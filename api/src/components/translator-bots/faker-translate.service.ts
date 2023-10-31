import { Injectable } from '@nestjs/common';

import { LanguageInput } from '../common/types';

import { ConfigService } from 'src/core/config.service';
import { createToken } from '../../common/utility';
import { PostgresService } from '../../core/postgres.service';
import { hash } from 'argon2';
import {
  FAKER_BOT_EMAIL,
  ITranslator,
  LanguageListForBotTranslateOutput,
} from './types';
import { ErrorType } from '../../common/types';

@Injectable()
export class FakerTranslateService implements ITranslator {
  constructor(private config: ConfigService, private pg: PostgresService) {}

  translate = async (
    texts: string[],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    from: LanguageInput,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    to: LanguageInput,
  ): Promise<string[]> => {
    try {
      const translations = ['TEST-translation-word', 'TEST Translation Phrase'];
      const translationTexts: string[] = [];
      for (let i = 0; i < texts.length; i++) {
        translationTexts.push(translations[i % 2]);
      }

      return translationTexts;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  async getLanguages(): Promise<LanguageListForBotTranslateOutput> {
    return {
      languages: null,
      error: ErrorType.NoError,
    };
  }

  getTranslatorToken = async (): Promise<{ id: string; token: string }> => {
    // // check if token for googlebot exists
    const tokenRes = await this.pg.pool.query(
      `select t.token, u.user_id
            from tokens t
            join users u
            on t.user_id = u.user_id
            where u.email=$1;`,
      [FAKER_BOT_EMAIL],
    );
    let gid = tokenRes.rows[0]?.user_id;
    if (!gid) {
      const pash = await hash(this.config.CR_GOOGLE_BOT_PASSWORD);
      const token = createToken();
      const res = await this.pg.pool.query(
        `
        call authentication_register_bot($1, $2, $3, $4, 0, '');
        `,
        [FAKER_BOT_EMAIL, 'FakerBot', pash, token],
      );
      gid = res.rows[0].p_user_id;
    }
    let token = tokenRes.rows[0]?.token;
    if (!token) {
      token = createToken();
      await this.pg.pool.query(
        `
          insert into tokens(token, user_id) values($1, $2);
        `,
        [token, gid],
      );
    }
    return { id: gid, token };
  };
}
