import { Injectable, Inject, forwardRef } from '@nestjs/common';
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
  GetWordListByLang,
  getWordListByLang,
} from './sql-string';
import { WordDefinition } from '../definitions/types';

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

  /**
   * @warning
   * Sync style with other methods
   */
  async getWordByDefinitionId(
    definitionId: string,
    pgClient: PoolClient | null,
  ): Promise<Word> {
    const res = await pgClientOrPool({
      client: pgClient,
      pool: this.pg.pool,
    }).query(
      `
      select
        w.word_id ,
        ws.wordlike_string ,
        w.language_code ,
        w.dialect_code,
        w.geo_code
      from
        words w
      left join word_definitions wd on
        w.word_id = wd.word_id
      left join wordlike_strings ws on
        w.wordlike_string_id = ws.wordlike_string_id
      where
        wd.word_definition_id = $1
    `,
      [definitionId],
    );

    const word: Word = {
      word_id: res[0].word_id,
      word: res[0].wordlike_string,
      language_code: res[0].language_code,
      dialect_code: res[0].dialect_code,
      geo_code: res[0].geo_code,
    };
    return word;
  }
}
