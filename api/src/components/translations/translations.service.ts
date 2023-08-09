import { Injectable } from '@nestjs/common';

import { ErrorType } from 'src/common/types';
import { LanguageInput } from 'src/components/common/types';

import { WordToWordTranslationsService } from './word-to-word-translations.service';
import { WordToPhraseTranslationsService } from './word-to-phrase-translations.service';
import { PhraseToWordTranslationsService } from './phrase-to-word-translations.service';
import { PhraseToPhraseTranslationsService } from './phrase-to-phrase-translations.service';

import { TranslationWithVoteListOutput } from './types';

@Injectable()
export class TranslationsService {
  constructor(
    private wordToWordTrService: WordToWordTranslationsService,
    private wordToPhraseTrService: WordToPhraseTranslationsService,
    private phraseToWordTrService: PhraseToWordTranslationsService,
    private phraseToPhraseTrService: PhraseToPhraseTranslationsService,
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

        if (wordToWordError === ErrorType.NoError) {
          return {
            error: wordToWordError,
            word_to_word_tr_with_vote_list: [],
            word_to_phrase_tr_with_vote_list: [],
            phrase_to_word_tr_with_vote_list: [],
            phrase_to_phrase_tr_with_vote_list: [],
          };
        }

        const { error: wordToPhraseError, word_to_phrase_tr_with_vote_list } =
          await this.wordToPhraseTrService.getTranslationsByFromWordDefinitionId(
            definition_id,
            langInfo,
          );

        if (wordToPhraseError === ErrorType.NoError) {
          return {
            error: wordToPhraseError,
            word_to_word_tr_with_vote_list: [],
            word_to_phrase_tr_with_vote_list: [],
            phrase_to_word_tr_with_vote_list: [],
            phrase_to_phrase_tr_with_vote_list: [],
          };
        }

        return {
          error: ErrorType.NoError,
          word_to_word_tr_with_vote_list,
          word_to_phrase_tr_with_vote_list,
          phrase_to_word_tr_with_vote_list: [],
          phrase_to_phrase_tr_with_vote_list: [],
        };
      } else {
        const { error: phraseToWordError, phrase_to_word_tr_with_vote_list } =
          await this.phraseToWordTrService.getTranslationsByFromPhraseDefinitionId(
            definition_id,
            langInfo,
          );

        if (phraseToWordError === ErrorType.NoError) {
          return {
            error: phraseToWordError,
            word_to_word_tr_with_vote_list: [],
            word_to_phrase_tr_with_vote_list: [],
            phrase_to_word_tr_with_vote_list: [],
            phrase_to_phrase_tr_with_vote_list: [],
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

        if (phraseToPhraseError === ErrorType.NoError) {
          return {
            error: phraseToPhraseError,
            word_to_word_tr_with_vote_list: [],
            word_to_phrase_tr_with_vote_list: [],
            phrase_to_word_tr_with_vote_list: [],
            phrase_to_phrase_tr_with_vote_list: [],
          };
        }

        return {
          error: ErrorType.NoError,
          word_to_word_tr_with_vote_list: [],
          word_to_phrase_tr_with_vote_list: [],
          phrase_to_word_tr_with_vote_list,
          phrase_to_phrase_tr_with_vote_list,
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_to_word_tr_with_vote_list: [],
      word_to_phrase_tr_with_vote_list: [],
      phrase_to_word_tr_with_vote_list: [],
      phrase_to_phrase_tr_with_vote_list: [],
    };
  }
}
