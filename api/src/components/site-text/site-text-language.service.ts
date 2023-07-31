import { Injectable } from '@nestjs/common';

import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';

import {
  SiteTextLanguageOutput,
  SiteTextLanguageUpsertInput,
  SiteTextLanguageListOutput,
} from './types';

import {
  GetSiteTextLanguageObjectById,
  getSiteTextLanguageObjById,
  SiteTextLanguageUpsertProcedureOutputRow,
  callSiteTextLanguageUpsertProcedure,
  GetAllSiteTextLanguageList,
  getAllSiteTextLanguageList,
} from './sql-string';

@Injectable()
export class SiteTextLanguagesService {
  constructor(private pg: PostgresService) {}

  async read(id: number): Promise<SiteTextLanguageOutput> {
    try {
      const res1 = await this.pg.pool.query<GetSiteTextLanguageObjectById>(
        ...getSiteTextLanguageObjById(id),
      );

      if (res1.rowCount !== 1) {
        console.error(`no site-text-language for id: ${id}`);
      } else {
        return {
          error: ErrorType.NoError,
          site_text_language: {
            site_text_language_id: id + '',
            language_code: res1.rows[0].language_code,
            dialect_code: res1.rows[0].dialect_code,
            geo_code: res1.rows[0].geo_code,
          },
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      site_text_language: null,
    };
  }

  async upsert(
    input: SiteTextLanguageUpsertInput,
  ): Promise<SiteTextLanguageOutput> {
    try {
      const res =
        await this.pg.pool.query<SiteTextLanguageUpsertProcedureOutputRow>(
          ...callSiteTextLanguageUpsertProcedure(input),
        );

      const creatingError = res.rows[0].p_error_type;
      const site_text_language_id = res.rows[0].p_site_text_language_id;

      if (creatingError !== ErrorType.NoError || !site_text_language_id) {
        return {
          error: creatingError,
          site_text_language: null,
        };
      }

      return this.read(site_text_language_id);
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      site_text_language: null,
    };
  }

  async getSiteTextLanguageList(): Promise<SiteTextLanguageListOutput> {
    try {
      const res1 = await this.pg.pool.query<GetAllSiteTextLanguageList>(
        ...getAllSiteTextLanguageList(),
      );

      const siteTextLanguageList = [];

      for (let i = 0; i < res1.rowCount; i++) {
        const { error, site_text_language } = await this.read(
          res1.rows[i].site_text_language_id,
        );

        if (error !== ErrorType.NoError) {
          return {
            error,
            site_text_language_list: [],
          };
        }

        siteTextLanguageList.push(site_text_language);
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
