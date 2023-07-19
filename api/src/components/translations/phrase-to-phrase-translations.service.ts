import { Injectable } from '@nestjs/common';

import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';
import { PhrasesService } from 'src/components/phrases/phrases.service';

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
    private phraseService: PhrasesService,
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
        const fromPhraseOutput = await this.phraseService.read({
          phrase_id: res1.rows[0].from_phrase + '',
        });

        const toPhraseOuput = await this.phraseService.read({
          phrase_id: res1.rows[0].to_phrase + '',
        });

        if (fromPhraseOutput.error !== ErrorType.NoError) {
          return {
            error: fromPhraseOutput.error,
            phrase_to_phrase_translation: null,
          };
        }

        if (toPhraseOuput.error !== ErrorType.NoError) {
          return {
            error: toPhraseOuput.error,
            phrase_to_phrase_translation: null,
          };
        }

        return {
          error: ErrorType.NoError,
          phrase_to_phrase_translation: {
            phrase_to_phrase_translation_id: id + '',
            from_phrase: fromPhraseOutput.phrase,
            to_phrase: toPhraseOuput.phrase,
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
    fromPhrase: number,
    toPhrase: number,
    token: string,
  ): Promise<PhraseToPhraseTranslationUpsertOutput> {
    try {
      const res =
        await this.pg.pool.query<PhraseToPhraseTranslationUpsertProcedureOutputRow>(
          ...callPhraseToPhraseTranslationUpsertProcedure({
            fromPhrase,
            toPhrase,
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
