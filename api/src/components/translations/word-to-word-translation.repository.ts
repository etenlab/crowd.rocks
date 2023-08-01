import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { ErrorType } from '../../common/types';
import { PostgresService } from '../../core/postgres.service';
import { WordTrVoteStatusOutputRow } from './types';

interface IToggleVoteStatusParams {
  word_to_word_translation_id: string;
  vote: boolean;
  token: string;
  dbPoolClient?: PoolClient;
}

export interface IToggleVoteStatusRes {
  word_to_word_translation_vote_id: number | null;
  error: string;
}

@Injectable()
export class WordToWordTranslationRepository {
  constructor(private pg: PostgresService) {}

  async toggleVoteStatus({
    word_to_word_translation_id,
    vote,
    token,
    dbPoolClient,
  }: IToggleVoteStatusParams): Promise<IToggleVoteStatusRes> {
    const poolClient = dbPoolClient ? dbPoolClient : this.pg.pool;

    try {
      const res1 = await poolClient.query(
        `
        call word_to_word_translation_vote_toggle ($1, $2, $3, $4, $5)
      `,
        [word_to_word_translation_id, vote, token, null, null],
      );

      const error = res1.rows[0].p_error_type;
      const word_to_word_translation_vote_id =
        res1.rows[0].p_word_to_word_translation_vote_id;

      return {
        word_to_word_translation_vote_id,
        error,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      word_to_word_translation_vote_id: null,
      error: ErrorType.UnknownError,
    };
  }

  async getVotesStatus(
    word_to_word_translation_id: string,
  ): Promise<WordTrVoteStatusOutputRow> {
    try {
      const res = await this.pg.pool.query(
        `
        select
          wtwt.word_to_word_translation_id,
          v_up.up_votes_count,
          v_down.down_votes_count
        from
          word_to_word_translations wtwt
        left join v_word_to_word_translations_upvotes_count v_up on
          wtwt.word_to_word_translation_id = v_up.word_to_word_translation_id
        left join v_word_to_word_translations_downvotes_count v_down on
          wtwt.word_to_word_translation_id = v_down.word_to_word_translation_id
        where
          wtwt.word_to_word_translation_id = $1  
      `,
        [word_to_word_translation_id],
      );
      return {
        vote_status: {
          upvotes: res.rows[0].up_votes_count || '0',
          downvotes: res.rows[0].down_votes_count || '0',
          word_to_word_translation_id: res.rows[0].word_to_word_translation_id,
        },
        error: ErrorType.NoError,
      };
    } catch (error) {
      console.log(
        '[word-to-word-translation.repository#getVotesStatus error:]',
        error,
      );
      return {
        vote_status: undefined,
        error: ErrorType.UnknownError,
      };
    }
  }
}