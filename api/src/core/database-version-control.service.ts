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

    if (!exists) {
      console.log('Creating database schema');
      await this.loadVersion1();
    }

    const version = +(await this.getSchemaVersion());
    console.log('Database schema version:', version);

    switch (version) {
      case 1:
        console.log('Updating database to version 2');
        await this.loadVersion2();
      // note that there is no break needed in the switch's cases
      default:
        console.error('Database version is current');
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

  async loadVersion1(): Promise<void> {
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

    // document
    await this.runSqlFile('./src/core/sql/document/document_create.sql');

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
      './src/core/sql/data/site-text-translation-vote-upsert.sql',
    );
    await this.runSqlFile(
      './src/core/sql/data/site-text-translation-vote-toggle.sql',
    );

    // update db version
    await this.setVersionNumber(1);

    await this.registerUser(
      'admin@crowd.rocks',
      'Admin',
      this.config.ADMIN_PASSWORD || 'asdfasdf',
    );
    await this.registerUser('anonymous@crowd.rocks', 'Anonymous', 'asdfasdf');

    // load data
    await this.dataloader.loadSiteTextData();
  }

  async loadVersion2(): Promise<void> {
    // schema
    await this.runSqlFile('./src/core/sql/schema/v2.schema.sql');

    // word
    await this.runSqlFile('./src/core/sql/words/batch_word_upsert.sql');
    await this.runSqlFile('./src/core/sql/words/batch_phrase_upsert.sql');
    await this.runSqlFile(
      './src/core/sql/words/batch_word_definition_upsert.sql',
    );
    await this.runSqlFile(
      './src/core/sql/words/batch_phrase_definition_upsert.sql',
    );
    await this.runSqlFile(
      './src/core/sql/words/batch_word_definition_update.sql',
    );
    await this.runSqlFile(
      './src/core/sql/words/batch_phrase_definition_update.sql',
    );

    // translation
    await this.runSqlFile(
      './src/core/sql/translation/word_to_phrase_translation_votes_count.sql',
    );
    await this.runSqlFile(
      './src/core/sql/translation/phrase_to_word_translation_votes_count.sql',
    );
    await this.runSqlFile(
      './src/core/sql/translation/phrase_to_phrase_translation_votes_count.sql',
    );
    await this.runSqlFile(
      './src/core/sql/translation/batch_word_to_word_translation_upsert.sql',
    );
    await this.runSqlFile(
      './src/core/sql/translation/batch_word_to_phrase_translation_upsert.sql',
    );
    await this.runSqlFile(
      './src/core/sql/translation/batch_phrase_to_word_translation_upsert.sql',
    );
    await this.runSqlFile(
      './src/core/sql/translation/batch_phrase_to_phrase_translation_upsert.sql',
    );

    // data
    await this.runSqlFile(
      './src/core/sql/data/batch-site-text-word-definition-upsert.sql',
    );
    await this.runSqlFile(
      './src/core/sql/data/batch-site-text-phrase-definition-upsert.sql',
    );
    await this.runSqlFile(
      './src/core/sql/data/site-text-definition-translation-counts-upsert.sql',
    );
    await this.runSqlFile(
      './src/core/sql/data/batch-site-text-definition-translation-counts-upsert.sql',
    );
    await this.runSqlFile(
      './src/core/sql/data/site-text-definition-translation-counts-trigger.sql',
    );

    // flags
    await this.runSqlFile('./src/core/sql/flag/flag-upsert.sql');
    await this.runSqlFile('./src/core/sql/flag/flag-toggle.sql');

    // post
    await this.runSqlFile('./src/core/sql/post/post_create.v2.sql');

    // file
    await this.runSqlFile('./src/core/sql/file/file_create.sql');
    await this.runSqlFile('./src/core/sql/file/file_update-v2.sql');

    // forum
    await this.runSqlFile('./src/core/sql/forums/forum_upsert.sql');
    await this.runSqlFile('./src/core/sql/forums/forum_delete.sql');

    // forum folder
    await this.runSqlFile(
      './src/core/sql/forum_folders/forum_folder_delete.sql',
    );
    await this.runSqlFile(
      './src/core/sql/forum_folders/forum_folder_upsert.sql',
    );

    // threads
    await this.runSqlFile('./src/core/sql/threads/thread_delete.sql');
    await this.runSqlFile('./src/core/sql/threads/thread_upsert.sql');

    // notifications
    await this.runSqlFile(
      './src/core/sql/notification/notification_delete.sql',
    );
    await this.runSqlFile(
      './src/core/sql/notification/notification_insert.sql',
    );
    await this.runSqlFile(
      './src/core/sql/notification/mark_notification_as_read.sql',
    );

    // map
    await this.runSqlFile('./src/core/sql/map/original_map_create-v2.sql');

    await this.setVersionNumber(2);
  }

  async registerUser(
    email: string,
    avatar: string,
    password: string,
  ): Promise<void> {
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

  async setVersionNumber(version: number): Promise<void> {
    await this.pg.pool.query(
      `
      insert into database_version_control(version) values($1);
    `,
      [version],
    );
  }

  async runSqlFile(path: string): Promise<void> {
    try {
      console.log('loading SQL:', path);
      const data = readFileSync(path, 'utf8');
      await this.pg.pool.query(data, []);
    } catch (err) {
      console.log(err);
    }
  }
}
