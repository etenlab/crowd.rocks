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
    // this.loadSiteTextData(); // I use this to easily rerun the load function
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
        const wordIds = await Promise.all(
          siteTextEntryKeyWordsArr.map(async (value) => {
            const newWord = value.trim();
            const wordId = await this.wordUpsert(newWord, 'en', token);
            return wordId;
          }),
        );

        const phraseId = await this.phraseUpsert(wordIds, token);

        // create translated phrase
        await this.addTranslatedPhraseToPhraseFromSiteTextEntry(
          siteText[siteTextEntryKey],
          phraseId,
          token,
        );
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
          call phrase_upsert($1, $2, 0, '');
        `,
        [wordArr, token],
      );

      const error = res.rows[0].p_error_type;
      const prase_id = res.rows[0].p_phrase_id;

      if (error !== ErrorType.NoError || !prase_id) {
        console.error('error upserting phrase', wordArr);
        return;
      }

      return prase_id;
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
        const wordIds = await Promise.all(
          translatedWordOrPhraseInEntry.map(async (value) => {
            const newWord = value.trim();
            const wordId = await this.wordUpsert(newWord, 'en', token);
            return wordId;
          }),
        );

        const phraseId = await this.phraseUpsert(wordIds, token);

        const wordToPhraseTranslationId =
          await this.wordToPhraseTranslationUpsert(
            onlyWordIdOfEntryKey,
            phraseId,
            token,
          );

        console.log('w2p', wordToPhraseTranslationId);
      }
    }
  }

  async addTranslatedPhraseToPhraseFromSiteTextEntry(
    siteTextEntryObj: {},
    phraseIdOfEntryKey: number,
    token: string,
  ): Promise<number | null> {
    const keysInEntryObj = Object.keys(siteTextEntryObj);

    for (let i = 0; i < keysInEntryObj.length; i++) {
      const languageCode = keysInEntryObj[i];
      const translatedWordOrPhraseInEntry =
        siteTextEntryObj[languageCode].split(' ');

      if (translatedWordOrPhraseInEntry.length == 1) {
        // the translation is a single word

        console.log('we have a phrase to word translation');
        // const translatedWordId = await this.wordUpsert(
        //   siteTextEntryObj[languageCode].trim(),
        //   languageCode,
        //   token,
        // );

        // const wordToWordTranslationId = await this.wordToWordTranslationUpsert(
        //   phraseIdOfEntryKey,
        //   translatedWordId,
        //   token,
        // );

        // return wordToWordTranslationId;
      } else if (translatedWordOrPhraseInEntry.length > 1) {
        // the translation is a phrase
        const wordIds = await Promise.all(
          translatedWordOrPhraseInEntry.map(async (value) => {
            const newWord = value.trim();
            const wordId = await this.wordUpsert(newWord, 'en', token);
            return wordId;
          }),
        );

        const phraseId = await this.phraseUpsert(wordIds, token);

        const phraseToPhraseTranslationId =
          await this.phraseToPhraseTranslationUpsert(
            phraseIdOfEntryKey,
            phraseId,
            token,
          );

        return phraseToPhraseTranslationId;
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

      const translation_id = res.rows[0].p_word_to_word_translation_id;

      if (!translation_id) {
        console.error(
          'failed to upsert word to word translation',
          fromWord,
          toWord,
        );
      }

      return translation_id;
    } catch (e) {
      console.error(e);
    }
  }

  async wordToPhraseTranslationUpsert(
    fromWord: number,
    toPhrase: number,
    token: string,
  ): Promise<number | null> {
    try {
      const res = await this.pg.pool.query(
        `
          call word_to_phrase_translation_upsert($1, $2, $3, 0, '');
        `,
        [fromWord, toPhrase, token],
      );

      const translation_id = res.rows[0].p_word_to_phrase_translation_id;

      if (!translation_id) {
        console.error(
          'failed to upsert word to phrase translation',
          fromWord,
          toPhrase,
        );
      }

      return translation_id;
    } catch (e) {
      console.error(e);
    }
  }

  async phraseToPhraseTranslationUpsert(
    fromPhrase: number,
    toPhrase: number,
    token: string,
  ): Promise<number | null> {
    try {
      const res = await this.pg.pool.query(
        `
          call phrase_to_phrase_translation_upsert($1, $2, $3, 0, '');
        `,
        [fromPhrase, toPhrase, token],
      );

      const translation_id = res.rows[0].p_phrase_to_phrase_translation_id;

      if (!translation_id) {
        console.error(
          'failed to upsert phrase to phrase translation',
          fromPhrase,
          toPhrase,
        );
      }

      return translation_id;
    } catch (e) {
      console.error(e);
    }
  }
}
