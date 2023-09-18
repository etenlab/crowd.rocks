import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';

import { pgClientOrPool } from 'src/common/utility';

import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';

import {
  DefinitionVoteUpsertInput,
  WordDefinitionVoteOutput,
  DefinitionVoteStatusOutput,
  DefinitionVoteStatusOutputRow,
  DefinitionVoteStatus,
} from './types';

import {
  WordDefinitionVoteUpsertProcedureOutputRow,
  callWordDefinitionVoteUpsertProcedure,
  GetWordDefinitionVoteObjectById,
  getWordDefinitionVoteObjById,
  GetWordDefinitionVoteStatus,
  getWordDefinitionVoteStatusFromIds,
  ToggleWordDefinitionVoteStatus,
  toggleWordDefinitionVoteStatus,
} from './sql-string';

@Injectable()
export class WordDefinitionVotesService {
  constructor(private pg: PostgresService) {}

  async read(
    id: number,
    pgClient: PoolClient | null,
  ): Promise<WordDefinitionVoteOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetWordDefinitionVoteObjectById>(
        ...getWordDefinitionVoteObjById(id),
      );

      if (res.rowCount !== 1) {
        console.error(`no word-definition-vote for id: ${id}`);

        return {
          error: ErrorType.WordDefinitionVoteNotFound,
          word_definition_vote: null,
        };
      } else {
        return {
          error: ErrorType.NoError,
          word_definition_vote: {
            word_definitions_vote_id: id + '',
            word_definition_id: res.rows[0].word_definition_id + '',
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
      word_definition_vote: null,
    };
  }

  async upsert(
    input: DefinitionVoteUpsertInput,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<WordDefinitionVoteOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<WordDefinitionVoteUpsertProcedureOutputRow>(
        ...callWordDefinitionVoteUpsertProcedure({
          word_definition_id: +input.definition_id,
          vote: input.vote,
          token: token,
        }),
      );

      const creatingError = res.rows[0].p_error_type;
      const word_definitions_vote_id = res.rows[0].p_word_definitions_vote_id;

      if (creatingError !== ErrorType.NoError || !word_definitions_vote_id) {
        return {
          error: creatingError,
          word_definition_vote: null,
        };
      }

      return this.read(+word_definitions_vote_id, pgClient);
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_definition_vote: null,
    };
  }

  async getVoteStatus(
    word_definition_id: number,
    pgClient: PoolClient | null,
  ): Promise<DefinitionVoteStatusOutputRow> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetWordDefinitionVoteStatus>(
        ...getWordDefinitionVoteStatusFromIds([word_definition_id]),
      );

      if (res.rowCount !== 1) {
        return {
          error: ErrorType.NoError,
          vote_status: {
            definition_id: word_definition_id + '',
            upvotes: 0,
            downvotes: 0,
          },
        };
      } else {
        return {
          error: ErrorType.NoError,
          vote_status: {
            definition_id: res.rows[0].word_definition_id + '',
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

  async getVoteStatusFromWordDefinitionIds(
    word_definition_ids: number[],
    pgClient: PoolClient | null,
  ): Promise<DefinitionVoteStatusOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetWordDefinitionVoteStatus>(
        ...getWordDefinitionVoteStatusFromIds(word_definition_ids),
      );

      const voteStatusMap = new Map<string, DefinitionVoteStatus>();

      res.rows.forEach((row) =>
        voteStatusMap.set(row.word_definition_id, {
          definition_id: row.word_definition_id + '',
          upvotes: row.upvotes,
          downvotes: row.downvotes,
        }),
      );

      return {
        error: ErrorType.NoError,
        vote_status_list: word_definition_ids.map((id) => {
          const voteStatus = voteStatusMap.get(id + '');

          return voteStatus
            ? voteStatus
            : {
                definition_id: id + '',
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
    word_definition_id: number,
    vote: boolean,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<DefinitionVoteStatusOutputRow> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<ToggleWordDefinitionVoteStatus>(
        ...toggleWordDefinitionVoteStatus({
          word_definition_id,
          vote,
          token,
        }),
      );

      const creatingError = res.rows[0].p_error_type;
      const word_definitions_vote_id = res.rows[0].p_word_definitions_vote_id;

      if (creatingError !== ErrorType.NoError || !word_definitions_vote_id) {
        return {
          error: creatingError,
          vote_status: null,
        };
      }

      return this.getVoteStatus(word_definition_id, pgClient);
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      vote_status: null,
    };
  }
}
