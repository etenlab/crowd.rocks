import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { ErrorType } from 'src/common/types';
import { getBearer } from 'src/common/utility';
import { PostgresService } from 'src/core/postgres.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { NotificationResolver } from '../notifications/notification.resolver';
import { PostReadResolver } from './post-read.resolver';
import { Post, PostCreateInput, PostCreateOutput } from './types';

@Resolver(Post)
export class PostCreateResolver {
  constructor(
    private pg: PostgresService,
    private postRead: PostReadResolver,
    private notificationRes: NotificationResolver,
    private authenticationService: AuthenticationService,
  ) {}
  @Mutation(() => PostCreateOutput)
  async postCreateResolver(
    @Args('input') input: PostCreateInput,
    @Context() req: any,
  ): Promise<PostCreateOutput> {
    console.log(`post create resolver. content: ${input.content}`);
    try {
      const bearer = getBearer(req);

      try {
        const latestPost = await this.postRead.latestPostByParent(
          {
            parent_id: input.parent_id + '',
            parent_name: input.parent_table,
          },
          req,
        );

        const res = await this.pg.pool.query(
          `
          call post_create($1, $2, $3, $4,null,null,null,null,null);
        `,
          [input.content, bearer, input.parent_table, input.parent_id],
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

        const post_read = await this.postRead.postReadResolver(
          { post_id: post_id },
          req,
        );

        return {
          error,
          post: post_read.post,
        };

        // return {
        //   error,
        //   post: {
        //     candidate,
        //     created_by: {
        //       i: user_id,
        //       c: 1,
        //     },
        //     created_at,
        //     discussion_election,
        //     discussion_max_vote_rank: 0,
        //     discussion_posts_count: 0,
        //     parent_election: input.parent_election,
        //     post_id,
        //     rank,
        //     tie,
        //     zero_based_position: -1,
        //     vote: null,
        //     parts: [
        //       {
        //         part_id,
        //         post_id,
        //         rank: 1,
        //         versions: [],
        //         current_version: {
        //           version_id,
        //           part_id,
        //           content_type: 1,
        //           created_at,
        //           content: input.parts[0],
        //         },
        //         content_type: parts[0].content_type,
        //       },
        //     ],
        //   },
        // }
      } catch (e) {
        console.error(e);
        console.log(`failed to parse json from parts[0]`, input.content);
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
