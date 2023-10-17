import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PoolClient } from 'pg';

import { pgClientOrPool } from 'src/common/utility';

import { ErrorType, GenericOutput } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';
import { WordsService } from 'src/components/words/words.service';
import { WordDefinitionVotesService } from './word-definition-votes.service';

import {
  WordDefinitionUpsertInput,
  WordDefinitionOutput,
  WordDefinitionsOutput,
  WordDefinitionUpdateInput,
  WordDefinitionWithVoteListOutput,
  WordDefinition,
  WordDefinitionWithVote,
  DefinitionIdsOutput,
} from './types';
import { Word } from '../words/types';

import { LanguageInput } from 'src/components/common/types';

import {
  getWordDefinitionObjByIds,
  GetWordDefinitionObjectById,
  callWordDefinitionUpsertProcedure,
  WordDefinitionUpsertProcedureOutputRow,
  WordDefinitionUpdateProcedureOutputRow,
  callWordDefinitionUpdateProcedure,
  WordDefinitionUpsertsProcedureOutput,
  callWordDefinitionUpsertsProcedure,
  GetWordDefinitionListByLang,
  getWordDefinitionListByLang,
  GetWordDefinitionListByWordId,
  getWordDefinitionListByWordIds,
} from './sql-string';

@Injectable()
export class WordDefinitionsService {
  constructor(
    private pg: PostgresService,
    @Inject(forwardRef(() => WordsService))
    private wordService: WordsService,
    private wordDefinitionVoteService: WordDefinitionVotesService,
  ) {}

  async read(
    id: number,
    pgClient: PoolClient | null,
  ): Promise<WordDefinitionOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetWordDefinitionObjectById>(...getWordDefinitionObjByIds([id]));

      if (res.rowCount !== 1) {
        console.error(`no word definition for id: ${id}`);

        return {
          error: ErrorType.WordDefinitionNotFound,
          word_definition: null,
        };
      } else {
        const wordOutput = await this.wordService.read(
          {
            word_id: res.rows[0].word_id + '',
          },
          null,
        );

        if (!wordOutput.word) {
          return {
            error: ErrorType.WordDefinitionNotFound,
            word_definition: null,
          };
        }

        return {
          error: wordOutput.error,
          word_definition: {
            word_definition_id: id + '',
            word: wordOutput.word,
            definition: res.rows[0].definition,
            created_at: new Date(res.rows[0].created_at),
            created_by_user: {
              user_id: res.rows[0].user_id,
              avatar: res.rows[0].avatar,
              avatar_url: res.rows[0].avatar_url,
              is_bot: res.rows[0].is_bot,
            },
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

  async reads(
    ids: number[],
    pgClient: PoolClient | null,
  ): Promise<WordDefinitionsOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetWordDefinitionObjectById>(...getWordDefinitionObjByIds(ids));

      const wordIds = res.rows.map((row) => +row.word_id);

      const { error, words } = await this.wordService.reads(wordIds, pgClient);

      if (error !== ErrorType.NoError) {
        return {
          error: error,
          word_definitions: [],
        };
      }

      const wordMap = new Map<string, Word>();
      const wordDefinitionsMap = new Map<string, WordDefinition>();

      words.forEach((word) => (word ? wordMap.set(word.word_id, word) : null));

      res.rows.forEach((row) => {
        const word = wordMap.get(row.word_id);

        if (word && row) {
          wordDefinitionsMap.set(row.word_definition_id, {
            word_definition_id: row.word_definition_id + '',
            word: word,
            definition: row.definition,
            created_at: new Date(row.created_at),
            created_by_user: {
              user_id: row.user_id,
              avatar: row.avatar,
              avatar_url: row.avatar_url,
              is_bot: row.is_bot,
            },
          });
        }
      });

      return {
        error: ErrorType.NoError,
        word_definitions: ids.map((id) => {
          const wordDefinition = wordDefinitionsMap.get(id + '');

          return wordDefinition ? wordDefinition : null;
        }),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_definitions: [],
    };
  }

  async upsert(
    input: WordDefinitionUpsertInput,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<WordDefinitionOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<WordDefinitionUpsertProcedureOutputRow>(
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
        +word_definition_id,
        pgClient,
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

  async upserts(
    input: {
      word_id: number;
      definition: string;
    }[],
    token: string,
    pgClient: PoolClient | null,
  ): Promise<WordDefinitionsOutput> {
    if (input.length === 0) {
      return {
        error: ErrorType.NoError,
        word_definitions: [],
      };
    }

    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<WordDefinitionUpsertsProcedureOutput>(
        ...callWordDefinitionUpsertsProcedure({
          word_ids: input.map((item) => item.word_id),
          definitions: input.map((item) => item.definition),
          token: token,
        }),
      );

      const creatingError = res.rows[0].p_error_type;
      const creatingErrors = res.rows[0].p_error_types;
      const word_definition_ids = res.rows[0].p_word_definition_ids;

      if (creatingError !== ErrorType.NoError) {
        return {
          error: creatingError,
          word_definitions: [],
        };
      }

      const ids: { word_definition_id: string; error: ErrorType }[] = [];

      for (let i = 0; i < word_definition_ids.length; i++) {
        ids.push({
          word_definition_id: word_definition_ids[i],
          error: creatingErrors[i],
        });
      }

      const { error: readingError, word_definitions } = await this.reads(
        ids
          .filter((id) => id.error === ErrorType.NoError)
          .map((id) => +id.word_definition_id),
        pgClient,
      );

      const wordDefinitionsMap = new Map<string, WordDefinition>();

      word_definitions.forEach((word_definition) =>
        word_definition
          ? wordDefinitionsMap.set(
              word_definition.word_definition_id,
              word_definition,
            )
          : null,
      );

      return {
        error: readingError,
        word_definitions: ids.map((id) => {
          if (id.error !== ErrorType.NoError) {
            return null;
          }

          return wordDefinitionsMap.get(id.word_definition_id) || null;
        }),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_definitions: [],
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
  ): Promise<{ word_definition_id: string | null } & GenericOutput> {
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
    pgClient: PoolClient | null,
  ): Promise<WordDefinitionOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<WordDefinitionUpdateProcedureOutputRow>(
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
        pgClient,
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

  async getWordDefinitionWithVoteListFromIds(
    ids: number[],
    pgClient: PoolClient | null,
  ): Promise<WordDefinitionWithVoteListOutput> {
    try {
      const { error: wordDefinitionReadsError, word_definitions } =
        await this.reads(ids, pgClient);

      if (wordDefinitionReadsError !== ErrorType.NoError) {
        return {
          error: wordDefinitionReadsError,
          word_definition_list: [],
        };
      }

      const { error: voteError, vote_status_list } =
        await this.wordDefinitionVoteService.getVoteStatusFromWordDefinitionIds(
          ids,
          pgClient,
        );

      if (voteError !== ErrorType.NoError) {
        return {
          error: voteError,
          word_definition_list: [],
        };
      }

      return {
        error: ErrorType.NoError,
        word_definition_list: ids.map((_id, index) => {
          if (word_definitions[index] && vote_status_list[index]) {
            return {
              ...word_definitions[index],
              upvotes: vote_status_list[index].upvotes,
              downvotes: vote_status_list[index].downvotes,
            } as WordDefinitionWithVote;
          } else {
            return null;
          }
        }),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_definition_list: [],
    };
  }

  async getWordDefinitionsByLanguage(
    input: LanguageInput,
    pgClient: PoolClient | null,
  ): Promise<WordDefinitionWithVoteListOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetWordDefinitionListByLang>(
        ...getWordDefinitionListByLang({
          ...input,
        }),
      );

      return this.getWordDefinitionWithVoteListFromIds(
        res.rows.map((row) => +row.word_definition_id),
        pgClient,
      );
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
    pgClient: PoolClient | null,
  ): Promise<WordDefinitionWithVoteListOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetWordDefinitionListByWordId>(
        ...getWordDefinitionListByWordIds([word_id]),
      );

      return await this.getWordDefinitionWithVoteListFromIds(
        res.rows.map((row) => +row.word_definition_id),
        pgClient,
      );
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_definition_list: [],
    };
  }

  async getWordDefinitionIdsByWordIds(
    wordIds: number[],
    pgClient: PoolClient | null,
  ): Promise<DefinitionIdsOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetWordDefinitionListByWordId>(
        ...getWordDefinitionListByWordIds(wordIds),
      );

      return {
        error: ErrorType.NoError,
        ids: res.rows.map((row) => row.word_definition_id),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      ids: [],
    };
  }

  async getWordDefinitionsByWordIds(
    wordIds: number[],
    pgClient: PoolClient | null,
  ): Promise<WordDefinitionWithVoteListOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetWordDefinitionListByWordId>(
        ...getWordDefinitionListByWordIds(wordIds),
      );

      return await this.getWordDefinitionWithVoteListFromIds(
        res.rows.map((row) => +row.word_definition_id),
        pgClient,
      );
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_definition_list: [],
    };
  }

  getDiscussionTitle = async (id: string): Promise<string> => {
    const word_def = await this.read(Number(id), null);
    if (
      word_def.error !== ErrorType.NoError ||
      word_def.word_definition == null
    ) {
      console.error(word_def.error);
      return 'Dictionary: ';
    }

    return `Dictionary: ${word_def.word_definition.word.word} - ${word_def.word_definition.definition}`;
  };
}
