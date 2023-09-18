import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';

import { pgClientOrPool } from 'src/common/utility';

import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';

import { PhraseDefinitionsService } from 'src/components/definitions/phrase-definitions.service';

import {
  SiteTextPhraseDefinitionOutput,
  SiteTextPhraseDefinitionsOutput,
  SiteTextPhraseDefinitionListOutput,
  SiteTextPhraseDefinition,
} from './types';
import { PhraseDefinition } from 'src/components/definitions/types';

import {
  getSiteTextPhraseDefinitionObjByIds,
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

  async read(
    id: number,
    pgClient: PoolClient | null,
  ): Promise<SiteTextPhraseDefinitionOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetSiteTextPhraseDefinitionObjectById>(
        ...getSiteTextPhraseDefinitionObjByIds([id]),
      );

      if (res.rowCount !== 1) {
        console.error(`no site-text-phrase-definition for id: ${id}`);
      } else {
        const { error, phrase_definition } =
          await this.phraseDefinitionService.read(
            +res.rows[0].phrase_definition_id,
            pgClient,
          );

        if (error !== ErrorType.NoError || !phrase_definition) {
          return {
            error,
            site_text_phrase_definition: null,
          };
        }

        return {
          error: ErrorType.NoError,
          site_text_phrase_definition: {
            site_text_id: id + '',
            phrase_definition: phrase_definition,
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

  async reads(
    ids: number[],
    pgClient: PoolClient | null,
  ): Promise<SiteTextPhraseDefinitionsOutput> {
    try {
      const res1 = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetSiteTextPhraseDefinitionObjectById>(
        ...getSiteTextPhraseDefinitionObjByIds(ids),
      );

      const siteTextPhraseDefinitionsMap = new Map<
        string,
        GetSiteTextPhraseDefinitionObjectById
      >();

      res1.rows.forEach((row) =>
        siteTextPhraseDefinitionsMap.set(row.site_text_id, row),
      );

      const phraseDefinitionIds = res1.rows.map(
        (row) => +row.phrase_definition_id,
      );

      const { error, phrase_definitions } =
        await this.phraseDefinitionService.reads(phraseDefinitionIds, pgClient);

      if (error !== ErrorType.NoError) {
        return {
          error,
          site_text_phrase_definitions: [],
        };
      }

      const phraseDefinitionsMap = new Map<string, PhraseDefinition>();

      phrase_definitions.forEach((phraseDefinition) =>
        phraseDefinition
          ? phraseDefinitionsMap.set(
              phraseDefinition.phrase_definition_id,
              phraseDefinition,
            )
          : null,
      );

      return {
        error: ErrorType.NoError,
        site_text_phrase_definitions: ids.map((id) => {
          const row = siteTextPhraseDefinitionsMap.get(id + '');

          if (!row) {
            return null;
          }

          const phraseDefinition = phraseDefinitionsMap.get(
            row.phrase_definition_id + '',
          );

          if (!phraseDefinition) {
            return null;
          }

          return {
            site_text_id: row.site_text_id,
            phrase_definition: phraseDefinition,
          };
        }),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      site_text_phrase_definitions: [],
    };
  }

  async getDefinitionIdFromWordId(
    phrase_id: number,
    pgClient: PoolClient | null,
  ): Promise<number | null> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetDefinitionIdFromPhraseId>(
        ...getDefinitionIdFromPhraseId(phrase_id),
      );

      if (res.rowCount === 0) {
        return null;
      } else {
        return +res.rows[0].phrase_definition_id;
      }
    } catch (e) {
      console.error(e);
    }

    return null;
  }

  async upsert(
    phrase_definition_id: number,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<SiteTextPhraseDefinitionOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<SiteTextPhraseDefinitionUpsertProcedureOutputRow>(
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
        await this.read(+site_text_id, pgClient);

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

  async getAllSiteTextPhraseDefinitions({
    filter,
    pgClient,
  }: {
    filter?: string;
    pgClient: PoolClient | null;
  }): Promise<SiteTextPhraseDefinitionListOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetAllSiteTextPhraseDefinition>(
        ...getAllSiteTextPhraseDefinition(filter),
      );

      const siteTextIds = res.rows.map((row) => +row.site_text_id);

      const { error, site_text_phrase_definitions } = await this.reads(
        siteTextIds,
        pgClient,
      );

      if (error !== ErrorType.NoError) {
        return {
          error,
          site_text_phrase_definition_list: [],
        };
      }

      return {
        error: ErrorType.NoError,
        site_text_phrase_definition_list: site_text_phrase_definitions.filter(
          (definition) => definition,
        ) as SiteTextPhraseDefinition[],
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
