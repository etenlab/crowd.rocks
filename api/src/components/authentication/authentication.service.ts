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
  }
}
