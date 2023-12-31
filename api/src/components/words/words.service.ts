import { Injectable, Inject, forwardRef, Logger } from '@nestjs/common';
import { PoolClient } from 'pg';

import { pgClientOrPool } from 'src/common/utility';

import { ErrorType, GenericOutput } from 'src/common/types';

import { PostgresService } from 'src/core/postgres.service';
import { WordVotesService } from './word-votes.service';
import { WordDefinitionsService } from 'src/components/definitions/word-definitions.service';

import {
  Word,
  WordWithVote,
  WordReadInput,
  WordOutput,
  WordsOutput,
  WordUpsertInput,
  WordWithVoteListOutput,
  WordWithVoteListConnection,
  WordWithVoteOutput,
} from './types';
import { LanguageInput } from 'src/components/common/types';

import {
  getWordObjByIds,
  GetWordObjectById,
  callWordUpsertProcedure,
  WordUpsertProcedureOutputRow,
  callWordUpsertsProcedure,
  WordUpsertsProcedureOutput,
  GetWordListByLang,
  getWordListByLang,
  getWordByDefinitionIdSql,
  GetWordObjectByDefinitionId,
} from './sql-string';
import { WordDefinition } from '../definitions/types';
import { WordWithDefinition } from '../maps/types';

@Injectable()
export class WordsService {
  constructor(
    private pg: PostgresService,
    private wordVoteService: WordVotesService,
    @Inject(forwardRef(() => WordDefinitionsService))
    private wordDefinitionService: WordDefinitionsService,
  ) {}

  async read(
    input: WordReadInput,
    pgClient: PoolClient | null,
  ): Promise<WordOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetWordObjectById>(...getWordObjByIds([+input.word_id]));

      if (res.rowCount !== 1) {
        console.error(`no word for id: ${input.word_id}`);

        return {
          error: ErrorType.WordNotFound,
          word: null,
        };
      } else {
        return {
          error: ErrorType.NoError,
          word: {
            word_id: input.word_id,
            word: res.rows[0].word,
            language_code: res.rows[0].language_code,
            dialect_code: res.rows[0].dialect_code,
            geo_code: res.rows[0].geo_code,
            created_at: res.rows[0].created_at,
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
      word: null,
    };
  }

  async reads(
    ids: number[],
    pgClient: PoolClient | null,
  ): Promise<WordsOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetWordObjectById>(...getWordObjByIds(ids));

      const wordsMap = new Map<string, Word>();

      res.rows.forEach((row) =>
        wordsMap.set(row.word_id, {
          word_id: row.word_id,
          word: row.word,
          language_code: row.language_code,
          dialect_code: row.dialect_code,
          geo_code: row.geo_code,
          created_at: row.created_at,
          created_by_user: {
            user_id: row.user_id,
            is_bot: row.is_bot,
            avatar: row.avatar,
            avatar_url: row.avatar_url,
          },
        }),
      );

      return {
        error: ErrorType.NoError,
        words: ids.map((id) => {
          const word = wordsMap.get(id + '');

          return word ? word : null;
        }),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      words: [],
    };
  }

  async upsert(
    input: WordUpsertInput,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<WordOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<WordUpsertProcedureOutputRow>(
        ...callWordUpsertProcedure({
          wordlike_string: input.wordlike_string,
          language_code: input.language_code,
          dialect_code: input.dialect_code,
          geo_code: input.geo_code,
          token: token,
        }),
      );

      const creatingError = res.rows[0].p_error_type;
      const word_id = res.rows[0].p_word_id;

      if (creatingError !== ErrorType.NoError || !word_id) {
        return {
          error: creatingError,
          word: null,
        };
      }

      const { error: readingError, word } = await this.read(
        {
          word_id: word_id + '',
        },
        pgClient,
      );

      return {
        error: readingError,
        word,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word: null,
    };
  }

  async upserts(
    input: {
      wordlike_string: string;
      language_code: string;
      dialect_code: string | null;
      geo_code: string | null;
    }[],
    token: string,
    pgClient: PoolClient | null,
  ): Promise<WordsOutput> {
    if (input.length === 0) {
      return {
        error: ErrorType.NoError,
        words: [],
      };
    }

    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<WordUpsertsProcedureOutput>(
        ...callWordUpsertsProcedure({
          wordlike_strings: input.map((item) => item.wordlike_string),
          language_codes: input.map((item) => item.language_code),
          dialect_codes: input.map((item) => item.dialect_code),
          geo_codes: input.map((item) => item.geo_code),
          token,
        }),
      );

      const creatingErrors = res.rows[0].p_error_types;
      const creatingError = res.rows[0].p_error_type;
      const word_ids = res.rows[0].p_word_ids;

      if (creatingError !== ErrorType.NoError) {
        return {
          error: creatingError,
          words: [],
        };
      }

      const ids: { word_id: string; error: ErrorType }[] = [];

      for (let i = 0; i < word_ids.length; i++) {
        ids.push({ word_id: word_ids[i], error: creatingErrors[i] });
      }

      const { error: readingError, words } = await this.reads(
        ids
          .filter((id) => id.error === ErrorType.NoError)
          .map((id) => +id.word_id),
        pgClient,
      );

      const wordsMap = new Map<string, Word>();

      words.forEach((word) => (word ? wordsMap.set(word.word_id, word) : null));

      return {
        error: readingError,
        words: ids.map((id) => {
          if (id.error !== ErrorType.NoError) {
            return null;
          }

          return wordsMap.get(id.word_id) || null;
        }),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      words: [],
    };
  }

  /**
   * Same as upsert but can be used in transaction, thus returns only IDs due to impossibility of dirty reads in PG
   * Sql statement will be executed using given dbPoolClient .
   * It is useful if you need to make this operation as part of some SQL transaction (to transaction work properly,
   * all opertations of this transaction should be executed in  the same PoolClient instance)
   */
  async upsertInTrn(
    input: WordUpsertInput,
    token: string,
    dbPoolClient: PoolClient,
  ): Promise<{ word_id: string | null } & GenericOutput> {
    try {
      const res = await dbPoolClient.query<WordUpsertProcedureOutputRow>(
        ...callWordUpsertProcedure({
          wordlike_string: input.wordlike_string,
          language_code: input.language_code,
          dialect_code: input.dialect_code,
          geo_code: input.geo_code,
          token: token,
        }),
      );

      const creatingError = res.rows[0].p_error_type;
      const word_id = res.rows[0].p_word_id
        ? String(res.rows[0].p_word_id)
        : null;

      return {
        error: creatingError,
        word_id,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_id: null,
    };
  }

  async getWordWithVoteById(
    word_id: number,
    pgClient: PoolClient | null,
  ): Promise<WordWithVoteOutput> {
    try {
      const { error, vote_status } = await this.wordVoteService.getVoteStatus(
        word_id,
        pgClient,
      );

      if (error !== ErrorType.NoError || vote_status === null) {
        return {
          error,
          word_with_vote: null,
        };
      }

      const { error: readError, word } = await this.read(
        {
          word_id: word_id + '',
        },
        pgClient,
      );

      if (readError !== ErrorType.NoError || word === null) {
        return {
          error: readError,
          word_with_vote: null,
        };
      }

      return {
        error,
        word_with_vote: {
          ...word,
          upvotes: vote_status.upvotes,
          downvotes: vote_status.downvotes,
        },
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_with_vote: null,
    };
  }

  async getWordWithVoteByIds(
    wordIds: number[],
    pgClient: PoolClient | null,
  ): Promise<WordWithVoteListOutput> {
    try {
      const { error, vote_status_list } =
        await this.wordVoteService.getVoteStatusFromIds(wordIds, pgClient);

      if (error !== ErrorType.NoError) {
        return {
          error,
          word_with_vote_list: [],
        };
      }

      const { error: readError, words } = await this.reads(wordIds, pgClient);

      if (readError !== ErrorType.NoError) {
        return {
          error: readError,
          word_with_vote_list: [],
        };
      }

      return {
        error,
        word_with_vote_list: wordIds.map((_wordId, index) => {
          const vote_status = vote_status_list[index];
          const word = words[index];

          if (!word || !vote_status) {
            return null;
          }

          return {
            ...word,
            upvotes: vote_status.upvotes,
            downvotes: vote_status.downvotes,
          };
        }),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_with_vote_list: [],
    };
  }

  async getWordsByLanguage(
    input: LanguageInput,
    first: number | null,
    after: string | null,
    pgClient: PoolClient | null,
  ): Promise<WordWithVoteListConnection> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetWordListByLang>(
        ...getWordListByLang({
          ...input,
        }),
      );

      let offset: number | null = null;
      let hasNextPage = false;
      let startCursor: string | null = null;
      let endCursor: string | null = null;

      const wordIds: number[] = [];

      for (let i = 0; i < res.rowCount; i++) {
        const { word_id } = res.rows[i];

        if (after === null && offset === null) {
          offset = 0;
        }

        if (word_id !== after && offset === null) {
          continue;
        }

        if (word_id === after && offset === null) {
          offset = 0;
          continue;
        }

        if (offset === 0) {
          startCursor = word_id;
        }

        if (first !== null && offset! >= first) {
          hasNextPage = true;
          break;
        }

        wordIds.push(+word_id);

        endCursor = word_id;
        offset!++;
      }

      const { error, word_with_vote_list } = await this.getWordWithVoteByIds(
        wordIds,
        pgClient,
      );

      if (error !== ErrorType.NoError) {
        return {
          error,
          edges: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null,
          },
        };
      }

      const { error: definitionError, word_definition_list } =
        await this.wordDefinitionService.getWordDefinitionsByWordIds(
          wordIds,
          pgClient,
        );

      if (definitionError !== ErrorType.NoError) {
        return {
          error: definitionError,
          edges: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null,
          },
        };
      }

      const wordDefinitionMap = new Map<string, WordDefinition[]>();

      word_definition_list.forEach((word_definition) => {
        if (!word_definition) {
          return;
        }

        const word_id = word_definition.word.word_id;
        const wordDefinitions = wordDefinitionMap.get(word_id);

        if (wordDefinitions) {
          wordDefinitions.push(word_definition);
        } else {
          wordDefinitionMap.set(word_id, [word_definition]);
        }
      });

      return {
        error: ErrorType.NoError,
        edges: word_with_vote_list
          .filter((wordWitVote) => wordWitVote)
          .map((wordWithVote: WordWithVote) => {
            const wordDefinition = wordDefinitionMap.get(wordWithVote.word_id);

            return {
              cursor: wordWithVote.word_id,
              node: {
                ...wordWithVote,
                definitions: wordDefinition || [],
              },
            };
          }),
        pageInfo: {
          hasNextPage,
          hasPreviousPage: false,
          startCursor,
          endCursor,
        },
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      },
    };
  }

  async getWordByDefinitionId(
    definitionId: string,
    pgClient: PoolClient | null,
  ): Promise<WordWithDefinition | null> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetWordObjectByDefinitionId>(
        ...getWordByDefinitionIdSql(+definitionId),
      );

      if (!res.rows[0].word_id) {
        Logger.error(
          `WordsService#getWordByDefinitionId: word with definition id ${definitionId} not found`,
        );
        return null;
      }

      return {
        word_id: res.rows[0].word_id,
        word: res.rows[0].word,
        language_code: res.rows[0].language_code,
        dialect_code: res.rows[0].dialect_code,
        geo_code: res.rows[0].geo_code,
        definition: res.rows[0].definition,
        definition_id: res.rows[0].definition_id,
        created_at: res.rows[0].created_at,
        created_by_user: {
          user_id: res.rows[0].user_id,
          avatar: res.rows[0].avatar,
          avatar_url: res.rows[0].avatar_url,
          is_bot: res.rows[0].is_bot,
        },
      };
    } catch (error) {
      Logger.error(error);
      return null;
    }
  }

  getDiscussionTitle = async (id: string): Promise<string> => {
    const word = await this.getWordWithVoteById(Number(id), null);
    if (word.error !== ErrorType.NoError || word.word_with_vote == null) {
      console.error(word.error);
      return 'Dictionary:';
    }
    return `Dictionary: ${word.word_with_vote.word}`;
  };
}
