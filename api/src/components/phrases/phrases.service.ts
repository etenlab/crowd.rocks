import { Injectable } from '@nestjs/common';

import { ErrorType } from 'src/common/types';

import { PostgresService } from 'src/core/postgres.service';
import { WordsService } from 'src/components/words/words.service';

import { PhraseReadInput, PhraseReadOutput, PhraseUpsertInput } from './types';
import { WordUpsertInput } from 'src/components/words/types';

import {
  GetPhraseObjByIdResultRow,
  getPhraseObjById,
  callPhraseUpsertProcedure,
  PhraseUpsertProcedureOutputRow,
} from './sql-string';

@Injectable()
export class PhrasesService {
  constructor(private pg: PostgresService, private wordService: WordsService) {}

  async read(input: PhraseReadInput): Promise<PhraseReadOutput> {
    try {
      const res1 = await this.pg.pool.query<GetPhraseObjByIdResultRow>(
        ...getPhraseObjById(input.phrase_id),
      );

      if (res1.rowCount !== 1) {
        console.error(`no phrase for id: ${input.phrase_id}`);
      } else {
        return {
          error: ErrorType.NoError,
          phrase: {
            phrase_id: input.phrase_id,
            phrase: res1.rows[0].phrase,
            definition:
              res1.rows[0].definition_id && res1.rows[0].definition
                ? {
                    phrase_definition_id: res1.rows[0].definition_id,
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
      phrase: null,
    };
  }

  async upsert(
    input: PhraseUpsertInput,
    token?: string,
  ): Promise<PhraseReadOutput> {
    try {
      const wordlikeStrings = input.phraselike_string.split(' ');
      const wordIds: number[] = [];

      for (const wordlikeStr of wordlikeStrings) {
        const res = await this.wordService.upsert(
          {
            wordlike_string: wordlikeStr,
            language_code: input.language_code,
            dialect_code: input.dialect_code,
            geo_code: input.geo_code,
          } as WordUpsertInput,
          token,
        );

        if (res.error !== ErrorType.NoError) {
          return {
            error: res.error,
            phrase: null,
          };
        }

        wordIds.push(res.word.word_id);
      }

      const res = await this.pg.pool.query<PhraseUpsertProcedureOutputRow>(
        ...callPhraseUpsertProcedure({
          phraselike_string: input.phraselike_string,
          wordIds: wordIds,
          token: token,
        }),
      );

      const error = res.rows[0].p_error_type;
      const phrase_id = res.rows[0].p_phrase_id;

      if (error !== ErrorType.NoError || !phrase_id) {
        return {
          error,
          phrase: null,
        };
      }

      const phrase = await (await this.read({ phrase_id })).phrase;

      return {
        error,
        phrase,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase: null,
    };
  }
}
