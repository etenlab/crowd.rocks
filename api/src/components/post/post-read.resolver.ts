import { Injectable } from '@nestjs/common'
import { Args, Context, Query, Resolver } from '@nestjs/graphql'
import { ErrorType } from 'src/common/types'
import { getBearer } from 'src/common/utility'
import { PostgresService } from 'src/core/postgres.service'
import { Post, PostReadInput, PostReadOutput } from './types' 

@Injectable()
@Resolver(Post)
export class PostReadResolver {
  constructor(
    private pg: PostgresService,
  ) {}
  @Query(() => PostReadOutput)
  async postReadResolver(
    @Args('input') input: PostReadInput,
    @Context() req: any,
  ): Promise<PostReadOutput> {
    console.log('post read resolver, post_id:', input.post_id)
    try {
      const bearer = getBearer(req)

      if (!bearer) {
        const res1 = await this.pg.pool.query( 
          `
              --[todo]
            `,
          [input.post_id],
        )

        if (res1.rowCount !== 1) {
          console.error(`no post for id: ${input.post_id}`)
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
          --[todo]
        `,
          [bearer, input.post_id],
        )

        if (res1.rowCount !== 1) {
          console.error(`no post for id: ${input.post_id}`)
        } else {

          const post = {
            error: ErrorType.NoError,
            post: {
              // todo
            },
          }

          // return post
        }
      }
    } catch (e) {
      console.error(e)
    }

    return {
      error: ErrorType.UnknownError,
      post: null,
    }
  }
}
