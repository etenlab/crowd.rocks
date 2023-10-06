import { Injectable } from '@nestjs/common';

import { LanguageInput } from '../common/types';
import { ConfigService } from 'src/core/config.service';
import { ITranslator, LanguageResult } from './translations.service';
import { PostgresService } from '../../core/postgres.service';
import { createToken } from '../../common/utility';
import { hash } from 'argon2';
import { parse } from 'node-html-parser';
import fetch from 'node-fetch';
import { LanguageInput2tag } from '../../common/langUtils';

const LIMIT_WORDS = 20; // for debugging purposes, not to exhaust free limit too quickly/
const SMARTCAT_BOT_EMAIL = 'liltbot@crowd.rocks';
const DEFAULT_CONTEXT = 'default';
const DEFAULT_PROFILE = 'crowd.rocks profile';
const DEFAULT_TAG = 'crowd.rocks tag';

type InSmartcatObj = {
  sourceLanguage: string;
  targetLanguages: string[];
  profile: string;
  isHtml: boolean;
  texts: Array<{
    text: string;
    context: string;
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
    const res: OutSmartcatObj = { translations: [] };
    //todo
    return res;
  }

  async translate(
    texts: string[],
    from: LanguageInput,
    to: LanguageInput,
  ): Promise<string[]> {
    try {
      const objForTranslation: InSmartcatObj = {
        sourceLanguage: LanguageInput2tag(from),
        targetLanguages: [LanguageInput2tag(to)],
        isHtml: false,
        externalTag: DEFAULT_TAG,
        profile: DEFAULT_PROFILE,
        texts: texts.splice(0, LIMIT_WORDS).map((text) => ({
          text,
          context: DEFAULT_CONTEXT,
        })),
      };

      const translatedObj = await this.smartcatTranslate(objForTranslation);
      const translatedTexts = translatedObj.translations[
        LanguageInput2tag(to)
      ].map((t) => t.translation);

      return translatedTexts;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async getLanguages(): Promise<LanguageResult[]> {
    const res = await fetch('https://smartcat.com/Home/Languages');
    const text = await res.text();
    const dom = parse(text);
    const tds = dom.getElementsByTagName('td');
    const languages: {
      name: string;
      tag: string;
      script: string;
      writingDirection: string;
    }[] = [];
    for (let i = 0; i < tds.length; i++) {
      languages.push({
        name: tds[i].innerText,
        tag: tds[i + 1].innerText,
        script: tds[i + 2].innerText,
        writingDirection: tds[i + 3].innerText,
      });
      i = i + 3;
    }
    return languages.map((l) => ({
      code: l.tag,
      name: l.name,
    }));
  }

  async getTranslatorToken(): Promise<{ id: string; token: string }> {
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
  }
}
