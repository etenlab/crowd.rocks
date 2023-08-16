import { Injectable } from '@nestjs/common';

import { readFileSync } from 'fs';
import { justBearerHeader } from 'src/common/utility';
import { RegisterResolver } from 'src/components/authentication/register.resolver';

import { ConfigService } from './config.service';
import { DataLoadService } from './data-load.service';
import { PostgresService } from './postgres.service';
import { SesService } from './ses.service';

@Injectable()
export class DatabaseVersionControlService {
  constructor(
    private pg: PostgresService,
    private ses: SesService,
    private config: ConfigService,
    private dataloader: DataLoadService,
  ) {
    console.log('Database Version Control');
    this.init();
  }

  async init() {
    const exists = await this.getIsDbInit();

    if (exists) {
      const version = await this.getSchemaVersion();
      console.log('Database schema version:', version);
    } else {
      console.log('Creating database schema');
      await this.loadSchemaAndFunctions();
    }

    console.log('Database version check complete');
  }

  async getIsDbInit(): Promise<boolean> {
    const res = await this.pg.pool.query(
      `
      SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE  table_name   = 'database_version_control');
    `,
      [],
    );

    return res.rows[0].exists;
  }

  async getSchemaVersion(): Promise<number> {
    const res = await this.pg.pool.query(
      `
      select version 
      from database_version_control 
      order by version 
      desc limit 1;
    `,
      [],
    );

    const version = res.rows[0].version;

    if (version) {
      return version;
    }

    return 0;
  }

  async loadSchemaAndFunctions() {
    // schema
    await this.runSqlFile('./src/core/sql/schema/v1.schema.sql');

    // authentication
    await this.runSqlFile('./src/core/sql/authentication/password_reset.sql');
    await this.runSqlFile('./src/core/sql/authentication/register.sql');

    // user
    await this.runSqlFile('./src/core/sql/user/avatar_update.sql');

    // email
    await this.runSqlFile('./src/core/sql/email/verify_email.sql');

    // post
    await this.runSqlFile('./src/core/sql/post/post_create.sql');
    await this.runSqlFile('./src/core/sql/post/version_create.sql');

    // word
    await this.runSqlFile('./src/core/sql/words/word_upsert.sql');
    await this.runSqlFile('./src/core/sql/words/phrase_upsert.sql');
    await this.runSqlFile('./src/core/sql/words/word_definition_upsert.sql');
    await this.runSqlFile('./src/core/sql/words/phrase_definition_upsert.sql');
    await this.runSqlFile('./src/core/sql/words/phrase_definition_update.sql');
    await this.runSqlFile('./src/core/sql/words/word_definition_update.sql');
    await this.runSqlFile(
      './src/core/sql/words/word-definition-vote-upsert.sql',
    );
    await this.runSqlFile(
      './src/core/sql/words/word-definition-vote-toggle.sql',
    );
    await this.runSqlFile(
      './src/core/sql/words/phrase-definition-vote-upsert.sql',
    );
    await this.runSqlFile(
      './src/core/sql/words/phrase-definition-vote-toggle.sql',
    );
    await this.runSqlFile('./src/core/sql/words/word-vote-upsert.sql');
    await this.runSqlFile('./src/core/sql/words/word-vote-toggle.sql');
    await this.runSqlFile('./src/core/sql/words/phrase-vote-upsert.sql');
    await this.runSqlFile('./src/core/sql/words/phrase-vote-toggle.sql');

    // map
    await this.runSqlFile('./src/core/sql/map/original_map_create.sql');

    // translation
    await this.runSqlFile(
      './src/core/sql/translation/word_to_word_translation_upsert.sql',
    );
    await this.runSqlFile(
      './src/core/sql/translation/word_to_phrase_translation_upsert.sql',
    );
    await this.runSqlFile(
      './src/core/sql/translation/phrase_to_word_translation_upsert.sql',
    );
    await this.runSqlFile(
      './src/core/sql/translation/phrase_to_phrase_translation_upsert.sql',
    );

    await this.runSqlFile(
      './src/core/sql/translation/word_to_word_translation_votes_count.sql',
    );

    await this.runSqlFile(
      './src/core/sql/translation/word_to_word_translation_vote_toggle.sql',
    );
    await this.runSqlFile(
      './src/core/sql/translation/word_to_phrase_translation_vote_toggle.sql',
    );
    await this.runSqlFile(
      './src/core/sql/translation/phrase_to_word_translation_vote_toggle.sql',
    );
    await this.runSqlFile(
      './src/core/sql/translation/phrase_to_phrase_translation_vote_toggle.sql',
    );

    // data
    await this.runSqlFile(
      './src/core/sql/data/site-text-word-definition-upsert.sql',
    );
    await this.runSqlFile(
      './src/core/sql/data/site-text-phrase-definition-upsert.sql',
    );
    await this.runSqlFile(
      './src/core/sql/data/site-text-translation-upsert.sql',
    );
    await this.runSqlFile(
      './src/core/sql/data/site-text-translation-vote-upsert.sql',
    );
    await this.runSqlFile(
      './src/core/sql/data/site-text-translation-vote-toggle.sql',
    );

    // update db version
    await this.setVersionNumber(1);

    await this.registerUser('admin@crowd.rocks', 'Admin', 'asdfasdf');
    await this.registerUser('anonymous@crowd.rocks', 'Anonymous', 'asdfasdf');

    // load data
    await this.dataloader.loadSiteTextData();
  }

  async registerUser(email: string, avatar: string, password: string) {
    const registerService = new RegisterResolver(
      this.pg,
      this.ses,
      this.config,
    );
    await registerService.register(
      {
        email,
        avatar,
        password,
      },
      justBearerHeader('michaelwuzhere'),
    );
  }

  async setVersionNumber(version: number) {
    await this.pg.pool.query(
      `
      insert into database_version_control(version) values($1);
    `,
      [version],
    );
  }

  async runSqlFile(path: string) {
    console.log('loading SQL:', path);
    const data = readFileSync(path, 'utf8');
    await this.pg.pool.query(data, []);
  }
}
