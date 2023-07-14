import { Args, Context, GqlContextType, Mutation, Query, Resolver } from "@nestjs/graphql";
import { ApolloError } from "apollo-server-express";
import { createToken, getBearer, validateEmail } from "src/common/utility";
import { PostgresService } from "src/core/postgres.service";
import { LogoutOutput, LogoutInput } from "./types";
import { hash } from "argon2"
import { ErrorType } from "src/common/types";
@Resolver(LogoutOutput)
export class LogoutResolver {
  constructor(
    private pg: PostgresService,
  ) { }

  @Mutation(() => LogoutOutput)
  async logout(@Args('input') input: LogoutInput, @Context() req: any): Promise<LogoutOutput> {
    console.log("logout resolver")
    try {
      const bearer = getBearer(req)

      if (bearer !== input.token) {
        return {
          error: ErrorType.UnknownError,
        }
      }

      const res = await this.pg.pool.query(`
        delete from tokens
        where token = $1
      `, [input.token])

      return {
        error: ErrorType.NoError,
      }
    } catch (e) {
      console.error(e)
    }

    return {
      error: ErrorType.UnknownError,
    }
  }
}