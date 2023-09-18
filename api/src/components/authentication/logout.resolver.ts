import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { getBearer } from 'src/common/utility';
import { PostgresService } from 'src/core/postgres.service';
import { LogoutOutput, LogoutInput } from './types';
import { ErrorType } from 'src/common/types';
@Resolver(LogoutOutput)
export class LogoutResolver {
  constructor(private pg: PostgresService) {}

  @Mutation(() => LogoutOutput)
  async logout(
    @Args('input') input: LogoutInput,
    @Context() req: any,
  ): Promise<LogoutOutput> {
    console.log('logout resolver');
    try {
      const bearer = getBearer(req);

      if (bearer !== input.token) {
        return {
          error: ErrorType.UnknownError,
        };
      }

      await this.pg.pool.query(
        `
        delete from tokens
        where token = $1
      `,
        [input.token],
      );

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
}
