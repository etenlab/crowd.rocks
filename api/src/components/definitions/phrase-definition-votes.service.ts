import { Injectable } from '@nestjs/common';

import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';

import {
  DefinitionVoteUpsertInput,
  PhraseDefinitionVoteOutput,
  DefinitionVoteStatusOutputRow,
} from './types';

import {
  PhraseDefinitionVoteUpsertProcedureOutputRow,
  callPhraseDefinitionVoteUpsertProcedure,
  GetPhraseDefinitionVoteObjectById,
  getPhraseDefinitionVoteObjById,
  GetPhraseDefinitionVoteStatus,
  getPhraseDefinitionVoteStatus,
  TogglePhraseDefinitionVoteStatus,
  togglePhraseDefinitionVoteStatus,
} from './sql-string';

@Injectable()
export class PhraseDefinitionVotesService {
  constructor(private pg: PostgresService) {}

  async read(id: number): Promise<PhraseDefinitionVoteOutput> {
    try {
      const res1 = await this.pg.pool.query<GetPhraseDefinitionVoteObjectById>(
        ...getPhraseDefinitionVoteObjById(id),
      );

      if (res1.rowCount !== 1) {
        console.error(`no site-text-translation-vote for id: ${id}`);
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
  ): Promise<PhraseDefinitionVoteOutput> {
    try {
      const res =
        await this.pg.pool.query<PhraseDefinitionVoteUpsertProcedureOutputRow>(
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

      return this.read(phrase_definitions_vote_id);
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase_definition_vote: null,
    };
  }

  async getVoteStatus(
    word_definition_id: number,
  ): Promise<DefinitionVoteStatusOutputRow> {
    try {
      const res1 = await this.pg.pool.query<GetPhraseDefinitionVoteStatus>(
        ...getPhraseDefinitionVoteStatus(word_definition_id),
      );

      if (res1.rowCount !== 1) {
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

  async toggleVoteStatus(
    phrase_definition_id: number,
    vote: boolean,
    token: string,
  ): Promise<DefinitionVoteStatusOutputRow> {
    try {
      const res1 = await this.pg.pool.query<TogglePhraseDefinitionVoteStatus>(
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

      return this.getVoteStatus(phrase_definition_id);
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      vote_status: null,
    };
  }
}
