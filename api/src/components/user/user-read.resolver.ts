import { Injectable } from "@nestjs/common";
import { Args, Context, Query, Resolver } from "@nestjs/graphql";
import { ErrorType } from "src/common/types";
import { getBearer, get_avatar_image_url } from "src/common/utility";
import { PostgresService } from "src/core/postgres.service";
import { User, UserReadInput, UserReadOutput } from "./types";

@Injectable()
@Resolver(User)
export class UserReadResolver {
  constructor(
    private pg: PostgresService,
  ) { }
  @Query(() => UserReadOutput)
  async userReadResolver(
    @Args('input') input: UserReadInput,
    @Context() req: any
  ): Promise<UserReadOutput> {
    console.log("user read resolver")
    try {
      const bearer = getBearer(req)

      const res1 = await this.pg.pool.query(`
        select 
          avatar,
          url
        from avatars
        where user_id = $1
      `, [input.user_id])

      if (res1.rowCount == 1) {
        return {
          error: ErrorType.NoError,
          user: {
            avatar: res1.rows[0].avatar,
            avatar_url: get_avatar_image_url(res1.rows[0].url),
            user_id: input.user_id,
          }
        }
      }

    } catch (e) {
      console.error(e)
    }

    return {
      error: ErrorType.UnknownError,
      user: null,
    }
  }
}