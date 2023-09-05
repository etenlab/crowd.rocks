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
