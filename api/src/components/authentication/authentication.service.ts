import { Injectable, Logger } from '@nestjs/common';
import { PostgresService } from '../../core/postgres.service';

@Injectable()
export class AuthenticationService {
  constructor(private pg: PostgresService) {}

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
    try {
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
    } catch (error) {
      Logger.error(
        `AuthenticationService#get_admin_id: ` + JSON.stringify(error),
      );
      return null;
    }
  }

  async isAdmin(token): Promise<boolean> {
    const user_id = await this.get_user_id_from_bearer(token);
    const admin_id = await this.get_admin_id();
    return user_id === admin_id;
  }

  async getAdminToken(): Promise<string> {
    const adminId = await this.get_admin_id();
    const resQ = await this.pg.pool.query(
      `
      select t.token as token
      from tokens t 
      where t.user_id =  $1
    `,
      [adminId],
    );
    if (!(resQ.rows.length > 0)) {
      Logger.error(
        `AuthenticationService#getAdminToken: admin token not found`,
      );
    }
    return resQ.rows.at(-1).token;
  }
}
