import { Args, Context, Mutation, Resolver } from '@nestjs/graphql'
import { PostgresService } from 'src/core/postgres.service'
import { ErrorType } from 'src/common/types'
import { SesService } from 'src/core/ses.service'
import { ConfigService } from 'src/core/config.service'
import { EmailResponseInput, EmailResponseOutput } from './types'

@Resolver(EmailResponseOutput)
export class EmailResponseResolver {
  constructor(
    private pg: PostgresService,
    private ses: SesService,
    private config: ConfigService,
  ) {}

  @Mutation(() => EmailResponseOutput)
  async emailResponseResolver(
    @Args('input') input: EmailResponseInput,
    @Context() req: any,
  ): Promise<EmailResponseOutput> {
    console.log('email response resolver')
    try {
      if (!input.token) return { error: ErrorType.TokenInvalid }

      await this.pg.pool.query(
        `
        CALL verify_email($1, '', '', '');
        `,
        [input.token],
      )

      return { error: ErrorType.NoError }
    } catch (e) {
      console.error(e)
    }

    return {
      error: ErrorType.UnknownError,
    }
  }
}
