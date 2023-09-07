import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';

import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';

import {
  DefinitionVoteUpsertInput,
  PhraseDefinitionVoteOutput,
  DefinitionVoteStatusOutput,
  DefinitionVoteStatusOutputRow,
  DefinitionVoteStatus,
} from './types';

import {
  PhraseDefinitionVoteUpsertProcedureOutputRow,
  callPhraseDefinitionVoteUpsertProcedure,
  GetPhraseDefinitionVoteObjectById,
  getPhraseDefinitionVoteObjById,
  GetPhraseDefinitionVoteStatus,
  getPhraseDefinitionVoteStatusFromIds,
  TogglePhraseDefinitionVoteStatus,
  togglePhraseDefinitionVoteStatus,
} from './sql-string';

import { pgClientOrPool } from 'src/common/utility';

@Injectable()
export class PhraseDefinitionVotesService {
  constructor(private pg: PostgresService) {}

  async read(
    id: number,
    pgClient: PoolClient | null,
  ): Promise<PhraseDefinitionVoteOutput> {
    try {
      const res1 = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetPhraseDefinitionVoteObjectById>(
        ...getPhraseDefinitionVoteObjById(id),
      );

      if (res1.rowCount !== 1) {
        console.error(`no phrase-definition-vote for id: ${id}`);

        return {
          error: ErrorType.PhraseDefinitionVoteNotFound,
          phrase_definition_vote: null,
        };
      } else {
        return {
          error: ErrorType.NoError,
          phrase_definition_vote: {
            phrase_definitions_vote_id: id + '',
            phrase_definition_id: res1.rows[0].phrase_definition_id + '',
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
      phrase_definition_vote: null,
    };
  }

  async upsert(
    input: DefinitionVoteUpsertInput,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<PhraseDefinitionVoteOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<PhraseDefinitionVoteUpsertProcedureOutputRow>(
        ...callPhraseDefinitionVoteUpsertProcedure({
          phrase_definition_id: +input.definition_id,
          vote: input.vote,
          token: token,
        }),
      );

      const creatingError = res.rows[0].p_error_type;
      const phrase_definitions_vote_id =
        res.rows[0].p_phrase_definitions_vote_id;

      if (creatingError !== ErrorType.NoError || !phrase_definitions_vote_id) {
        return {
          error: creatingError,
          phrase_definition_vote: null,
        };
      }

      return this.read(+phrase_definitions_vote_id, pgClient);
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase_definition_vote: null,
    };
  }

  async getVoteStatus(
    phrase_definition_id: number,
    pgClient: PoolClient | null,
  ): Promise<DefinitionVoteStatusOutputRow> {
    try {
      const res1 = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetPhraseDefinitionVoteStatus>(
        ...getPhraseDefinitionVoteStatusFromIds([phrase_definition_id]),
      );

      if (res1.rowCount !== 1) {
        return {
          error: ErrorType.NoError,
          vote_status: {
            definition_id: phrase_definition_id + '',
            upvotes: 0,
            downvotes: 0,
          },
        };
      } else {
        return {
          error: ErrorType.NoError,
          vote_status: {
            definition_id: res1.rows[0].phrase_definition_id + '',
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

  async getVoteStatusFromPhraseDefinitionIds(
    phrase_definition_ids: number[],
    pgClient: PoolClient | null,
  ): Promise<DefinitionVoteStatusOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetPhraseDefinitionVoteStatus>(
        ...getPhraseDefinitionVoteStatusFromIds(phrase_definition_ids),
      );

      const voteStatusMap = new Map<string, DefinitionVoteStatus>();

      res.rows.forEach((row) =>
        voteStatusMap.set(row.phrase_definition_id, {
          definition_id: row.phrase_definition_id + '',
          upvotes: row.upvotes,
          downvotes: row.downvotes,
        }),
      );

      return {
        error: ErrorType.NoError,
        vote_status_list: phrase_definition_ids.map((id) => {
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
    phrase_definition_id: number,
    vote: boolean,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<DefinitionVoteStatusOutputRow> {
    try {
      const res1 = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<TogglePhraseDefinitionVoteStatus>(
        ...togglePhraseDefinitionVoteStatus({
          phrase_definition_id,
          vote,
          token,
        }),
      );

      const creatingError = res1.rows[0].p_error_type;
      const phrase_definitions_vote_id =
        res1.rows[0].p_phrase_definitions_vote_id;

      if (creatingError !== ErrorType.NoError || !phrase_definitions_vote_id) {
        return {
          error: creatingError,
          vote_status: null,
        };
      }

      return this.getVoteStatus(phrase_definition_id, pgClient);
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      vote_status: null,
    };
  }
}
