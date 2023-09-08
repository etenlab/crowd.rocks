import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';

import { pgClientOrPool } from 'src/common/utility';
import { ErrorType, FlagType } from 'src/common/types';

import { PostgresService } from 'src/core/postgres.service';

import { FlagsOutput } from './types';

import {
  GetFlagRow,
  getFlagsFromRefQuery,
  FlagToggleProcedureOutput,
  callFlagToggleFlagWithRef,
} from './sql-string';

@Injectable()
export class FlagsService {
  constructor(private pg: PostgresService) {}

  async getFlagsFromRef(
    parent_table: string,
    parent_id: number,
    pgClient: PoolClient | null,
  ): Promise<FlagsOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetFlagRow>(
        ...getFlagsFromRefQuery({
          parent_table,
          parent_id,
        }),
      );

      return {
        error: ErrorType.NoError,
        flags: res.rows,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      flags: [],
    };
  }

  async toggleFlagWithRef(
    parent_table: string,
    parent_id: number,
    name: FlagType,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<FlagsOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<FlagToggleProcedureOutput>(
        ...callFlagToggleFlagWithRef({
          parent_table,
          parent_id,
          flag_name: name,
          token,
        }),
      );

      const creatingError = res.rows[0].p_error_type;
      const flag_id = res.rows[0].p_flag_id;

      if (creatingError !== ErrorType.NoError || !flag_id) {
        return {
          error: creatingError,
          flags: [],
        };
      }

      return this.getFlagsFromRef(parent_table, parent_id, pgClient);
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      flags: [],
    };
  }
}
