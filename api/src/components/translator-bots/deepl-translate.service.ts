import { Injectable } from '@nestjs/common';

import { LanguageInput } from '../common/types';
import { ConfigService } from 'src/core/config.service';
import { PostgresService } from '../../core/postgres.service';
import { createToken } from '../../common/utility';
import { hash } from 'argon2';
import { languageInput2tag } from '../../common/langUtils';
import {
  ITranslator,
  LanguageForBotTranslate,
  LanguageListForBotTranslateOutput,
} from './types';
import { ErrorType } from '../../common/types';
import * as deepl from 'deepl-node';
import { SourceLanguageCode, TargetLanguageCode } from 'deepl-node';

const LIMIT_WORDS = 20; // for debugging purposes, not to exhaust free limit too quickly/
const DEEPL_BOT_EMAIL = 'deeplbot@crowd.rocks';

@Injectable()
export class DeepLTranslateService implements ITranslator {
  private deepLTranslator;
  constructor(private config: ConfigService, private pg: PostgresService) {
    this.deepLTranslator = new deepl.Translator(config.DEEPL_KEY);
  }

  translate = async (
    texts: string[],
    from: LanguageInput,
    to: LanguageInput,
  ): Promise<string[]> => {
    try {
      const sourceLangTag = languageInput2tag(from);
      const targetLangTag = languageInput2tag(to);
      const wordsCountRequested = texts.length;
      if (
        (await this.deepLTranslator.getSourceLanguages()).findIndex(
          (sl) => sl.code === sourceLangTag,
        ) === -1
      ) {
        throw new Error(
          `Language ${sourceLangTag} can not be source language for DeepL`,
        );
      }

      if (
        (await this.deepLTranslator.getTargetLanguages()).findIndex(
          (sl) => sl.code === targetLangTag,
        ) === -1
      ) {
        throw new Error(
          `Language ${targetLangTag} can not be target language for DeepL`,
        );
      }

      const textsForTranslate = texts.splice(0, LIMIT_WORDS);
      const translated = await this.deepLTranslator.translateText(
        textsForTranslate,
        sourceLangTag as SourceLanguageCode,
        targetLangTag as TargetLanguageCode,
      );
      const translatedTexts = translated.map((t) => t.text);
      //fill the rest with ''
      for (let i = 0; i < wordsCountRequested - translated.length; i++) {
        translatedTexts.push('');
      }

      return translatedTexts;
    } catch (err) {
      console.log(`sc-translate.service Error: ${JSON.stringify(err)}`);
      throw err;
    }
  };

  async getLanguages(): Promise<LanguageListForBotTranslateOutput> {
    try {
      const deepLLangs = await this.deepLTranslator.getTargetLanguages();
      const languages: LanguageForBotTranslate[] = deepLLangs.map((dl) => {
        return {
          code: dl.code,
          name: dl.name,
        } as LanguageForBotTranslate;
      });
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
    // // check if token for bot exists
    const tokenRes = await this.pg.pool.query(
      `select t.token, u.user_id
            from users u
            left join tokens t
            on u.user_id = t.user_id
            where u.email=$1;`,
      [DEEPL_BOT_EMAIL],
    );
    let id = tokenRes.rows[0]?.user_id;
    if (!id) {
      const pash = await hash(this.config.CR_GOOGLE_BOT_PASSWORD); // sic! one password for all bots
      const token = createToken();
      const res = await this.pg.pool.query(
        `
        call authentication_register($1, $2, $3, $4, 0, '');
        `,
        [DEEPL_BOT_EMAIL, 'DeepLBot', pash, token],
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
