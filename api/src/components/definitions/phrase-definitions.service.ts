import { Injectable } from '@nestjs/common';

import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';
import { PhrasesService } from 'src/components/phrases/phrases.service';
import { PhraseDefinitionVotesService } from './phrase-definition-votes.service';

import {
  PhraseDefinitionUpsertInput,
  PhraseDefinitionReadOutput,
  PhraseDefinitionUpsertOutput,
  PhraseDefinitionUpdateInput,
  LanguageInput,
  PhraseDefinitionWithVoteListOutput,
  PhraseDefinitionWithVote,
} from './types';

import {
  getPhraseDefinitionObjById,
  GetPhraseDefinitionObjectById,
  callPhraseDefinitionUpsertProcedure,
  PhraseDefinitionUpsertProcedureOutputRow,
  PhraseDefinitionUpdateProcedureOutputRow,
  callPhraseDefinitionUpdateProcedure,
  GetPhraseDefinitionListByLang,
  getPhraseDefinitionListByLang,
} from './sql-string';

@Injectable()
export class PhraseDefinitionsService {
  constructor(
    private pg: PostgresService,
    private phraseService: PhrasesService,
    private phraseDefinitionVoteService: PhraseDefinitionVotesService,
  ) {}

  async read(id: number): Promise<PhraseDefinitionReadOutput> {
    try {
      const res1 = await this.pg.pool.query<GetPhraseDefinitionObjectById>(
        ...getPhraseDefinitionObjById(+id),
      );

      if (res1.rowCount !== 1) {
        console.error(`no phrase definition for id: ${id}`);
      } else {
        const phraseOutput = await this.phraseService.read({
          phrase_id: res1.rows[0].phrase_id + '',
        });

        return {
          error: phraseOutput.error,
          phrase_definition: {
            phrase_definition_id: id + '',
            phrase: phraseOutput.phrase,
            definition: res1.rows[0].definition,
          },
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase_definition: null,
    };
  }

  async upsert(
    input: PhraseDefinitionUpsertInput,
    token: string,
  ): Promise<PhraseDefinitionUpsertOutput> {
    try {
      const res =
        await this.pg.pool.query<PhraseDefinitionUpsertProcedureOutputRow>(
          ...callPhraseDefinitionUpsertProcedure({
            phrase_id: +input.phrase_id,
            definition: input.definition,
            token: token,
          }),
        );

      const creatingError = res.rows[0].p_error_type;
      const phrase_definition_id = res.rows[0].p_phrase_definition_id;

      if (creatingError !== ErrorType.NoError || !phrase_definition_id) {
        return {
          error: creatingError,
          phrase_definition: null,
        };
      }

      const { error: readingError, phrase_definition } = await this.read(
        phrase_definition_id,
      );

      return {
        error: readingError,
        phrase_definition,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase_definition: null,
    };
  }

  async update(
    input: PhraseDefinitionUpdateInput,
    token: string,
  ): Promise<PhraseDefinitionUpsertOutput> {
    try {
      const res =
        await this.pg.pool.query<PhraseDefinitionUpdateProcedureOutputRow>(
          ...callPhraseDefinitionUpdateProcedure({
            phrase_definition_id: +input.phrase_definition_id,
            definition: input.definitionlike_string,
            token: token,
          }),
        );

      const updatingError = res.rows[0].p_error_type;

      if (updatingError !== ErrorType.NoError) {
        return {
          error: updatingError,
          phrase_definition: null,
        };
      }

      const { error: readingError, phrase_definition } = await this.read(
        +input.phrase_definition_id,
      );

      return {
        error: readingError,
        phrase_definition,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase_definition: null,
    };
  }

  async getPhraseDefinitionsByLanguage(
    input: LanguageInput,
  ): Promise<PhraseDefinitionWithVoteListOutput> {
    try {
      const res1 = await this.pg.pool.query<GetPhraseDefinitionListByLang>(
        ...getPhraseDefinitionListByLang({
          ...input,
        }),
      );

      const definitionsWithVoteList: PhraseDefinitionWithVote[] = [];

      for (let i = 0; i < res1.rowCount; i++) {
        const { phrase_definition_id, created_at } = res1.rows[i];
        const { error, vote_status } =
          await this.phraseDefinitionVoteService.getVoteStatus(
            phrase_definition_id,
          );

        if (error !== ErrorType.NoError) {
          return {
            error,
            phrase_definition_list: [],
          };
        }

        const { error: readError, phrase_definition } = await this.read(
          phrase_definition_id,
        );

        if (readError !== ErrorType.NoError) {
          continue;
        }

        definitionsWithVoteList.push({
          ...phrase_definition,
          upvotes: vote_status.upvotes,
          downvotes: vote_status.downvotes,
          created_at: created_at,
        });
      }

      return {
        error: ErrorType.NoError,
        phrase_definition_list: definitionsWithVoteList,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase_definition_list: [],
    };
  }
}
