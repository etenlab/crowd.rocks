import { Injectable } from '@nestjs/common';
// import { Config } from 'apollo-server-core';
// import { readFileSync } from 'fs';
// import { justBearerHeader } from 'src/common/utility';
// import { RegisterResolver } from 'src/components/authentication/register.resolver';
// import { WordUpsertResolver } from 'src/components/words/word-upsert.resolver';

import { PostgresService } from './postgres.service';
import { WordsService } from 'src/components/words/words.service';
import { PhrasesService } from 'src/components/phrases/phrases.service';
import { WordToWordTranslationsService } from 'src/components/translations/word-to-word-translations.service';
import { WordToPhraseTranslationsService } from 'src/components/translations/word-to-phrase-translations.service';
import { PhraseToPhraseTranslationsService } from 'src/components/translations/phrase-to-phrase-translations.service';

import { siteText } from './data/lang';

import { getAdminTokenSQL } from './sql-string';

@Injectable()
export class DataLoadService {
  constructor(
    private pg: PostgresService,
    private wordService: WordsService,
    private phraseService: PhrasesService,
    private wordToWordTransService: WordToWordTranslationsService,
    private wordToPhraseTransService: WordToPhraseTranslationsService,
    private phraseToPhraseTransService: PhraseToPhraseTranslationsService,
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

    // const siteTextKeys = Object.keys(siteText);

    // for (let i = 0; i < siteTextKeys.length; i++) {
    //   const siteTextEntryKey = siteTextKeys[i];
    //   const siteTextEntryKeyWordsArr = siteTextEntryKey.split(' ');

    //   if (siteTextEntryKeyWordsArr.length == 1) {
    //     const onlyWordInEntryKey = siteTextEntryKeyWordsArr[0].trim();
    //     const { word } = await this.wordService.upsert(
    //       {
    //         wordlike_string: onlyWordInEntryKey,
    //         language_code: 'en',
    //         dialect_code: null,
    //         geo_code: null,
    //       },
    //       token,
    //     );

    //     await this.addTranslatedWordOrPhraseToOneWordSiteTextEntry(
    //       siteText[siteTextEntryKey],
    //       +word.word_id,
    //       token,
    //     );
    //   } else if (siteTextEntryKeyWordsArr.length > 1) {
    //     // this is a phrase
    //     const { phrase } = await this.phraseService.upsert(
    //       {
    //         phraselike_string: siteTextEntryKeyWordsArr.join(' '),
    //         language_code: 'en',
    //         dialect_code: null,
    //         geo_code: null,
    //       },
    //       token,
    //     );

    //     // create translated phrase
    //     await this.addTranslatedPhraseToPhraseFromSiteTextEntry(
    //       siteText[siteTextEntryKey],
    //       +phrase.phrase_id,
    //       token,
    //     );
    //   }
    // }
  }

  async getAdminToken(): Promise<string | null> {
    try {
      const res = await this.pg.pool.query(...getAdminTokenSQL());

      return res.rows[0].token;
    } catch (e) {
      console.error(e);
    }
  }

  // async addTranslatedWordOrPhraseToOneWordSiteTextEntry(
  //   siteTextEntryObj: object,
  //   onlyWordIdOfEntryKey: number,
  //   token: string,
  // ): Promise<number | null> {
  //   const keysInEntryObj = Object.keys(siteTextEntryObj);

  //   for (let i = 0; i < keysInEntryObj.length; i++) {
  //     const languageCode = keysInEntryObj[i];
  //     const translatedWordOrPhraseInEntry =
  //       siteTextEntryObj[languageCode].split(' ');

  //     if (translatedWordOrPhraseInEntry.length == 1) {
  //       // the translation is a single word

  //       const { word: translatedWord } = await this.wordService.upsert(
  //         {
  //           wordlike_string: siteTextEntryObj[languageCode].trim(),
  //           language_code: languageCode,
  //           dialect_code: null,
  //           geo_code: null,
  //         },
  //         token,
  //       );

  //       const wordToWordTranslationUpsertOutput =
  //         await this.wordToWordTransService.upsert(
  //           onlyWordIdOfEntryKey,
  //           +translatedWord.word_id,
  //           token,
  //         );

  //       return +wordToWordTranslationUpsertOutput.word_to_word_translation
  //         .word_to_word_translation_id;
  //     } else if (translatedWordOrPhraseInEntry.length > 1) {
  //       // the translation is a phrase
  //       const { phrase } = await this.phraseService.upsert(
  //         {
  //           phraselike_string: translatedWordOrPhraseInEntry.join(' '),
  //           language_code: 'en',
  //           dialect_code: null,
  //           geo_code: null,
  //         },
  //         token,
  //       );

  //       const wordToPhraseTranslationUpsertOutput =
  //         await this.wordToPhraseTransService.upsert(
  //           onlyWordIdOfEntryKey,
  //           +phrase.phrase_id,
  //           token,
  //         );

  //       console.log(
  //         'w2p',
  //         wordToPhraseTranslationUpsertOutput.word_to_phrase_translation
  //           .word_to_phrase_translation_id,
  //       );
  //     }
  //   }
  // }

  // async addTranslatedPhraseToPhraseFromSiteTextEntry(
  //   siteTextEntryObj: object,
  //   phraseIdOfEntryKey: number,
  //   token: string,
  // ): Promise<number | null> {
  //   const keysInEntryObj = Object.keys(siteTextEntryObj);

  //   for (let i = 0; i < keysInEntryObj.length; i++) {
  //     const languageCode = keysInEntryObj[i];
  //     const translatedWordOrPhraseInEntry =
  //       siteTextEntryObj[languageCode].split(' ');

  //     if (translatedWordOrPhraseInEntry.length == 1) {
  //       // the translation is a single word

  //       console.log('we have a phrase to word translation');
  //       // const translatedWordId = await this.wordUpsert(
  //       //   siteTextEntryObj[languageCode].trim(),
  //       //   languageCode,
  //       //   token,
  //       // );

  //       // const wordToWordTranslationId = await this.wordToWordTranslationUpsert(
  //       //   phraseIdOfEntryKey,
  //       //   translatedWordId,
  //       //   token,
  //       // );

  //       // return wordToWordTranslationId;
  //     } else if (translatedWordOrPhraseInEntry.length > 1) {
  //       // the translation is a phrase
  //       const { phrase } = await this.phraseService.upsert(
  //         {
  //           phraselike_string: translatedWordOrPhraseInEntry.join(' '),
  //           language_code: 'en',
  //           dialect_code: null,
  //           geo_code: null,
  //         },
  //         token,
  //       );

  //       const phraseToPhraseTranslationUpsertOutput =
  //         await this.phraseToPhraseTransService.upsert(
  //           phraseIdOfEntryKey,
  //           +phrase.phrase_id,
  //           token,
  //         );

  //       return +phraseToPhraseTranslationUpsertOutput
  //         .phrase_to_phrase_translation.phrase_to_phrase_translation_id;
  //     }
  //   }
  // }
}
