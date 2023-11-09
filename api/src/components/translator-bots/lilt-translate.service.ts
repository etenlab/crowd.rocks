import { Injectable, Logger } from '@nestjs/common';
import { hash } from 'argon2';
import { delay } from 'rxjs';
import { createToken } from 'src/common/utility';
import { LanguageInput } from 'src/components/common/types';
import { ConfigService } from 'src/core/config.service';
import { PostgresService } from 'src/core/postgres.service';
import { ErrorType } from '../../common/types';
import {
  ITranslator,
  LanguageForBotTranslate,
  LanguageListForBotTranslateOutput,
} from './types';
import fetch, { Headers } from 'node-fetch';
import { getLangsRegistry } from '../../../../utils';

const LIMIT_REQUESTS = 4000; // per LIMIT_TIME
const LIMIT_TIME = 60 * 1000; // per minute
const WAIT_TIMEOUT = 60 * 1000; // miliseconds; if limit_requests reached, need to wait 60 seconds before the next request
const LIMIT_LENGTH = 5000; // characters of a source string per request
const JOINER = '.<br/>'; // joins words or phrases before sending to lilt api

const LILT_BOT_EMAIL = 'liltbot@crowd.rocks';

type TResLangs = {
  source_to_target: {
    [key: string]: { [key: string]: boolean };
  };
  code_to_name: {
    [key: string]: string;
  };
};

@Injectable()
export class LiltTranslateService implements ITranslator {
  private firstOperateTime: number;
  private lastOperateTime: number;
  private availableRequests: number;

  constructor(private config: ConfigService, private pg: PostgresService) {
    this.firstOperateTime = 0;
    this.lastOperateTime = 0;
    this.availableRequests = LIMIT_REQUESTS;
  }

  async liltTranslate(
    origStr,
    from: LanguageInput,
    to: LanguageInput,
  ): Promise<string> {
    //todo
    return '';
  }

  processApiCall = async (
    chunks: Array<string>,
    from: LanguageInput,
    to: LanguageInput,
  ): Promise<Array<string>> => {
    if (!(chunks?.length > 0)) return [];
    if (
      Date.now() - this.firstOperateTime < 60 * LIMIT_TIME &&
      this.availableRequests < 1
    ) {
      await delay(WAIT_TIMEOUT);
      this.availableRequests = LIMIT_REQUESTS;
    }

    const translation = await this.liltTranslate(chunks.join(JOINER), from, to);
    const translatedChunks = translation.split(JOINER);

    this.lastOperateTime = Date.now();
    this.availableRequests--;
    return translatedChunks;
  };

  translate = async (
    texts: string[],
    from: LanguageInput,
    to: LanguageInput,
  ): Promise<string[]> => {
    try {
      texts.forEach((text) => {
        if (text.length >= LIMIT_LENGTH - JOINER.length) {
          throw new Error(
            `Input text too long, more than ${LIMIT_LENGTH - JOINER.length}`,
          );
        }
      });

      let chunks: string[] = [];
      const translatedTexts: string[] = [];
      let availableCharacters = LIMIT_LENGTH;

      for (const text of texts) {
        if (availableCharacters < text.length + JOINER.length) {
          translatedTexts.push(
            ...(await this.processApiCall(chunks, from, to)),
          );
          chunks = [];
          availableCharacters = LIMIT_LENGTH;
        }
        chunks.push(text);
        availableCharacters = availableCharacters - text.length - JOINER.length;
      }
      // last one
      translatedTexts.push(...(await this.processApiCall(chunks, from, to)));

      return translatedTexts;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  async getLanguages(): Promise<LanguageListForBotTranslateOutput> {
    try {
      const ourLangTags = (await getLangsRegistry()).langs.map((l) => l.tag);
      const url = `https://lilt.com/2/languages?key=${this.config.LILT_KEY}`;
      const res = await fetch(url, {
        method: 'GET',
      });
      const liltLangsRes = await res.json();
      const targetLangsObj = (liltLangsRes as TResLangs).source_to_target['en'];
      const targetLangsNames = (liltLangsRes as TResLangs).code_to_name;
      const languages: LanguageForBotTranslate[] = [];
      const filteredOut: Array<LanguageForBotTranslate & { reason: string }> =
        [];

      for (const [langCode, isTrue] of Object.entries(targetLangsObj)) {
        if (!isTrue) {
          filteredOut.push({
            code: langCode,
            name: targetLangsNames[langCode],
            reason: 'Lilt translate status is false',
          });
          continue;
        }

        if (ourLangTags.includes(langCode)) {
          languages.push({
            code: langCode,
            name: targetLangsNames[langCode],
          });
        } else {
          filteredOut.push({
            code: langCode,
            name: targetLangsNames[langCode],
            reason: 'Not Found in RFC 5646 language codes',
          });
        }
      }

      Logger.log(
        `filtered out lilt's languages: ${JSON.stringify(filteredOut)}`,
      );

      return {
        languages,
        error: ErrorType.NoError,
      };
    } catch (error) {
      return {
        languages: null,
        error: ErrorType.BotTranslationLanguagesListError,
      };
    }
  }

  getTranslatorToken = async (): Promise<{ id: string; token: string }> => {
    // // check if token for liltbot exists
    const tokenRes = await this.pg.pool.query(
      `select t.token, u.user_id
            from users u
            left join tokens t
            on u.user_id = t.user_id
            where u.email=$1;`,
      [LILT_BOT_EMAIL],
    );
    let id = tokenRes.rows[0]?.user_id;
    if (!id) {
      const pash = await hash(this.config.CR_GOOGLE_BOT_PASSWORD);
      const token = createToken();
      const res = await this.pg.pool.query(
        `
        call authentication_register_bot($1, $2, $3, $4, 0, '');
        `,
        [LILT_BOT_EMAIL, 'LiltBot', pash, token],
      );
      id = res.rows[0].p_user_id;
    }

    let token = tokenRes.rows[0]?.token;
    if (!token) {
      const res = await this.pg.pool.query(
        `
          insert into tokens(token, user_id) values($1, $2)
          returning token
        `,
        [createToken(), id],
      );
      token = res.rows[0].token;
    }
    return { id, token };
  };
}
