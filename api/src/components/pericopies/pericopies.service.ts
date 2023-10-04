import { Injectable, Logger } from '@nestjs/common';
import { PoolClient } from 'pg';

import { pgClientOrPool } from 'src/common/utility';

import { ErrorType } from 'src/common/types';

import { PostgresService } from 'src/core/postgres.service';
import { PericopiesOutput } from './types';

import {
  PericopeUpsertsProcedureOutput,
  callPericopeUpsertsProcedure,
  GetPericopiesObjectRow,
  getPericopiesObjByIds,
} from './sql-string';

@Injectable()
export class PericopiesService {
  constructor(private pg: PostgresService) {}

  async reads(
    ids: number[],
    pgClient: PoolClient | null,
  ): Promise<PericopiesOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetPericopiesObjectRow>(...getPericopiesObjByIds({ ids }));

      return {
        error: ErrorType.NoError,
        pericopies: res.rows,
      };
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      pericopies: [],
    };
  }

  async upserts(
    startWords: number[],
    token: string,
    pgClient: PoolClient | null,
  ): Promise<PericopiesOutput> {
    if (startWords.length === 0) {
      return {
        error: ErrorType.NoError,
        pericopies: [],
      };
    }

    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<PericopeUpsertsProcedureOutput>(
        ...callPericopeUpsertsProcedure({
          start_words: startWords,
          token,
        }),
      );

      const creatingError = res.rows[0].p_error_type;
      const creatingErrors = res.rows[0].p_error_types;
      const pericope_ids = res.rows[0].p_pericope_ids;

      if (creatingError !== ErrorType.NoError) {
        return {
          error: creatingError,
          pericopies: [],
        };
      }

      return {
        error: ErrorType.NoError,
        pericopies: pericope_ids.map((pericope_id, index) => {
          if (creatingErrors[index] !== ErrorType.NoError) {
            return null;
          }

          return {
            pericope_id,
            start_word: startWords[index] + '',
          };
        }),
      };
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      pericopies: [],
    };
  }
}
