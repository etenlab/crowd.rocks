import { Injectable } from '@nestjs/common';

import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';

import { SiteTextWordDefinitionsService } from './site-text-word-definitions.service';
import { SiteTextPhraseDefinitionsService } from './site-text-phrase-definitions.service';

import { DefinitionsService } from 'src/components/definitions/definitions.service';

import {
  SiteTextUpsertInput,
  SiteTextUpsertOutput,
  SiteTextDefinitionListOutput,
  SiteTextLanguageListOutput,
} from './types';

import {
  DefinitionUpdateaInput,
  DefinitionUpdateOutput,
} from 'src/components/definitions/types';

import { GetSiteTextLanguageList, getSiteTextLanguageList } from './sql-string';

@Injectable()
export class SiteTextsService {
  constructor(
    private pg: PostgresService,
    private siteTextWordDefinitionService: SiteTextWordDefinitionsService,
    private siteTextPhraseDefinitionService: SiteTextPhraseDefinitionsService,
    private definitionService: DefinitionsService,
  ) {}

  async upsert(
    input: SiteTextUpsertInput,
    token: string,
  ): Promise<SiteTextUpsertOutput> {
    if (input.siteTextlike_string.trim() === '') {
      return {
        error: ErrorType.InvalidInputs,
        site_text_phrase_definition: null,
        site_text_word_definition: null,
      };
    }

    try {
      const words = input.siteTextlike_string.split(' ');

      if (words.length > 1) {
        const { error, phrase_definition } =
          await this.definitionService.upsertFromPhraseAndDefinitionlikeString(
            {
              phraselike_string: input.siteTextlike_string.trim(),
              definitionlike_string: input.definitionlike_string,
              language_code: input.language_code,
              dialect_code: input.dialect_code,
              geo_code: input.geo_code,
            },
            token,
          );

        if (error !== ErrorType.NoError || phrase_definition === null) {
          return {
            error: error,
            site_text_phrase_definition: null,
            site_text_word_definition: null,
          };
        }

        const {
          error: siteTextPhraseDefinitionError,
          site_text_phrase_definition,
        } = await this.siteTextPhraseDefinitionService.upsert(
          {
            phrase_definition_id: phrase_definition.phrase_definition_id + '',
          },
          token,
        );

        return {
          error: siteTextPhraseDefinitionError,
          site_text_phrase_definition,
          site_text_word_definition: null,
        };
      } else {
        const { error, word_definition } =
          await this.definitionService.upsertFromWordAndDefinitionlikeString(
            {
              wordlike_string: input.siteTextlike_string.trim(),
              definitionlike_string: input.definitionlike_string,
              language_code: input.language_code,
              dialect_code: input.dialect_code,
              geo_code: input.geo_code,
            },
            token,
          );

        if (error !== ErrorType.NoError || word_definition === null) {
          return {
            error: error,
            site_text_phrase_definition: null,
            site_text_word_definition: null,
          };
        }

        const {
          error: siteTextWordDefinitionError,
          site_text_word_definition,
        } = await this.siteTextWordDefinitionService.upsert(
          {
            word_definition_id: word_definition.word_definition_id + '',
          },
          token,
        );

        return {
          error: siteTextWordDefinitionError,
          site_text_phrase_definition: null,
          site_text_word_definition,
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      site_text_phrase_definition: null,
      site_text_word_definition: null,
    };
  }

  async updateDefinition(
    input: DefinitionUpdateaInput,
    token: string,
  ): Promise<DefinitionUpdateOutput> {
    return this.definitionService.updateDefinition(input, token);
  }

  async getAllSiteTextDefinitions(): Promise<SiteTextDefinitionListOutput> {
    try {
      const { error: wordError, site_text_word_definition_list } =
        await this.siteTextWordDefinitionService.getAllSiteTextWordDefinitions();

      if (wordError !== ErrorType.NoError) {
        return {
          error: wordError,
          site_text_phrase_definition_list: [],
          site_text_word_definition_list: [],
        };
      }

      const { error: phraseError, site_text_phrase_definition_list } =
        await this.siteTextPhraseDefinitionService.getAllSiteTextPhraseDefinitions();

      if (phraseError !== ErrorType.NoError) {
        return {
          error: phraseError,
          site_text_phrase_definition_list: [],
          site_text_word_definition_list: [],
        };
      }

      return {
        error: ErrorType.NoError,
        site_text_word_definition_list,
        site_text_phrase_definition_list,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      site_text_word_definition_list: [],
      site_text_phrase_definition_list: [],
    };
  }

  async getAllSiteTextLanguageList(): Promise<SiteTextLanguageListOutput> {
    try {
      const res1 = await this.pg.pool.query<GetSiteTextLanguageList>(
        ...getSiteTextLanguageList(),
      );
      const siteTextLanguageList = [];

      for (let i = 0; i < res1.rowCount; i++) {
        siteTextLanguageList.push({
          language_code: res1.rows[i].language_code,
          dialect_code: res1.rows[i].dialect_code,
          geo_code: res1.rows[i].geo_code,
        });
      }

      return {
        error: ErrorType.NoError,
        site_text_language_list: siteTextLanguageList,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      site_text_language_list: [],
    };
  }
}
