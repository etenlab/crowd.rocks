import { Injectable } from '@nestjs/common';

import { ErrorType } from 'src/common/types';
import { calc_vote_weight } from 'src/common/utility';

import { PostgresService } from 'src/core/postgres.service';

import { DefinitionsService } from 'src/components/definitions/definitions.service';
import { TranslationsService } from 'src/components/translations/translations.service';

import { SiteTextsService } from './site-texts.service';
import { SiteTextTranslationVotesService } from './site-text-translation-votes.service';

import {
  TranslationUpsertOutput,
  WordToWordTranslationWithVote,
  WordToPhraseTranslationWithVote,
  PhraseToWordTranslationWithVote,
  PhraseToPhraseTranslationWithVote,
} from 'src/components/translations/types';

import {
  SiteTextWordToWordTranslationWithVote,
  SiteTextWordToPhraseTranslationWithVote,
  SiteTextPhraseToWordTranslationWithVote,
  SiteTextPhraseToPhraseTranslationWithVote,
  SiteTextTranslationWithVoteOutput,
  SiteTextTranslationWithVoteListOutput,
  SiteTextTranslationsFromInput,
  SiteTextTranslationsToInput,
  SiteTextTranslationUpsertInput,
  SiteTextTranslationVoteStatusOutputRow,
  SiteTextTranslationWithVoteListByLanguage,
  SiteTextTranslationWithVoteListByLanguageOutput,
  SiteTextTranslationWithVoteListByLanguageListOutput,
} from './types';

import {
  getSiteTextPhraseDefinitionObjById,
  GetSiteTextPhraseDefinitionObjectById,
  getSiteTextWordDefinitionObjById,
  GetSiteTextWordDefinitionObjectById,
  GetAllSiteTextPhraseDefinition,
  getAllSiteTextPhraseDefinition,
  GetAllSiteTextWordDefinition,
  getAllSiteTextWordDefinition,
  GetDefinitionIdBySiteTextId,
  getDefinitionIdBySiteTextId,
} from './sql-string';

@Injectable()
export class SiteTextTranslationsService {
  constructor(
    private pg: PostgresService,
    private definitionService: DefinitionsService,
    private translationService: TranslationsService,
    private siteTextService: SiteTextsService,
    private siteTextTranslationVoteService: SiteTextTranslationVotesService,
  ) {}

  async upsertFromTranslationlikeString(
    fromInput: SiteTextTranslationsFromInput,
    toInput: SiteTextTranslationsToInput,
    token: string,
  ): Promise<TranslationUpsertOutput> {
    if (toInput.translationlike_string.trim() === '') {
      return {
        error: ErrorType.InvalidInputs,
        translation: null,
      };
    }

    try {
      const words = toInput.translationlike_string.split(' ');

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
  ): Promise<TranslationUpsertOutput> {
    try {
      const res1 = await this.pg.pool.query<GetDefinitionIdBySiteTextId>(
        ...getDefinitionIdBySiteTextId(
          +input.site_text_id,
          input.is_word_definition,
        ),
      );

      if (res1.rowCount !== 1) {
        console.error(`no site-text-definition for id: ${input.site_text_id}`);
      } else {
        const from_definition_id = res1.rows[0].definition_id;
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
  ): Promise<SiteTextTranslationWithVoteListOutput> {
    try {
      let from_definition_id: number;

      if (site_text_type_is_word) {
        const res =
          await this.pg.pool.query<GetSiteTextWordDefinitionObjectById>(
            ...getSiteTextWordDefinitionObjById(site_text_id),
          );

        if (res.rowCount !== 1) {
          return {
            error: ErrorType.SiteTextWordDefinitionNotFound,
            site_text_translation_with_vote_list: null,
          };
        } else {
          from_definition_id = +res.rows[0].word_definition_id;
        }
      } else {
        const res =
          await this.pg.pool.query<GetSiteTextPhraseDefinitionObjectById>(
            ...getSiteTextPhraseDefinitionObjById(site_text_id),
          );

        if (res.rowCount !== 1) {
          return {
            error: ErrorType.SiteTextPhraseDefinitionNotFound,
            site_text_translation_with_vote_list: null,
          };
        } else {
          from_definition_id = +res.rows[0].phrase_definition_id;
        }
      }

      const { error, translation_with_vote_list } =
        await this.translationService.getTranslationsByFromDefinitionId(
          from_definition_id,
          site_text_type_is_word,
          {
            language_code,
            dialect_code,
            geo_code,
          },
        );

      if (error !== ErrorType.NoError || translation_with_vote_list === null) {
        return {
          error,
          site_text_translation_with_vote_list: null,
        };
      }

      const new_translation_with_vote_list: (
        | SiteTextWordToWordTranslationWithVote
        | SiteTextWordToPhraseTranslationWithVote
        | SiteTextPhraseToWordTranslationWithVote
        | SiteTextPhraseToPhraseTranslationWithVote
      )[] = [];

      for (const translation_with_vote of translation_with_vote_list) {
        let vote_status_output: SiteTextTranslationVoteStatusOutputRow;

        if ((translation_with_vote as any)?.word_to_word_translation_id) {
          vote_status_output =
            await this.siteTextTranslationVoteService.getVoteStatus(
              +(translation_with_vote as WordToWordTranslationWithVote)
                .word_to_word_translation_id,
              true,
              true,
            );
        } else if (
          (translation_with_vote as any)?.word_to_phrase_translation_id
        ) {
          vote_status_output =
            await this.siteTextTranslationVoteService.getVoteStatus(
              +(translation_with_vote as WordToPhraseTranslationWithVote)
                .word_to_phrase_translation_id,
              true,
              false,
            );
        } else if (
          (translation_with_vote as any)?.phrase_to_word_translation_id
        ) {
          vote_status_output =
            await this.siteTextTranslationVoteService.getVoteStatus(
              +(translation_with_vote as PhraseToWordTranslationWithVote)
                .phrase_to_word_translation_id,
              false,
              true,
            );
        } else if (
          (translation_with_vote as any)?.phrase_to_phrase_translation_id
        ) {
          vote_status_output =
            await this.siteTextTranslationVoteService.getVoteStatus(
              +(translation_with_vote as PhraseToPhraseTranslationWithVote)
                .phrase_to_phrase_translation_id,
              false,
              false,
            );
        }

        if (vote_status_output.error !== ErrorType.NoError) {
          return {
            error,
            site_text_translation_with_vote_list: null,
          };
        }

        new_translation_with_vote_list.push({
          ...translation_with_vote,
          upvotes: vote_status_output.vote_status.upvotes,
          downvotes: vote_status_output.vote_status.downvotes,
        });
      }

      return {
        error: ErrorType.NoError,
        site_text_translation_with_vote_list: new_translation_with_vote_list,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      site_text_translation_with_vote_list: null,
    };
  }

  async getRecommendedTranslationFromSiteTextDefinitionID(
    site_text_id: number,
    site_text_type_is_word: boolean,
    language_code: string,
    dialect_code: string | null,
    geo_code: string | null,
  ): Promise<SiteTextTranslationWithVoteOutput> {
    try {
      const { error, site_text_translation_with_vote_list } =
        await this.getAllTranslationFromSiteTextDefinitionID(
          site_text_id,
          site_text_type_is_word,
          language_code,
          dialect_code,
          geo_code,
        );

      if (error !== ErrorType.NoError) {
        return {
          error: error,
          site_text_translation_with_vote: null,
        };
      }

      let mostVoted:
        | SiteTextWordToWordTranslationWithVote
        | SiteTextWordToPhraseTranslationWithVote
        | SiteTextPhraseToWordTranslationWithVote
        | SiteTextPhraseToPhraseTranslationWithVote
        | null = null;

      for (const translation_with_vote of site_text_translation_with_vote_list) {
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
          site_text_translation_with_vote: null,
        };
      }

      return {
        error: ErrorType.NoError,
        site_text_translation_with_vote: mostVoted,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      site_text_translation_with_vote: null,
    };
  }

  async getAllRecommendedTranslationListByLanguage(
    language_code: string,
    dialect_code: string | null,
    geo_code: string | null,
  ): Promise<SiteTextTranslationWithVoteListByLanguageOutput> {
    try {
      const res1 = await this.pg.pool.query<GetAllSiteTextWordDefinition>(
        ...getAllSiteTextWordDefinition(),
      );

      const translationWithVoteList: (
        | SiteTextWordToWordTranslationWithVote
        | SiteTextWordToPhraseTranslationWithVote
        | SiteTextPhraseToWordTranslationWithVote
        | SiteTextPhraseToPhraseTranslationWithVote
      )[] = [];

      for (let i = 0; i < res1.rowCount; i++) {
        const { error, site_text_translation_with_vote } =
          await this.getRecommendedTranslationFromSiteTextDefinitionID(
            res1.rows[i].site_text_id,
            true,
            language_code,
            dialect_code,
            geo_code,
          );

        if (error !== ErrorType.NoError) {
          return {
            error,
            site_text_translation_with_vote_list_by_language: {
              site_text_translation_with_vote_list: null,
              language_code,
              dialect_code,
              geo_code,
            },
          };
        }

        if (site_text_translation_with_vote) {
          translationWithVoteList.push(site_text_translation_with_vote);
        }
      }

      const res2 = await this.pg.pool.query<GetAllSiteTextPhraseDefinition>(
        ...getAllSiteTextPhraseDefinition(),
      );

      for (let i = 0; i < res2.rowCount; i++) {
        const { error, site_text_translation_with_vote } =
          await this.getRecommendedTranslationFromSiteTextDefinitionID(
            res2.rows[i].site_text_id,
            false,
            language_code,
            dialect_code,
            geo_code,
          );

        if (error !== ErrorType.NoError) {
          return {
            error,
            site_text_translation_with_vote_list_by_language: {
              site_text_translation_with_vote_list: null,
              language_code,
              dialect_code,
              geo_code,
            },
          };
        }

        if (site_text_translation_with_vote) {
          translationWithVoteList.push(site_text_translation_with_vote);
        }
      }

      return {
        error: ErrorType.NoError,
        site_text_translation_with_vote_list_by_language: {
          site_text_translation_with_vote_list: translationWithVoteList,
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
      site_text_translation_with_vote_list_by_language: {
        site_text_translation_with_vote_list: null,
        language_code,
        dialect_code,
        geo_code,
      },
    };
  }

  async getAllRecommendedTranslationList(): Promise<SiteTextTranslationWithVoteListByLanguageListOutput> {
    try {
      const { error: languageError, site_text_language_list } =
        await this.siteTextService.getAllSiteTextLanguageList();

      if (languageError !== ErrorType.NoError) {
        return {
          error: languageError,
          site_text_translation_with_vote_list_by_language_list: null,
        };
      }

      const siteTextTranslationWithVoteListByLanguageList: SiteTextTranslationWithVoteListByLanguage[] =
        [];

      for (const language of site_text_language_list) {
        const { error, site_text_translation_with_vote_list_by_language } =
          await this.getAllRecommendedTranslationListByLanguage(
            language.language_code,
            language.dialect_code,
            language.geo_code,
          );

        if (error !== ErrorType.NoError) {
          return {
            error,
            site_text_translation_with_vote_list_by_language_list: null,
          };
        }

        siteTextTranslationWithVoteListByLanguageList.push(
          site_text_translation_with_vote_list_by_language,
        );
      }

      return {
        error: ErrorType.NoError,
        site_text_translation_with_vote_list_by_language_list:
          siteTextTranslationWithVoteListByLanguageList,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      site_text_translation_with_vote_list_by_language_list: null,
    };
  }
}
