import { Injectable, Inject, forwardRef } from '@nestjs/common';

import { ErrorType, GenericOutput } from 'src/common/types';

import { PostgresService } from 'src/core/postgres.service';
import { WordsService } from 'src/components/words/words.service';
import { PhraseVotesService } from './phrase-votes.service';
import { PhraseDefinitionsService } from 'src/components/definitions/phrase-definitions.service';

import {
  PhraseReadInput,
  PhraseReadOutput,
  PhraseUpsertInput,
  PhraseWithVoteListEdge,
  PhraseWithVoteListConnection,
  PhraseWithVoteOutput,
} from './types';
import { WordUpsertInput } from 'src/components/words/types';
import { LanguageInput } from 'src/components/common/types';

import {
  GetPhraseObjByIdResultRow,
  getPhraseObjById,
  callPhraseUpsertProcedure,
  PhraseUpsertProcedureOutputRow,
  GetPhraseListByLang,
  getPhraseListByLang,
} from './sql-string';
import { PoolClient } from 'pg';

@Injectable()
export class PhrasesService {
  constructor(
    private pg: PostgresService,
    private wordService: WordsService,
    private phraseVoteService: PhraseVotesService,
    @Inject(forwardRef(() => PhraseDefinitionsService))
    private phraseDefinitionService: PhraseDefinitionsService,
  ) {}

  async read(input: PhraseReadInput): Promise<PhraseReadOutput> {
    try {
      const res1 = await this.pg.pool.query<GetPhraseObjByIdResultRow>(
        ...getPhraseObjById(+input.phrase_id),
      );

      if (res1.rowCount === 0) {
        console.error(`no phrase for id: ${input.phrase_id}`);
      } else {
        return {
          error: ErrorType.NoError,
          phrase: {
            phrase_id: input.phrase_id,
            phrase: res1.rows[0].phrase,
            language_code: res1.rows[0].language_code,
            dialect_code: res1.rows[0].dialect_code,
            geo_code: res1.rows[0].geo_code,
          },
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase: null,
    };
  }

  async upsert(
    input: PhraseUpsertInput,
    token: string,
  ): Promise<PhraseReadOutput> {
    try {
      const wordlikeStrings = input.phraselike_string
        .split(' ')
        .filter((w) => w !== '');
      const wordIds: number[] = [];

      for (const wordlikeStr of wordlikeStrings) {
        const res = await this.wordService.upsert(
          {
            wordlike_string: wordlikeStr,
            language_code: input.language_code,
            dialect_code: input.dialect_code,
            geo_code: input.geo_code,
          } as WordUpsertInput,
          token,
        );

        if (res.error !== ErrorType.NoError) {
          return {
            error: res.error,
            phrase: null,
          };
        }

        wordIds.push(+res.word.word_id);
      }

      const res = await this.pg.pool.query<PhraseUpsertProcedureOutputRow>(
        ...callPhraseUpsertProcedure({
          phraselike_string: input.phraselike_string,
          wordIds: wordIds,
          token: token,
        }),
      );

      const error = res.rows[0].p_error_type;
      const phrase_id = res.rows[0].p_phrase_id;

      if (error !== ErrorType.NoError || !phrase_id) {
        return {
          error,
          phrase: null,
        };
      }

      const phrase = await (
        await this.read({ phrase_id: phrase_id + '' })
      ).phrase;

      return {
        error,
        phrase,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase: null,
    };
  }

  /**
   * Same as upsert but uses given dbPoolClient and without dirty reads.
   * also returns array of word_ids present in the phrase
   */
  async upsertInTrn(
    input: PhraseUpsertInput,
    token: string,
    dbPoolClient: PoolClient,
  ): Promise<{ phrase_id: number | null; word_ids: number[] } & GenericOutput> {
    try {
      const wordlikeStrings = input.phraselike_string
        .split(' ')
        .map((w) => w.trim())
        .filter((w) => w.length > 1);
      const word_ids: number[] = [];

      for (const wordlikeStr of wordlikeStrings) {
        const res = await this.wordService.upsertInTrn(
          {
            wordlike_string: wordlikeStr,
            language_code: input.language_code,
            dialect_code: input.dialect_code,
            geo_code: input.geo_code,
          } as WordUpsertInput,
          token,
          dbPoolClient,
        );

        if (res.error !== ErrorType.NoError) {
          return {
            error: res.error,
            phrase_id: null,
            word_ids,
          };
        }

        word_ids.push(Number(res.word_id));
      }

      const res = await dbPoolClient.query<PhraseUpsertProcedureOutputRow>(
        ...callPhraseUpsertProcedure({
          phraselike_string: input.phraselike_string,
          wordIds: word_ids,
          token: token,
        }),
      );

      const error = res.rows[0].p_error_type;
      const phrase_id = res.rows[0].p_phrase_id;

      if (error !== ErrorType.NoError || !phrase_id) {
        return {
          error,
          phrase_id: null,
          word_ids: null,
        };
      }
      return {
        error,
        phrase_id: phrase_id,
        word_ids,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase_id: null,
      word_ids: null,
    };
  }

  async getPhraseWithVoteById(
    phrase_id: number,
  ): Promise<PhraseWithVoteOutput> {
    try {
      const { error, vote_status } = await this.phraseVoteService.getVoteStatus(
        phrase_id,
      );

      if (error !== ErrorType.NoError) {
        return {
          error,
          phrase_with_vote: null,
        };
      }

      const { error: readError, phrase } = await this.read({
        phrase_id: phrase_id + '',
      });

      if (readError !== ErrorType.NoError) {
        return {
          error: readError,
          phrase_with_vote: null,
        };
      }

      return {
        error,
        phrase_with_vote: {
          ...phrase,
          upvotes: vote_status.upvotes,
          downvotes: vote_status.downvotes,
        },
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase_with_vote: null,
    };
  }

  async getPhrasesByLanguage(
    input: LanguageInput,
    first: number,
    after: string | null,
  ): Promise<PhraseWithVoteListConnection> {
    try {
      const res1 = await this.pg.pool.query<GetPhraseListByLang>(
        ...getPhraseListByLang({
          ...input,
        }),
      );

      const phraseWithVoteListEdge: PhraseWithVoteListEdge[] = [];

      let offset: number | null = null;
      let hasNextPage = false;
      let startCursor: string | null = null;
      let endCursor: string | null = null;

      for (let i = 0; i < res1.rowCount; i++) {
        const { phrase_id } = res1.rows[i];

        if (after === null && offset === null) {
          offset = 0;
        }

        if (phrase_id !== after && offset === null) {
          continue;
        }

        if (phrase_id === after && offset === null) {
          offset = 0;
          continue;
        }

        if (offset === 0) {
          startCursor = phrase_id;
        }

        if (offset >= first) {
          hasNextPage = true;
          break;
        }

        const { error, vote_status } =
          await this.phraseVoteService.getVoteStatus(+phrase_id);

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

        const { error: definitionError, definitions } =
          await this.phraseDefinitionService.getDefinitionsByPhraseId(
            +phrase_id,
          );

        if (error !== ErrorType.NoError) {
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

        const { error: readError, phrase } = await this.read({
          phrase_id,
        });

        if (readError !== ErrorType.NoError) {
          return {
            error: readError,
            edges: [],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: null,
              endCursor: null,
            },
          };
        }

        phraseWithVoteListEdge.push({
          cursor: phrase_id,
          node: {
            ...phrase,
            upvotes: vote_status.upvotes,
            downvotes: vote_status.downvotes,
            definitions,
          },
        });

        endCursor = phrase_id;
        offset++;
      }

      return {
        error: ErrorType.NoError,
        edges: phraseWithVoteListEdge,
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
}
