import { Injectable } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { hash } from 'argon2';
import { ErrorType } from 'src/common/types';
import { createToken } from 'src/common/utility';
import { ConfigService } from 'src/core/config.service';
import { PostgresService } from 'src/core/postgres.service';
import { SesService } from 'src/core/ses.service';
import { User } from '../user/types';
import {
  LoginOutput,
  PasswordResetFormInput,
  ResetEmailRequestInput,
  ResetEmailRequestOutput,
} from './types';

@Injectable()
@Resolver(User)
export class PasswordResetResolver {
  constructor(
    private pg: PostgresService,
    private config: ConfigService,
    private ses: SesService,
  ) {}
  @Mutation(() => ResetEmailRequestOutput)
  async resetEmailRequest(
    @Args('input') input: ResetEmailRequestInput,
    // @Context() req: any,
  ): Promise<ResetEmailRequestOutput> {
    console.log('reset email request resolver');
    try {
      // const bearer = getBearer(req)

      const res1 = await this.pg.pool.query(
        `
          select avatar, user_id
          from avatars
          where user_id = (
            select user_id
            from users
            where email = $1
          ) ;
        `,
        [input.email],
      );

      if (res1.rows[0] !== null) {
        const avatar = res1.rows[0].avatar;
        const user_id = res1.rows[0].user_id;

        console.log(avatar);
        await this.send_reset_password_email(
          input.email,
          avatar,
          createToken(),
          user_id,
        );

        return {
          error: ErrorType.NoError,
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
    };
  }

  async send_reset_password_email(
    to_address: string,
    avatar: string,
    reset_token: string,
    user_id: string,
  ) {
    try {
      const html = `<h1>Hello ${avatar}!</h1>
      <p>To reset your password, please click <a href="${this.config.EMAIL_SERVER}/US/eng/1/password-reset-form/${reset_token}">here</a>.</p>
      <p>If you didn't request your password to be reset, you do not need to do anything.</p>`;

      const text = `Hello ${avatar}!
      
      To reset your password, please click this link:
      
      ${this.config.EMAIL_SERVER}/US/eng/1/password-reset-form/${reset_token}
      
      If you didn't request your password to be reset, you do not need to do anything.`;

      const data = await this.ses.send_email(
        to_address,
        'no-reply@crowd.rocks',
        'Password Reset - crowd.rocks',
        html,
        text,
      );

      if (data) {
        await this.pg.pool.query(
          `
            insert into reset_tokens("token", "user_id")
            values ($1, $2);
        `,
          [reset_token, user_id],
        );

        await this.pg.pool.query(
          `
            insert into emails_sent("email", "message_id", "type")
            values ($1, $2, 'Register');
        `,
          [to_address, data.$metadata.requestId],
        );
      } else {
        // error
      }

      // process data.
    } catch (error) {
      // error handling.
      console.log('error sending email', error);
    } finally {
      // finally.
    }
  }

  @Mutation(() => LoginOutput)
  async passwordResetFormResolver(
    @Args('input') input: PasswordResetFormInput,
    // @Context() req: any,
  ): Promise<LoginOutput> {
    console.log('password reset form resolver');
    try {
      // const bearer = getBearer(req)
      const pash = await hash(input.password);
      const new_token = createToken();

      const res1 = await this.pg.pool.query(
        `
          CALL password_reset($1, $2, $3, '', '', 0, '', '');
        `,
        [input.token, new_token, pash],
      );

      if (res1.rows[0] !== null) {
        const error = res1.rows[0].error_type;

        console.log(error);

        if (error == ErrorType.NoError) {
          const avatar = res1.rows[0].p_avatar;
          res1.rows[0].p_email;
          const user_id = res1.rows[0].p_user_id;
          const url = res1.rows[0].p_url;

          return {
            error,
            session: {
              user_id: user_id,
              token: new_token,
              avatar: avatar,
              avatar_url: url,
            },
          };
        } else {
          return { error: ErrorType.UnknownError, session: null };
        }
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      session: null,
    };
  }
}
