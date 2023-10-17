import { Injectable } from '@nestjs/common';

import { LanguageInput } from '../common/types';
import { ConfigService } from 'src/core/config.service';
import { PostgresService } from '../../core/postgres.service';
import { createToken } from '../../common/utility';
import { hash } from 'argon2';
import { parse } from 'node-html-parser';
import fetch, { Headers } from 'node-fetch';
import { ITranslator, LanguageListForBotTranslateOutput } from './types';
import { ErrorType } from '../../common/types';
import { languageInput2tag } from '../../common/langUtils';

const LIMIT_WORDS = undefined; //20; // for debugging purposes, not to exhaust free limit too quickly/
const SMARTCAT_BOT_EMAIL = 'smartcatbot@crowd.rocks';
const PROJECT_TAG = 'crowd_rocks_tag';

type InSmartcatObj = {
  sourceLanguage: string;
  targetLanguages: string[];
  profile: string;
  isHtml: boolean;
  texts: Array<{
    text: string;
    context?: string;
  }>;
  externalTag: string;
};

type OutSmartcatObj = {
  translations: Array<{
    [key: string]: Array<{
      translation: string;
      error: boolean;
    }>;
  }>;
};

@Injectable()
export class SmartcatTranslateService implements ITranslator {
  constructor(private config: ConfigService, private pg: PostgresService) {}

  async smartcatTranslate(inObj: InSmartcatObj): Promise<OutSmartcatObj> {
    if (!this.config.SMARTCAT_KEY || !this.config.SMARTCAT_ID) {
      throw new Error(`No credentials for smartcat are found.`);
    }
    const url =
      'https://us.smartcat.ai/api/integration/v1/smartTranslation/translate';
    const username = this.config.SMARTCAT_ID;
    const password = this.config.SMARTCAT_KEY;

    const headers = new Headers();
    // headers.append('Content-Type', 'text/json');
    headers.append(
      'Authorization',
      `Basic ${Buffer.from(username + ':' + password).toString('base64')}`,
    );
    headers.append('Content-Type', 'application/json-patch+json');
    headers.append('Accept', 'text/plain');

    const res = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(inObj),
    });
    let resS = '';
    for await (const b of res.body) {
      resS += b;
    }
    if (!res.ok) {
      throw new Error(
        `Error from Smartcat API, responce:  ${JSON.stringify(resS)}`,
      );
    }

    let resJ: any = {};
    try {
      resJ = JSON.parse(resS);
    } catch {
      throw new Error(`Can't parse Smartcat API responce:  ${resS}`);
    }
    return resJ;
  }

  translate = async (
    texts: string[],
    from: LanguageInput,
    to: LanguageInput,
  ): Promise<string[]> => {
    try {
      const textsForTranslate = LIMIT_WORDS
        ? texts.splice(0, LIMIT_WORDS)
        : texts;
      const objForTranslation: InSmartcatObj = {
        sourceLanguage: languageInput2tag(from),
        targetLanguages: [languageInput2tag(to)],
        isHtml: false,
        externalTag: PROJECT_TAG,
        profile: this.config.SMARTCAT_PROFILE || '',
        texts: textsForTranslate.map((text) => ({
          text,
        })),
      };

      const translatedObj = await this.smartcatTranslate(objForTranslation);
      const translatedTexts = translatedObj.translations[
        languageInput2tag(to)
      ].map((t) => t.translation);

      return translatedTexts;
    } catch (err) {
      console.log(`sc-translate.service Error: ${JSON.stringify(err)}`);
      throw err;
    }
  };

  async getLanguages(): Promise<LanguageListForBotTranslateOutput> {
    try {
      const res = await fetch('https://smartcat.com/Home/Languages');
      const text = await res.text();
      const dom = parse(text);
      const tds = dom.getElementsByTagName('td');
      const scLangs: {
        name: string;
        tag: string;
        script: string;
        writingDirection: string;
      }[] = [];
      for (let i = 0; i < tds.length; i++) {
        scLangs.push({
          name: tds[i].innerText,
          tag: tds[i + 1].innerText,
          script: tds[i + 2].innerText,
          writingDirection: tds[i + 3].innerText,
        });
        // Array `tds` repeats every 4 elements (for name, tag, script, direction).
        // So while iterating, we increase counter `i` by 1 in the `for` clause, and here also increase by 3.
        // Thus we can take the next 4 elements in the new iteration of the `for` cycle.
        i = i + 3;
      }
      const languages = scLangs.map((l) => ({
        code: l.tag,
        name: l.name,
      }));
      return {
        languages: languages,
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
      [SMARTCAT_BOT_EMAIL],
    );
    let id = tokenRes.rows[0]?.user_id;
    if (!id) {
      const pash = await hash(this.config.CR_GOOGLE_BOT_PASSWORD);
      const token = createToken();
      const res = await this.pg.pool.query(
        `
        call authentication_register($1, $2, $3, $4, 0, '');
        `,
        [SMARTCAT_BOT_EMAIL, 'SmartcatBot', pash, token],
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
