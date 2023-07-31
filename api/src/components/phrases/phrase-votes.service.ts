import { Injectable } from '@nestjs/common';

import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';

import {
  PhraseVoteUpsertInput,
  PhraseVoteOutput,
  PhraseVoteStatusOutputRow,
} from './types';

import {
  PhraseVoteUpsertProcedureOutputRow,
  callPhraseVoteUpsertProcedure,
  GetPhraseVoteObjectById,
  getPhraseVoteObjById,
  GetPhraseVoteStatus,
  getPhraseVoteStatus,
  TogglePhraseVoteStatus,
  togglePhraseVoteStatus,
} from './sql-string';

@Injectable()
export class PhraseVotesService {
  constructor(private pg: PostgresService) {}

  async read(id: number): Promise<PhraseVoteOutput> {
    try {
      const res1 = await this.pg.pool.query<GetPhraseVoteObjectById>(
        ...getPhraseVoteObjById(id),
      );

      if (res1.rowCount !== 1) {
        console.error(`no word-votes for id: ${id}`);
      } else {
        return {
          error: ErrorType.NoError,
          phrase_vote: {
            phrase_vote_id: id + '',
            phrase_id: res1.rows[0].phrase_id + '',
            user_id: res1.rows[0].user_id + '',
            vote: res1.rows[0].vote,
            last_updated_at: new Date(res1.rows[0].last_updated_at),
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
  ): Promise<PhraseVoteOutput> {
    try {
      const res = await this.pg.pool.query<PhraseVoteUpsertProcedureOutputRow>(
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

      return this.read(phrase_vote_id);
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase_vote: null,
    };
  }

  async getVoteStatus(phrase_id: number): Promise<PhraseVoteStatusOutputRow> {
    try {
      const res1 = await this.pg.pool.query<GetPhraseVoteStatus>(
        ...getPhraseVoteStatus(phrase_id),
      );

      if (res1.rowCount !== 1) {
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
            phrase_id: res1.rows[0].phrase_id + '',
            upvotes: res1.rows[0].upvotes,
            downvotes: res1.rows[0].downvotes,
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

  async toggleVoteStatus(
    phrase_id: number,
    vote: boolean,
    token: string,
  ): Promise<PhraseVoteStatusOutputRow> {
    try {
      const res1 = await this.pg.pool.query<TogglePhraseVoteStatus>(
        ...togglePhraseVoteStatus({
          phrase_id,
          vote,
          token,
        }),
      );

      const creatingError = res1.rows[0].p_error_type;
      const phrase_vote_id = res1.rows[0].p_phrase_vote_id;

      if (creatingError !== ErrorType.NoError || !phrase_vote_id) {
        return {
          error: creatingError,
          vote_status: null,
        };
      }

      return this.getVoteStatus(phrase_id);
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      vote_status: null,
    };
  }
}
