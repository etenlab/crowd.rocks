import { Injectable } from '@nestjs/common';

import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';

import { WordDefinitionsService } from 'src/components/definitions/word-definitions.service';

import {
  SiteTextWordDefinitionOutput,
  SiteTextWordDefinitionListOutput,
} from './types';

import {
  getSiteTextWordDefinitionObjById,
  GetSiteTextWordDefinitionObjectById,
  callSiteTextWordDefinitionUpsertProcedure,
  SiteTextWordDefinitionUpsertProcedureOutputRow,
  getAllSiteTextWordDefinition,
  GetAllSiteTextWordDefinition,
  GetDefinitionIdFromWordId,
  getDefinitionIdFromWordId,
} from './sql-string';

@Injectable()
export class SiteTextWordDefinitionsService {
  constructor(
    private pg: PostgresService,
    private wordDefinitionService: WordDefinitionsService,
  ) {}

  async read(id: number): Promise<SiteTextWordDefinitionOutput> {
    try {
      const res1 =
        await this.pg.pool.query<GetSiteTextWordDefinitionObjectById>(
          ...getSiteTextWordDefinitionObjById(id),
        );

      if (res1.rowCount !== 1) {
        console.error(`no site-text-word-definition for id: ${id}`);
      } else {
        const wordDefinition = await this.wordDefinitionService.read(
          res1.rows[0].word_definition_id,
        );

        return {
          error: wordDefinition.error,
          site_text_word_definition: {
            site_text_id: id + '',
            word_definition: wordDefinition.word_definition,
          },
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      site_text_word_definition: null,
    };
  }

  async getDefinitionIdFromWordId(word_id: number): Promise<number | null> {
    try {
      const res = await this.pg.pool.query<GetDefinitionIdFromWordId>(
        ...getDefinitionIdFromWordId(word_id),
      );

      if (res.rowCount === 0) {
        return null;
      } else {
        return res.rows[0].word_definition_id;
      }
    } catch (e) {
      console.error(e);
    }

    return null;
  }

  async upsert(
    word_definition_id: number,
    token: string,
  ): Promise<SiteTextWordDefinitionOutput> {
    try {
      const res =
        await this.pg.pool.query<SiteTextWordDefinitionUpsertProcedureOutputRow>(
          ...callSiteTextWordDefinitionUpsertProcedure({
            word_definition_id: word_definition_id,
            token: token,
          }),
        );

      const creatingError = res.rows[0].p_error_type;
      const site_text_id = res.rows[0].p_site_text_id;

      if (creatingError !== ErrorType.NoError || !site_text_id) {
        return {
          error: creatingError,
          site_text_word_definition: null,
        };
      }

      const { error: readingError, site_text_word_definition } =
        await this.read(site_text_id);

      return {
        error: readingError,
        site_text_word_definition: site_text_word_definition,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      site_text_word_definition: null,
    };
  }

  async getAllSiteTextWordDefinitions(
    filter?: string,
  ): Promise<SiteTextWordDefinitionListOutput> {
    try {
      const res1 = await this.pg.pool.query<GetAllSiteTextWordDefinition>(
        ...getAllSiteTextWordDefinition(filter),
      );

      const siteTextWordDefinitionList = [];

      for (let i = 0; i < res1.rowCount; i++) {
        const { error, site_text_word_definition } = await this.read(
          res1.rows[i].site_text_id,
        );

        if (error !== ErrorType.NoError) {
          return {
            error,
            site_text_word_definition_list: [],
          };
        }

        siteTextWordDefinitionList.push(site_text_word_definition);
      }

      return {
        error: ErrorType.NoError,
        site_text_word_definition_list: siteTextWordDefinitionList,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      site_text_word_definition_list: [],
    };
  }
}
