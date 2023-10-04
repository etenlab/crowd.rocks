import { Injectable, Logger } from '@nestjs/common';
import { PoolClient } from 'pg';

import { pgClientOrPool } from 'src/common/utility';

import { ErrorType } from 'src/common/types';

import { PostgresService } from 'src/core/postgres.service';
import {
  PericopeVoteStatus,
  PericopeVoteStatusOutput,
  PericopeVoteStatusListOutput,
} from './types';

import {
  GetPericopeVoteStatus,
  getPericopeVoteStatusFromPericopeIds,
  TogglePericopeVoteStatus,
  togglePericopeVoteStatus,
} from './sql-string';

@Injectable()
export class PericopeVotesService {
  constructor(private pg: PostgresService) {}

  async getVoteStatusFromIds(
    pericopeIds: number[],
    pgClient: PoolClient | null,
  ): Promise<PericopeVoteStatusListOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetPericopeVoteStatus>(
        ...getPericopeVoteStatusFromPericopeIds(pericopeIds),
      );

      const voteStatusMap = new Map<string, PericopeVoteStatus>();

      res.rows.forEach((row) => voteStatusMap.set(row.pericope_id, row));

      return {
        error: ErrorType.NoError,
        vote_status_list: pericopeIds.map((pericope_id) => {
          const voteStatus = voteStatusMap.get(pericope_id + '');

          return voteStatus
            ? voteStatus
            : {
                pericope_id: pericope_id + '',
                upvotes: 0,
                downvotes: 0,
              };
        }),
      };
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      vote_status_list: [],
    };
  }

  async toggleVoteStatus(
    pericope_id: number,
    vote: boolean,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<PericopeVoteStatusOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<TogglePericopeVoteStatus>(
        ...togglePericopeVoteStatus({
          pericope_id,
          vote,
          token,
        }),
      );

      const creatingError = res.rows[0].p_error_type;
      const pericope_vote_id = res.rows[0].p_pericope_vote_id;

      if (creatingError !== ErrorType.NoError || !pericope_vote_id) {
        return {
          error: creatingError,
          vote_status: null,
        };
      }

      const { error, vote_status_list } = await this.getVoteStatusFromIds(
        [pericope_id],
        pgClient,
      );

      return {
        error,
        vote_status: vote_status_list.length > 0 ? vote_status_list[0] : null,
      };
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      vote_status: null,
    };
  }
}
