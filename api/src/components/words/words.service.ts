import { Injectable } from '@nestjs/common';

import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';

import { WordReadInput, WordReadOutput, WordUpsertInput } from './types';

import {
  getWordObjById,
  GetWordObjectById,
  callWordUpsertProcedure,
  WordUpsertProcedureOutputRow,
} from './sql-string';

@Injectable()
export class WordsService {
  constructor(private pg: PostgresService) {}

  async read(input: WordReadInput): Promise<WordReadOutput> {
    try {
      const res1 = await this.pg.pool.query<GetWordObjectById>(
        ...getWordObjById(+input.word_id),
      );

      if (res1.rowCount !== 1) {
        console.error(`no word for id: ${input.word_id}`);
      } else {
        return {
          error: ErrorType.NoError,
          word: {
            word_id: input.word_id,
            word: res1.rows[0].word,
            definition:
              res1.rows[0].word_definition_id && res1.rows[0].definition
                ? {
                    word_definition_id: res1.rows[0].word_definition_id + '',
                    definition: res1.rows[0].definition,
                  }
                : null,
            language_code: res1.rows[0].language_code,
            dialect_code: res1.rows[0].dialect_code,
            geo_code: res1.rows[0].geo_code,
          },
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word: null,
    };
  }

  async upsert(
    input: WordUpsertInput,
    token?: string,
  ): Promise<WordReadOutput> {
    try {
      const res = await this.pg.pool.query<WordUpsertProcedureOutputRow>(
        ...callWordUpsertProcedure({
          wordlike_string: input.wordlike_string,
          language_code: input.language_code,
          dialect_code: input.dialect_code,
          geo_code: input.geo_code,
          token: token,
        }),
      );

      const creatingError = res.rows[0].p_error_type;
      const word_id = res.rows[0].p_word_id;

      if (creatingError !== ErrorType.NoError || !word_id) {
        return {
          error: creatingError,
          word: null,
        };
      }

      const { error: readingError, word } = await await this.read({
        word_id: word_id + '',
      });

      return {
        error: readingError,
        word,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word: null,
    };
  }
}
