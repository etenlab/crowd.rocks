import { Injectable } from '@nestjs/common';

import { ErrorType } from 'src/common/types';
import { LanguageInput } from 'src/components/common/types';

import { PostgresService } from 'src/core/postgres.service';
import { PhraseDefinitionsService } from 'src/components/definitions/phrase-definitions.service';

import {
  PhraseToPhraseTranslationReadOutput,
  PhraseToPhraseTranslationUpsertOutput,
  PhraseToPhraseTranslationVoteStatusOutputRow,
  PhraseToPhraseTranslationWithVote,
  PhraseToPhraseTranslationWithVoteListOutput,
} from './types';

import {
  GetPhraseToPhraseTranslationObjectByIdRow,
  getPhraseToPhraseTranslationObjById,
  callPhraseToPhraseTranslationUpsertProcedure,
  PhraseToPhraseTranslationUpsertProcedureOutputRow,
  GetPhraseToPhraseTranslationVoteStatus,
  getPhraseToPhraseTranslationVoteStatus,
  TogglePhraseToPhraseTranslationVoteStatus,
  togglePhraseToPhraseTranslationVoteStatus,
  GetPhraseToPhraseTranslationListByFromPhraseDefinitionId,
  getPhraseToPhraseTranslationListByFromPhraseDefinitionId,
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
  async getVoteStatus(
    phrase_to_phrase_translation_id: number,
  ): Promise<PhraseToPhraseTranslationVoteStatusOutputRow> {
    try {
      const res1 =
        await this.pg.pool.query<GetPhraseToPhraseTranslationVoteStatus>(
          ...getPhraseToPhraseTranslationVoteStatus(
            phrase_to_phrase_translation_id,
          ),
        );

      if (res1.rowCount !== 1) {
        return {
          error: ErrorType.NoError,
          vote_status: {
            phrase_to_phrase_translation_id:
              phrase_to_phrase_translation_id + '',
            upvotes: 0,
            downvotes: 0,
          },
        };
      } else {
        return {
          error: ErrorType.NoError,
          vote_status: {
            phrase_to_phrase_translation_id:
              res1.rows[0].phrase_to_phrase_translation_id + '',
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
    phrase_to_phrase_translation_id: number,
    vote: boolean,
    token: string,
  ): Promise<PhraseToPhraseTranslationVoteStatusOutputRow> {
    try {
      const res1 =
        await this.pg.pool.query<TogglePhraseToPhraseTranslationVoteStatus>(
          ...togglePhraseToPhraseTranslationVoteStatus({
            phrase_to_phrase_translation_id,
            vote,
            token,
          }),
        );

      const creatingError = res1.rows[0].p_error_type;
      const phrase_to_phrase_translations_vote_id =
        res1.rows[0].p_phrase_to_phrase_translations_vote_id;

      if (
        creatingError !== ErrorType.NoError ||
        !phrase_to_phrase_translations_vote_id
      ) {
        return {
          error: creatingError,
          vote_status: null,
        };
      }

      return this.getVoteStatus(phrase_to_phrase_translation_id);
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      vote_status: null,
    };
  }

  async getTranslationsByFromPhraseDefinitionId(
    from_phrase_definition_id: number,
    langInfo: LanguageInput,
  ): Promise<PhraseToPhraseTranslationWithVoteListOutput> {
    try {
      const res =
        await this.pg.pool.query<GetPhraseToPhraseTranslationListByFromPhraseDefinitionId>(
          ...getPhraseToPhraseTranslationListByFromPhraseDefinitionId({
            from_phrase_definition_id,
            language_code: langInfo.language_code,
            dialect_code: langInfo.dialect_code,
            geo_code: langInfo.geo_code,
          }),
        );

      const phraseToPhraseTrWithVoteList: PhraseToPhraseTranslationWithVote[] =
        [];

      for (let i = 0; i < res.rowCount; i++) {
        const { phrase_to_phrase_translation_id } = res.rows[i];
        const { error, phrase_to_phrase_translation } = await this.read(
          phrase_to_phrase_translation_id,
        );

        if (error !== ErrorType.NoError) {
          return {
            error,
            phrase_to_phrase_tr_with_vote_list: [],
          };
        }

        const { error: voteError, vote_status } = await this.getVoteStatus(
          phrase_to_phrase_translation_id,
        );

        if (voteError !== ErrorType.NoError) {
          return {
            error: voteError,
            phrase_to_phrase_tr_with_vote_list: [],
          };
        }

        phraseToPhraseTrWithVoteList.push({
          ...phrase_to_phrase_translation,
          upvotes: vote_status.upvotes,
          downvotes: vote_status.downvotes,
        });
      }

      return {
        error: ErrorType.NoError,
        phrase_to_phrase_tr_with_vote_list: phraseToPhraseTrWithVoteList,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase_to_phrase_tr_with_vote_list: [],
    };
  }
}
