import { Injectable, Logger } from '@nestjs/common';
import { PoolClient } from 'pg';

import { pgClientOrPool } from 'src/common/utility';

import { ErrorType } from 'src/common/types';

import { PostgresService } from 'src/core/postgres.service';

import {
  WordRangeTagVoteStatus,
  WordRangeTagVoteStatusListOutput,
  WordRangeTagVoteStatusOutput,
} from './types';

import {
  ToggleWordRangeTagVoteStatus,
  toggleWordRangeTagVoteStatus,
  getWordRangeTagVoteStatusFromWordIds,
  GetWordRangeTagVoteStatus,
} from './sql-string';

@Injectable()
export class WordRangeTagVotesService {
  constructor(private pg: PostgresService) {}

  async getVoteStatusFromIds(
    word_range_tag_ids: number[],
    pgClient: PoolClient | null,
  ): Promise<WordRangeTagVoteStatusListOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetWordRangeTagVoteStatus>(
        ...getWordRangeTagVoteStatusFromWordIds(word_range_tag_ids),
      );

      const voteStatusMap = new Map<string, WordRangeTagVoteStatus>();

      res.rows.forEach((row) =>
        voteStatusMap.set(row.word_range_tag_id, {
          word_range_tag_id: row.word_range_tag_id + '',
          upvotes: row.upvotes,
          downvotes: row.downvotes,
        }),
      );

      return {
        error: ErrorType.NoError,
        vote_status_list: word_range_tag_ids.map((word_range_tag_id) => {
          const voteStatus = voteStatusMap.get(word_range_tag_id + '');

          return voteStatus
            ? voteStatus
            : {
                word_range_tag_id: word_range_tag_id + '',
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
    word_range_tag_id: number,
    vote: boolean,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<WordRangeTagVoteStatusOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<ToggleWordRangeTagVoteStatus>(
        ...toggleWordRangeTagVoteStatus({
          word_range_tag_id,
          vote,
          token,
        }),
      );

      const creatingError = res.rows[0].p_error_type;
      const word_range_tags_vote_id = res.rows[0].p_word_range_tags_vote_id;

      if (creatingError !== ErrorType.NoError || !word_range_tags_vote_id) {
        return {
          error: creatingError,
          vote_status: null,
        };
      }

      const { error, vote_status_list } = await this.getVoteStatusFromIds(
        [word_range_tag_id],
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
