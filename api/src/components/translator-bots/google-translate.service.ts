import { Injectable } from '@nestjs/common';
import { v2 } from '@google-cloud/translate';
import { convert } from 'html-to-text';

import { LanguageInput } from '../common/types';

import { ConfigService } from 'src/core/config.service';
import { createToken, substituteN, unSubstituteN } from '../../common/utility';
import { PostgresService } from '../../core/postgres.service';
import { hash } from 'argon2';
import {
  GOOGLE_BOT_EMAIL,
  ITranslator,
  LanguageListForBotTranslateOutput,
  LIMITS,
} from './types';
import { ErrorType } from '../../common/types';
import { delay } from './utility';

@Injectable()
export class GoogleTranslateService implements ITranslator {
  private gcpTranslateClient: v2.Translate | null;
  private availableCharactors: number;
  private lastOperateTime: number;

  constructor(private config: ConfigService, private pg: PostgresService) {
    if (
      this.config.GCP_API_KEY &&
      this.config.GCP_API_KEY.trim().length > 0 &&
      this.config.GCP_PROJECT_ID &&
      this.config.GCP_PROJECT_ID.trim().length > 0
    ) {
      this.gcpTranslateClient = new v2.Translate({
        projectId: this.config.GCP_PROJECT_ID,
        key: this.config.GCP_API_KEY,
      });

      this.lastOperateTime = 0;
    }
  }

  translate = async (
    texts: string[],
    from: LanguageInput,
    to: LanguageInput,
  ): Promise<string[]> => {
    try {
      if (!this.gcpTranslateClient) {
        throw new Error('no translation client');
      }

      texts.forEach((text) => {
        if (text.length >= LIMITS) {
          throw new Error('Input text too long');
        }
      });

      if (Date.now() - this.lastOperateTime > 60 * 1000) {
        this.availableCharactors = LIMITS;
      }

      let chunks: string[] = [];
      let translationTexts: string[] = [];

      const processApiCall = async () => {
        if (
          Date.now() - this.lastOperateTime < 60 * 1000 &&
          this.availableCharactors < 1
        ) {
          await delay(60 * 1000);
          this.availableCharactors = LIMITS;
        }

        const [translations] = await this.gcpTranslateClient!.translate(
          substituteN(chunks).join('<br/>'),
          {
            from: from.language_code,
            to: to.language_code,
            format: 'html',
          },
        );

        translationTexts = [
          ...translationTexts,
          ...unSubstituteN(
            translations
              .split('<br/>')
              .map((translation) => convert(translation)),
          ),
        ];

        chunks = [];
        this.lastOperateTime = Date.now();
      };

      for (const text of texts) {
        if (this.availableCharactors < text.length) {
          this.availableCharactors -= text.length;
          await processApiCall();
        }

        chunks.push(text);
        this.availableCharactors = this.availableCharactors - text.length;
      }

      if (chunks.length > 0) {
        await processApiCall();
      }

      return translationTexts;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  async getLanguages(): Promise<LanguageListForBotTranslateOutput> {
    try {
      if (!this.gcpTranslateClient) {
        throw new Error('no translate client');
      }

      const [googleLanguageResults] =
        await this.gcpTranslateClient!.getLanguages();

      const languages = googleLanguageResults.map((gl) => ({
        code: gl.code,
        name: gl.name,
      }));
      return {
        languages,
        error: ErrorType.NoError,
      };
    } catch {
      return {
        languages: null,
        error: ErrorType.BotTranslationLanguagesListError,
      };
    }
  }

  getTranslatorToken = async (): Promise<{ id: string; token: string }> => {
    // // check if token for googlebot exists
    const tokenRes = await this.pg.pool.query(
      `select t.token, u.user_id
            from tokens t
            join users u
            on t.user_id = u.user_id
            where u.email=$1;`,
      [GOOGLE_BOT_EMAIL],
    );
    let gid = tokenRes.rows[0]?.user_id;
    if (!gid) {
      const pash = await hash(this.config.CR_GOOGLE_BOT_PASSWORD);
      const token = createToken();
      const res = await this.pg.pool.query(
        `
        call authentication_register_bot($1, $2, $3, $4, 0, '');
        `,
        [GOOGLE_BOT_EMAIL, 'GoogleBot', pash, token],
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
