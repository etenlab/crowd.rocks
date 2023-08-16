import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { createToken, getBearer, validateEmail } from 'src/common/utility';
import { PostgresService } from 'src/core/postgres.service';
import {
  RegisterOutput,
  RegisterInput,
  IsAdminIdInput,
  IsAdminIdOutput,
} from './types';
import { hash } from 'argon2';
import { ErrorType } from 'src/common/types';
import { SesService } from 'src/core/ses.service';
import { ConfigService } from 'src/core/config.service';
import { AuthenticationService } from './authentication.service';

@Resolver(RegisterOutput)
export class RegisterResolver {
  constructor(
    private pg: PostgresService,
    private ses: SesService,
    private config: ConfigService,
    private authenticationService?: AuthenticationService,
  ) {}

  @Query(() => IsAdminIdOutput)
  async loggedInIsAdmin(
    @Args('input') input: IsAdminIdInput,
  ): Promise<IsAdminIdOutput> {
    const adminId = await this.authenticationService.get_admin_id();
    console.log(`userId: ${input.user_id}`);
    console.log(`adminId: ${adminId}`);
    if (adminId == input.user_id) {
      return { isAdmin: true };
    }
    return { isAdmin: false };
  }

  @Mutation(() => RegisterOutput)
  async register(
    @Args('input') input: RegisterInput,
    @Context() req: any,
  ): Promise<RegisterOutput> {
    console.log('register resolver');
    try {
      const bearer = getBearer(req);

      if (!validateEmail(input.email)) {
        return {
          error: ErrorType.InvalidEmailOrPassword,
          session: null,
        };
      }

      if (input.email.length > 255) {
        return {
          error: ErrorType.EmailTooLong,
          session: null,
        };
      }

      if (input.email.length <= 4) {
        return {
          error: ErrorType.EmailTooShort,
          session: null,
        };
      }

      if (input.password.length > 32) {
        return {
          error: ErrorType.PasswordTooLong,
          session: null,
        };
      }

      if (input.password.length < 8) {
        return {
          error: ErrorType.PasswordTooShort,
          session: null,
        };
      }

      if (input.avatar.length > 64) {
        return {
          error: ErrorType.AvatarTooLong,
          session: null,
        };
      }

      if (input.avatar.length <= 0) {
        return {
          error: ErrorType.AvatarTooShort,
          session: null,
        };
      }

      const pash = await hash(input.password);
      const token = createToken();

      const res = await this.pg.pool.query(
        `
        call authentication_register($1, $2, $3, $4, 0, '');
      `,
        [input.email, input.avatar, pash, token],
      );

      const error = res.rows[0].p_error_type;

      if (error !== ErrorType.NoError) {
        return {
          error,
          session: null,
        };
      }

      const email_token = createToken();
      const reject_token = createToken();

      // send email using SES, comment out to skip for local deving
      // const email_res = await this.send_registration_email(
      //   input.email,
      //   input.avatar,
      //   email_token,
      //   reject_token,
      //   res.rows[0].p_user_id,
      // )

      return {
        error: error,
        session: {
          user_id: res.rows[0].p_user_id,
          token: token,
          avatar: input.avatar,
          avatar_url: null,
        },
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      session: null,
    };
  }

  async send_registration_email(
    to_address: string,
    avatar: string,
    email_token: string,
    reject_token: string,
    user_id: number,
  ) {
    try {
      const html = `<h1>Hello ${avatar}!</h1>
      <p>To CONFIRM your email address, click here: <a href="${this.config.EMAIL_SERVER}/US/eng/1/email/${email_token}">ACCEPT</a></p>
      <p>If you didn't register with this email address and would like us to BLOCK this address from receiving ALL future emails please click here: <a href="${this.config.EMAIL_SERVER}/US/eng/1/email/${reject_token}">BLOCK</a></p>`;

      const text = `Hello ${avatar}!
      
      To CONFIRM your email address, click this link:
      
      ${this.config.EMAIL_SERVER}/US/eng/1/email/${email_token}
      
      If you didn't register with this email address and would like us to BLOCK this address from receiving ALL future emails please click this link:
      
      ${this.config.EMAIL_SERVER}/US/eng/1/email/${reject_token}
            `;

      const data = await this.ses.send_email(
        to_address,
        'no-reply@crowd.rocks',
        'Please Confirm Email Address - crowd.rocks Registration',
        html,
        text,
      );

      if (data) {
        await this.pg.pool.query(
          `
            insert into email_tokens("token", "user_id", "type")
            values ($2, $1, 'Accept'),
                   ($3, $1, 'Reject');
        `,
          [user_id, email_token, reject_token],
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
}
