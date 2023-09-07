import { Injectable } from '@nestjs/common';

import { ErrorType } from 'src/common/types';

import { getPgClient } from 'src/common/utility';

import { PostgresService } from 'src/core/postgres.service';
import { WordsService } from 'src/components/words/words.service';
import { PhrasesService } from 'src/components/phrases/phrases.service';

import { WordDefinitionsService } from './word-definitions.service';
import { PhraseDefinitionsService } from './phrase-definitions.service';

import {
  FromWordAndDefintionlikeStringUpsertInput,
  FromPhraseAndDefintionlikeStringUpsertInput,
  PhraseDefinitionOutput,
  WordDefinitionOutput,
  DefinitionUpdateaInput,
  DefinitionUpdateOutput,
  WordDefinitionsOutput,
  PhraseDefinitionsOutput,
  WordDefinition,
  PhraseDefinition,
} from './types';
import { PoolClient } from 'pg';

@Injectable()
export class DefinitionsService {
  constructor(
    private pg: PostgresService,
    private wordService: WordsService,
    private phraseService: PhrasesService,
    private wordDefinitionService: WordDefinitionsService,
    private phraseDefinitionService: PhraseDefinitionsService,
  ) {}

  async upsertFromWordAndDefinitionlikeString(
    input: FromWordAndDefintionlikeStringUpsertInput,
    token: string,
    poolClient: PoolClient | null,
  ): Promise<WordDefinitionOutput> {
    const {
      client: pgClient,
      beginTransaction,
      commitTransaction,
      rollbackTransaction,
    } = await getPgClient({
      client: poolClient,
      pool: this.pg.pool,
    });

    try {
      await beginTransaction();

      const wordOuptut = await this.wordService.upsert(
        {
          wordlike_string: input.wordlike_string,
          language_code: input.language_code,
          dialect_code: input.dialect_code,
          geo_code: input.geo_code,
        },
        token,
        pgClient,
      );

      if (wordOuptut.error !== ErrorType.NoError || !wordOuptut.word) {
        await rollbackTransaction();
        return {
          error: wordOuptut.error,
          word_definition: null,
        };
      }

      const result = this.wordDefinitionService.upsert(
        {
          word_id: wordOuptut.word.word_id,
          definition: input.definitionlike_string,
        },
        token,
        pgClient,
      );

      await commitTransaction();

      return result;
    } catch (e) {
      await rollbackTransaction();
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_definition: null,
    };
  }

  async batchUpsertFromWordAndDefinitionlikeString(
    input: FromWordAndDefintionlikeStringUpsertInput[],
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
      const { error: wordError, words } = await this.wordService.upserts(
        input.map((item) => ({
          wordlike_string: item.wordlike_string,
          language_code: item.language_code,
          dialect_code: item.dialect_code,
          geo_code: item.geo_code,
        })),
        token,
        pgClient,
      );

      if (wordError !== ErrorType.NoError) {
        return {
          error: wordError,
          word_definitions: [],
        };
      }

      const wordsMap = new Map<string, number>();

      words.forEach((word) =>
        word ? wordsMap.set(word.word, +word.word_id) : null,
      );

      const definitionUpsertsInput: {
        word_id: number;
        definition: string;
      }[] = [];

      for (let i = 0; i < input.length; i++) {
        const word_id = wordsMap.get(input[i].wordlike_string) || null;
        const definition = input[i].definitionlike_string;

        if (word_id === null) {
          continue;
        }

        definitionUpsertsInput.push({
          word_id,
          definition,
        });
      }

      const { error, word_definitions } =
        await this.wordDefinitionService.upserts(
          definitionUpsertsInput,
          token,
          pgClient,
        );

      const wordDefinitionsMap = new Map<string, WordDefinition>();

      word_definitions.forEach((word_definition) =>
        word_definition
          ? wordDefinitionsMap.set(
              `${word_definition.word.word}-${word_definition.definition}`,
              word_definition,
            )
          : null,
      );

      return {
        error,
        word_definitions: input.map(
          (item) =>
            wordDefinitionsMap.get(
              `${item.wordlike_string}-${item.definitionlike_string}`,
            ) || null,
        ),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_definitions: [],
    };
  }

  async upsertFromPhraseAndDefinitionlikeString(
    input: FromPhraseAndDefintionlikeStringUpsertInput,
    token: string,
    poolClient: PoolClient | null,
  ): Promise<PhraseDefinitionOutput> {
    const {
      client: pgClient,
      beginTransaction,
      commitTransaction,
      rollbackTransaction,
    } = await getPgClient({
      client: poolClient,
      pool: this.pg.pool,
    });

    try {
      await beginTransaction();

      const phraseOuptut = await this.phraseService.upsert(
        {
          phraselike_string: input.phraselike_string,
          language_code: input.language_code,
          dialect_code: input.dialect_code,
          geo_code: input.geo_code,
        },
        token,
        pgClient,
      );

      if (phraseOuptut.error !== ErrorType.NoError || !phraseOuptut.phrase) {
        await rollbackTransaction();

        return {
          error: phraseOuptut.error,
          phrase_definition: null,
        };
      }

      const result = await this.phraseDefinitionService.upsert(
        {
          phrase_id: phraseOuptut.phrase.phrase_id,
          definition: input.definitionlike_string,
        },
        token,
        pgClient,
      );

      await commitTransaction();

      return result;
    } catch (e) {
      console.error(e);
      await rollbackTransaction();
    }

    return {
      error: ErrorType.UnknownError,
      phrase_definition: null,
    };
  }

  async batchUpsertFromPhraseAndDefinitionlikeString(
    input: FromPhraseAndDefintionlikeStringUpsertInput[],
    token: string,
    pgClient: PoolClient | null,
  ): Promise<PhraseDefinitionsOutput> {
    if (input.length === 0) {
      return {
        error: ErrorType.NoError,
        phrase_definitions: [],
      };
    }

    try {
      const { error: phraseError, phrases } = await this.phraseService.upserts(
        input.map((item) => ({
          phraselike_string: item.phraselike_string,
          language_code: item.language_code,
          dialect_code: item.dialect_code,
          geo_code: item.geo_code,
        })),
        token,
        pgClient,
      );

      if (phraseError !== ErrorType.NoError) {
        return {
          error: phraseError,
          phrase_definitions: [],
        };
      }

      const phrasesMap = new Map<string, number>();

      phrases.forEach((phrase) =>
        phrase ? phrasesMap.set(phrase.phrase, +phrase.phrase_id) : null,
      );

      const definitionUpsertsInput: {
        phrase_id: number;
        definition: string;
      }[] = [];

      for (let i = 0; i < input.length; i++) {
        const phrase_id = phrasesMap.get(input[i].phraselike_string) || null;
        const definition = input[i].definitionlike_string;

        if (phrase_id === null) {
          continue;
        }

        definitionUpsertsInput.push({
          phrase_id,
          definition,
        });
      }

      const { error, phrase_definitions } =
        await this.phraseDefinitionService.upserts(
          definitionUpsertsInput,
          token,
          pgClient,
        );

      const phraseDefinitionsMap = new Map<string, PhraseDefinition>();

      phrase_definitions.forEach((phrase_definition) =>
        phrase_definition
          ? phraseDefinitionsMap.set(
              `${phrase_definition.phrase.phrase}-${phrase_definition.definition}`,
              phrase_definition,
            )
          : null,
      );

      return {
        error,
        phrase_definitions: input.map(
          (item) =>
            phraseDefinitionsMap.get(
              `${item.phraselike_string}-${item.definitionlike_string}`,
            ) || null,
        ),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase_definitions: [],
    };
  }

  async updateDefinition(
    input: DefinitionUpdateaInput,
    token: string,
    poolClient: PoolClient | null,
  ): Promise<DefinitionUpdateOutput> {
    const {
      client: pgClient,
      beginTransaction,
      commitTransaction,
      rollbackTransaction,
    } = await getPgClient({
      client: poolClient,
      pool: this.pg.pool,
    });

    try {
      await beginTransaction();

      if (input.definition_type_is_word) {
        const { error, word_definition } =
          await this.wordDefinitionService.update(
            {
              word_definition_id: input.definition_id,
              definitionlike_string: input.definitionlike_string,
            },
            token,
            pgClient,
          );

        if (error !== ErrorType.NoError) {
          await rollbackTransaction();

          return {
            error,
            word_definition: null,
            phrase_definition: null,
          };
        }

        await commitTransaction();

        return {
          error: error,
          word_definition: word_definition,
          phrase_definition: null,
        };
      } else {
        const { error, phrase_definition } =
          await this.phraseDefinitionService.update(
            {
              phrase_definition_id: input.definition_id,
              definitionlike_string: input.definitionlike_string,
            },
            token,
            pgClient,
          );

        if (error !== ErrorType.NoError) {
          await rollbackTransaction();

          return {
            error,
            word_definition: null,
            phrase_definition: null,
          };
        }

        await commitTransaction();

        return {
          error: error,
          word_definition: null,
          phrase_definition: phrase_definition,
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase_definition: null,
      word_definition: null,
    };
  }
}
