import { Injectable } from '@nestjs/common';
import { ErrorType } from 'src/common/types';
import { get_avatar_image_url } from 'src/common/utility';
import { PostgresService } from 'src/core/postgres.service';
import { UserReadInput, UserReadOutput } from './types';

@Injectable()
export class UserService {
  constructor(private pg: PostgresService) {}

  async read(input: UserReadInput): Promise<UserReadOutput> {
    try {
      const res1 = await this.pg.pool.query(
        `
          select 
            avatar,
            url
          from avatars
          where user_id = $1
        `,
        [input.user_id],
      );

      if (res1.rowCount == 1) {
        return {
          error: ErrorType.NoError,
          user: {
            avatar: res1.rows[0].avatar,
            avatar_url: get_avatar_image_url(res1.rows[0].url),
            user_id: input.user_id,
          },
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      user: null,
    };
  }
}
