import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';

import { pgClientOrPool } from 'src/common/utility';

import { ErrorType } from 'src/common/types';

import { PostgresService } from 'src/core/postgres.service';

import { WordlikeStringsOutput, WordlikeString } from './types';

import {
  callWordlikeStringUpsertsProcedure,
  WordlikeStringUpsertsProcedureOutput,
  getWordlikeStringsObjByIds,
  GetWordlikeStringsObjectByIds,
} from './sql-string';

@Injectable()
export class WordlikeStringsService {
  constructor(private pg: PostgresService) {}

  async reads(
    ids: number[],
    pgClient: PoolClient | null,
  ): Promise<WordlikeStringsOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetWordlikeStringsObjectByIds>(
        ...getWordlikeStringsObjByIds(ids),
      );

      const wordlikeStringsMap = new Map<string, WordlikeString>();

      res.rows.forEach((row) =>
        wordlikeStringsMap.set(row.wordlike_string_id, {
          wordlike_string_id: row.wordlike_string_id,
          wordlike_string: row.wordlike_string,
        }),
      );

      return {
        error: ErrorType.NoError,
        wordlike_strings: ids.map((id) => {
          const wordlikeString = wordlikeStringsMap.get(id + '');

          return wordlikeString ? wordlikeString : null;
        }),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      wordlike_strings: [],
    };
  }

  async upserts(
    wordlike_strings: string[],
    token: string,
    pgClient: PoolClient | null,
  ): Promise<WordlikeStringsOutput> {
    if (wordlike_strings.length === 0) {
      return {
        error: ErrorType.NoError,
        wordlike_strings: [],
      };
    }

    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<WordlikeStringUpsertsProcedureOutput>(
        ...callWordlikeStringUpsertsProcedure({
          wordlike_strings,
          token,
        }),
      );

      const creatingErrors = res.rows[0].p_error_types;
      const creatingError = res.rows[0].p_error_type;
      const wordlike_string_ids = res.rows[0].p_wordlike_string_ids;

      if (creatingError !== ErrorType.NoError) {
        return {
          error: creatingError,
          wordlike_strings: [],
        };
      }

      return {
        error: ErrorType.NoError,
        wordlike_strings: wordlike_string_ids.map((id, index) => {
          if (creatingErrors[index] !== ErrorType.NoError) {
            return null;
          }

          return {
            wordlike_string_id: id,
            wordlike_string: wordlike_strings[index],
          };
        }),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      wordlike_strings: [],
    };
  }
}
