import { Injectable } from '@nestjs/common';

import { ErrorType } from 'src/common/types';
import { calc_vote_weight } from 'src/common/utility';

import { LanguageInput } from 'src/components/common/types';

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
} from './types';
import { PoolClient } from 'pg';

export function makeStr(
  word_definition_id: number,
  is_word_definition: boolean,
) {
  return `${word_definition_id}-${is_word_definition ? 'true' : 'false'}`;
}

@Injectable()
export class TranslationsService {
  constructor(
    private wordToWordTrService: WordToWordTranslationsService,
    private wordToPhraseTrService: WordToPhraseTranslationsService,
    private phraseToWordTrService: PhraseToWordTranslationsService,
    private phraseToPhraseTrService: PhraseToPhraseTranslationsService,
    private definitionService: DefinitionsService,
    private wordsService: WordsService,
    private phrasesService: PhrasesService,
    private gTrService: GoogleTranslateService,
  ) {}

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
      console.error(e);
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
      console.error(e);
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
      console.error(e);
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
      console.error(e);
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
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      translation_vote_status: null,
    };
  }

  async translateAllWordsAndPhrasesByGoogle(
    from_language: LanguageInput,
    to_language: LanguageInput,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<TranslateAllWordsAndPhrasesByGoogleOutput> {
    try {
      const originalTextsObjMap = new Map<
        string,
        { text: string; id: number }
      >();
      let uniqueId = 0;

      const wordsConnection = await this.wordsService.getWordsByLanguage(
        from_language,
        null,
        null,
        pgClient,
      );

      if (wordsConnection.error === ErrorType.NoError) {
        for (const edge of wordsConnection.edges) {
          const { node } = edge;

          if (originalTextsObjMap.get(node.word) === undefined) {
            originalTextsObjMap.set(node.word, {
              text: node.word,
              id: uniqueId++,
            });
          }

          for (const definition of node.definitions) {
            if (originalTextsObjMap.get(definition.definition) === undefined) {
              originalTextsObjMap.set(definition.definition, {
                text: definition.definition,
                id: uniqueId++,
              });
            }
          }
        }
      }

      const phrasesConnection = await this.phrasesService.getPhrasesByLanguage(
        from_language,
        null,
        null,
        pgClient,
      );

      if (phrasesConnection.error === ErrorType.NoError) {
        for (const edge of phrasesConnection.edges) {
          const { node } = edge;

          if (originalTextsObjMap.get(node.phrase) === undefined) {
            originalTextsObjMap.set(node.phrase, {
              text: node.phrase,
              id: uniqueId++,
            });
          }

          for (const definition of node.definitions) {
            if (originalTextsObjMap.get(definition.definition) === undefined) {
              originalTextsObjMap.set(definition.definition, {
                text: definition.definition,
                id: uniqueId++,
              });
            }
          }
        }
      }

      const originalObj: { id: number; text: string }[] = [];

      for (const obj of originalTextsObjMap.values()) {
        originalObj.push(obj);
      }

      const originalTexts = originalObj
        .sort((a, b) => a.id - b.id)
        .map((obj) => obj.text);

      const translationTexts = await this.gTrService.translate(
        originalTexts,
        from_language,
        to_language,
      );

      const requestedCharactors = originalTexts.join('\n').length;

      let translatedWordCount = 0;
      let translatedPhraseCount = 0;

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

            await this.upsertTranslationFromWordAndDefinitionlikeString(
              +definition.word_definition_id,
              true,
              {
                word_or_phrase: translatedWord,
                is_type_word,
                definition: translatedDefinition,
                language_code: to_language.language_code,
                dialect_code: to_language.dialect_code,
                geo_code: to_language.geo_code,
              },
              token,
              pgClient,
            );

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

            await this.upsertTranslationFromWordAndDefinitionlikeString(
              +definition.phrase_definition_id,
              false,
              {
                word_or_phrase: translatedPhrase,
                is_type_word,
                definition: translatedDefinition,
                language_code: to_language.language_code,
                dialect_code: to_language.dialect_code,
                geo_code: to_language.geo_code,
              },
              token,
              pgClient,
            );

            translatedPhraseCount++;
          }
        }
      }

      return {
        error: ErrorType.UnknownError,
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

  async languagesForGoogleTranslate(): Promise<LanguageListForGoogleTranslateOutput> {
    try {
      const languages = await this.gTrService.getLanguages();

      return {
        error: ErrorType.NoError,
        languages,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      languages: null,
    };
  }
}
