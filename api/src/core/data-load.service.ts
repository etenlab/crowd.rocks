import { Injectable } from '@nestjs/common';
import { Config } from 'apollo-server-core';
import { readFileSync } from 'fs';
import { justBearerHeader } from 'src/common/utility';
import { RegisterResolver } from 'src/components/authentication/register.resolver';
import { WordUpsertResolver } from 'src/components/words/word-upsert.resolver';
import { ConfigService } from './config.service';
import { PostgresService } from './postgres.service';
import { SesService } from './ses.service';
import { siteText } from './data/lang';

@Injectable()
export class DataLoadService {
  constructor(
    private pg: PostgresService,
    private ses: SesService,
    private config: ConfigService,
  ) {
    this.loadSiteTextData();
  }

  async loadSiteTextData() {
    console.log('loading site text data');

    const token = await this.getAdminToken();

    if (token == null) {
      console.error("Admin user hasn't been created yet");
      return;
    }

    Object.keys(siteText).forEach((element) => {
      console.log(element);
      console.log(siteText[element].jp);
    });
  }

  async getAdminToken(): string | null {
    try {
      const res = await this.pg.pool.query(
        `
            select token from tokens where user_id = 1
          `,
        [],
      );

      return res.rows[0].token;
    } catch (e) {
      console.error(e);
    }
  }

  async wordUpsert(word: string, token: string): number | null {
    try {
      const res = await this.pg.pool.query(
        `
            call word_upsert($1, $2, null, null, $3, 0, '');
          `,
        [
          input.wordlike_string,
          'eng',
          token,
        ],
      );

      const error = res.rows[0].p_error_type;
      const word_id = res.rows[0].p_word_id;

      if (error !== ErrorType.NoError || !word_id) {
        return {
          error,
          word: null,
        };
      }

      const word = await (
        await this.wordRead.wordReadResolver({ word_id }, req)
      ).word;

      return {
        error,
        word,
      };
    } catch (e) {
      console.error(e);
    }
  }
}
