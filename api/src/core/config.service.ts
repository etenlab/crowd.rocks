import { Injectable } from '@nestjs/common';

import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class ConfigService {
  public readonly CR_DB = process.env.CR_DB;
  public readonly CR_DB_URL = process.env.CR_DB_URL;
  public readonly CR_DB_PORT = +process.env.CR_DB_PORT;
  public readonly CR_DB_USER = process.env.CR_DB_USER;
  public readonly CR_DB_PASSWORD = process.env.CR_DB_PASSWORD;

  public readonly AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
  public readonly AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
  public readonly AWS_REGION = process.env.AWS_REGION;

  public readonly EMAIL_SERVER = process.env.EMAIL_SERVER;
}
