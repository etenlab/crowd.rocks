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

if (process.env.NODE_ENV === 'test') {
  process.env.CR_DB = testEnv.CR_DB;
  process.env.CR_DB_URL = testEnv.CR_DB_URL;
  process.env.CR_DB_PORT = testEnv.CR_DB_PORT + '';
  process.env.CR_DB_USER = testEnv.CR_DB_USER;
  process.env.CR_DB_PASSWORD = testEnv.CR_DB_PASSWORD;
  process.env.ADMIN_PASSWORD = testEnv.ADMIN_PASSWORD;
}

@Injectable()
export class ConfigService {
  public readonly CR_DB = process.env.CR_DB;
  public readonly CR_DB_URL = process.env.CR_DB_URL;
  public readonly CR_DB_PORT = +(process.env.CR_DB_PORT || 5432);
  public readonly CR_DB_USER = process.env.CR_DB_USER;
  public readonly CR_DB_PASSWORD = process.env.CR_DB_PASSWORD;
  public readonly CR_GPT_3_PASSWORD =
    process.env.CR_GPT_3_PASSWORD || 'asdfasdf';
  public readonly CR_GPT_4_PASSWORD =
    process.env.CR_GPT_4_PASSWORD || 'asdfasdf';

  public readonly ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  public readonly CR_GOOGLE_BOT_PASSWORD =
    process.env.CR_GOOGLE_BOT_PASSWORD || 'asdfasdf';

  public readonly SMARTCAT_ID = process.env.SMARTCAT_ID;
  public readonly SMARTCAT_KEY = process.env.SMARTCAT_KEY;
  public readonly SMARTCAT_PROFILE = process.env.SMARTCAT_PROFILE;

  public readonly LILT_KEY = process.env.LILT_KEY || '';

  public readonly DEEPL_KEY = process.env.DEEPL_KEY || '';

  public readonly OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'asdfasdf';

  public readonly AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
  public readonly AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
  public readonly AWS_REGION = process.env.AWS_REGION;

  public readonly EMAIL_SERVER = process.env.EMAIL_SERVER;
  public readonly GCP_PROJECT_ID = process.env.GCP_PROJECT_ID;
  public readonly GCP_API_KEY = process.env.GCP_API_KEY;
}
