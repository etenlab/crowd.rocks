import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { ConfigService } from './config.service';

@Injectable()
export class PostgresService {
  constructor(private config: ConfigService) {}

  readonly pool = new Pool({
    user: this.config.CR_DB_USER,
    host: this.config.CR_DB_URL,
    database: this.config.CR_DB,
    password: this.config.CR_DB_PASSWORD,
    port: this.config.CR_DB_PORT!,
  });
}
