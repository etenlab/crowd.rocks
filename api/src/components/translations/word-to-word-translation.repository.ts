import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';

import { pgClientOrPool } from 'src/common/utility';

import { ErrorType } from '../../common/types';
import { PostgresService } from '../../core/postgres.service';
import { WordTrVoteStatusOutputRow } from './types';

interface IToggleVoteStatusParams {
  word_to_word_translation_id: string;
  vote: boolean;
  token: string;
  dbpoolClient: PoolClient | null;
}

export interface IToggleVoteStatusRes {
  word_to_word_translation_vote_id: number | null;
  error: ErrorType;
}

@Injectable()
export class WordToWordTranslationRepository {
  constructor(private pg: PostgresService) {}

  async toggleVoteStatus({
    word_to_word_translation_id,
    vote,
    token,
    dbpoolClient,
  }: IToggleVoteStatusParams): Promise<IToggleVoteStatusRes> {
    const poolClient = await pgClientOrPool({
      client: dbpoolClient,
      pool: this.pg.pool,
    });

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
    pgClient: PoolClient | null,
  ): Promise<WordTrVoteStatusOutputRow> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query(
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
        vote_status: null,
        error: ErrorType.UnknownError,
      };
    }
  }

  async getDefinitionsIds(
    word_to_word_translation_id: string,
    pgClient: PoolClient | null,
  ) {
    const resQ = await pgClientOrPool({
      client: pgClient,
      pool: this.pg.pool,
    }).query(
      `
      select
        from_word_definition_id ,
        to_word_definition_id
      from
        word_to_word_translations wtwt
      where
        wtwt.word_to_word_translation_id = $1
    `,
      [word_to_word_translation_id],
    );
    return {
      from_word_definition_id: resQ.rows[0].from_word_definition_id,
      to_word_definition_id: resQ.rows[0].to_word_definition_id,
    };
  }
}
