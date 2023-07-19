import { Injectable } from '@nestjs/common';

import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';

import { WordsService } from 'src/components/words/words.service';
import { PhrasesService } from 'src/components/phrases/phrases.service';

import {
  WordToPhraseTranslationReadOutput,
  WordToPhraseTranslationUpsertOutput,
} from './types';

import {
  GetWordToPhraseTranslationObjectByIdRow,
  getWordToPhraseTranslationObjById,
  callWordToPhraseTranslationUpsertProcedure,
  WordToPhraseTranslationUpsertProcedureOutputRow,
} from './sql-string';

@Injectable()
export class WordToPhraseTranslationsService {
  constructor(
    private pg: PostgresService,
    private wordService: WordsService,
    private phraseService: PhrasesService,
  ) {}

  async read(id: number): Promise<WordToPhraseTranslationReadOutput> {
    try {
      const res1 =
        await this.pg.pool.query<GetWordToPhraseTranslationObjectByIdRow>(
          ...getWordToPhraseTranslationObjById(id),
        );

      if (res1.rowCount !== 1) {
        console.error(`no word-to-phrase-translation for id: ${id}`);
      } else {
        const fromWordOutput = await this.wordService.read({
          word_id: res1.rows[0].from_word + '',
        });

        const toPhraseOuput = await this.phraseService.read({
          phrase_id: res1.rows[0].to_phrase + '',
        });

        if (fromWordOutput.error !== ErrorType.NoError) {
          return {
            error: fromWordOutput.error,
            word_to_phrase_translation: null,
          };
        }

        if (toPhraseOuput.error !== ErrorType.NoError) {
          return {
            error: toPhraseOuput.error,
            word_to_phrase_translation: null,
          };
        }

        return {
          error: ErrorType.NoError,
          word_to_phrase_translation: {
            word_to_phrase_translation_id: id + '',
            from_word: fromWordOutput.word,
            to_phrase: toPhraseOuput.phrase,
          },
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_to_phrase_translation: null,
    };
  }

  async upsert(
    fromWord: number,
    toPhrase: number,
    token: string,
  ): Promise<WordToPhraseTranslationUpsertOutput> {
    try {
      const res =
        await this.pg.pool.query<WordToPhraseTranslationUpsertProcedureOutputRow>(
          ...callWordToPhraseTranslationUpsertProcedure({
            fromWord,
            toPhrase,
            token,
          }),
        );

      const error = res.rows[0].p_error_type;
      const word_to_phrase_translation_id =
        res.rows[0].p_word_to_phrase_translation_id;

      if (error !== ErrorType.NoError || !word_to_phrase_translation_id) {
        return {
          error: error,
          word_to_phrase_translation: null,
        };
      }

      const wordToPhraseTranslationReadOutput = await this.read(
        word_to_phrase_translation_id,
      );

      return {
        error: wordToPhraseTranslationReadOutput.error,
        word_to_phrase_translation:
          wordToPhraseTranslationReadOutput.word_to_phrase_translation,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_to_phrase_translation: null,
    };
  }
}
