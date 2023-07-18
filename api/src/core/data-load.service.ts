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
import { ErrorType } from 'src/common/types';

@Injectable()
export class DataLoadService {
  constructor(
    private pg: PostgresService,
    private ses: SesService,
    private config: ConfigService,
  ) {
    this.loadSiteTextData(); // I use this to easily rerun the load function
  }

  async loadSiteTextData() {
    console.log('loading site text data');

    const token = await this.getAdminToken();

    if (token == null) {
      console.error("Admin user hasn't been created yet");
      return;
    }

    const siteTextKeys = Object.keys(siteText);

    for (let i = 0; i < siteTextKeys.length; i++) {
      const siteTextEntryKey = siteTextKeys[i];
      const siteTextEntryKeyWordsArr = siteTextEntryKey.split(' ');

      if (siteTextEntryKeyWordsArr.length == 1) {
        const onlyWordInEntryKey = siteTextEntryKeyWordsArr[0].trim();
        const wordIdOfOnlyWord = await this.wordUpsert(
          onlyWordInEntryKey,
          'en',
          token,
        );
        await this.addTranslatedWordOrPhraseToOneWordSiteTextEntry(
          siteText[siteTextEntryKey],
          wordIdOfOnlyWord,
          token,
        );
      } else if (siteTextEntryKeyWordsArr.length > 1) {
        // this is a phrase
        // const wordIds = words.map(async (value) => {
        //   const newWord = value.trim();
        //   const wordId = await this.wordUpsert(newWord, 'en', token);
        //   return wordId;
        // });
        // console.log('phrase array', wordIds);
      }
    }
  }

  async getAdminToken(): Promise<string | null> {
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

  async wordUpsert(
    word: string,
    langauge: string,
    token: string,
  ): Promise<number | null> {
    try {
      const res = await this.pg.pool.query(
        `
          call word_upsert($1, $2, $3, $4, $5, 0, '');
        `,
        [word, langauge, null, null, token],
      );

      const error = res.rows[0].p_error_type;
      const word_id = res.rows[0].p_word_id;

      if (error !== ErrorType.NoError || !word_id) {
        console.error('error upserting word', word);
        return;
      }

      return word_id;
    } catch (e) {
      console.error(e);
    }
  }

  async phraseUpsert(wordArr: number[], token: string): Promise<number | null> {
    try {
      const res = await this.pg.pool.query(
        `
          call phrase_upsert($1, $2, $3, $4, $5, 0, '');
        `,
        [wordArr, null, null, token],
      );

      const error = res.rows[0].p_error_type;
      const word_id = res.rows[0].p_word_id;

      if (error !== ErrorType.NoError || !word_id) {
        console.error('error upserting word', wordArr);
        return;
      }

      return word_id;
    } catch (e) {
      console.error(e);
    }
  }

  async addTranslatedWordOrPhraseToOneWordSiteTextEntry(
    siteTextEntryObj: {},
    onlyWordIdOfEntryKey: number,
    token: string,
  ): Promise<number | null> {
    const keysInEntryObj = Object.keys(siteTextEntryObj);

    for (let i = 0; i < keysInEntryObj.length; i++) {
      const languageCode = keysInEntryObj[i];
      const translatedWordOrPhraseInEntry =
        siteTextEntryObj[languageCode].split(' ');

      if (translatedWordOrPhraseInEntry.length == 1) {
        // the translation is a single word
        const translatedWordId = await this.wordUpsert(
          siteTextEntryObj[languageCode].trim(),
          languageCode,
          token,
        );

        const wordToWordTranslationId = await this.wordToWordTranslationUpsert(
          onlyWordIdOfEntryKey,
          translatedWordId,
          token,
        );

        return wordToWordTranslationId;
      } else if (translatedWordOrPhraseInEntry.length > 1) {
        // the translation is a phrase
      }
    }
  }

  async wordToWordTranslationUpsert(
    fromWord: number,
    toWord: number,
    token: string,
  ): Promise<number | null> {
    try {
      const res = await this.pg.pool.query(
        `
          call word_to_word_translation_upsert($1, $2, $3, 0, '');
        `,
        [fromWord, toWord, token],
      );

      const translation_id = res.rows[0].p_w2w_translation_id;

      if (!translation_id) {
        console.error('failed to upsert w2w translation', fromWord, toWord);
      }

      return translation_id;
    } catch (e) {
      console.error(e);
    }
  }
}
   