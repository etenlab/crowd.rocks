import { Injectable } from '@nestjs/common';

import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';
import { PhraseDefinitionsService } from 'src/components/definitions/phrase-definitions.service';

import {
  PhraseToPhraseTranslationReadOutput,
  PhraseToPhraseTranslationUpsertOutput,
} from './types';

import {
  GetPhraseToPhraseTranslationObjectByIdRow,
  getPhraseToPhraseTranslationObjById,
  callPhraseToPhraseTranslationUpsertProcedure,
  PhraseToPhraseTranslationUpsertProcedureOutputRow,
} from './sql-string';

@Injectable()
export class PhraseToPhraseTranslationsService {
  constructor(
    private pg: PostgresService,
    private phraseDefinitionService: PhraseDefinitionsService,
  ) {}

  async read(id: number): Promise<PhraseToPhraseTranslationReadOutput> {
    try {
      const res1 =
        await this.pg.pool.query<GetPhraseToPhraseTranslationObjectByIdRow>(
          ...getPhraseToPhraseTranslationObjById(id),
        );

      if (res1.rowCount !== 1) {
        console.error(`no phrase-to-phrase-translation for id: ${id}`);
      } else {
        const fromPhraseDefinitionOutput =
          await this.phraseDefinitionService.read(
            res1.rows[0].from_phrase_definition_id,
          );

        const toPhraseDefinitionOuput = await this.phraseDefinitionService.read(
          res1.rows[0].to_phrase_definition_id,
        );

        if (fromPhraseDefinitionOutput.error !== ErrorType.NoError) {
          return {
            error: fromPhraseDefinitionOutput.error,
            phrase_to_phrase_translation: null,
          };
        }

        if (toPhraseDefinitionOuput.error !== ErrorType.NoError) {
          return {
            error: toPhraseDefinitionOuput.error,
            phrase_to_phrase_translation: null,
          };
        }

        return {
          error: ErrorType.NoError,
          phrase_to_phrase_translation: {
            phrase_to_phrase_translation_id: id + '',
            from_phrase_definition:
              fromPhraseDefinitionOutput.phrase_definition,
            to_phrase_definition: toPhraseDefinitionOuput.phrase_definition,
          },
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase_to_phrase_translation: null,
    };
  }

  async upsert(
    fromPhraseDefinitionId: number,
    toPhraseDefinitionId: number,
    token: string,
  ): Promise<PhraseToPhraseTranslationUpsertOutput> {
    try {
      const res =
        await this.pg.pool.query<PhraseToPhraseTranslationUpsertProcedureOutputRow>(
          ...callPhraseToPhraseTranslationUpsertProcedure({
            fromPhraseDefinitionId,
            toPhraseDefinitionId,
            token,
          }),
        );

      const error = res.rows[0].p_error_type;
      const phrase_to_phrase_translation_id =
        res.rows[0].p_phrase_to_phrase_translation_id;

      if (error !== ErrorType.NoError || !phrase_to_phrase_translation_id) {
        return {
          error: error,
          phrase_to_phrase_translation: null,
        };
      }

      const phraseToPhraseTranslationReadOutput = await this.read(
        phrase_to_phrase_translation_id,
      );

      return {
        error: phraseToPhraseTranslationReadOutput.error,
        phrase_to_phrase_translation:
          phraseToPhraseTranslationReadOutput.phrase_to_phrase_translation,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase_to_phrase_translation: null,
    };
  }
}