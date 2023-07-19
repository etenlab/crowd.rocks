import { Injectable } from '@nestjs/common';

import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';

import { WordDefinitionsService } from 'src/components/definitions/word-definitions.service';
import { PhraseDefinitionsService } from 'src/components/definitions/phrase-definitions.service';

import {
  WordToPhraseTranslationReadOutput,
  WordToPhraseTranslationUpsertOutput,
} from './types';

import {
  GetWordToPhraseTranslationObjectByIdRow,
  getWordToPhraseTranslationObjById,
  callWordToPhraseTranslationUpsertProcedure,
  WordToPhraseTranslationUpsertProcedureOutputRow,
} from './sql-string';

@Injectable()
export class WordToPhraseTranslationsService {
  constructor(
    private pg: PostgresService,
    private wordDefinitionService: WordDefinitionsService,
    private phraseDefinitionService: PhraseDefinitionsService,
  ) {}

  async read(id: number): Promise<WordToPhraseTranslationReadOutput> {
    try {
      const res1 =
        await this.pg.pool.query<GetWordToPhraseTranslationObjectByIdRow>(
          ...getWordToPhraseTranslationObjById(id),
        );

      if (res1.rowCount !== 1) {
        console.error(`no word-to-phrase-translation for id: ${id}`);
      } else {
        const fromWordDefinitionOutput = await this.wordDefinitionService.read(
          res1.rows[0].from_word_definition_id,
        );

        const toPhraseDefinitionOuput = await this.phraseDefinitionService.read(
          res1.rows[0].to_phrase_definition_id,
        );

        if (fromWordDefinitionOutput.error !== ErrorType.NoError) {
          return {
            error: fromWordDefinitionOutput.error,
            word_to_phrase_translation: null,
          };
        }

        if (toPhraseDefinitionOuput.error !== ErrorType.NoError) {
          return {
            error: toPhraseDefinitionOuput.error,
            word_to_phrase_translation: null,
          };
        }

        return {
          error: ErrorType.NoError,
          word_to_phrase_translation: {
            word_to_phrase_translation_id: id + '',
            from_word_definition: fromWordDefinitionOutput.word_definition,
            to_phrase_definition: toPhraseDefinitionOuput.phrase_definition,
          },
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_to_phrase_translation: null,
    };
  }

  async upsert(
    fromWordDefinitionId: number,
    toPhraseDefinitionId: number,
    token: string,
  ): Promise<WordToPhraseTranslationUpsertOutput> {
    try {
      const res =
        await this.pg.pool.query<WordToPhraseTranslationUpsertProcedureOutputRow>(
          ...callWordToPhraseTranslationUpsertProcedure({
            fromWordDefinitionId,
            toPhraseDefinitionId,
            token,
          }),
        );

      const error = res.rows[0].p_error_type;
      const word_to_phrase_translation_id =
        res.rows[0].p_word_to_phrase_translation_id;

      if (error !== ErrorType.NoError || !word_to_phrase_translation_id) {
        return {
          error: error,
          word_to_phrase_translation: null,
        };
      }

      const wordToPhraseTranslationReadOutput = await this.read(
        word_to_phrase_translation_id,
      );

      return {
        error: wordToPhraseTranslationReadOutput.error,
        word_to_phrase_translation:
          wordToPhraseTranslationReadOutput.word_to_phrase_translation,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_to_phrase_translation: null,
    };
  }
}
