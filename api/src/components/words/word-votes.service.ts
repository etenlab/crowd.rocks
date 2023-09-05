import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';

import { pgClientOrPool } from 'src/common/utility';

import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';

import {
  WordVoteUpsertInput,
  WordVoteOutput,
  WordVoteStatus,
  WordVoteStatusOutput,
  WordVoteStatusOutputRow,
} from './types';

import {
  WordVoteUpsertProcedureOutputRow,
  callWordVoteUpsertProcedure,
  GetWordVoteObjectById,
  getWordVoteObjById,
  GetWordVoteStatus,
  getWordVoteStatusFromWordIds,
  ToggleWordVoteStatus,
  toggleWordVoteStatus,
} from './sql-string';

@Injectable()
export class WordVotesService {
  constructor(private pg: PostgresService) {}

  async read(id: number, pgClient: PoolClient | null): Promise<WordVoteOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetWordVoteObjectById>(...getWordVoteObjById(id));

      if (res.rowCount !== 1) {
        console.error(`no word-votes for id: ${id}`);

        return {
          error: ErrorType.WordVoteNotFound,
          word_vote: null,
        };
      } else {
        return {
          error: ErrorType.NoError,
          word_vote: {
            words_vote_id: id + '',
            word_id: res.rows[0].word_id + '',
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
      word_vote: null,
    };
  }

  async upsert(
    input: WordVoteUpsertInput,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<WordVoteOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<WordVoteUpsertProcedureOutputRow>(
        ...callWordVoteUpsertProcedure({
          word_id: +input.word_id,
          vote: input.vote,
          token: token,
        }),
      );

      const creatingError = res.rows[0].p_error_type;
      const words_vote_id = res.rows[0].p_words_vote_id;

      if (creatingError !== ErrorType.NoError || !words_vote_id) {
        return {
          error: creatingError,
          word_vote: null,
        };
      }

      return this.read(+words_vote_id, pgClient);
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_vote: null,
    };
  }

  async getVoteStatus(
    word_id: number,
    pgClient: PoolClient | null,
  ): Promise<WordVoteStatusOutputRow> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetWordVoteStatus>(...getWordVoteStatusFromWordIds([word_id]));

      if (res.rowCount !== 1) {
        return {
          error: ErrorType.NoError,
          vote_status: {
            word_id: word_id + '',
            upvotes: 0,
            downvotes: 0,
          },
        };
      } else {
        return {
          error: ErrorType.NoError,
          vote_status: {
            word_id: res.rows[0].word_id + '',
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
    wordIds: number[],
    pgClient: PoolClient | null,
  ): Promise<WordVoteStatusOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetWordVoteStatus>(...getWordVoteStatusFromWordIds(wordIds));

      const voteStatusMap = new Map<string, WordVoteStatus>();

      res.rows.forEach((row) =>
        voteStatusMap.set(row.word_id, {
          word_id: row.word_id + '',
          upvotes: row.upvotes,
          downvotes: row.downvotes,
        }),
      );

      return {
        error: ErrorType.NoError,
        vote_status_list: wordIds.map((wordId) => {
          const voteStatus = voteStatusMap.get(wordId + '');

          return voteStatus
            ? voteStatus
            : {
                word_id: wordId + '',
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
    word_id: number,
    vote: boolean,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<WordVoteStatusOutputRow> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<ToggleWordVoteStatus>(
        ...toggleWordVoteStatus({
          word_id,
          vote,
          token,
        }),
      );

      const creatingError = res.rows[0].p_error_type;
      const words_vote_id = res.rows[0].p_words_vote_id;

      if (creatingError !== ErrorType.NoError || !words_vote_id) {
        return {
          error: creatingError,
          vote_status: null,
        };
      }

      return this.getVoteStatus(word_id, pgClient);
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      vote_status: null,
    };
  }
}
