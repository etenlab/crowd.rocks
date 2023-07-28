import { Injectable } from '@nestjs/common';

import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';

import {
  DefinitionVoteUpsertInput,
  WordDefinitionVoteOutput,
  DefinitionVoteStatusOutputRow,
} from './types';

import {
  WordDefinitionVoteUpsertProcedureOutputRow,
  callWordDefinitionVoteUpsertProcedure,
  GetWordDefinitionVoteObjectById,
  getWordDefinitionVoteObjById,
  GetWordDefinitionVoteStatus,
  getWordDefinitionVoteStatus,
  ToggleWordDefinitionVoteStatus,
  toggleWordDefinitionVoteStatus,
} from './sql-string';

@Injectable()
export class WordDefinitionVotesService {
  constructor(private pg: PostgresService) {}

  async read(id: number): Promise<WordDefinitionVoteOutput> {
    try {
      const res1 = await this.pg.pool.query<GetWordDefinitionVoteObjectById>(
        ...getWordDefinitionVoteObjById(id),
      );

      if (res1.rowCount !== 1) {
        console.error(`no site-text-translation-vote for id: ${id}`);
      } else {
        return {
          error: ErrorType.NoError,
          word_definition_vote: {
            word_definitions_vote_id: id + '',
            word_definition_id: res1.rows[0].word_definition_id + '',
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
      word_definition_vote: null,
    };
  }

  async upsert(
    input: DefinitionVoteUpsertInput,
    token: string,
  ): Promise<WordDefinitionVoteOutput> {
    try {
      const res =
        await this.pg.pool.query<WordDefinitionVoteUpsertProcedureOutputRow>(
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

      return this.read(word_definitions_vote_id);
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
  ): Promise<DefinitionVoteStatusOutputRow> {
    try {
      const res1 = await this.pg.pool.query<GetWordDefinitionVoteStatus>(
        ...getWordDefinitionVoteStatus(word_definition_id),
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
            definition_id: res1.rows[0].word_definition_id + '',
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
    word_definition_id: number,
    vote: boolean,
    token: string,
  ): Promise<DefinitionVoteStatusOutputRow> {
    try {
      const res1 = await this.pg.pool.query<ToggleWordDefinitionVoteStatus>(
        ...toggleWordDefinitionVoteStatus({
          word_definition_id,
          vote,
          token,
        }),
      );

      const creatingError = res1.rows[0].p_error_type;
      const word_definitions_vote_id = res1.rows[0].p_word_definitions_vote_id;

      if (creatingError !== ErrorType.NoError || !word_definitions_vote_id) {
        return {
          error: creatingError,
          vote_status: null,
        };
      }

      return this.getVoteStatus(word_definition_id);
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      vote_status: null,
    };
  }
}
