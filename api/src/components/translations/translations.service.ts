import { Injectable, Inject, Logger } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { from, Subject } from 'rxjs';

import { ErrorType, GenericOutput } from 'src/common/types';
import {
  calc_vote_weight,
  createToken,
  pgClientOrPool,
} from 'src/common/utility';
import { subTags2LangInfo, langInfo2String } from 'src/common/langUtils';
import { LanguageInput } from 'src/components/common/types';

import { SubscriptionToken } from 'src/common/subscription-token';

import { PUB_SUB } from 'src/pubSub.module';

import { DefinitionsService } from 'src/components/definitions/definitions.service';
import { WordsService } from '../words/words.service';
import { PhrasesService } from '../phrases/phrases.service';

import { WordToWordTranslationsService } from './word-to-word-translations.service';
import { WordToPhraseTranslationsService } from './word-to-phrase-translations.service';
import { PhraseToWordTranslationsService } from './phrase-to-word-translations.service';
import { PhraseToPhraseTranslationsService } from './phrase-to-phrase-translations.service';
import { GoogleTranslateService } from './google-translate.service';

import {
  TranslationWithVoteListOutput,
  TranslationWithVoteListFromIdsOutput,
  TranslationVoteStatusOutputRow,
  ToDefinitionInput,
  TranslationWithVoteOutput,
  TranslationOutput,
  WordToWordTranslationWithVote,
  WordToPhraseTranslationWithVote,
  PhraseToWordTranslationWithVote,
  PhraseToPhraseTranslationWithVote,
  LanguageListForGoogleTranslateOutput,
  TranslateAllWordsAndPhrasesByGoogleOutput,
  WordToWordTranslation,
  WordToPhraseTranslation,
  PhraseToWordTranslation,
  PhraseToPhraseTranslation,
  TranslationsOutput,
  TranslatedLanguageInfoInput,
  TranslatedLanguageInfoOutput,
} from './types';
import { PoolClient } from 'pg';
import { PhraseDefinition, WordDefinition } from '../definitions/types';
import { PostgresService } from '../../core/postgres.service';
import {
  getTotalPhraseCountByLanguage,
  getTotalPhraseToPhraseCountByUser,
  getTotalPhraseToWordCountByUser,
  getTotalWordCountByLanguage,
  getTotalWordToPhraseCountByUser,
  getTotalWordToWordCountByUser,
  getTranslatedStringsPhraseToPhrase,
  getTranslatedStringsPhraseToWord,
  getTranslatedStringsWordToPhrase,
  getTranslatedStringsWordToWord,
  getTranslationLangSqlStr,
  IdToStringRow,
} from './sql-string';
import {
  getLangConnectionsObjectMapAndTexts,
  validateTranslateByGoogleInput,
} from './utility';

export function makeStr(
  word_definition_id: number,
  is_word_definition: boolean,
) {
  return `${word_definition_id}-${is_word_definition ? 'true' : 'false'}`;
}

const makeKey = (
  fromId: number,
  toId: number,
  isfromWord: boolean,
  isToWord: boolean,
) => {
  return `${fromId}-${toId}-${isfromWord ? 'true' : 'false'}-${
    isToWord ? 'true' : 'false'
  }`;
};

@Injectable()
export class TranslationsService {
  private translationSubject: Subject<number>;

  constructor(
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
    private wordToWordTrService: WordToWordTranslationsService,
    private wordToPhraseTrService: WordToPhraseTranslationsService,
    private phraseToWordTrService: PhraseToWordTranslationsService,
    private phraseToPhraseTrService: PhraseToPhraseTranslationsService,
    private definitionService: DefinitionsService,
    private wordsService: WordsService,
    private phrasesService: PhrasesService,
    private gTrService: GoogleTranslateService,
    private pg: PostgresService,
  ) {
    this.translationSubject = new Subject<number>();
  }

  async getTranslationsByFromDefinitionId(
    definition_id: number,
    from_definition_type_is_word: boolean,
    langInfo: LanguageInput,
    pgClient: PoolClient | null,
  ): Promise<TranslationWithVoteListOutput> {
    try {
      if (from_definition_type_is_word) {
        const { error: wordToWordError, word_to_word_tr_with_vote_list } =
          await this.wordToWordTrService.getTranslationsByFromWordDefinitionId(
            definition_id,
            langInfo,
            pgClient,
          );

        if (wordToWordError !== ErrorType.NoError) {
          return {
            error: wordToWordError,
            translation_with_vote_list: [],
          };
        }

        const { error: wordToPhraseError, word_to_phrase_tr_with_vote_list } =
          await this.wordToPhraseTrService.getTranslationsByFromWordDefinitionId(
            definition_id,
            langInfo,
            pgClient,
          );

        if (wordToPhraseError !== ErrorType.NoError) {
          return {
            error: wordToPhraseError,
            translation_with_vote_list: [],
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
            pgClient,
          );

        if (phraseToWordError !== ErrorType.NoError) {
          return {
            error: phraseToWordError,
            translation_with_vote_list: [],
          };
        }

        const {
          error: phraseToPhraseError,
          phrase_to_phrase_tr_with_vote_list,
        } =
          await this.phraseToPhraseTrService.getTranslationsByFromPhraseDefinitionId(
            definition_id,
            langInfo,
            pgClient,
          );

        if (phraseToPhraseError !== ErrorType.NoError) {
          return {
            error: phraseToPhraseError,
            translation_with_vote_list: [],
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
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      translation_with_vote_list: [],
    };
  }

  async getTranslationsByFromDefinitionIds(
    fromDefinitionIds: {
      definition_id: number;
      from_definition_type_is_word: boolean;
    }[],
    langInfo: LanguageInput,
    pgClient: PoolClient | null,
  ): Promise<TranslationWithVoteListFromIdsOutput> {
    try {
      const wordDefinitionIds = fromDefinitionIds
        .filter((id) => id.from_definition_type_is_word)
        .map((id) => id.definition_id);

      const phraseDefinitionIds = fromDefinitionIds
        .filter((id) => !id.from_definition_type_is_word)
        .map((id) => id.definition_id);

      const translationsMap = new Map<
        string,
        (
          | WordToWordTranslationWithVote
          | WordToPhraseTranslationWithVote
          | PhraseToWordTranslationWithVote
          | PhraseToPhraseTranslationWithVote
          | null
        )[]
      >();

      const { error: wordToWordError, word_to_word_tr_with_vote_list } =
        await this.wordToWordTrService.getTranslationsByFromWordDefinitionIds(
          wordDefinitionIds,
          langInfo,
          pgClient,
        );

      if (wordToWordError !== ErrorType.NoError) {
        return {
          error: wordToWordError,
          translation_with_vote_list: [],
        };
      }

      wordDefinitionIds.forEach((id, index) => {
        const translations = translationsMap.get(makeStr(id, true));

        if (translations) {
          translations.push(...word_to_word_tr_with_vote_list[index]);
        } else {
          translationsMap.set(
            makeStr(id, true),
            word_to_word_tr_with_vote_list[index],
          );
        }
      });

      const { error: wordToPhraseError, word_to_phrase_tr_with_vote_list } =
        await this.wordToPhraseTrService.getTranslationsByFromWordDefinitionIds(
          wordDefinitionIds,
          langInfo,
          pgClient,
        );

      if (wordToPhraseError !== ErrorType.NoError) {
        return {
          error: wordToPhraseError,
          translation_with_vote_list: [],
        };
      }

      wordDefinitionIds.forEach((id, index) => {
        const translations = translationsMap.get(makeStr(id, true));

        if (translations) {
          translations.push(...word_to_phrase_tr_with_vote_list[index]);
        } else {
          translationsMap.set(
            makeStr(id, true),
            word_to_phrase_tr_with_vote_list[index],
          );
        }
      });

      const { error: phraseToWordError, phrase_to_word_tr_with_vote_list } =
        await this.phraseToWordTrService.getTranslationsByFromPhraseDefinitionIds(
          phraseDefinitionIds,
          langInfo,
          pgClient,
        );

      if (phraseToWordError !== ErrorType.NoError) {
        return {
          error: phraseToWordError,
          translation_with_vote_list: [],
        };
      }

      phraseDefinitionIds.forEach((id, index) => {
        const translations = translationsMap.get(makeStr(id, false));

        if (translations) {
          translations.push(...phrase_to_word_tr_with_vote_list[index]);
        } else {
          translationsMap.set(
            makeStr(id, false),
            phrase_to_word_tr_with_vote_list[index],
          );
        }
      });

      const { error: phraseToPhraseError, phrase_to_phrase_tr_with_vote_list } =
        await this.phraseToPhraseTrService.getTranslationsByFromPhraseDefinitionIds(
          phraseDefinitionIds,
          langInfo,
          pgClient,
        );

      if (phraseToPhraseError !== ErrorType.NoError) {
        return {
          error: phraseToPhraseError,
          translation_with_vote_list: [],
        };
      }

      phraseDefinitionIds.forEach((id, index) => {
        const translations = translationsMap.get(makeStr(id, false));

        if (translations) {
          translations.push(...phrase_to_phrase_tr_with_vote_list[index]);
        } else {
          translationsMap.set(
            makeStr(id, false),
            phrase_to_phrase_tr_with_vote_list[index],
          );
        }
      });

      return {
        error: ErrorType.NoError,
        translation_with_vote_list: fromDefinitionIds.map((id) => {
          const translations = translationsMap.get(
            makeStr(id.definition_id, id.from_definition_type_is_word),
          );

          return translations ? translations : [];
        }),
      };
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      translation_with_vote_list: [],
    };
  }

  async getRecommendedTranslationFromDefinitionID(
    from_definition_id: number,
    from_type_is_word: boolean,
    language_code: string,
    dialect_code: string | null,
    geo_code: string | null,
    pgClient: PoolClient | null,
  ): Promise<TranslationWithVoteOutput> {
    try {
      const { error, translation_with_vote_list } =
        await this.getTranslationsByFromDefinitionId(
          from_definition_id,
          from_type_is_word,
          {
            language_code,
            dialect_code,
            geo_code,
          },
          pgClient,
        );

      if (error !== ErrorType.NoError) {
        return {
          error: error,
          translation_with_vote: null,
        };
      }

      let mostVoted:
        | WordToWordTranslationWithVote
        | WordToPhraseTranslationWithVote
        | PhraseToWordTranslationWithVote
        | PhraseToPhraseTranslationWithVote
        | null = null;

      for (const translation_with_vote of translation_with_vote_list) {
        if (!translation_with_vote) {
          continue;
        }

        if (mostVoted !== null) {
          const a = calc_vote_weight(mostVoted.upvotes, mostVoted.downvotes);
          const b = calc_vote_weight(
            translation_with_vote.upvotes,
            translation_with_vote.downvotes,
          );

          if (a > b) {
            continue;
          }
        }

        mostVoted = translation_with_vote;
      }

      if (mostVoted === null) {
        return {
          error: ErrorType.NoError,
          translation_with_vote: null,
        };
      }

      return {
        error: ErrorType.NoError,
        translation_with_vote: mostVoted,
      };
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      translation_with_vote: null,
    };
  }

  async getRecommendedTranslationFromDefinitionIDs(
    fromDefinitionIds: {
      from_definition_id: number;
      from_type_is_word: boolean;
    }[],
    language_code: string,
    dialect_code: string | null,
    geo_code: string | null,
    pgClient: PoolClient | null,
  ): Promise<TranslationWithVoteListOutput> {
    try {
      const { error, translation_with_vote_list } =
        await this.getTranslationsByFromDefinitionIds(
          fromDefinitionIds.map((id) => ({
            definition_id: id.from_definition_id,
            from_definition_type_is_word: id.from_type_is_word,
          })),
          {
            language_code,
            dialect_code,
            geo_code,
          },
          pgClient,
        );

      if (error !== ErrorType.NoError) {
        return {
          error: error,
          translation_with_vote_list: [],
        };
      }

      return {
        error: ErrorType.NoError,
        translation_with_vote_list: translation_with_vote_list.map((trList) => {
          let mostVoted:
            | WordToWordTranslationWithVote
            | WordToPhraseTranslationWithVote
            | PhraseToWordTranslationWithVote
            | PhraseToPhraseTranslationWithVote
            | null = null;

          trList.forEach((translation) => {
            if (!translation) {
              return;
            }

            if (mostVoted !== null) {
              const a = calc_vote_weight(
                mostVoted.upvotes,
                mostVoted.downvotes,
              );
              const b = calc_vote_weight(
                translation.upvotes,
                translation.downvotes,
              );

              if (a > b) {
                return;
              }
            }

            mostVoted = translation;
          });

          if (mostVoted === null) {
            return null;
          }

          return mostVoted;
        }),
      };
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      translation_with_vote_list: [],
    };
  }

  async upsertTranslation(
    from_definition_id: number,
    from_definition_type_is_word: boolean,
    to_definition_id: number,
    to_definition_type_is_word: boolean,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<TranslationOutput> {
    try {
      if (from_definition_type_is_word) {
        if (to_definition_type_is_word) {
          const { error, word_to_word_translation } =
            await this.wordToWordTrService.upsert(
              from_definition_id,
              to_definition_id,
              token,
              pgClient,
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
              pgClient,
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
              pgClient,
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
              pgClient,
            );

          return {
            error: error,
            translation: phrase_to_phrase_translation,
          };
        }
      }
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      translation: null,
    };
  }

  async batchUpsertTranslation(
    input: {
      from_definition_id: number;
      from_definition_type_is_word: boolean;
      to_definition_id: number;
      to_definition_type_is_word: boolean;
    }[],
    token: string,
    pgClient: PoolClient | null,
  ): Promise<TranslationsOutput> {
    if (input.length === 0) {
      return {
        error: ErrorType.NoError,
        translations: [],
      };
    }

    try {
      const w2wInput = input
        .filter(
          (item) =>
            item.from_definition_type_is_word &&
            item.to_definition_type_is_word,
        )
        .map((item) => ({
          from_word_definition_id: item.from_definition_id,
          to_word_definition_id: item.to_definition_id,
        }));

      const w2pInput = input
        .filter(
          (item) =>
            item.from_definition_type_is_word &&
            !item.to_definition_type_is_word,
        )
        .map((item) => ({
          from_word_definition_id: item.from_definition_id,
          to_phrase_definition_id: item.to_definition_id,
        }));

      const p2wInput = input
        .filter(
          (item) =>
            !item.from_definition_type_is_word &&
            item.to_definition_type_is_word,
        )
        .map((item) => ({
          from_phrase_definition_id: item.from_definition_id,
          to_word_definition_id: item.to_definition_id,
        }));

      const p2pInput = input
        .filter(
          (item) =>
            !item.from_definition_type_is_word &&
            !item.to_definition_type_is_word,
        )
        .map((item) => ({
          from_phrase_definition_id: item.from_definition_id,
          to_phrase_definition_id: item.to_definition_id,
        }));

      const translationsMap = new Map<
        string,
        | WordToWordTranslation
        | WordToPhraseTranslation
        | PhraseToWordTranslation
        | PhraseToPhraseTranslation
      >();

      const { error: w2wError, word_to_word_translations } =
        await this.wordToWordTrService.upserts(w2wInput, token, pgClient);

      if (w2wError !== ErrorType.NoError) {
        return {
          error: w2wError,
          translations: [],
        };
      }

      word_to_word_translations.forEach((w2wTr) =>
        w2wTr
          ? translationsMap.set(
              makeKey(
                +w2wTr.from_word_definition.word_definition_id,
                +w2wTr.to_word_definition.word_definition_id,
                true,
                true,
              ),
              w2wTr,
            )
          : null,
      );

      const { error: w2pError, word_to_phrase_translations } =
        await this.wordToPhraseTrService.upserts(w2pInput, token, pgClient);

      if (w2pError !== ErrorType.NoError) {
        return {
          error: w2pError,
          translations: [],
        };
      }

      word_to_phrase_translations.forEach((w2pTr) =>
        w2pTr
          ? translationsMap.set(
              makeKey(
                +w2pTr.from_word_definition.word_definition_id,
                +w2pTr.to_phrase_definition.phrase_definition_id,
                true,
                false,
              ),
              w2pTr,
            )
          : null,
      );

      const { error: p2wError, phrase_to_word_translations } =
        await this.phraseToWordTrService.upserts(p2wInput, token, pgClient);

      if (p2wError !== ErrorType.NoError) {
        return {
          error: p2wError,
          translations: [],
        };
      }

      phrase_to_word_translations.forEach((p2wTr) =>
        p2wTr
          ? translationsMap.set(
              makeKey(
                +p2wTr.from_phrase_definition.phrase_definition_id,
                +p2wTr.to_word_definition.word_definition_id,
                true,
                false,
              ),
              p2wTr,
            )
          : null,
      );

      const { error: p2pError, phrase_to_phrase_translations } =
        await this.phraseToPhraseTrService.upserts(p2pInput, token, pgClient);

      if (p2pError !== ErrorType.NoError) {
        return {
          error: p2pError,
          translations: [],
        };
      }

      phrase_to_phrase_translations.forEach((p2pTr) =>
        p2pTr
          ? translationsMap.set(
              makeKey(
                +p2pTr.from_phrase_definition.phrase_definition_id,
                +p2pTr.to_phrase_definition.phrase_definition_id,
                true,
                false,
              ),
              p2pTr,
            )
          : null,
      );

      return {
        error: ErrorType.NoError,
        translations: input.map(
          (item) =>
            translationsMap.get(
              makeKey(
                item.from_definition_id,
                item.to_definition_id,
                item.from_definition_type_is_word,
                item.to_definition_type_is_word,
              ),
            ) || null,
        ),
      };
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      translations: [],
    };
  }

  async batchUpsertTranslationFromWordAndDefinitionlikeString(
    input: {
      from_definition_id: number;
      from_definition_type_is_word: boolean;
      to_definition_input: ToDefinitionInput;
    }[],
    token: string,
    pgClient: PoolClient | null,
  ): Promise<TranslationsOutput> {
    if (input.length === 0) {
      return {
        error: ErrorType.NoError,
        translations: [],
      };
    }

    try {
      const wordDefinitionInput = input
        .map((item) => item.to_definition_input)
        .filter((item) => item.is_type_word)
        .map((item) => ({
          wordlike_string: item.word_or_phrase,
          definitionlike_string: item.definition,
          language_code: item.language_code,
          dialect_code: item.dialect_code,
          geo_code: item.geo_code,
        }));

      const phraseDefinitionInput = input
        .map((item) => item.to_definition_input)
        .filter((item) => !item.is_type_word)
        .map((item) => ({
          phraselike_string: item.word_or_phrase,
          definitionlike_string: item.definition,
          language_code: item.language_code,
          dialect_code: item.dialect_code,
          geo_code: item.geo_code,
        }));

      const { error: wordError, word_definitions } =
        await this.definitionService.batchUpsertFromWordAndDefinitionlikeString(
          wordDefinitionInput,
          token,
          pgClient,
        );

      if (wordError !== ErrorType.NoError) {
        return {
          error: wordError,
          translations: [],
        };
      }

      const wordDefinitionsMap = new Map<string, WordDefinition>();

      word_definitions.forEach((word_definition) =>
        word_definition
          ? wordDefinitionsMap.set(
              `${word_definition.word.word}-${word_definition.definition}`,
              word_definition,
            )
          : null,
      );

      const { error: phraseError, phrase_definitions } =
        await this.definitionService.batchUpsertFromPhraseAndDefinitionlikeString(
          phraseDefinitionInput,
          token,
          pgClient,
        );

      if (phraseError !== ErrorType.NoError) {
        return {
          error: wordError,
          translations: [],
        };
      }

      const phraseDefinitionsMap = new Map<string, PhraseDefinition>();

      phrase_definitions.forEach((phrase_definition) =>
        phrase_definition
          ? phraseDefinitionsMap.set(
              `${phrase_definition.phrase.phrase}-${phrase_definition.definition}`,
              phrase_definition,
            )
          : null,
      );

      const upsertInput: {
        from_definition_id: number;
        from_definition_type_is_word: boolean;
        to_definition_id: number;
        to_definition_type_is_word: boolean;
        valid: boolean;
      }[] = [];

      for (let i = 0; i < input.length; i++) {
        let to_definition_id;
        let to_definition_type_is_word;

        if (input[i].to_definition_input.is_type_word) {
          to_definition_type_is_word = true;

          const definition = wordDefinitionsMap.get(
            `${input[i].to_definition_input.word_or_phrase}-${input[i].to_definition_input.definition}`,
          );

          if (!definition) {
            upsertInput.push({
              from_definition_id: 0,
              from_definition_type_is_word: true,
              to_definition_id: 0,
              to_definition_type_is_word: true,
              valid: false,
            });
            continue;
          }

          to_definition_id = definition.word_definition_id;
        } else {
          to_definition_type_is_word = false;

          const definition = phraseDefinitionsMap.get(
            `${input[i].to_definition_input.word_or_phrase}-${input[i].to_definition_input.definition}`,
          );

          if (!definition) {
            upsertInput.push({
              from_definition_id: 0,
              from_definition_type_is_word: true,
              to_definition_id: 0,
              to_definition_type_is_word: true,
              valid: false,
            });
            continue;
          }

          to_definition_id = definition.phrase_definition_id;
        }

        upsertInput.push({
          from_definition_id: input[i].from_definition_id,
          from_definition_type_is_word: input[i].from_definition_type_is_word,
          to_definition_id,
          to_definition_type_is_word,
          valid: true,
        });
      }

      const translationsMap = new Map<
        string,
        | WordToWordTranslation
        | WordToPhraseTranslation
        | PhraseToWordTranslation
        | PhraseToPhraseTranslation
        | null
      >();

      const { error: upsertError, translations } =
        await this.batchUpsertTranslation(
          upsertInput.filter((item) => item.valid),
          token,
          pgClient,
        );

      for (let i = 0; i < upsertInput.length; i++) {
        if (!translations[i]) {
          continue;
        }
        translationsMap.set(
          makeKey(
            upsertInput[i].from_definition_id,
            upsertInput[i].to_definition_id,
            upsertInput[i].from_definition_type_is_word,
            upsertInput[i].to_definition_type_is_word,
          ),
          translations[i],
        );
      }

      return {
        error: upsertError,
        translations: upsertInput.map((item) => {
          if (!item.valid) {
            return null;
          }

          return (
            translationsMap.get(
              makeKey(
                item.from_definition_id,
                item.to_definition_id,
                item.from_definition_type_is_word,
                item.to_definition_type_is_word,
              ),
            ) || null
          );
        }),
      };
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      translations: [],
    };
  }

  async upsertTranslationFromWordAndDefinitionlikeString(
    from_definition_id: number,
    from_definition_type_is_word: boolean,
    to_definition_input: ToDefinitionInput,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<TranslationOutput> {
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
            pgClient,
          );

        if (wordError !== ErrorType.NoError || !word_definition) {
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
          pgClient,
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
            pgClient,
          );

        if (phraseError !== ErrorType.NoError || !phrase_definition) {
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
          pgClient,
        );
      }
    } catch (e) {
      Logger.error(e);
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
    pgClient: PoolClient | null,
  ): Promise<TranslationVoteStatusOutputRow> {
    try {
      if (from_definition_type_is_word) {
        if (to_definition_type_is_word) {
          const { error: wordToWordVoteError, vote_status } =
            await this.wordToWordTrService.toggleVoteStatus(
              translation_id + '',
              vote,
              token,
              pgClient,
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
              pgClient,
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
              pgClient,
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
              pgClient,
            );

          return {
            error: phraseToPhraseVoteError,
            translation_vote_status: vote_status,
          };
        }
      }
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      translation_vote_status: null,
    };
  }

  async getTranslationLanguageInfo(
    input: TranslatedLanguageInfoInput,
    pgClient: PoolClient | null,
  ): Promise<TranslatedLanguageInfoOutput> {
    const pg = await pgClientOrPool({
      client: pgClient,
      pool: this.pg.pool,
    });

    const userRes = await this.pg.pool.query(
      `select u.user_id
      from users 
      where email=$1;`,
      ['googlebot@crowd.rocks'],
    );
    const google_user_id = userRes.rows[0].user_id;

    // total words
    const totalWordres = await pg.query(
      ...getTotalWordCountByLanguage(input.fromLanguageCode),
    );
    const totalWordCount = totalWordres.rows[0].count;

    // total phrases
    const totalPhraseRes = await pg.query(
      ...getTotalPhraseCountByLanguage(input.fromLanguageCode),
    );
    const totalPhraseCount = totalPhraseRes.rows[0].count;

    let translatedMissingPhraseCount: number | undefined = undefined;
    // missing phrases
    if (input.toLanguageCode) {
      const totalPhraseToWordRes = await pg.query(
        ...getTotalPhraseToWordCountByUser(
          input.fromLanguageCode,
          input.toLanguageCode,
          google_user_id,
        ),
      );
      const totalPhraseToPhraseRes = await pg.query(
        ...getTotalPhraseToPhraseCountByUser(
          input.fromLanguageCode,
          input.toLanguageCode,
          google_user_id,
        ),
      );
      translatedMissingPhraseCount =
        +totalPhraseCount -
        (+totalPhraseToWordRes.rows[0].count +
          +totalPhraseToPhraseRes.rows[0].count);
    }

    // missing phrases
    let translatedMissingWordCount: number | undefined = undefined;
    if (input.toLanguageCode) {
      const totalWordToWordRes = await pg.query(
        ...getTotalWordToWordCountByUser(
          input.fromLanguageCode,
          input.toLanguageCode,
          google_user_id,
        ),
      );

      const totalWordToPhraseRes = await pg.query(
        ...getTotalWordToPhraseCountByUser(
          input.fromLanguageCode,
          input.toLanguageCode,
          google_user_id,
        ),
      );
      translatedMissingWordCount =
        +totalWordCount -
        (+totalWordToWordRes.rows[0].count +
          +totalWordToPhraseRes.rows[0].count);
    }

    // total possible 'to' languages googleTranslate can translate to.
    const googleTranslateTotalLangCount = (await this.gTrService.getLanguages())
      .length;

    return {
      error: ErrorType.NoError, // later
      totalPhraseCount,
      totalWordCount,
      translatedMissingPhraseCount,
      translatedMissingWordCount,
      googleTranslateTotalLangCount,
    };
  }

  async translateMissingWordsAndPhrasesByGoogle(
    from_language: LanguageInput,
    to_language: LanguageInput,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<TranslateAllWordsAndPhrasesByGoogleOutput> {
    const badInputResult = validateTranslateByGoogleInput(
      from_language,
      to_language,
    );

    if (badInputResult) {
      return badInputResult;
    }

    try {
      const {
        strings,
        originalTextsObjMap,
        wordsConnection,
        phrasesConnection,
      } = await getLangConnectionsObjectMapAndTexts(
        from_language,
        pgClient,
        this.wordsService,
        this.phrasesService,
      );
      const pg = await pgClientOrPool({ client: pgClient, pool: this.pg.pool });
      // const translatedTextsObjMap = new Map<
      //   string,
      //   { text: string; id: number }
      // >();
      // let uniqueId = 0;
      const translatedStrs: string[] = [];
      // check if token for googlebot exists
      const tokenRes = await this.pg.pool.query(
        `select t.token, u.user_id
      from tokens t 
      join users u 
      on t.user_id = u.user_id
      where u.email=$1;`,
        ['googlebot@crowd.rocks'],
      );
      let gtoken = tokenRes.rows[0].token;
      const google_user_id = tokenRes.rows[0].user_id;
      if (!gtoken) {
        gtoken = createToken();
        await this.pg.pool.query(
          `
          insert into tokens(token, user_id) values($1, $2);
        `,
          [gtoken, google_user_id],
        );
      }

      const trW2WRes = await pg.query<IdToStringRow>(
        ...getTranslatedStringsWordToWord(
          from_language.language_code,
          to_language.language_code,
          google_user_id,
        ),
      );

      for (let i = 0; i < trW2WRes.rowCount; i++) {
        const { id, string } = trW2WRes.rows[i];
        translatedStrs.push(string);
      }

      const trW2PRes = await pg.query<IdToStringRow>(
        ...getTranslatedStringsWordToPhrase(
          from_language.language_code,
          to_language.language_code,
          google_user_id,
        ),
      );
      for (let i = 0; i < trW2PRes.rowCount; i++) {
        const { id, string } = trW2PRes.rows[i];
        translatedStrs.push(string);
      }

      const trP2PRes = await pg.query<IdToStringRow>(
        ...getTranslatedStringsPhraseToPhrase(
          from_language.language_code,
          to_language.language_code,
          google_user_id,
        ),
      );
      for (let i = 0; i < trP2PRes.rowCount; i++) {
        const { id, string } = trP2PRes.rows[i];
        translatedStrs.push(string);
      }

      const trP2WRes = await pg.query<IdToStringRow>(
        ...getTranslatedStringsPhraseToWord(
          from_language.language_code,
          to_language.language_code,
          google_user_id,
        ),
      );
      for (let i = 0; i < trP2WRes.rowCount; i++) {
        const { id, string } = trP2WRes.rows[i];
        translatedStrs.push(string);
      }

      const allStrings: string[] = [];
      wordsConnection.edges.map((c) => allStrings.push(c.node.word));
      phrasesConnection.edges.map((p) => allStrings.push(p.node.phrase));

      const missing = allStrings.filter((s) => {
        return translatedStrs.indexOf(s) < 0;
      });

      const translationTexts = await this.gTrService.translate(
        missing,
        from_language,
        to_language,
      );
    } catch (err) {
      console.error(err);
    }
    return {
      error: ErrorType.UnknownError,
      result: null,
    };
  }

  async translateWordsAndPhrasesByGoogle(
    from_language: LanguageInput,
    to_language: LanguageInput,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<TranslateAllWordsAndPhrasesByGoogleOutput> {
    const badInputResult = validateTranslateByGoogleInput(
      from_language,
      to_language,
    );

    if (badInputResult) {
      return badInputResult;
    }

    try {
      const {
        strings: originalTexts,
        originalTextsObjMap,
        wordsConnection,
        phrasesConnection,
      } = await getLangConnectionsObjectMapAndTexts(
        from_language,
        pgClient,
        this.wordsService,
        this.phrasesService,
      );

      const translationTexts = await this.gTrService.translate(
        originalTexts,
        from_language,
        to_language,
      );

      const requestedCharactors = originalTexts.join('\n').length;

      let translatedWordCount = 0;
      let translatedPhraseCount = 0;

      const upsertInputs: {
        from_definition_id: number;
        from_definition_type_is_word: boolean;
        to_definition_input: ToDefinitionInput;
      }[] = [];

      if (wordsConnection.error === ErrorType.NoError) {
        for (const edge of wordsConnection.edges) {
          const { node } = edge;

          const obj = originalTextsObjMap.get(node.word);

          if (obj === undefined) {
            continue;
          }

          const translatedWord = translationTexts[obj.id];
          const is_type_word =
            translatedWord
              .trim()
              .split(' ')
              .filter((w) => w !== '').length === 1;

          for (const definition of node.definitions) {
            const obj = originalTextsObjMap.get(definition.definition);
            if (obj === undefined) {
              continue;
            }

            const translatedDefinition = translationTexts[obj.id];

            upsertInputs.push({
              from_definition_id: +definition.word_definition_id,
              from_definition_type_is_word: true,
              to_definition_input: {
                word_or_phrase: translatedWord,
                is_type_word,
                definition: translatedDefinition,
                language_code: to_language.language_code,
                dialect_code: to_language.dialect_code,
                geo_code: to_language.geo_code,
              },
            });

            translatedWordCount++;
          }
        }
      }

      if (phrasesConnection.error === ErrorType.NoError) {
        for (const edge of phrasesConnection.edges) {
          const { node } = edge;

          const obj = originalTextsObjMap.get(node.phrase);

          if (obj === undefined) {
            continue;
          }

          const translatedPhrase = translationTexts[obj.id];
          const is_type_word =
            translatedPhrase
              .trim()
              .split(' ')
              .filter((w) => w !== '').length === 1;

          for (const definition of node.definitions) {
            const obj = originalTextsObjMap.get(definition.definition);

            if (obj === undefined) {
              continue;
            }

            const translatedDefinition = translationTexts[obj.id];

            upsertInputs.push({
              from_definition_id: +definition.phrase_definition_id,
              from_definition_type_is_word: false,
              to_definition_input: {
                word_or_phrase: translatedPhrase,
                is_type_word,
                definition: translatedDefinition,
                language_code: to_language.language_code,
                dialect_code: to_language.dialect_code,
                geo_code: to_language.geo_code,
              },
            });

            translatedPhraseCount++;
          }
        }
      }

      // check if token for googlebot exists
      const tokenRes = await this.pg.pool.query(
        `select t.token, u.user_id
      from tokens t 
      join users u 
      on t.user_id = u.user_id
      where u.email=$1;`,
        ['googlebot@crowd.rocks'],
      );
      let gtoken = tokenRes.rows[0].token;
      const google_user_id = tokenRes.rows[0].user_id;
      if (!gtoken) {
        gtoken = createToken();
        await this.pg.pool.query(
          `
          insert into tokens(token, user_id) values($1, $2);
        `,
          [gtoken, google_user_id],
        );
      }

      const { error, translations } =
        await this.batchUpsertTranslationFromWordAndDefinitionlikeString(
          upsertInputs,
          gtoken,
          pgClient,
        );

      console.log('translations: ');
      console.log(translations.filter((t) => t !== null).length);
      console.log('null translations: ');
      console.log(translations.filter((t) => t === null).length);
      return {
        error,
        result: {
          requestedCharactors,
          totalWordCount: wordsConnection.edges.length,
          totalPhraseCount: phrasesConnection.edges.length,
          translatedWordCount,
          translatedPhraseCount,
        },
      };
    } catch (err) {
      console.error(err);
    }

    return {
      error: ErrorType.UnknownError,
      result: null,
    };
  }

  async translateAllWordsAndPhrasesByGoogle(
    from_language: LanguageInput,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<GenericOutput> {
    try {
      if (this.translationSubject) {
        this.translationSubject.complete();
      }

      this.translationSubject = new Subject<number>();

      const { error, languages } = await this.languagesForGoogleTranslate();

      if (error !== ErrorType.NoError || !languages) {
        return { error };
      }

      let totalResult = {
        requestedCharactors: 0,
        totalWordCount: 0,
        totalPhraseCount: 0,
        translatedWordCount: 0,
        translatedPhraseCount: 0,
      };
      const hasErrors: string[] = [];
      let status: 'Progressing' | 'Completed' = 'Progressing';

      this.pubSub.publish(SubscriptionToken.TranslationReport, {
        [SubscriptionToken.TranslationReport]: {
          ...totalResult,
          status,
          message: `Translating ${langInfo2String(
            subTags2LangInfo({
              lang: from_language.language_code,
              dialect: from_language.dialect_code || undefined,
              region: from_language.geo_code || undefined,
            }),
          )} into ${
            languages.length > 0
              ? langInfo2String(
                  subTags2LangInfo({
                    lang: languages[0].code,
                    dialect: undefined,
                    region: undefined,
                  }),
                )
              : ''
          }...`,
          errors: hasErrors,
          total: languages.length,
          completed: 0,
        },
      });

      this.translationSubject.subscribe({
        next: async (step) => {
          if (step >= languages.length) {
            this.translationSubject.complete();
            return;
          }

          const language = languages[step];

          if (language.code === from_language.language_code) {
            this.translationSubject.next(step + 1);
            return;
          }

          const { error, result } = await this.translateWordsAndPhrasesByGoogle(
            from_language,
            {
              language_code: language.code,
              dialect_code: null,
              geo_code: null,
            },
            token,
            pgClient,
          );

          if (error !== ErrorType.NoError) {
            hasErrors.push(
              langInfo2String(
                subTags2LangInfo({
                  lang: language.code,
                }),
              ),
            );
          }

          if (result) {
            totalResult = {
              requestedCharactors:
                totalResult.requestedCharactors + result.requestedCharactors,
              totalWordCount:
                totalResult.totalWordCount + result.totalWordCount,
              totalPhraseCount:
                totalResult.totalPhraseCount + result.totalPhraseCount,
              translatedWordCount:
                totalResult.translatedWordCount + result.totalWordCount,
              translatedPhraseCount:
                totalResult.translatedPhraseCount +
                result.translatedPhraseCount,
            };
          }

          this.pubSub.publish(SubscriptionToken.TranslationReport, {
            [SubscriptionToken.TranslationReport]: {
              ...totalResult,
              status: step + 1 === languages.length ? 'Completed' : status,
              message: `Translating ${langInfo2String(
                subTags2LangInfo({
                  lang: from_language.language_code,
                  dialect: from_language.dialect_code || undefined,
                  region: from_language.geo_code || undefined,
                }),
              )} into ${langInfo2String(
                subTags2LangInfo({
                  lang: language.code,
                  dialect: undefined,
                  region: undefined,
                }),
              )}...`,
              errors: hasErrors,
              total: languages.length,
              completed: step,
            },
          });

          this.translationSubject.next(step + 1);
        },
        complete: () => {
          status = 'Completed';
        },
      });

      this.translationSubject.next(0);
    } catch (err) {
      console.error(err);
    }

    return {
      error: ErrorType.UnknownError,
    };
  }

  async stopGoogleTranslation(): Promise<GenericOutput> {
    this.translationSubject.complete();
    return {
      error: ErrorType.NoError,
    };
  }

  async languagesForGoogleTranslate(): Promise<LanguageListForGoogleTranslateOutput> {
    try {
      const languages = await this.gTrService.getLanguages();

      return {
        error: ErrorType.NoError,
        languages,
      };
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      languages: null,
    };
  }

  async getTranslationLanguage(
    translation_id: string,
    from_definition_type_is_word: boolean,
    to_definition_type_is_word: boolean,
  ): Promise<LanguageInput | null> {
    if (isNaN(Number(translation_id))) {
      Logger.error(
        `translationsService#getTranslationLanguage: Number(${JSON.stringify(
          translation_id,
        )}) is NaN`,
      );
      return null;
    }
    const resQ = await this.pg.pool.query(
      ...getTranslationLangSqlStr(
        Number(translation_id),
        from_definition_type_is_word,
        to_definition_type_is_word,
      ),
    );

    if (!resQ.rows[0].language_code || resQ.rows.length > 1) {
      Logger.error(
        `translationsService#getTranslationLanguage: translation language not found or several results are found`,
      );
      return null;
    }
    return {
      language_code: resQ.rows[0].language_code,
      geo_code: resQ.rows[0].geo_code,
      dialect_code: resQ.rows[0].dialect_code,
    };
  }
}
