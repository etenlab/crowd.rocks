import { Injectable } from '@nestjs/common';
import { ErrorType } from 'src/common/types';
import { getBearer } from 'src/common/utility';
import { PostgresService } from 'src/core/postgres.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { PhraseDefinitionsService } from '../definitions/phrase-definitions.service';
import { WordDefinitionsService } from '../definitions/word-definitions.service';
import { NotificationResolver } from '../notifications/notification.resolver';
import { PhrasesService } from '../phrases/phrases.service';
import { ThreadsService } from '../threads/threads.service';
import { UserService } from '../user/user.service';
import { WordsService } from '../words/words.service';
import {
  Post,
  PostCreateInput,
  PostCreateOutput,
  PostReadInput,
  PostReadOutput,
  PostsByParentInput,
  PostsByParentOutput,
} from './types';

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

  async getPostsByParent(
    input: PostsByParentInput,
    req: any,
  ): Promise<PostsByParentOutput> {
    try {
      const res1 = await this.pg.pool.query(
        `
            select
              p.post_id,
              p.created_at,
              p.created_by,
              v.content,
              f.file_url
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
    };
    if (parentTableToGetTitle[name]) {
      return parentTableToGetTitle[name](id);
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
