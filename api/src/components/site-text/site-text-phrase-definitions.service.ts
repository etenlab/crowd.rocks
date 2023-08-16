import { Injectable } from '@nestjs/common';

import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';

import { PhraseDefinitionsService } from 'src/components/definitions/phrase-definitions.service';

import {
  SiteTextPhraseDefinitionOutput,
  SiteTextPhraseDefinitionListOutput,
} from './types';

import {
  getSiteTextPhraseDefinitionObjById,
  GetSiteTextPhraseDefinitionObjectById,
  callSiteTextPhraseDefinitionUpsertProcedure,
  SiteTextPhraseDefinitionUpsertProcedureOutputRow,
  GetAllSiteTextPhraseDefinition,
  getAllSiteTextPhraseDefinition,
  GetDefinitionIdFromPhraseId,
  getDefinitionIdFromPhraseId,
} from './sql-string';

@Injectable()
export class SiteTextPhraseDefinitionsService {
  constructor(
    private pg: PostgresService,
    private phraseDefinitionService: PhraseDefinitionsService,
  ) {}

  async read(id: number): Promise<SiteTextPhraseDefinitionOutput> {
    try {
      const res1 =
        await this.pg.pool.query<GetSiteTextPhraseDefinitionObjectById>(
          ...getSiteTextPhraseDefinitionObjById(id),
        );

      if (res1.rowCount !== 1) {
        console.error(`no site-text-phrase-definition for id: ${id}`);
      } else {
        const phraseDefinition = await this.phraseDefinitionService.read(
          res1.rows[0].phrase_definition_id,
        );

        return {
          error: phraseDefinition.error,
          site_text_phrase_definition: {
            site_text_id: id + '',
            phrase_definition: phraseDefinition.phrase_definition,
          },
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      site_text_phrase_definition: null,
    };
  }

  async getDefinitionIdFromWordId(phrase_id: number): Promise<number | null> {
    try {
      const res = await this.pg.pool.query<GetDefinitionIdFromPhraseId>(
        ...getDefinitionIdFromPhraseId(phrase_id),
      );

      if (res.rowCount === 0) {
        return null;
      } else {
        return res.rows[0].phrase_definition_id;
      }
    } catch (e) {
      console.error(e);
    }

    return null;
  }

  async upsert(
    phrase_definition_id: number,
    token: string,
  ): Promise<SiteTextPhraseDefinitionOutput> {
    try {
      const res =
        await this.pg.pool.query<SiteTextPhraseDefinitionUpsertProcedureOutputRow>(
          ...callSiteTextPhraseDefinitionUpsertProcedure({
            phrase_definition_id: phrase_definition_id,
            token: token,
          }),
        );

      const creatingError = res.rows[0].p_error_type;
      const site_text_id = res.rows[0].p_site_text_id;

      if (creatingError !== ErrorType.NoError || !site_text_id) {
        return {
          error: creatingError,
          site_text_phrase_definition: null,
        };
      }

      const { error: readingError, site_text_phrase_definition } =
        await this.read(site_text_id);

      return {
        error: readingError,
        site_text_phrase_definition: site_text_phrase_definition,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      site_text_phrase_definition: null,
    };
  }

  async getAllSiteTextPhraseDefinitions(
    filter?: string,
  ): Promise<SiteTextPhraseDefinitionListOutput> {
    try {
      const res1 = await this.pg.pool.query<GetAllSiteTextPhraseDefinition>(
        ...getAllSiteTextPhraseDefinition(filter),
      );

      const siteTextPhraseDefinitionList = [];

      for (let i = 0; i < res1.rowCount; i++) {
        const { error, site_text_phrase_definition } = await this.read(
          res1.rows[i].site_text_id,
        );

        if (error !== ErrorType.NoError) {
          return {
            error,
            site_text_phrase_definition_list: [],
          };
        }

        siteTextPhraseDefinitionList.push(site_text_phrase_definition);
      }

      return {
        error: ErrorType.NoError,
        site_text_phrase_definition_list: siteTextPhraseDefinitionList,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      site_text_phrase_definition_list: [],
    };
  }
}
