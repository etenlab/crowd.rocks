import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';

import { pgClientOrPool } from 'src/common/utility';

import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';

import {
  PhraseVoteUpsertInput,
  PhraseVoteOutput,
  PhraseVoteStatusOutput,
  PhraseVoteStatusOutputRow,
  PhraseVoteStatus,
} from './types';

import {
  PhraseVoteUpsertProcedureOutputRow,
  callPhraseVoteUpsertProcedure,
  GetPhraseVoteObjectById,
  getPhraseVoteObjById,
  GetPhraseVoteStatus,
  getPhraseVoteStatusFromPhraseIds,
  TogglePhraseVoteStatus,
  togglePhraseVoteStatus,
} from './sql-string';

@Injectable()
export class PhraseVotesService {
  constructor(private pg: PostgresService) {}

  async read(
    id: number,
    pgClient: PoolClient | null,
  ): Promise<PhraseVoteOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetPhraseVoteObjectById>(...getPhraseVoteObjById(id));

      if (res.rowCount !== 1) {
        console.error(`no word-votes for id: ${id}`);

        return {
          error: ErrorType.PhraseVoteNotFound,
          phrase_vote: null,
        };
      } else {
        return {
          error: ErrorType.NoError,
          phrase_vote: {
            phrase_vote_id: id + '',
            phrase_id: res.rows[0].phrase_id + '',
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
      phrase_vote: null,
    };
  }

  async upsert(
    input: PhraseVoteUpsertInput,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<PhraseVoteOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<PhraseVoteUpsertProcedureOutputRow>(
        ...callPhraseVoteUpsertProcedure({
          phrase_id: +input.phrase_id,
          vote: input.vote,
          token: token,
        }),
      );

      const creatingError = res.rows[0].p_error_type;
      const phrase_vote_id = res.rows[0].p_phrase_vote_id;

      if (creatingError !== ErrorType.NoError || !phrase_vote_id) {
        return {
          error: creatingError,
          phrase_vote: null,
        };
      }

      return this.read(+phrase_vote_id, pgClient);
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase_vote: null,
    };
  }

  async getVoteStatus(
    phrase_id: number,
    pgClient: PoolClient | null,
  ): Promise<PhraseVoteStatusOutputRow> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetPhraseVoteStatus>(
        ...getPhraseVoteStatusFromPhraseIds([phrase_id]),
      );

      if (res.rowCount !== 1) {
        return {
          error: ErrorType.NoError,
          vote_status: {
            phrase_id: phrase_id + '',
            upvotes: 0,
            downvotes: 0,
          },
        };
      } else {
        return {
          error: ErrorType.NoError,
          vote_status: {
            phrase_id: res.rows[0].phrase_id + '',
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
    phraseIds: number[],
    pgClient: PoolClient | null,
  ): Promise<PhraseVoteStatusOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetPhraseVoteStatus>(
        ...getPhraseVoteStatusFromPhraseIds(phraseIds),
      );

      const voteStatusMap = new Map<string, PhraseVoteStatus>();

      res.rows.forEach((row) =>
        voteStatusMap.set(row.phrase_id, {
          phrase_id: row.phrase_id + '',
          upvotes: row.upvotes,
          downvotes: row.downvotes,
        }),
      );

      return {
        error: ErrorType.NoError,
        vote_status_list: phraseIds.map((phraseId) => {
          const voteStatus = voteStatusMap.get(phraseId + '');

          return voteStatus
            ? voteStatus
            : {
                phrase_id: phraseId + '',
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
    phrase_id: number,
    vote: boolean,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<PhraseVoteStatusOutputRow> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<TogglePhraseVoteStatus>(
        ...togglePhraseVoteStatus({
          phrase_id,
          vote,
          token,
        }),
      );

      const creatingError = res.rows[0].p_error_type;
      const phrase_vote_id = res.rows[0].p_phrase_vote_id;

      if (creatingError !== ErrorType.NoError || !phrase_vote_id) {
        return {
          error: creatingError,
          vote_status: null,
        };
      }

      return this.getVoteStatus(phrase_id, pgClient);
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      vote_status: null,
    };
  }
}
