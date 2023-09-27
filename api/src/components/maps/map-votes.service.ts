import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';

import { pgClientOrPool } from 'src/common/utility';

import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';

import {
  MapVoteUpsertInput,
  MapVoteOutput,
  MapVoteStatus,
  MapVoteStatusOutput,
  MapVoteStatusOutputRow,
} from './types';

import {
  MapVoteUpsertProcedureOutputRow,
  callMapVoteUpsertProcedure,
  GetMapVoteObjectById,
  getMapVoteObjById,
  GetMapVoteStatus,
  getMapVoteStatusFromMapIds,
  ToggleMapVoteStatus,
  toggleMapVoteStatus,
} from './sql-string';

@Injectable()
export class MapVotesService {
  constructor(private pg: PostgresService) {}

  async read(
    id: number,
    is_original: boolean,
    pgClient: PoolClient | null,
  ): Promise<MapVoteOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetMapVoteObjectById>(...getMapVoteObjById(id, is_original));

      if (res.rowCount !== 1) {
        console.error(`no map-votes for id: ${id}`);

        return {
          error: ErrorType.MapVoteNotFound,
          map_vote: null,
        };
      } else {
        return {
          error: ErrorType.NoError,
          map_vote: {
            maps_vote_id: id + '',
            map_id: res.rows[0].map_id + '',
            is_original,
            user_id: res.rows[0].user_id + '',
            vote: res.rows[0].vote,
            last_updated_at: new Date(res.rows[0].last_updated_at),
          },
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      map_vote: null,
    };
  }

  async upsert(
    input: MapVoteUpsertInput,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<MapVoteOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<MapVoteUpsertProcedureOutputRow>(
        ...callMapVoteUpsertProcedure({
          map_id: +input.map_id,
          is_original: input.is_original,
          vote: input.vote,
          token: token,
        }),
      );

      const creatingError = res.rows[0].p_error_type;
      const maps_vote_id = res.rows[0].p_maps_vote_id;

      if (creatingError !== ErrorType.NoError || !maps_vote_id) {
        return {
          error: creatingError,
          map_vote: null,
        };
      }

      return this.read(+maps_vote_id, input.is_original, pgClient);
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      map_vote: null,
    };
  }

  async getVoteStatus(
    map_id: number,
    is_original: boolean,
    pgClient: PoolClient | null,
  ): Promise<MapVoteStatusOutputRow> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetMapVoteStatus>(
        ...getMapVoteStatusFromMapIds([map_id], is_original),
      );

      if (res.rowCount !== 1) {
        return {
          error: ErrorType.NoError,
          vote_status: {
            map_id: map_id + '',
            is_original,
            upvotes: 0,
            downvotes: 0,
          },
        };
      } else {
        return {
          error: ErrorType.NoError,
          vote_status: {
            map_id: res.rows[0].map_id + '',
            is_original,
            upvotes: res.rows[0].upvotes,
            downvotes: res.rows[0].downvotes,
          },
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      vote_status: null,
    };
  }

  async getVoteStatusFromIds(
    mapIds: number[],
    is_original: boolean,
    pgClient: PoolClient | null,
  ): Promise<MapVoteStatusOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetMapVoteStatus>(
        ...getMapVoteStatusFromMapIds(mapIds, is_original),
      );

      const voteStatusMap = new Map<string, MapVoteStatus>();

      res.rows.forEach((row) =>
        voteStatusMap.set(row.map_id, {
          map_id: row.map_id + '',
          is_original,
          upvotes: row.upvotes,
          downvotes: row.downvotes,
        }),
      );

      return {
        error: ErrorType.NoError,
        vote_status_list: mapIds.map((mapId) => {
          const voteStatus = voteStatusMap.get(mapId + '');

          return voteStatus
            ? voteStatus
            : {
                map_id: mapId + '',
                is_original,
                upvotes: 0,
                downvotes: 0,
              };
        }),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      vote_status_list: [],
    };
  }

  async toggleVoteStatus(
    map_id: number,
    is_original: boolean,
    vote: boolean,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<MapVoteStatusOutputRow> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<ToggleMapVoteStatus>(
        ...toggleMapVoteStatus({
          map_id,
          is_original,
          vote,
          token,
        }),
      );

      const creatingError = res.rows[0].p_error_type;
      const maps_vote_id = res.rows[0].p_maps_vote_id;

      if (creatingError !== ErrorType.NoError || !maps_vote_id) {
        return {
          error: creatingError,
          vote_status: null,
        };
      }

      return this.getVoteStatus(map_id, is_original, pgClient);
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      vote_status: null,
    };
  }
}
