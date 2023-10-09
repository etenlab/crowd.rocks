import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';

import { pgClientOrPool } from 'src/common/utility';

import { ErrorType, GenericOutput } from 'src/common/types';
import { calc_vote_weight } from 'src/common/utility';

import { PostgresService } from 'src/core/postgres.service';

import { DefinitionsService } from 'src/components/definitions/definitions.service';
import { TranslationsService } from 'src/components/translations/translations.service';

import { SiteTextsService } from './site-texts.service';

import { SiteTextWordDefinitionsService } from './site-text-word-definitions.service';
import { SiteTextPhraseDefinitionsService } from './site-text-phrase-definitions.service';

import {
  TranslationOutput,
  WordToWordTranslationWithVote,
  WordToPhraseTranslationWithVote,
  PhraseToWordTranslationWithVote,
  PhraseToPhraseTranslationWithVote,
  TranslationWithVoteOutput,
  TranslationWithVoteListOutput,
  TranslationWithVoteListFromIdsOutput,
} from 'src/components/translations/types';

import {
  SiteTextTranslationsFromInput,
  SiteTextTranslationsToInput,
  SiteTextTranslationUpsertInput,
  TranslationWithVoteListByLanguage,
  TranslationWithVoteListByLanguageOutput,
  TranslationWithVoteListByLanguageListOutput,
} from './types';

import {
  GetAllSiteTextPhraseDefinition,
  getAllSiteTextPhraseDefinition,
  GetAllSiteTextWordDefinition,
  getAllSiteTextWordDefinition,
  GetDefinitionIdBySiteTextId,
  getDefinitionIdBySiteTextId,
  SiteTextDefinitionTranslationCountUpsertsProcedureOutput,
  callSiteTextDefinitionTranslationCountUpsertsProcedure,
} from './sql-string';

import { makeStr } from 'src/components/translations/translations.service';

@Injectable()
export class SiteTextTranslationsService {
  constructor(
    private pg: PostgresService,
    private definitionService: DefinitionsService,
    private translationService: TranslationsService,
    private siteTextService: SiteTextsService,
    private siteTextWordDefinitionService: SiteTextWordDefinitionsService,
    private siteTextPhraseDefinitionService: SiteTextPhraseDefinitionsService,
  ) {
    // update site_text_definition_translation_counts table after 5 mins
    setTimeout(() => {
      this.updateSiteTextTranslatedInfo(null);
    }, 300000);
  }

  async upsertFromTranslationlikeString(
    fromInput: SiteTextTranslationsFromInput,
    toInput: SiteTextTranslationsToInput,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<TranslationOutput> {
    if (toInput.translationlike_string.trim() === '') {
      return {
        error: ErrorType.InvalidInputs,
        translation: null,
      };
    }

    try {
      const words = toInput.translationlike_string
        .split(' ')
        .filter((w) => w !== '');

      if (words.length > 1) {
        const { error, phrase_definition } =
          await this.definitionService.upsertFromPhraseAndDefinitionlikeString(
            {
              phraselike_string: toInput.translationlike_string.trim(),
              definitionlike_string: toInput.definitionlike_string,
              language_code: toInput.language_code,
              dialect_code: toInput.dialect_code,
              geo_code: toInput.geo_code,
            },
            token,
            pgClient,
          );

        if (error !== ErrorType.NoError || phrase_definition === null) {
          return {
            error: error,
            translation: null,
          };
        }

        return this.translationService.upsertTranslation(
          +fromInput.from_definition_id,
          fromInput.from_type_is_word,
          +phrase_definition.phrase_definition_id,
          false,
          token,
          pgClient,
        );
      } else {
        const { error, word_definition } =
          await this.definitionService.upsertFromWordAndDefinitionlikeString(
            {
              wordlike_string: toInput.translationlike_string.trim(),
              definitionlike_string: toInput.definitionlike_string,
              language_code: toInput.language_code,
              dialect_code: toInput.dialect_code,
              geo_code: toInput.geo_code,
            },
            token,
            pgClient,
          );

        if (error !== ErrorType.NoError || word_definition === null) {
          return {
            error: error,
            translation: null,
          };
        }

        return this.translationService.upsertTranslation(
          +fromInput.from_definition_id,
          fromInput.from_type_is_word,
          +word_definition.word_definition_id,
          true,
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

  async upsertTranslation(
    input: SiteTextTranslationUpsertInput,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<TranslationOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetDefinitionIdBySiteTextId>(
        ...getDefinitionIdBySiteTextId(
          +input.site_text_id,
          input.is_word_definition,
        ),
      );

      if (res.rowCount !== 1) {
        console.error(`no site-text-definition for id: ${input.site_text_id}`);
      } else {
        const from_definition_id = res.rows[0].definition_id;
        const from_type_is_word = input.is_word_definition;

        return this.upsertFromTranslationlikeString(
          {
            from_definition_id: from_definition_id + '',
            from_type_is_word,
          },
          {
            translationlike_string: input.translationlike_string,
            definitionlike_string: input.definitionlike_string,
            language_code: input.language_code,
            dialect_code: input.dialect_code,
            geo_code: input.geo_code,
          },
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

  async getAllTranslationFromSiteTextDefinitionID(
    site_text_id: number,
    site_text_type_is_word: boolean,
    language_code: string,
    dialect_code: string | null,
    geo_code: string | null,
    pgClient: PoolClient | null,
  ): Promise<TranslationWithVoteListOutput> {
    try {
      let from_definition_id: number;

      if (site_text_type_is_word) {
        const { error, site_text_word_definition } =
          await this.siteTextWordDefinitionService.read(site_text_id, pgClient);

        if (error !== ErrorType.NoError || !site_text_word_definition) {
          return {
            error: error,
            translation_with_vote_list: [],
          };
        } else {
          from_definition_id =
            +site_text_word_definition.word_definition.word_definition_id;
        }
      } else {
        const { error, site_text_phrase_definition } =
          await this.siteTextPhraseDefinitionService.read(
            site_text_id,
            pgClient,
          );

        if (error !== ErrorType.NoError || !site_text_phrase_definition) {
          return {
            error: error,
            translation_with_vote_list: [],
          };
        } else {
          from_definition_id =
            +site_text_phrase_definition.phrase_definition.phrase_definition_id;
        }
      }

      return this.translationService.getTranslationsByFromDefinitionId(
        from_definition_id,
        site_text_type_is_word,
        {
          language_code,
          dialect_code,
          geo_code,
        },
        pgClient,
      );
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      translation_with_vote_list: [],
    };
  }

  async getAllTranslationFromSiteTextDefinitionIDs(
    siteTextIds: {
      site_text_id: number;
      site_text_type_is_word: boolean;
    }[],
    language_code: string,
    dialect_code: string | null,
    geo_code: string | null,
    pgClient: PoolClient | null,
  ): Promise<TranslationWithVoteListFromIdsOutput> {
    try {
      const siteTextWordDefinitionIds = siteTextIds
        .filter((siteTextId) => siteTextId.site_text_type_is_word)
        .map((siteTextId) => siteTextId.site_text_id);

      const siteTextPhraseDefinitionIds = siteTextIds
        .filter((siteTextId) => !siteTextId.site_text_type_is_word)
        .map((siteTextId) => siteTextId.site_text_id);

      const { error: wordError, site_text_word_definitions } =
        await this.siteTextWordDefinitionService.reads(
          siteTextWordDefinitionIds,
          pgClient,
        );

      if (wordError !== ErrorType.NoError) {
        return {
          error: wordError,
          translation_with_vote_list: [],
        };
      }

      const { error: phraseError, site_text_phrase_definitions } =
        await this.siteTextPhraseDefinitionService.reads(
          siteTextPhraseDefinitionIds,
          pgClient,
        );

      if (phraseError !== ErrorType.NoError) {
        return {
          error: phraseError,
          translation_with_vote_list: [],
        };
      }

      const siteTextDefinitionsMap = new Map<
        string,
        {
          definition_id: number;
          from_definition_type_is_word: boolean;
        }
      >();

      site_text_word_definitions.forEach((stwd) =>
        stwd
          ? siteTextDefinitionsMap.set(makeStr(+stwd.site_text_id, true), {
              definition_id: +stwd.word_definition.word_definition_id,
              from_definition_type_is_word: true,
            })
          : null,
      );

      site_text_phrase_definitions.forEach((stpd) =>
        stpd
          ? siteTextDefinitionsMap.set(makeStr(+stpd.site_text_id, false), {
              definition_id: +stpd.phrase_definition.phrase_definition_id,
              from_definition_type_is_word: false,
            })
          : null,
      );

      const definitionObjIds: {
        definition_id: number;
        from_definition_type_is_word: boolean;
      }[] = [];

      for (const id of siteTextDefinitionsMap.values()) {
        definitionObjIds.push(id);
      }

      return this.translationService.getTranslationsByFromDefinitionIds(
        definitionObjIds,
        {
          language_code,
          dialect_code,
          geo_code,
        },
        pgClient,
      );
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      translation_with_vote_list: [],
    };
  }

  async getRecommendedTranslationFromSiteTextDefinitionID(
    site_text_id: number,
    site_text_type_is_word: boolean,
    language_code: string,
    dialect_code: string | null,
    geo_code: string | null,
    pgClient: PoolClient | null,
  ): Promise<TranslationWithVoteOutput> {
    try {
      const { error, translation_with_vote_list } =
        await this.getAllTranslationFromSiteTextDefinitionID(
          site_text_id,
          site_text_type_is_word,
          language_code,
          dialect_code,
          geo_code,
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

  async getRecommendedTranslationFromSiteTextDefinitionIDs(
    siteTextIds: {
      site_text_id: number;
      site_text_type_is_word: boolean;
    }[],
    language_code: string,
    dialect_code: string | null,
    geo_code: string | null,
    pgClient: PoolClient | null,
  ): Promise<TranslationWithVoteListOutput> {
    try {
      const { error, translation_with_vote_list } =
        await this.getAllTranslationFromSiteTextDefinitionIDs(
          siteTextIds,
          language_code,
          dialect_code,
          geo_code,
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

          for (const translation_with_vote of trList) {
            if (!translation_with_vote) {
              continue;
            }

            if (mostVoted !== null) {
              const a = calc_vote_weight(
                mostVoted.upvotes,
                mostVoted.downvotes,
              );
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

  async getAllRecommendedTranslationListByLanguage(
    language_code: string,
    dialect_code: string | null,
    geo_code: string | null,
    pgClient: PoolClient | null,
  ): Promise<TranslationWithVoteListByLanguageOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetAllSiteTextWordDefinition>(...getAllSiteTextWordDefinition());

      const res2 = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetAllSiteTextPhraseDefinition>(
        ...getAllSiteTextPhraseDefinition(),
      );

      const { error: wordError, translation_with_vote_list } =
        await this.getRecommendedTranslationFromSiteTextDefinitionIDs(
          [
            ...res.rows.map((row) => ({
              site_text_id: +row.site_text_id,
              site_text_type_is_word: true,
            })),
            ...res2.rows.map((row) => ({
              site_text_id: +row.site_text_id,
              site_text_type_is_word: false,
            })),
          ],
          language_code,
          dialect_code,
          geo_code,
          pgClient,
        );

      if (wordError !== ErrorType.NoError) {
        return {
          error: wordError,
          translation_with_vote_list_by_language: {
            translation_with_vote_list: [],
            language_code,
            dialect_code,
            geo_code,
          },
        };
      }

      return {
        error: ErrorType.NoError,
        translation_with_vote_list_by_language: {
          translation_with_vote_list,
          language_code,
          dialect_code,
          geo_code,
        },
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      translation_with_vote_list_by_language: {
        translation_with_vote_list: [],
        language_code,
        dialect_code,
        geo_code,
      },
    };
  }

  async getAllRecommendedTranslationList(
    pgClient: PoolClient | null,
  ): Promise<TranslationWithVoteListByLanguageListOutput> {
    try {
      const { error: languageError, site_text_language_list } =
        await this.siteTextService.getAllSiteTextLanguageList(pgClient);

      if (languageError !== ErrorType.NoError || !site_text_language_list) {
        return {
          error: languageError,
          translation_with_vote_list_by_language_list: null,
        };
      }

      const translationWithVoteListByLanguageList: TranslationWithVoteListByLanguage[] =
        [];

      for (const language of site_text_language_list) {
        const { error, translation_with_vote_list_by_language } =
          await this.getAllRecommendedTranslationListByLanguage(
            language.language_code,
            language.dialect_code,
            language.geo_code,
            pgClient,
          );

        if (error !== ErrorType.NoError) {
          return {
            error,
            translation_with_vote_list_by_language_list: null,
          };
        }

        translationWithVoteListByLanguageList.push(
          translation_with_vote_list_by_language,
        );
      }

      return {
        error: ErrorType.NoError,
        translation_with_vote_list_by_language_list:
          translationWithVoteListByLanguageList,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      translation_with_vote_list_by_language_list: null,
    };
  }

  async updateSiteTextTranslatedInfo(
    pgClient: PoolClient | null,
  ): Promise<GenericOutput> {
    try {
      const { error: languageError, site_text_language_list } =
        await this.siteTextService.getAllSiteTextLanguageList(pgClient);

      if (languageError !== ErrorType.NoError || !site_text_language_list) {
        return {
          error: languageError,
        };
      }

      for (const language of site_text_language_list) {
        const upsertInput: {
          site_text_id: number;
          is_word_definition: boolean;
          language_code: string;
          dialect_code: string | null;
          geo_code: string | null;
          count: number;
        }[] = [];

        const res = await pgClientOrPool({
          client: pgClient,
          pool: this.pg.pool,
        }).query<GetAllSiteTextWordDefinition>(
          ...getAllSiteTextWordDefinition(),
        );

        const siteTextWordDefinitionIds = res.rows.map((row) => ({
          site_text_id: +row.site_text_id,
          site_text_type_is_word: true,
        }));

        const res2 = await pgClientOrPool({
          client: pgClient,
          pool: this.pg.pool,
        }).query<GetAllSiteTextPhraseDefinition>(
          ...getAllSiteTextPhraseDefinition(),
        );

        const siteTextPhraseDefinitionIds = res2.rows.map((row) => ({
          site_text_id: +row.site_text_id,
          site_text_type_is_word: false,
        }));

        const siteTextIds = [
          ...siteTextWordDefinitionIds,
          ...siteTextPhraseDefinitionIds,
        ];

        const { translation_with_vote_list } =
          await this.getAllTranslationFromSiteTextDefinitionIDs(
            siteTextIds,
            language.language_code,
            language.dialect_code,
            language.geo_code,
            pgClient,
          );

        for (let i = 0; i < siteTextIds.length; i++) {
          if (!translation_with_vote_list[i]) {
            continue;
          }

          upsertInput.push({
            site_text_id: siteTextIds[i].site_text_id,
            is_word_definition: siteTextIds[i].site_text_type_is_word,
            language_code: language.language_code,
            dialect_code: language.dialect_code,
            geo_code: language.geo_code,
            count: translation_with_vote_list[i].length,
          });
        }

        await pgClientOrPool({
          client: pgClient,
          pool: this.pg.pool,
        }).query<SiteTextDefinitionTranslationCountUpsertsProcedureOutput>(
          ...callSiteTextDefinitionTranslationCountUpsertsProcedure({
            site_text_ids: upsertInput.map((item) => item.site_text_id),
            is_word_definitions: upsertInput.map(
              (item) => item.is_word_definition,
            ),
            language_codes: upsertInput.map((item) => item.language_code),
            dialect_codes: upsertInput.map((item) => item.dialect_code),
            geo_codes: upsertInput.map((item) => item.geo_code),
            counts: upsertInput.map((item) => item.count),
          }),
        );
      }

      return {
        error: ErrorType.NoError,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
    };
  }
}
