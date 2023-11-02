import { Injectable, Logger } from '@nestjs/common';

import { ErrorType } from 'src/common/types';
import { calc_vote_weight } from 'src/common/utility';
import { LanguageInput } from 'src/components/common/types';

import { DefinitionsService } from 'src/components/definitions/definitions.service';

import { WordToWordTranslationsService } from './word-to-word-translations.service';
import { WordToPhraseTranslationsService } from './word-to-phrase-translations.service';
import { PhraseToWordTranslationsService } from './phrase-to-word-translations.service';
import { PhraseToPhraseTranslationsService } from './phrase-to-phrase-translations.service';

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
  WordToWordTranslation,
  WordToPhraseTranslation,
  PhraseToWordTranslation,
  PhraseToPhraseTranslation,
  TranslationsOutput,
} from './types';
import { PoolClient } from 'pg';
import { PhraseDefinition, WordDefinition } from '../definitions/types';
import { PostgresService } from '../../core/postgres.service';
import { setTranslationsVotes } from './translations.repository';
import { getTranslationLangSqlStr } from './sql-string';
import { from } from 'rxjs';

export function makeStr(
  word_definition_id: number,
  is_word_definition: boolean,
) {
  return `${word_definition_id}-${is_word_definition ? 'true' : 'false'}`;
}
function isWtoW(
  translation:
    | WordToWordTranslation
    | WordToPhraseTranslation
    | PhraseToPhraseTranslation
    | PhraseToWordTranslation,
): translation is WordToWordTranslation {
  return (
    (translation as WordToWordTranslation).word_to_word_translation_id !==
    undefined
  );
}

function isWtoP(
  translation:
    | WordToWordTranslation
    | WordToPhraseTranslation
    | PhraseToPhraseTranslation
    | PhraseToWordTranslation,
): translation is WordToPhraseTranslation {
  return (
    (translation as WordToPhraseTranslation).word_to_phrase_translation_id !==
    undefined
  );
}

function isPtoP(
  translation:
    | WordToWordTranslation
    | WordToPhraseTranslation
    | PhraseToPhraseTranslation
    | PhraseToWordTranslation,
): translation is PhraseToPhraseTranslation {
  return (
    (translation as PhraseToPhraseTranslation)
      .phrase_to_phrase_translation_id !== undefined
  );
}
function isPtoW(
  translation:
    | WordToWordTranslation
    | WordToPhraseTranslation
    | PhraseToPhraseTranslation
    | PhraseToWordTranslation,
): translation is PhraseToWordTranslation {
  return (
    (translation as PhraseToWordTranslation).phrase_to_word_translation_id !==
    undefined
  );
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
  constructor(
    private wordToWordTrService: WordToWordTranslationsService,
    private wordToPhraseTrService: WordToPhraseTranslationsService,
    private phraseToWordTrService: PhraseToWordTranslationsService,
    private phraseToPhraseTrService: PhraseToPhraseTranslationsService,
    private definitionService: DefinitionsService,
    private pg: PostgresService,
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
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      translation_with_vote_list: [],
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
        if (!upsertInput[i].valid) {
          continue;
        }

        let translationId: string;
        let from_is_word: boolean;
        let to_is_word: boolean;
        if (isWtoW(translations[i]!)) {
          translationId = (translations[i]! as WordToWordTranslation)
            .word_to_word_translation_id!;
          from_is_word = true;
          to_is_word = true;
          // console.log('w2w');
        } else if (isWtoP(translations[i]!)) {
          translationId = (translations[i]! as WordToPhraseTranslation)
            .word_to_phrase_translation_id!;
          from_is_word = true;
          to_is_word = false;
          // console.log('w2p');
        } else if (isPtoP(translations[i]!)) {
          translationId = (translations[i]! as PhraseToPhraseTranslation)
            .phrase_to_phrase_translation_id!;
          from_is_word = false;
          to_is_word = false;
          // console.log('p2p');
        } else if (isPtoW(translations[i]!)) {
          translationId = (translations[i]! as PhraseToWordTranslation)
            .phrase_to_word_translation_id!;
          from_is_word = false;
          to_is_word = true;
          // console.log('p2w');
        } else {
          continue;
        }
        // console.log(`upvote: ${translationId}`);

        await setTranslationsVotes(
          from_is_word,
          to_is_word,
          [+translationId],
          token,
          true,
          this.pg.pool,
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
}
