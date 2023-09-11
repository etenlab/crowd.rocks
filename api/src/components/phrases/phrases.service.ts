import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PoolClient } from 'pg';

import { pgClientOrPool } from 'src/common/utility';

import { ErrorType, GenericOutput } from 'src/common/types';

import { PostgresService } from 'src/core/postgres.service';
import { WordsService } from 'src/components/words/words.service';
import { PhraseVotesService } from './phrase-votes.service';
import { PhraseDefinitionsService } from 'src/components/definitions/phrase-definitions.service';

import {
  PhraseWithVote,
  PhraseReadInput,
  PhraseOutput,
  PhrasesOutput,
  PhraseUpsertInput,
  PhraseWithVoteListOutput,
  PhraseWithVoteListConnection,
  PhraseWithVoteOutput,
  Phrase,
} from './types';
import { WordUpsertInput } from 'src/components/words/types';
import { LanguageInput } from 'src/components/common/types';
import { PhraseDefinition } from 'src/components/definitions/types';

import {
  GetPhraseObjByIdResultRow,
  getPhraseObjByIds,
  callPhraseUpsertProcedure,
  PhraseUpsertProcedureOutputRow,
  callPhraseUpsertsProcedure,
  PhraseUpsertsProcedureOutput,
  GetPhraseListByLang,
  getPhraseListByLang,
} from './sql-string';

@Injectable()
export class PhrasesService {
  constructor(
    private pg: PostgresService,
    private wordService: WordsService,
    private phraseVoteService: PhraseVotesService,
    @Inject(forwardRef(() => PhraseDefinitionsService))
    private phraseDefinitionService: PhraseDefinitionsService,
  ) {}

  async read(
    input: PhraseReadInput,
    pgClient: PoolClient | null,
  ): Promise<PhraseOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetPhraseObjByIdResultRow>(
        ...getPhraseObjByIds([+input.phrase_id]),
      );

      if (res.rowCount === 0) {
        console.error(`no phrase for id: ${input.phrase_id}`);

        return {
          error: ErrorType.PhraseNotFound,
          phrase: null,
        };
      } else {
        return {
          error: ErrorType.NoError,
          phrase: {
            phrase_id: input.phrase_id,
            phrase: res.rows[0].phrase,
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
      phrase: null,
    };
  }

  async reads(
    ids: number[],
    pgClient: PoolClient | null,
  ): Promise<PhrasesOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetPhraseObjByIdResultRow>(...getPhraseObjByIds(ids));

      const phrasesMap = new Map<string, Phrase>();

      res.rows.forEach((row) =>
        phrasesMap.set(row.phrase_id, {
          phrase_id: row.phrase_id,
          phrase: row.phrase,
          language_code: row.language_code,
          dialect_code: row.dialect_code,
          geo_code: row.geo_code,
        }),
      );

      return {
        error: ErrorType.NoError,
        phrases: ids.map((id) => {
          const phrase = phrasesMap.get(id + '');

          return phrase ? phrase : null;
        }),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrases: [],
    };
  }

  async upsert(
    input: PhraseUpsertInput,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<PhraseOutput> {
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
          pgClient,
        );

        if (res.error !== ErrorType.NoError || !res.word) {
          return {
            error: res.error,
            phrase: null,
          };
        }

        wordIds.push(+res.word.word_id);
      }

      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<PhraseUpsertProcedureOutputRow>(
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
        await this.read({ phrase_id: phrase_id + '' }, pgClient)
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

  async upserts(
    input: {
      phraselike_string: string;
      language_code: string;
      dialect_code: string | null;
      geo_code: string | null;
    }[],
    token: string,
    pgClient: PoolClient | null,
  ): Promise<PhrasesOutput> {
    if (input.length === 0) {
      return {
        error: ErrorType.NoError,
        phrases: [],
      };
    }

    try {
      const wordlikeStrings_list = input
        .map((item) => item.phraselike_string)
        .map((phraselike_string) => {
          return phraselike_string.split(' ').filter((w) => w !== '');
        });

      const wordUpserInput: {
        wordlike_string: string;
        language_code: string;
        dialect_code: string | null;
        geo_code: string | null;
      }[] = [];

      for (let i = 0; i < input.length; i++) {
        wordUpserInput.push(
          ...wordlikeStrings_list[i].map((wordlikeString) => ({
            wordlike_string: wordlikeString,
            language_code: input[i].language_code,
            dialect_code: input[i].dialect_code,
            geo_code: input[i].geo_code,
          })),
        );
      }

      const { error: wordsError, words } = await this.wordService.upserts(
        wordUpserInput,
        token,
        pgClient,
      );

      if (wordsError !== ErrorType.NoError) {
        return {
          error: wordsError,
          phrases: [],
        };
      }

      const wordsMap = new Map<string, number>();

      words.forEach((word) =>
        word ? wordsMap.set(word.word, +word.word_id) : null,
      );

      const phraseUpsertsInput: {
        phraselike_string: string;
        word_ids: (number | null)[];
        language_code: string;
        dialect_code: string | null;
        geo_code: string | null;
      }[] = [];

      for (let i = 0; i < input.length; i++) {
        phraseUpsertsInput.push({
          phraselike_string: input[i].phraselike_string,
          word_ids: input[i].phraselike_string
            .split(' ')
            .filter((w) => w !== '')
            .map((wordlikeString) => wordsMap.get(wordlikeString) || null),
          language_code: input[i].language_code,
          dialect_code: input[i].dialect_code,
          geo_code: input[i].geo_code,
        });
      }

      const validInputs = phraseUpsertsInput.filter(
        (item) => !item.word_ids.find((word_id) => word_id === null),
      );

      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<PhraseUpsertsProcedureOutput>(
        ...callPhraseUpsertsProcedure({
          phraselike_strings: validInputs.map((item) => item.phraselike_string),
          wordIds_list: validInputs.map((item) => item.word_ids as number[]),
          token: token,
        }),
      );

      const error = res.rows[0].p_error_type;
      const errors = res.rows[0].p_error_types;
      const phrase_ids = res.rows[0].p_phrase_ids;

      if (error !== ErrorType.NoError) {
        return {
          error,
          phrases: [],
        };
      }

      const ids: { phrase_id: string; error: ErrorType }[] = [];

      for (let i = 0; i < phrase_ids.length; i++) {
        ids.push({ phrase_id: phrase_ids[i], error: errors[i] });
      }

      const { error: readingError, phrases } = await this.reads(
        ids
          .filter((id) => id.error === ErrorType.NoError)
          .map((id) => +id.phrase_id),
        pgClient,
      );

      const phrasesMap = new Map<string, Phrase>();

      phrases.forEach((phrase) =>
        phrase ? phrasesMap.set(phrase.phrase, phrase) : null,
      );

      return {
        error: readingError,
        phrases: input.map(
          (item) => phrasesMap.get(item.phraselike_string) || null,
        ),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrases: [],
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
          word_ids: [],
        };
      }
      return {
        error,
        phrase_id: +phrase_id,
        word_ids,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase_id: null,
      word_ids: [],
    };
  }

  async getPhraseWithVoteById(
    phrase_id: number,
    pgClient: PoolClient | null,
  ): Promise<PhraseWithVoteOutput> {
    try {
      const { error, vote_status } = await this.phraseVoteService.getVoteStatus(
        phrase_id,
        pgClient,
      );

      if (error !== ErrorType.NoError || !vote_status) {
        return {
          error,
          phrase_with_vote: null,
        };
      }

      const { error: readError, phrase } = await this.read(
        {
          phrase_id: phrase_id + '',
        },
        pgClient,
      );

      if (readError !== ErrorType.NoError || !phrase) {
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

  async getPhraseWithVoteByIds(
    phraseIds: number[],
    pgClient: PoolClient | null,
  ): Promise<PhraseWithVoteListOutput> {
    try {
      const { error, vote_status_list } =
        await this.phraseVoteService.getVoteStatusFromIds(phraseIds, pgClient);

      if (error !== ErrorType.NoError) {
        return {
          error,
          phrase_with_vote_list: [],
        };
      }

      const { error: readError, phrases } = await this.reads(
        phraseIds,
        pgClient,
      );

      if (readError !== ErrorType.NoError) {
        return {
          error: readError,
          phrase_with_vote_list: [],
        };
      }

      return {
        error,
        phrase_with_vote_list: phraseIds.map((_phraseId, index) => {
          const vote_status = vote_status_list[index];
          const phrase = phrases[index];

          if (!vote_status || !phrase) {
            return null;
          }

          return {
            ...phrase,
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
      phrase_with_vote_list: [],
    };
  }

  async getPhrasesByLanguage(
    input: LanguageInput,
    first: number | null,
    after: string | null,
    pgClient: PoolClient | null,
  ): Promise<PhraseWithVoteListConnection> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetPhraseListByLang>(
        ...getPhraseListByLang({
          ...input,
        }),
      );

      let offset: number | null = null;
      let hasNextPage = false;
      let startCursor: string | null = null;
      let endCursor: string | null = null;

      const phraseIds: number[] = [];

      for (let i = 0; i < res.rowCount; i++) {
        const { phrase_id } = res.rows[i];

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

        if (first !== null && offset! >= first) {
          hasNextPage = true;
          break;
        }

        phraseIds.push(+phrase_id);

        endCursor = phrase_id;
        offset!++;
      }

      const { error, phrase_with_vote_list } =
        await this.getPhraseWithVoteByIds(phraseIds, pgClient);

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

      const { error: definitionError, phrase_definition_list } =
        await this.phraseDefinitionService.getPhraseDefinitionsByPhraseIds(
          phraseIds,
          pgClient,
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

      const phraseDefinitionMap = new Map<string, PhraseDefinition[]>();

      phrase_definition_list.forEach((phrase_definition) => {
        if (!phrase_definition) {
          return;
        }

        const phrase_id = phrase_definition.phrase.phrase_id;
        const phraseDefinitions = phraseDefinitionMap.get(phrase_id);

        if (phraseDefinitions === undefined) {
          phraseDefinitionMap.set(phrase_id, [phrase_definition]);
        } else {
          phraseDefinitions.push(phrase_definition);
        }
      });

      return {
        error: ErrorType.NoError,
        edges: phrase_with_vote_list
          .filter((phraseWithVote) => phraseWithVote)
          .map((phraseWithVote: PhraseWithVote) => {
            const phraseDefinition = phraseDefinitionMap.get(
              phraseWithVote.phrase_id,
            );

            return {
              cursor: phraseWithVote.phrase_id,
              node: {
                ...phraseWithVote,
                definitions: phraseDefinition || [],
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

  getDiscussionTitle = async (id: string): Promise<string> => {
    const phrase = await this.getPhraseWithVoteById(Number(id), null);
    if (phrase.error !== ErrorType.NoError || phrase.phrase_with_vote == null) {
      console.error(phrase.error);
      return 'Phrase Book: ';
    }
    return `Phrase Book : ${phrase.phrase_with_vote.phrase}`;
  };
}
