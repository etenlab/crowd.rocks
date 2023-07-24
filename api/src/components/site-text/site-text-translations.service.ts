import { Injectable } from '@nestjs/common';
import { QueryResult } from 'pg';

import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';

import { DefinitionsService } from 'src/components/definitions/definitions.service';
import { WordDefinitionsService } from 'src/components/definitions/word-definitions.service';
import { PhraseDefinitionsService } from 'src/components/definitions/phrase-definitions.service';
import { SiteTextTranslationVotesService } from './site-text-translation-votes.service';

import {
  SiteTextTranslationsFromInput,
  SiteTextTranslationsToInput,
  SiteTextTranslationInput,
  SiteTextTranslationUpsertOutput,
  SiteTextTranslationReadOutput,
  SiteTextTranslationWithVoteOutput,
  SiteTextTranslationWithVoteListOutput,
  SiteTextTranslationWithVote,
} from './types';

import {
  SiteTextTranslationUpsertProcedureOutputRow,
  callSiteTextTranslationUpsertProcedure,
  GetSiteTextTranslationObjectById,
  getSiteTextTranslationObjById,
  GetAllSiteTextTranslation,
  getAllSiteTextWordTranslation,
  getAllSiteTextPhraseTranslation,
  GetAllSiteTextPhraseDefinition,
  getAllSiteTextPhraseDefinition,
  GetAllSiteTextWordDefinition,
  getAllSiteTextWordDefinition,
} from './sql-string';
import {
  PhraseDefinition,
  PhraseDefinitionReadOutput,
  WordDefinition,
  WordDefinitionReadOutput,
} from '../definitions/types';

function calc_vote_weight(upvotes: number, downvotes: number): number {
  return upvotes * 2 - downvotes;
}

@Injectable()
export class SiteTextTranslationsService {
  constructor(
    private pg: PostgresService,
    private wordDefinitionService: WordDefinitionsService,
    private phraseDefinitionService: PhraseDefinitionsService,
    private definitionService: DefinitionsService,
    private siteTextTranslationVoteService: SiteTextTranslationVotesService,
  ) {}

  async read(id: number): Promise<SiteTextTranslationReadOutput> {
    try {
      const res1 = await this.pg.pool.query<GetSiteTextTranslationObjectById>(
        ...getSiteTextTranslationObjById(id),
      );

      if (res1.rowCount !== 1) {
        console.error(`no site-text-translation for id: ${id}`);
      } else {
        const site_text_translation_id = res1.rows[0].site_text_translation_id;
        const from_definition_id = res1.rows[0].from_definition_id;
        const to_definition_id = res1.rows[0].to_definition_id;
        const from_type_is_word = res1.rows[0].from_type_is_word;
        const to_type_is_word = res1.rows[0].to_type_is_word;

        let fromDefinitionOutput:
          | WordDefinitionReadOutput
          | PhraseDefinitionReadOutput;
        let toDefinitionOutput:
          | WordDefinitionReadOutput
          | PhraseDefinitionReadOutput;

        let fromDefinition: WordDefinition | PhraseDefinition;
        let toDefinition: WordDefinition | PhraseDefinition;

        if (from_type_is_word) {
          fromDefinitionOutput = await this.wordDefinitionService.read(
            from_definition_id,
          );
          fromDefinition = fromDefinitionOutput.word_definition;
        } else {
          fromDefinitionOutput = await this.phraseDefinitionService.read(
            from_definition_id,
          );
          fromDefinition = fromDefinitionOutput.phrase_definition;
        }

        if (to_type_is_word) {
          toDefinitionOutput = await this.wordDefinitionService.read(
            to_definition_id,
          );
          toDefinition = toDefinitionOutput.word_definition;
        } else {
          toDefinitionOutput = await this.phraseDefinitionService.read(
            to_definition_id,
          );
          toDefinition = toDefinitionOutput.phrase_definition;
        }

        if (fromDefinitionOutput.error !== ErrorType.NoError) {
          return {
            error: fromDefinitionOutput.error,
            site_text_translation: null,
          };
        }

        if (toDefinitionOutput.error !== ErrorType.NoError) {
          return {
            error: toDefinitionOutput.error,
            site_text_translation: null,
          };
        }

        return {
          error: ErrorType.NoError,
          site_text_translation: {
            site_text_translation_id: site_text_translation_id + '',
            from_definition: fromDefinition,
            to_definition: toDefinition,
            from_type_is_word,
            to_type_is_word,
          },
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      site_text_translation: null,
    };
  }

  async upsert(
    input: SiteTextTranslationInput,
    token: string,
  ): Promise<SiteTextTranslationUpsertOutput> {
    try {
      const res =
        await this.pg.pool.query<SiteTextTranslationUpsertProcedureOutputRow>(
          ...callSiteTextTranslationUpsertProcedure({
            from_definition_id: +input.from_definition_id,
            to_definition_id: +input.to_definition_id,
            from_type_is_word: input.from_type_is_word,
            to_type_is_word: input.to_type_is_word,
            token: token,
          }),
        );

      const creatingError = res.rows[0].p_error_type;
      const site_text_translation_id = res.rows[0].p_site_text_translation_id;

      if (creatingError !== ErrorType.NoError || !site_text_translation_id) {
        return {
          error: creatingError,
          site_text_translation: null,
        };
      }

      return this.read(site_text_translation_id);
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      site_text_translation: null,
    };
  }

  async upsertFromTranslationlikeString(
    fromInput: SiteTextTranslationsFromInput,
    toInput: SiteTextTranslationsToInput,
    token: string,
  ): Promise<SiteTextTranslationUpsertOutput> {
    if (toInput.translationlike_string.trim() === '') {
      return {
        error: ErrorType.InvalidInputs,
        site_text_translation: null,
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
            site_text_translation: null,
          };
        }

        return this.upsert(
          {
            from_definition_id: fromInput.from_definition_id,
            to_definition_id: phrase_definition.phrase_definition_id,
            from_type_is_word: fromInput.from_type_is_word,
            to_type_is_word: false,
          },
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
            site_text_translation: null,
          };
        }

        return this.upsert(
          {
            from_definition_id: fromInput.from_definition_id,
            to_definition_id: word_definition.word_definition_id,
            from_type_is_word: fromInput.from_type_is_word,
            to_type_is_word: true,
          },
          token,
        );
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      site_text_translation: null,
    };
  }

  async getAllTranslationFromSiteTextDefinitionID(
    site_text_id: number,
    site_text_type_is_word: boolean,
    language_code: string,
    dialect_code: string,
    geo_code: string,
  ): Promise<SiteTextTranslationWithVoteListOutput> {
    try {
      let res1: QueryResult<GetAllSiteTextTranslation>;

      if (site_text_type_is_word) {
        res1 = await this.pg.pool.query<GetAllSiteTextTranslation>(
          ...getAllSiteTextWordTranslation({
            site_text_id,
            language_code,
            dialect_code,
            geo_code,
          }),
        );
      } else {
        res1 = await this.pg.pool.query<GetAllSiteTextTranslation>(
          ...getAllSiteTextPhraseTranslation({
            site_text_id,
            language_code,
            dialect_code,
            geo_code,
          }),
        );
      }

      const siteTextTranslationWithVoteList: SiteTextTranslationWithVote[] = [];

      for (let i = 0; i < res1.rowCount; i++) {
        const { site_text_translation_id, created_at } = res1.rows[i];
        const { error, vote_status } =
          await this.siteTextTranslationVoteService.getVoteStatus(
            site_text_translation_id,
          );

        if (error !== ErrorType.NoError) {
          return {
            error,
            site_text_translation_with_vote_list: [],
          };
        }

        const { error: readError, site_text_translation } = await this.read(
          site_text_translation_id,
        );

        if (readError !== ErrorType.NoError) {
          continue;
        }

        siteTextTranslationWithVoteList.push({
          ...site_text_translation,
          upvotes: vote_status.upvotes,
          downvotes: vote_status.downvotes,
          created_at: created_at,
        });
      }

      return {
        error: ErrorType.NoError,
        site_text_translation_with_vote_list: siteTextTranslationWithVoteList,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      site_text_translation_with_vote_list: [],
    };
  }

  async getRecommendedTranslationFromSiteTextDefinitionID(
    site_text_id: number,
    site_text_type_is_word: boolean,
    language_code: string,
    dialect_code: string,
    geo_code: string,
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

      let mostVoted: SiteTextTranslationWithVote | null = null;

      for (const siteTextTranslationWithVote of site_text_translation_with_vote_list) {
        if (mostVoted !== null) {
          const a = calc_vote_weight(mostVoted.upvotes, mostVoted.downvotes);
          const b = calc_vote_weight(
            siteTextTranslationWithVote.upvotes,
            siteTextTranslationWithVote.downvotes,
          );

          if (a > b) {
            continue;
          }

          if (
            a === b &&
            new Date(mostVoted.created_at) <
              new Date(siteTextTranslationWithVote.created_at)
          ) {
            continue;
          }
        }

        mostVoted = siteTextTranslationWithVote;
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

  async getAllRecommendedTranslation(
    language_code: string,
    dialect_code: string,
    geo_code: string,
  ): Promise<SiteTextTranslationWithVoteListOutput> {
    try {
      const res1 = await this.pg.pool.query<GetAllSiteTextWordDefinition>(
        ...getAllSiteTextWordDefinition(),
      );

      const siteTextTranslationWithVoteList: SiteTextTranslationWithVote[] = [];

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
            site_text_translation_with_vote_list: [],
          };
        }

        siteTextTranslationWithVoteList.push(site_text_translation_with_vote);
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
            site_text_translation_with_vote_list: [],
          };
        }

        siteTextTranslationWithVoteList.push(site_text_translation_with_vote);
      }

      return {
        error: ErrorType.NoError,
        site_text_translation_with_vote_list: siteTextTranslationWithVoteList,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      site_text_translation_with_vote_list: [],
    };
  }
}
