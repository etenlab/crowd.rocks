import { Injectable } from '@nestjs/common';
import { PostgresService } from '../../core/postgres.service';
import { getAdminTokenSQL } from '../../core/sql-string';

@Injectable()
export class AuthenticationService {
  constructor(private pg: PostgresService) {}

  // TODO: delete this service method for mocking user when read user registration & tokens
  async getAdminToken(): Promise<string | null> {
    try {
      const res = await this.pg.pool.query(...getAdminTokenSQL());

      return res.rows[0].token;
    } catch (e) {
      console.error(e);
    }

    return null;
  }

  async get_user_id_from_bearer(token: string): Promise<number | null> {
    const res1 = await this.pg.pool.query(
      `
        select user_id
        from tokens
        where token = $1;
      `,
      [token],
    );

    if (res1.rowCount == 1) {
      return res1.rows[0].user_id;
    }

    return null;
  }

  async get_avatar_from_bearer(token: string): Promise<string | null> {
    const res1 = await this.pg.pool.query(
      `
        select a.avatar 
        from avatars a
        join tokens t on t.user_id = a.user_id
        where t.token = $1;
      `,
      [token],
    );
    if (res1.rowCount == 1) {
      return res1.rows[0].avatar;
    }
    return null;
  }
  async get_admin_id(): Promise<number | null> {
    const res1 = await this.pg.pool.query(
      `
      select user_id
      from users 
      where email='admin@crowd.rocks';
      `,
    );
    if (res1.rowCount == 1) {
      return res1.rows[0].user_id;
    }
    return null;
  }
}
