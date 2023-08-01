import { Injectable } from '@nestjs/common';

import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';

import {
  WordVoteUpsertInput,
  WordVoteOutput,
  WordVoteStatusOutputRow,
} from './types';

import {
  WordVoteUpsertProcedureOutputRow,
  callWordVoteUpsertProcedure,
  GetWordVoteObjectById,
  getWordVoteObjById,
  GetWordVoteStatus,
  getWordVoteStatus,
  ToggleWordVoteStatus,
  toggleWordVoteStatus,
} from './sql-string';

@Injectable()
export class WordVotesService {
  constructor(private pg: PostgresService) {}

  async read(id: number): Promise<WordVoteOutput> {
    try {
      const res1 = await this.pg.pool.query<GetWordVoteObjectById>(
        ...getWordVoteObjById(id),
      );

      if (res1.rowCount !== 1) {
        console.error(`no word-votes for id: ${id}`);
      } else {
        return {
          error: ErrorType.NoError,
          word_vote: {
            words_vote_id: id + '',
            word_id: res1.rows[0].word_id + '',
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
      word_vote: null,
    };
  }

  async upsert(
    input: WordVoteUpsertInput,
    token: string,
  ): Promise<WordVoteOutput> {
    try {
      const res = await this.pg.pool.query<WordVoteUpsertProcedureOutputRow>(
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

      return this.read(words_vote_id);
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_vote: null,
    };
  }

  async getVoteStatus(word_id: number): Promise<WordVoteStatusOutputRow> {
    try {
      const res1 = await this.pg.pool.query<GetWordVoteStatus>(
        ...getWordVoteStatus(word_id),
      );

      if (res1.rowCount !== 1) {
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
            word_id: res1.rows[0].word_id + '',
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
    word_id: number,
    vote: boolean,
    token: string,
  ): Promise<WordVoteStatusOutputRow> {
    try {
      const res1 = await this.pg.pool.query<ToggleWordVoteStatus>(
        ...toggleWordVoteStatus({
          word_id,
          vote,
          token,
        }),
      );

      const creatingError = res1.rows[0].p_error_type;
      const words_vote_id = res1.rows[0].p_words_vote_id;

      if (creatingError !== ErrorType.NoError || !words_vote_id) {
        return {
          error: creatingError,
          vote_status: null,
        };
      }

      return this.getVoteStatus(word_id);
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      vote_status: null,
    };
  }
}
