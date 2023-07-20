import { Injectable } from '@nestjs/common';

import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';
import { WordDefinitionsService } from 'src/components/definitions/word-definitions.service';

import {
  WordToWordTranslationReadOutput,
  WordToWordTranslationUpsertOutput,
} from './types';

import {
  GetWordToWordTranslationObjectByIdRow,
  getWordToWordTranslationObjById,
  callWordToWordTranslationUpsertProcedure,
  WordToWordTranslationUpsertProcedureOutputRow,
} from './sql-string';

@Injectable()
export class WordToWordTranslationsService {
  constructor(
    private pg: PostgresService,
    private wordDefinitionService: WordDefinitionsService,
  ) {}

  async read(id: number): Promise<WordToWordTranslationReadOutput> {
    try {
      const res1 =
        await this.pg.pool.query<GetWordToWordTranslationObjectByIdRow>(
          ...getWordToWordTranslationObjById(id),
        );

      if (res1.rowCount !== 1) {
        console.error(`no word-to-word-translation for id: ${id}`);
      } else {
        const fromWordDefinitionOutput = await this.wordDefinitionService.read(
          res1.rows[0].from_word_definition_id,
        );

        const toWordDefinitionOuput = await this.wordDefinitionService.read(
          res1.rows[0].to_word_definition_id,
        );

        if (fromWordDefinitionOutput.error !== ErrorType.NoError) {
          return {
            error: fromWordDefinitionOutput.error,
            word_to_word_translation: null,
          };
        }

        if (toWordDefinitionOuput.error !== ErrorType.NoError) {
          return {
            error: toWordDefinitionOuput.error,
            word_to_word_translation: null,
          };
        }

        return {
          error: ErrorType.NoError,
          word_to_word_translation: {
            word_to_word_translation_id: id + '',
            from_word_definition: fromWordDefinitionOutput.word_definition,
            to_word_definition: toWordDefinitionOuput.word_definition,
          },
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_to_word_translation: null,
    };
  }

  async upsert(
    fromWordDefinitionId: number,
    toWordDefinitionId: number,
    token: string,
  ): Promise<WordToWordTranslationUpsertOutput> {
    try {
      const res =
        await this.pg.pool.query<WordToWordTranslationUpsertProcedureOutputRow>(
          ...callWordToWordTranslationUpsertProcedure({
            fromWordDefinitionId,
            toWordDefinitionId,
            token,
          }),
        );

      const error = res.rows[0].p_error_type;
      const word_to_word_translation_id =
        res.rows[0].p_word_to_word_translation_id;

      if (error !== ErrorType.NoError || !word_to_word_translation_id) {
        return {
          error: error,
          word_to_word_translation: null,
        };
      }

      const wordToWordTranslationReadOutput = await this.read(
        word_to_word_translation_id,
      );

      return {
        error: wordToWordTranslationReadOutput.error,
        word_to_word_translation:
          wordToWordTranslationReadOutput.word_to_word_translation,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_to_word_translation: null,
    };
  }
}
