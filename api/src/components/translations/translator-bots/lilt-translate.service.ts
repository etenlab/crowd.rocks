import { Injectable } from '@nestjs/common';
// import { convert } from 'html-to-text';
import { hash } from 'argon2';
import { delay } from 'rxjs';
import { createToken } from 'src/common/utility';
import { LanguageInput } from 'src/components/common/types';
import { ConfigService } from 'src/core/config.service';
import { PostgresService } from 'src/core/postgres.service';
import { ErrorType } from '../../../common/types';
import { LanguageListForBotTranslateOutput } from '../types';
import { ITranslator } from './types';
// import { substituteN, unSubstituteN } from '../../common/utility';

const LIMIT_REQUESTS = 4000; // per LIMIT_TIME
const LIMIT_TIME = 60 * 1000; // per minute
const WAIT_TIMEOUT = 60 * 1000; // miliseconds; if limit_requests reached, need to wait 60 seconds before the next request
const LIMIT_LENGTH = 5000; // characters of a source string per request
const JOINER = '.<br/>'; // joins words or phrases before sending to lilt api

const LILT_BOT_EMAIL = 'liltbot@crowd.rocks';

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

  async translate(
    texts: string[],
    from: LanguageInput,
    to: LanguageInput,
  ): Promise<string[]> {
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
  }

  async getLanguages(): Promise<LanguageListForBotTranslateOutput> {
    //todo
    return {
      languages: [
        {
          code: 'uk',
          name: 'Ukrainian (mocked)',
        },
        {
          code: 'pl',
          name: 'Polish (mocked)',
        },
      ],
      error: ErrorType.NoError,
    };
  }

  async getTranslatorToken(): Promise<{ id: string; token: string }> {
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
        call authentication_register($1, $2, $3, $4, 0, '');
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
  }
}
