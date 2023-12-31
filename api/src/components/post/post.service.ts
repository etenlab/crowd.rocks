import { Injectable, Logger } from '@nestjs/common';
import { PoolClient } from 'pg';
import { ErrorType, GenericOutput } from 'src/common/types';
import { getBearer, pgClientOrPool } from 'src/common/utility';
import { PostgresService } from 'src/core/postgres.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { PhraseDefinitionsService } from '../definitions/phrase-definitions.service';
import { WordDefinitionsService } from '../definitions/word-definitions.service';
import { NotificationResolver } from '../notifications/notification.resolver';
import { PhrasesService } from '../phrases/phrases.service';
import { ThreadsService } from '../threads/threads.service';
import { PhraseToPhraseTranslationsService } from '../translations/phrase-to-phrase-translations.service';
import { PhraseToWordTranslationsService } from '../translations/phrase-to-word-translations.service';
import { WordToPhraseTranslationsService } from '../translations/word-to-phrase-translations.service';
import { WordToWordTranslationsService } from '../translations/word-to-word-translations.service';
import { UserService } from '../user/user.service';
import { WordsService } from '../words/words.service';
import {
  Post,
  PostCountOutput,
  PostCreateInput,
  PostCreateOutput,
  PostReadInput,
  PostReadOutput,
  PostsByParentInput,
  PostsByParentOutput,
} from './types';
import {
  PostDeletesProcedureOutput,
  callPostDeletesProcedure,
  GetPostById,
  getPostsFromRefsQuery,
} from './sql-string';
import { PericopiesService } from '../pericopies/pericopies.service';
import { PericopeTrService } from '../pericope-translations/pericope-tr.service';

@Injectable()
export class PostService {
  constructor(
    private pg: PostgresService,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private notificationRes: NotificationResolver, //need the resolver instead of service so we can set up subscriptions
    private threadService: ThreadsService,
    private phraseService: PhrasesService,
    private wordDefService: WordDefinitionsService,
    private phraseDefService: PhraseDefinitionsService,
    private wordsService: WordsService,
    private phraseToPhraseTranslationService: PhraseToPhraseTranslationsService,
    private phraseToWordTranslationService: PhraseToWordTranslationsService,
    private wordToWordTranslationService: WordToWordTranslationsService,
    private wordToPhraseTranslationService: WordToPhraseTranslationsService,
    private pericopiesService: PericopiesService,
    private pericopeTrService: PericopeTrService,
  ) {}

  async read(input: PostReadInput, req: any): Promise<PostReadOutput> {
    console.log('post read resolver, post_id:', input.post_id);
    try {
      const bearer = getBearer(req);

      if (!bearer) {
        const res1 = await this.pg.pool.query(
          `
              --[todo]
            `,
          [input.post_id],
        );

        if (res1.rowCount !== 1) {
          console.error(`no post for id: ${input.post_id}`);
        } else {
          // return {
          //   error: ErrorType.NoError,
          //   post: {
          //     //todo
          //   },
          // }
        }
      } else {
        const res1 = await this.pg.pool.query(
          `
          select
            p.post_id,
            p.created_at,
            p.created_by,
            v.content,
            f.file_url,
            f.file_type
          from 
            posts p
          join versions v
            on p.post_id = v.post_id
          left join files f
            on v.file_id = f.file_id
          where
            true
            and p.post_id = $1
        `,
          [input.post_id],
        );

        if (res1.rowCount !== 1) {
          console.error(`no post for id: ${input.post_id}`);
          return {
            error: ErrorType.PostNotFound,
            post: null,
          };
        } else {
          const createdBy = (
            await this.userService.read({ user_id: res1.rows[0].created_by })
          ).user;
          const post = {
            error: ErrorType.NoError,
            post: {
              post_id: res1.rows[0].post_id,
              created_at: res1.rows[0].created_at,
              created_by_user: createdBy!,
              content: res1.rows[0].content,
              file_url: res1.rows[0].file_url,
              file_type: res1.rows[0].file_type,
            },
          };
          return post;
        }
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      post: null,
    };
  }

  async create(input: PostCreateInput, req: any): Promise<PostCreateOutput> {
    const bearer = getBearer(req);
    try {
      const latestPost = await this.latestPostByParent(
        input.parent_id + '',
        input.parent_table,
      );

      const res = await this.pg.pool.query(
        `
            call post_create($1, $2, $3, $4, $5,null,null,null,null,null);
          `,
        [
          input.content,
          bearer,
          input.parent_table,
          input.parent_id,
          input.file_id,
        ],
      );

      const error = res.rows[0].p_error_type;
      const post_id = res.rows[0].p_post_id;

      if (error !== ErrorType.NoError || !post_id) {
        return {
          error,
          post: null,
        };
      }

      const dUsersRes = await this.pg.pool.query(
        `
            select distinct created_by 
            from posts
            where parent_table = $1
            and parent_id = $2
            `,
        [input.parent_table, input.parent_id],
      );

      const user_ids = dUsersRes.rows.map<string>(
        ({ created_by }) => created_by,
      );

      const user_avatar = bearer
        ? await this.authenticationService.get_avatar_from_bearer(bearer)
        : 'An Unknown user';

      let notificationText = user_avatar ?? 'An Unknown User';

      notificationText += latestPost.post?.content
        ? " responded to '" +
          latestPost.post?.content
            .replace(/<[^>]+>/g, '')
            .split(' ')
            .slice(0, 5)
            .join(' ') +
          "...'"
        : ` started discussion with '${input.content
            .replace(/<[^>]+>/g, '')
            .split(' ')
            .slice(0, 5)
            .join(' ')}...'`;

      await this.notificationRes.notifyUsers(
        { text: notificationText, user_ids },
        req,
      );

      const post_read = await this.read({ post_id: post_id }, req);

      return {
        error,
        post: post_read.post,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      post: null,
    };
  }

  async getTotalPosts(input: PostsByParentInput): Promise<PostCountOutput> {
    if (input.parent_id === '') {
      return {
        error: ErrorType.InvalidInputs,
        total: 0,
      };
    }
    try {
      const res = await this.pg.pool.query(
        `
        select
	        count(p.post_id)
	        from posts p
	        where
	          true
	          and p.parent_table = $1
	          and p.parent_id = $2;
        `,
        [input.parent_name, input.parent_id],
      );
      if (res.rowCount > 0) {
        return {
          error: ErrorType.NoError,
          total: res.rows[0].count,
        };
      }
    } catch (e) {
      console.error(e);
    }
    return {
      error: ErrorType.UnknownError,
      total: 0,
    };
  }

  async deletePostsByRefs(
    refs: {
      parent_id: string;
      parent_table: string;
    }[],
    token: string,
    pgClient: PoolClient | null,
  ): Promise<GenericOutput> {
    if (refs.length === 0) {
      return {
        error: ErrorType.NoError,
      };
    }

    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetPostById>(...getPostsFromRefsQuery(refs));

      return this.deletePostsByIds(
        res.rows.map((item) => +item.post_id),
        token,
        pgClient,
      );
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
    };
  }

  async deletePostsByIds(
    post_ids: number[],
    token: string,
    pgClient: PoolClient | null,
  ): Promise<GenericOutput> {
    if (post_ids.length === 0) {
      return {
        error: ErrorType.NoError,
      };
    }

    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<PostDeletesProcedureOutput>(
        ...callPostDeletesProcedure({
          token,
          post_ids,
        }),
      );

      if (res.rowCount === 0) {
        return {
          error: ErrorType.PostDeleteFailed,
        };
      }

      for (const p_error of res.rows[0].p_error_types) {
        if (p_error !== ErrorType.NoError) {
          return {
            error: p_error,
          };
        }
      }

      return {
        error: ErrorType.NoError,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
    };
  }

  async getPostsByParent(
    input: PostsByParentInput,
  ): Promise<PostsByParentOutput> {
    try {
      const res1 = await this.pg.pool.query(
        `
            select
              p.post_id,
              p.created_at,
              p.created_by,
              v.content,
              f.file_url,
              f.file_type
            from 
              posts p
            join versions v
              on p.post_id = v.post_id
            left join files f
              on v.file_id = f.file_id
            where
              true
              and p.parent_table = $1
              and p.parent_id = $2
            order by p.created_at ASC
          `,
        [input.parent_name, input.parent_id],
      );

      const posts = await Promise.all(
        res1.rows.map<Promise<Post>>(async (data: any) => {
          const {
            post_id,
            created_at,
            created_by,
            content,
            file_url,
            file_type,
          } = data;
          const user = (await this.userService.read({ user_id: created_by }))
            .user;
          return {
            post_id,
            created_at,
            created_by_user: user!,
            content,
            file_url: file_url,
            file_type,
          };
        }),
      );

      return {
        error: ErrorType.NoError,
        posts: posts,
        title: await this.getTitle(input.parent_name, input.parent_id),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      posts: [],
      title: await this.getTitle(input.parent_name, input.parent_id),
    };
  }

  private getTitle(name: string, id: string) {
    const parentTableToGetTitle: {
      [K: string]: (id: string) => Promise<string>;
    } = {
      threads: this.threadService.getDiscussionTitle,
      phrases: this.phraseService.getDiscussionTitle,
      word_definitions: this.wordDefService.getDiscussionTitle,
      phrase_definitions: this.phraseDefService.getDiscussionTitle,
      words: this.wordsService.getDiscussionTitle,
      phrase_to_phrase_translations:
        this.phraseToPhraseTranslationService.getDiscussionTitle,
      phrase_to_word_translations:
        this.phraseToWordTranslationService.getDiscussionTitle,
      word_to_word_translations:
        this.wordToWordTranslationService.getDiscussionTitle,
      word_to_phrase_translations:
        this.wordToPhraseTranslationService.getDiscussionTitle,
      pericopies: this.pericopiesService.getDiscussionTitle,
      pericope_translations: this.pericopeTrService.getDiscussionTitle,
    };
    if (parentTableToGetTitle[name]) {
      try {
        return parentTableToGetTitle[name](id);
      } catch (e) {
        Logger.error(e);
      }
    }
    return `Discussion: ${name}`;
  }

  async latestPostByParent(
    parent_id: string,
    parent_name: string,
  ): Promise<PostReadOutput> {
    try {
      const res1 = await this.pg.pool.query(
        `
            select
              p.post_id,
              p.created_at,
              p.created_by,
              v.content,
              f.file_url,
              f.file_type
            from 
              posts p
            join versions v
              on p.post_id = v.post_id
            left join files f
              on v.file_id = f.file_id
            where
              true
              and p.parent_table = $1
              and p.parent_id = $2
            order by p.created_at DESC
            limit 1
          `,
        [parent_name, parent_id],
      );

      if (res1.rowCount !== 1) {
        console.error(
          `no post for parent id: '${parent_id}' and table '${parent_name}'`,
        );
        return {
          error: ErrorType.PostNotFound,
          post: null,
        };
      } else {
        const createdBy = (
          await this.userService.read({ user_id: res1.rows[0].created_by })
        ).user;
        const post = {
          error: ErrorType.NoError,
          post: {
            post_id: res1.rows[0].post_id,
            created_at: res1.rows[0].created_at,
            created_by_user: createdBy!,
            content: res1.rows[0].content,
            file_url: res1.rows[0].file_url,
            file_type: res1.rows[0].file_type,
          },
        };
        return post;
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      post: null,
    };
  }
}
