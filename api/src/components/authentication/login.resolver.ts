import { Args, Mutation, Resolver } from '@nestjs/graphql';
import {
  createToken,
  // getBearer,
  get_avatar_image_url,
  validateEmail,
} from 'src/common/utility';
import { PostgresService } from 'src/core/postgres.service';
import { LoginOutput, LoginInput } from './types';
import { verify } from 'argon2';
import { ErrorType } from 'src/common/types';
@Resolver(LoginOutput)
export class LoginResolver {
  constructor(private pg: PostgresService) {}

  @Mutation(() => LoginOutput)
  async login(@Args('input') input: LoginInput): Promise<LoginOutput> {
    console.log('login resolver');
    try {
      // const bearer = getBearer(req);

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

      const res1 = await this.pg.pool.query(
        `
        select user_id, password
        from users
        where email = $1
            and active = true;
      `,
        [input.email],
      );

      if (res1.rowCount !== 1) {
        return {
          error: ErrorType.InvalidEmailOrPassword,
          session: null,
        };
      }

      const user_id = res1.rows[0].user_id;
      const pash = res1.rows[0].password;

      if (!user_id || !pash) {
        return {
          error: ErrorType.InvalidEmailOrPassword,
          session: null,
        };
      }

      const matches = await verify(pash, input.password);
      if (!matches) {
        return {
          error: ErrorType.InvalidEmailOrPassword,
          session: null,
        };
      }

      // get session
      const res2 = await this.pg.pool.query(
        `
        select avatar, url
        from avatars
        where user_id = $1
      `,
        [user_id],
      );

      if (res2.rowCount !== 1) {
        return {
          error: ErrorType.AvatarNotFound,
          session: null,
        };
      }

      const avatar = res2.rows[0].avatar;
      const url = res2.rows[0].url;

      if (!avatar) {
        return {
          error: ErrorType.AvatarNotFound,
          session: null,
        };
      }

      const token = createToken();

      await this.pg.pool.query(
        `
        insert into tokens(token, user_id) values($1, $2);
      `,
        [token, user_id],
      );

      return {
        error: ErrorType.NoError,
        session: {
          user_id: user_id,
          token: token,
          avatar: avatar,
          avatar_url: get_avatar_image_url(url),
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
}
