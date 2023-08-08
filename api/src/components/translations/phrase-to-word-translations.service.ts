import { Injectable } from '@nestjs/common';

import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';
import { PhraseDefinitionsService } from 'src/components/definitions/phrase-definitions.service';
import { WordDefinitionsService } from 'src/components/definitions/word-definitions.service';

import {
  PhraseToWordTranslationReadOutput,
  PhraseToWordTranslationUpsertOutput,
  PhraseToWordVoteStatusOutputRow,
} from './types';

import {
  GetPhraseToWordTranslationObjectByIdRow,
  getPhraseToWordTranslationObjById,
  callPhraseToWordTranslationUpsertProcedure,
  PhraseToWordTranslationUpsertProcedureOutputRow,
  GetPhraseToWordTranslationVoteStatus,
  getPhraseToWordTranslationVoteStatus,
  TogglePhraseToWordTranslationVoteStatus,
  togglePhraseToWordTranslationVoteStatus,
} from './sql-string';

@Injectable()
export class PhraseToWordTranslationsService {
  constructor(
    private pg: PostgresService,
    private wordDefinitionService: WordDefinitionsService,
    private phraseDefinitionService: PhraseDefinitionsService,
  ) {}

  async read(id: number): Promise<PhraseToWordTranslationReadOutput> {
    try {
      const res1 =
        await this.pg.pool.query<GetPhraseToWordTranslationObjectByIdRow>(
          ...getPhraseToWordTranslationObjById(id),
        );

      if (res1.rowCount !== 1) {
        console.error(`no phrase-to-phrase-translation for id: ${id}`);
      } else {
        const fromPhraseDefinitionOutput =
          await this.phraseDefinitionService.read(
            res1.rows[0].from_phrase_definition_id,
          );

        const toWordDefinitionOuput = await this.wordDefinitionService.read(
          res1.rows[0].to_word_definition_id,
        );

        if (fromPhraseDefinitionOutput.error !== ErrorType.NoError) {
          return {
            error: fromPhraseDefinitionOutput.error,
            phrase_to_word_translation: null,
          };
        }

        if (toWordDefinitionOuput.error !== ErrorType.NoError) {
          return {
            error: toWordDefinitionOuput.error,
            phrase_to_word_translation: null,
          };
        }

        return {
          error: ErrorType.NoError,
          phrase_to_word_translation: {
            phrase_to_word_translation_id: id + '',
            from_phrase_definition:
              fromPhraseDefinitionOutput.phrase_definition,
            to_word_definition: toWordDefinitionOuput.word_definition,
          },
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase_to_word_translation: null,
    };
  }

  async upsert(
    fromPhraseDefinitionId: number,
    toWordDefinitionId: number,
    token: string,
  ): Promise<PhraseToWordTranslationUpsertOutput> {
    try {
      const res =
        await this.pg.pool.query<PhraseToWordTranslationUpsertProcedureOutputRow>(
          ...callPhraseToWordTranslationUpsertProcedure({
            fromPhraseDefinitionId,
            toWordDefinitionId,
            token,
          }),
        );

      const error = res.rows[0].p_error_type;
      const phrase_to_word_translation_id =
        res.rows[0].p_phrase_to_word_translation_id;

      if (error !== ErrorType.NoError || !phrase_to_word_translation_id) {
        return {
          error: error,
          phrase_to_word_translation: null,
        };
      }

      const phraseToWordTranslationReadOutput = await this.read(
        phrase_to_word_translation_id,
      );

      return {
        error: phraseToWordTranslationReadOutput.error,
        phrase_to_word_translation:
          phraseToWordTranslationReadOutput.phrase_to_word_translation,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase_to_word_translation: null,
    };
  }

  async getVoteStatus(
    phrase_to_word_translation_id: number,
  ): Promise<PhraseToWordVoteStatusOutputRow> {
    try {
      const res1 =
        await this.pg.pool.query<GetPhraseToWordTranslationVoteStatus>(
          ...getPhraseToWordTranslationVoteStatus(
            phrase_to_word_translation_id,
          ),
        );

      if (res1.rowCount !== 1) {
        return {
          error: ErrorType.NoError,
          vote_status: {
            phrase_to_word_translation_id: phrase_to_word_translation_id + '',
            upvotes: 0,
            downvotes: 0,
          },
        };
      } else {
        return {
          error: ErrorType.NoError,
          vote_status: {
            phrase_to_word_translation_id:
              res1.rows[0].phrase_to_word_translation_id + '',
            upvotes: res1.rows[0].upvotes,
            downvotes: res1.rows[0].downvotes,
          },
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      vote_status: null,
    };
  }

  async toggleVoteStatus(
    phrase_to_word_translation_id: number,
    vote: boolean,
    token: string,
  ): Promise<PhraseToWordVoteStatusOutputRow> {
    try {
      const res1 =
        await this.pg.pool.query<TogglePhraseToWordTranslationVoteStatus>(
          ...togglePhraseToWordTranslationVoteStatus({
            phrase_to_word_translation_id,
            vote,
            token,
          }),
        );

      const creatingError = res1.rows[0].p_error_type;
      const phrase_to_word_translations_vote_id =
        res1.rows[0].p_phrase_to_word_translations_vote_id;

      if (
        creatingError !== ErrorType.NoError ||
        !phrase_to_word_translations_vote_id
      ) {
        return {
          error: creatingError,
          vote_status: null,
        };
      }

      return this.getVoteStatus(phrase_to_word_translation_id);
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      vote_status: null,
    };
  }
}
