import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PoolClient } from 'pg';

import { ErrorType, GenericOutput } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';
import { WordsService } from 'src/components/words/words.service';
import { WordDefinitionVotesService } from './word-definition-votes.service';

import {
  WordDefinitionUpsertInput,
  WordDefinitionReadOutput,
  WordDefinitionUpsertOutput,
  WordDefinitionUpdateInput,
  WordDefinitionWithVoteListOutput,
  WordDefinitionWithVote,
  WordDefinitionListOutput,
  WordDefinition,
} from './types';

import { LanguageInput } from 'src/components/common/types';

import {
  getWordDefinitionObjById,
  GetWordDefinitionObjectById,
  callWordDefinitionUpsertProcedure,
  WordDefinitionUpsertProcedureOutputRow,
  WordDefinitionUpdateProcedureOutputRow,
  callWordDefinitionUpdateProcedure,
  GetWordDefinitionListByLang,
  getWordDefinitionListByLang,
  GetWordDefinitionListByWordId,
  getWordDefinitionListByWordId,
} from './sql-string';

@Injectable()
export class WordDefinitionsService {
  constructor(
    private pg: PostgresService,
    @Inject(forwardRef(() => WordsService))
    private wordService: WordsService,
    private wordDefinitionVoteService: WordDefinitionVotesService,
  ) {}

  async read(id: number): Promise<WordDefinitionReadOutput> {
    try {
      const res1 = await this.pg.pool.query<GetWordDefinitionObjectById>(
        ...getWordDefinitionObjById(+id),
      );

      if (res1.rowCount !== 1) {
        console.error(`no word definition for id: ${id}`);
      } else {
        const wordOutput = await this.wordService.read({
          word_id: res1.rows[0].word_id + '',
        });

        return {
          error: wordOutput.error,
          word_definition: {
            word_definition_id: id + '',
            word: wordOutput.word,
            definition: res1.rows[0].definition,
          },
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_definition: null,
    };
  }

  async upsert(
    input: WordDefinitionUpsertInput,
    token: string,
  ): Promise<WordDefinitionUpsertOutput> {
    try {
      const res =
        await this.pg.pool.query<WordDefinitionUpsertProcedureOutputRow>(
          ...callWordDefinitionUpsertProcedure({
            word_id: +input.word_id,
            definition: input.definition,
            token: token,
          }),
        );

      const creatingError = res.rows[0].p_error_type;
      const word_definition_id = res.rows[0].p_word_definition_id;

      if (creatingError !== ErrorType.NoError || !word_definition_id) {
        return {
          error: creatingError,
          word_definition: null,
        };
      }

      const { error: readingError, word_definition } = await this.read(
        word_definition_id,
      );

      return {
        error: readingError,
        word_definition,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_definition: null,
    };
  }

  /**
   * Same as upsert but can be used in transaction, thus returns only IDs due to impossibility of dirty reads in PG
   * Sql statement will be executed using given dbPoolClient .
   * It is useful if you need to make this operation as part of some SQL transaction (to transaction work properly,
   * all opertations of this transaction should be executed in  the same PoolClient instance)
   */
  async upsertInTrn(
    input: WordDefinitionUpsertInput,
    token: string,
    dbPoolClient: PoolClient,
  ): Promise<{ word_definition_id: string } & GenericOutput> {
    try {
      const res =
        await dbPoolClient.query<WordDefinitionUpsertProcedureOutputRow>(
          ...callWordDefinitionUpsertProcedure({
            word_id: +input.word_id,
            definition: input.definition,
            token: token,
          }),
        );

      const creatingError = res.rows[0].p_error_type;
      const word_definition_id = res.rows[0].p_word_definition_id
        ? String(res.rows[0].p_word_definition_id)
        : null;

      return {
        error: creatingError,
        word_definition_id,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_definition_id: null,
    };
  }

  async update(
    input: WordDefinitionUpdateInput,
    token: string,
  ): Promise<WordDefinitionUpsertOutput> {
    try {
      const res =
        await this.pg.pool.query<WordDefinitionUpdateProcedureOutputRow>(
          ...callWordDefinitionUpdateProcedure({
            word_definition_id: +input.word_definition_id,
            definition: input.definitionlike_string,
            token: token,
          }),
        );

      const updatingError = res.rows[0].p_error_type;

      if (updatingError !== ErrorType.NoError) {
        return {
          error: updatingError,
          word_definition: null,
        };
      }

      const { error: readingError, word_definition } = await this.read(
        +input.word_definition_id,
      );

      return {
        error: readingError,
        word_definition,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_definition: null,
    };
  }

  async getWordDefinitionsByLanguage(
    input: LanguageInput,
  ): Promise<WordDefinitionWithVoteListOutput> {
    try {
      const res1 = await this.pg.pool.query<GetWordDefinitionListByLang>(
        ...getWordDefinitionListByLang({
          ...input,
        }),
      );

      const definitionsWithVoteList: WordDefinitionWithVote[] = [];

      for (let i = 0; i < res1.rowCount; i++) {
        const { word_definition_id, created_at } = res1.rows[i];
        const { error, vote_status } =
          await this.wordDefinitionVoteService.getVoteStatus(
            word_definition_id,
          );

        if (error !== ErrorType.NoError) {
          return {
            error,
            word_definition_list: [],
          };
        }

        const { error: readError, word_definition } = await this.read(
          word_definition_id,
        );

        if (readError !== ErrorType.NoError) {
          continue;
        }

        definitionsWithVoteList.push({
          ...word_definition,
          upvotes: vote_status.upvotes,
          downvotes: vote_status.downvotes,
          created_at: created_at,
        });
      }

      return {
        error: ErrorType.NoError,
        word_definition_list: definitionsWithVoteList,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_definition_list: [],
    };
  }

  async getWordDefinitionsByWordId(
    word_id: number,
  ): Promise<WordDefinitionWithVoteListOutput> {
    try {
      const res1 = await this.pg.pool.query<GetWordDefinitionListByWordId>(
        ...getWordDefinitionListByWordId(word_id),
      );

      const definitionsWithVoteList: WordDefinitionWithVote[] = [];

      for (let i = 0; i < res1.rowCount; i++) {
        const { word_definition_id, created_at } = res1.rows[i];
        const { error, vote_status } =
          await this.wordDefinitionVoteService.getVoteStatus(
            word_definition_id,
          );

        if (error !== ErrorType.NoError) {
          return {
            error,
            word_definition_list: [],
          };
        }

        const { error: readError, word_definition } = await this.read(
          word_definition_id,
        );

        if (readError !== ErrorType.NoError) {
          continue;
        }

        definitionsWithVoteList.push({
          ...word_definition,
          upvotes: vote_status.upvotes,
          downvotes: vote_status.downvotes,
          created_at: created_at,
        });
      }

      return {
        error: ErrorType.NoError,
        word_definition_list: definitionsWithVoteList,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_definition_list: [],
    };
  }

  async getDefinitionsByWordId(
    word_id: number,
  ): Promise<WordDefinitionListOutput> {
    try {
      const res1 = await this.pg.pool.query<GetWordDefinitionListByWordId>(
        ...getWordDefinitionListByWordId(word_id),
      );

      const definitionList: WordDefinition[] = [];

      for (let i = 0; i < res1.rowCount; i++) {
        const { word_definition_id } = res1.rows[i];
        const { error, word_definition } = await this.read(word_definition_id);

        if (error !== ErrorType.NoError) {
          return {
            error,
            definitions: [],
          };
        }

        definitionList.push(word_definition);
      }

      return {
        error: ErrorType.NoError,
        definitions: definitionList,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      definitions: [],
    };
  }
}
