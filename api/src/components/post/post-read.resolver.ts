import { Injectable } from '@nestjs/common';
import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { ErrorType } from 'src/common/types';
import { getBearer } from 'src/common/utility';
import { PostgresService } from 'src/core/postgres.service';
import { UserReadResolver } from '../user/user-read.resolver';
import {
  Post,
  PostReadInput,
  PostReadOutput,
  PostsByParentInput,
  PostsByParentOutput,
} from './types';

@Injectable()
@Resolver(Post)
export class PostReadResolver {
  constructor(
    private pg: PostgresService,
    private userRead: UserReadResolver,
  ) {}
  @Query(() => PostReadOutput)
  async postReadResolver(
    @Args('input') input: PostReadInput,
    @Context() req: any,
  ): Promise<PostReadOutput> {
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
            v.content
          from 
            posts p
          join versions v
            on p.post_id = v.post_id
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
            await this.userRead.userReadResolver(
              { user_id: res1.rows[0].created_by },
              req,
            )
          ).user;
          const post = {
            error: ErrorType.NoError,
            post: {
              post_id: res1.rows[0].post_id,
              created_at: res1.rows[0].created_at,
              created_by_user: createdBy!,
              content: res1.rows[0].content,
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
  @Query(() => PostsByParentOutput)
  async postsByParent(
    @Args('input') input: PostsByParentInput,
    @Context() req: any,
  ): Promise<PostsByParentOutput> {
    console.log('post read resolver, parent_id:', input.parent_id);
    console.log('post read resolver, parent_table:', input.parent_name);
    try {
      const res1 = await this.pg.pool.query(
        `
          select
            p.post_id,
            p.created_at,
            p.created_by,
            v.content
          from 
            posts p
          join versions v
            on p.post_id = v.post_id
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
          const { post_id, created_at, created_by, content } = data;
          const user = (
            await this.userRead.userReadResolver({ user_id: created_by }, req)
          ).user;
          return {
            post_id,
            created_at,
            created_by_user: user!,
            content,
          };
        }),
      );

      return {
        error: ErrorType.NoError,
        posts: posts,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      posts: [],
    };
  }
}
