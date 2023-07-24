import { Injectable } from '@nestjs/common';

import { ErrorType } from 'src/common/types';

import { PostgresService } from 'src/core/postgres.service';
import { WordsService } from 'src/components/words/words.service';
import { PhrasesService } from 'src/components/phrases/phrases.service';

import { WordDefinitionsService } from './word-definitions.service';
import { PhraseDefinitionsService } from './phrase-definitions.service';

import {
  FromWordAndDefintionlikeStringUpsertInput,
  FromPhraseAndDefintionlikeStringUpsertInput,
  PhraseDefinitionUpsertOutput,
  WordDefinitionUpsertOutput,
  DefinitionUpdateaInput,
  DefinitionUpdateOutput,
} from './types';

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
  ): Promise<WordDefinitionUpsertOutput> {
    try {
      const wordOuptut = await this.wordService.upsert(
        {
          wordlike_string: input.wordlike_string,
          language_code: input.language_code,
          dialect_code: input.dialect_code,
          geo_code: input.geo_code,
        },
        token,
      );

      if (wordOuptut.error !== ErrorType.NoError) {
        return {
          error: wordOuptut.error,
          word_definition: null,
        };
      }

      return this.wordDefinitionService.upsert(
        {
          word_id: wordOuptut.word.word_id,
          definition: input.definitionlike_string,
        },
        token,
      );
    } catch (e) {
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
  ): Promise<PhraseDefinitionUpsertOutput> {
    try {
      const phraseOuptut = await this.phraseService.upsert(
        {
          phraselike_string: input.phraselike_string,
          language_code: input.language_code,
          dialect_code: input.dialect_code,
          geo_code: input.geo_code,
        },
        token,
      );

      if (phraseOuptut.error !== ErrorType.NoError) {
        return {
          error: phraseOuptut.error,
          phrase_definition: null,
        };
      }

      return this.phraseDefinitionService.upsert(
        {
          phrase_id: phraseOuptut.phrase.phrase_id,
          definition: input.definitionlike_string,
        },
        token,
      );
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase_definition: null,
    };
  }

  async updateDefinition(
    input: DefinitionUpdateaInput,
    token: string,
  ): Promise<DefinitionUpdateOutput> {
    try {
      if (input.definition_type_is_word) {
        const { error, word_definition } =
          await this.wordDefinitionService.update(
            {
              word_definition_id: input.definition_id,
              definitionlike_string: input.definitionlike_string,
            },
            token,
          );

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
          );

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
