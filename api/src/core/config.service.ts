import { Injectable } from '@nestjs/common';

import * as dotenv from 'dotenv';

dotenv.config();

const testEnv = {
  CR_DB: 'crowdrocks',
  CR_DB_URL: 'localhost',
  CR_DB_PORT: 5432,
  CR_DB_USER: 'postgres',
  CR_DB_PASSWORD: 'asdfasdf',
  ADMIN_PASSWORD: 'asdfasdf',
};

const noneTestEnv = process.env.NODE_ENV === 'test' ? false : true;

@Injectable()
export class ConfigService {
  public readonly CR_DB = noneTestEnv ? process.env.CR_DB : testEnv.CR_DB;
  public readonly CR_DB_URL = noneTestEnv
    ? process.env.CR_DB_URL
    : testEnv.CR_DB;
  public readonly CR_DB_PORT = noneTestEnv
    ? +(process.env.CR_DB_PORT || 5432)
    : testEnv.CR_DB_PORT;
  public readonly CR_DB_USER = noneTestEnv
    ? process.env.CR_DB_USER
    : testEnv.CR_DB_USER;
  public readonly CR_DB_PASSWORD = noneTestEnv
    ? process.env.CR_DB_PASSWORD
    : testEnv.CR_DB_PASSWORD;

  public readonly ADMIN_PASSWORD = noneTestEnv
    ? process.env.ADMIN_PASSWORD
    : testEnv.ADMIN_PASSWORD;

  public readonly AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
  public readonly AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
  public readonly AWS_REGION = process.env.AWS_REGION;

  public readonly EMAIL_SERVER = process.env.EMAIL_SERVER;
  public readonly GCP_PROJECT_ID = process.env.GCP_PROJECT_ID;
  public readonly GCP_API_KEY = process.env.GCP_API_KEY;
}
