import { Injectable } from '@nestjs/common';

import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';
import { WordsService } from 'src/components/words/words.service';

import {
  WordToWordTranslationReadOutput,
  WordToWordTranslationUpsertOutput,
} from './types';

import {
  GetWordToWordTranslationObjectByIdRow,
  getWordToWordTranslationObjById,
  callWordToWordTranslationUpsertProcedure,
  WordToWordTranslationUpsertProcedureOutputRow,
} from './sql-string';

@Injectable()
export class WordToWordTranslationsService {
  constructor(private pg: PostgresService, private wordService: WordsService) {}

  async read(id: number): Promise<WordToWordTranslationReadOutput> {
    try {
      const res1 =
        await this.pg.pool.query<GetWordToWordTranslationObjectByIdRow>(
          ...getWordToWordTranslationObjById(id),
        );

      if (res1.rowCount !== 1) {
        console.error(`no word-to-word-translation for id: ${id}`);
      } else {
        const fromWordOutput = await this.wordService.read({
          word_id: res1.rows[0].from_word + '',
        });

        const toWordOuput = await this.wordService.read({
          word_id: res1.rows[0].to_word + '',
        });

        if (fromWordOutput.error !== ErrorType.NoError) {
          return {
            error: fromWordOutput.error,
            word_to_word_translation: null,
          };
        }

        if (toWordOuput.error !== ErrorType.NoError) {
          return {
            error: toWordOuput.error,
            word_to_word_translation: null,
          };
        }

        return {
          error: ErrorType.NoError,
          word_to_word_translation: {
            word_to_word_translation_id: id + '',
            from_word: fromWordOutput.word,
            to_word: toWordOuput.word,
          },
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_to_word_translation: null,
    };
  }

  async upsert(
    fromWord: number,
    toWord: number,
    token: string,
  ): Promise<WordToWordTranslationUpsertOutput> {
    try {
      const res =
        await this.pg.pool.query<WordToWordTranslationUpsertProcedureOutputRow>(
          ...callWordToWordTranslationUpsertProcedure({
            fromWord,
            toWord,
            token,
          }),
        );

      const error = res.rows[0].p_error_type;
      const word_to_word_translation_id =
        res.rows[0].p_word_to_word_translation_id;

      if (error !== ErrorType.NoError || !word_to_word_translation_id) {
        return {
          error: error,
          word_to_word_translation: null,
        };
      }

      const wordToWordTranslationReadOutput = await this.read(
        word_to_word_translation_id,
      );

      return {
        error: wordToWordTranslationReadOutput.error,
        word_to_word_translation:
          wordToWordTranslationReadOutput.word_to_word_translation,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_to_word_translation: null,
    };
  }
}
