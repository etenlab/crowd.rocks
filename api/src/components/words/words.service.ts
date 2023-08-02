import { Injectable } from '@nestjs/common';

import { ErrorType, GenericOutput } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';

import { Word, WordReadInput, WordReadOutput, WordUpsertInput } from './types';

import {
  getWordObjById,
  GetWordObjectById,
  callWordUpsertProcedure,
  WordUpsertProcedureOutputRow,
} from './sql-string';
import { PoolClient } from 'pg';
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

  async upsert(input: WordUpsertInput, token: string): Promise<WordReadOutput> {
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

      const { error: readingError, word } = await this.read({
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

  /**
   * Same as upsert but can be used in transaction, thus returns only IDs due to impossibility of dirty reads in PG
   * Sql statement will be executed using given dbPoolClient .
   * It is useful if you need to make this operation as part of some SQL transaction (to transaction work properly,
   * all opertations of this transaction should be executed in  the same PoolClient instance)
   */
  async upsertInTrn(
    input: WordUpsertInput,
    token: string,
    dbPoolClient: PoolClient,
  ): Promise<{ word_id: string | null } & GenericOutput> {
    try {
      const res = await dbPoolClient.query<WordUpsertProcedureOutputRow>(
        ...callWordUpsertProcedure({
          wordlike_string: input.wordlike_string,
          language_code: input.language_code,
          dialect_code: input.dialect_code,
          geo_code: input.geo_code,
          token: token,
        }),
      );

      const creatingError = res.rows[0].p_error_type;
      const word_id = res.rows[0].p_word_id
        ? String(res.rows[0].p_word_id)
        : null;

      return {
        error: creatingError,
        word_id,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_id: null,
    };
  }

  async getWordByDefinitionId(definitionId: string): Promise<Word> {
    const res = this.pg.pool.query(
      `
      select
        w.word_id ,
        ws.wordlike_string ,
        w.language_code ,
        w.dialect_code,
        w.geo_code
      from
        words w
      left join word_definitions wd on
        w.word_id = wd.word_id
      left join wordlike_strings ws on
        w.wordlike_string_id = ws.wordlike_string_id
      where
        wd.word_definition_id = $1
    `,
      [definitionId],
    );

    const word: Word = {
      word_id: res[0].word_id,
      word: res[0].wordlike_string,
      language_code: res[0].language_code,
      dialect_code: res[0].dialect_code,
      geo_code: res[0].geo_code,
    };
    return word;
  }
}
