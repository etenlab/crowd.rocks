import { Injectable } from '@nestjs/common';

import { ErrorType } from 'src/common/types';
import { LanguageInput } from 'src/components/common/types';

import { DefinitionsService } from 'src/components/definitions/definitions.service';

import { WordToWordTranslationsService } from './word-to-word-translations.service';
import { WordToPhraseTranslationsService } from './word-to-phrase-translations.service';
import { PhraseToWordTranslationsService } from './phrase-to-word-translations.service';
import { PhraseToPhraseTranslationsService } from './phrase-to-phrase-translations.service';

import {
  TranslationWithVoteListOutput,
  TranslationVoteStatusOutputRow,
  ToDefinitionInput,
  TranslationUpsertOutput,
} from './types';

@Injectable()
export class TranslationsService {
  constructor(
    private wordToWordTrService: WordToWordTranslationsService,
    private wordToPhraseTrService: WordToPhraseTranslationsService,
    private phraseToWordTrService: PhraseToWordTranslationsService,
    private phraseToPhraseTrService: PhraseToPhraseTranslationsService,
    private definitionService: DefinitionsService,
  ) {}

  async getTranslationsByFromDefinitionId(
    definition_id: number,
    from_definition_type_is_word: boolean,
    langInfo: LanguageInput,
  ): Promise<TranslationWithVoteListOutput> {
    try {
      if (from_definition_type_is_word) {
        const { error: wordToWordError, word_to_word_tr_with_vote_list } =
          await this.wordToWordTrService.getTranslationsByFromWordDefinitionId(
            definition_id,
            langInfo,
          );

        if (wordToWordError !== ErrorType.NoError) {
          return {
            error: wordToWordError,
            translation_with_vote_list: null,
          };
        }

        const { error: wordToPhraseError, word_to_phrase_tr_with_vote_list } =
          await this.wordToPhraseTrService.getTranslationsByFromWordDefinitionId(
            definition_id,
            langInfo,
          );

        if (wordToPhraseError !== ErrorType.NoError) {
          return {
            error: wordToPhraseError,
            translation_with_vote_list: null,
          };
        }

        return {
          error: ErrorType.NoError,
          translation_with_vote_list: [
            ...word_to_word_tr_with_vote_list,
            ...word_to_phrase_tr_with_vote_list,
          ],
        };
      } else {
        const { error: phraseToWordError, phrase_to_word_tr_with_vote_list } =
          await this.phraseToWordTrService.getTranslationsByFromPhraseDefinitionId(
            definition_id,
            langInfo,
          );

        if (phraseToWordError !== ErrorType.NoError) {
          return {
            error: phraseToWordError,
            translation_with_vote_list: null,
          };
        }

        const {
          error: phraseToPhraseError,
          phrase_to_phrase_tr_with_vote_list,
        } =
          await this.phraseToPhraseTrService.getTranslationsByFromPhraseDefinitionId(
            definition_id,
            langInfo,
          );

        if (phraseToPhraseError !== ErrorType.NoError) {
          return {
            error: phraseToPhraseError,
            translation_with_vote_list: null,
          };
        }

        return {
          error: ErrorType.NoError,
          translation_with_vote_list: [
            ...phrase_to_word_tr_with_vote_list,
            ...phrase_to_phrase_tr_with_vote_list,
          ],
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      translation_with_vote_list: null,
    };
  }

  async upsertTranslation(
    from_definition_id: number,
    from_definition_type_is_word: boolean,
    to_definition_id: number,
    to_definition_type_is_word: boolean,
    token: string,
  ): Promise<TranslationUpsertOutput> {
    try {
      if (from_definition_type_is_word) {
        if (to_definition_type_is_word) {
          const { error, word_to_word_translation } =
            await this.wordToWordTrService.upsert(
              from_definition_id,
              to_definition_id,
              token,
            );

          return {
            error: error,
            translation: word_to_word_translation,
          };
        } else {
          const { error, word_to_phrase_translation } =
            await this.wordToPhraseTrService.upsert(
              from_definition_id,
              to_definition_id,
              token,
            );

          return {
            error: error,
            translation: word_to_phrase_translation,
          };
        }
      } else {
        if (to_definition_type_is_word) {
          const { error, phrase_to_word_translation } =
            await this.phraseToWordTrService.upsert(
              from_definition_id,
              to_definition_id,
              token,
            );

          return {
            error: error,
            translation: phrase_to_word_translation,
          };
        } else {
          const { error, phrase_to_phrase_translation } =
            await this.phraseToPhraseTrService.upsert(
              from_definition_id,
              to_definition_id,
              token,
            );

          return {
            error: error,
            translation: phrase_to_phrase_translation,
          };
        }
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      translation: null,
    };
  }

  async upsertTranslationFromWordAndDefinitionlikeString(
    from_definition_id: number,
    from_definition_type_is_word: boolean,
    to_definition_input: ToDefinitionInput,
    token: string,
  ): Promise<TranslationUpsertOutput> {
    try {
      if (to_definition_input.is_type_word) {
        const { error: wordError, word_definition } =
          await this.definitionService.upsertFromWordAndDefinitionlikeString(
            {
              wordlike_string: to_definition_input.word_or_phrase,
              definitionlike_string: to_definition_input.definition,
              language_code: to_definition_input.language_code,
              dialect_code: to_definition_input.dialect_code,
              geo_code: to_definition_input.geo_code,
            },
            token,
          );

        if (wordError !== ErrorType.NoError) {
          return {
            error: wordError,
            translation: null,
          };
        }

        return this.upsertTranslation(
          from_definition_id,
          from_definition_type_is_word,
          +word_definition.word_definition_id,
          true,
          token,
        );
      } else {
        const { error: phraseError, phrase_definition } =
          await this.definitionService.upsertFromPhraseAndDefinitionlikeString(
            {
              phraselike_string: to_definition_input.word_or_phrase,
              definitionlike_string: to_definition_input.definition,
              language_code: to_definition_input.language_code,
              dialect_code: to_definition_input.dialect_code,
              geo_code: to_definition_input.geo_code,
            },
            token,
          );

        if (phraseError !== ErrorType.NoError) {
          return {
            error: phraseError,
            translation: null,
          };
        }

        return this.upsertTranslation(
          from_definition_id,
          from_definition_type_is_word,
          +phrase_definition.phrase_definition_id,
          false,
          token,
        );
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      translation: null,
    };
  }

  async toggleTranslationVoteStatus(
    translation_id: number,
    from_definition_type_is_word: boolean,
    to_definition_type_is_word: boolean,
    vote: boolean,
    token: string,
  ): Promise<TranslationVoteStatusOutputRow> {
    try {
      if (from_definition_type_is_word) {
        if (to_definition_type_is_word) {
          const { error: wordToWordVoteError, vote_status } =
            await this.wordToWordTrService.toggleVoteStatus(
              translation_id + '',
              vote,
              token,
            );

          return {
            error: wordToWordVoteError,
            translation_vote_status: vote_status,
          };
        } else {
          const { error: wordToPhraseVoteError, vote_status } =
            await this.wordToPhraseTrService.toggleVoteStatus(
              translation_id,
              vote,
              token,
            );

          return {
            error: wordToPhraseVoteError,
            translation_vote_status: vote_status,
          };
        }
      } else {
        if (to_definition_type_is_word) {
          const { error: phraseToWordVoteError, vote_status } =
            await this.phraseToWordTrService.toggleVoteStatus(
              translation_id,
              vote,
              token,
            );

          return {
            error: phraseToWordVoteError,
            translation_vote_status: vote_status,
          };
        } else {
          const { error: phraseToPhraseVoteError, vote_status } =
            await this.phraseToPhraseTrService.toggleVoteStatus(
              translation_id,
              vote,
              token,
            );

          return {
            error: phraseToPhraseVoteError,
            translation_vote_status: vote_status,
          };
        }
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      translation_vote_status: null,
    };
  }
}
