import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';

import { pgClientOrPool } from 'src/common/utility';

import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';

import { WordDefinitionsService } from 'src/components/definitions/word-definitions.service';

import {
  SiteTextWordDefinitionOutput,
  SiteTextWordDefinitionListOutput,
  SiteTextWordDefinitionsOutput,
  SiteTextWordDefinition,
} from './types';

import {
  getSiteTextWordDefinitionObjByIds,
  GetSiteTextWordDefinitionObjectById,
  callSiteTextWordDefinitionUpsertProcedure,
  SiteTextWordDefinitionUpsertProcedureOutputRow,
  getAllSiteTextWordDefinition,
  GetAllSiteTextWordDefinition,
  GetDefinitionIdFromWordId,
  getDefinitionIdFromWordId,
} from './sql-string';
import { WordDefinition } from '../definitions/types';

@Injectable()
export class SiteTextWordDefinitionsService {
  constructor(
    private pg: PostgresService,
    private wordDefinitionService: WordDefinitionsService,
  ) {}

  async read(
    id: number,
    pgClient: PoolClient | null,
  ): Promise<SiteTextWordDefinitionOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetSiteTextWordDefinitionObjectById>(
        ...getSiteTextWordDefinitionObjByIds([id]),
      );

      if (res.rowCount !== 1) {
        return {
          error: ErrorType.SiteTextWordDefinitionNotFound,
          site_text_word_definition: null,
        };
      } else {
        const { error, word_definition } =
          await this.wordDefinitionService.read(
            +res.rows[0].word_definition_id,
            pgClient,
          );

        if (error !== ErrorType.NoError || !word_definition) {
          return {
            error,
            site_text_word_definition: null,
          };
        }

        return {
          error: ErrorType.NoError,
          site_text_word_definition: {
            site_text_id: id + '',
            word_definition: word_definition,
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

  async reads(
    ids: number[],
    pgClient: PoolClient | null,
  ): Promise<SiteTextWordDefinitionsOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetSiteTextWordDefinitionObjectById>(
        ...getSiteTextWordDefinitionObjByIds(ids),
      );

      const siteTextWordDefinitionsMap = new Map<
        string,
        GetSiteTextWordDefinitionObjectById
      >();

      res.rows.forEach((row) =>
        siteTextWordDefinitionsMap.set(row.site_text_id, row),
      );

      const wordDefinitionIds = res.rows.map((row) => +row.word_definition_id);

      const { error, word_definitions } =
        await this.wordDefinitionService.reads(wordDefinitionIds, pgClient);

      if (error !== ErrorType.NoError) {
        return {
          error,
          site_text_word_definitions: [],
        };
      }

      const wordDefinitionsMap = new Map<string, WordDefinition>();

      word_definitions.forEach((wordDefinition) =>
        wordDefinition
          ? wordDefinitionsMap.set(
              wordDefinition.word_definition_id,
              wordDefinition,
            )
          : null,
      );

      return {
        error: ErrorType.NoError,
        site_text_word_definitions: ids.map((id) => {
          const row = siteTextWordDefinitionsMap.get(id + '');

          if (!row) {
            return null;
          }

          const wordDefinition = wordDefinitionsMap.get(
            row.word_definition_id + '',
          );

          if (!wordDefinition) {
            return null;
          }

          return {
            site_text_id: row.site_text_id,
            word_definition: wordDefinition,
          };
        }),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      site_text_word_definitions: [],
    };
  }

  async getDefinitionIdFromWordId(
    word_id: number,
    pgClient: PoolClient | null,
  ): Promise<number | null> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetDefinitionIdFromWordId>(
        ...getDefinitionIdFromWordId(word_id),
      );

      if (res.rowCount === 0) {
        return null;
      } else {
        return +res.rows[0].word_definition_id;
      }
    } catch (e) {
      console.error(e);
    }

    return null;
  }

  async upsert(
    word_definition_id: number,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<SiteTextWordDefinitionOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<SiteTextWordDefinitionUpsertProcedureOutputRow>(
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
        await this.read(+site_text_id, pgClient);

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

  async getAllSiteTextWordDefinitions({
    pgClient,
    filter,
  }: {
    pgClient: PoolClient | null;
    filter?: string;
  }): Promise<SiteTextWordDefinitionListOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetAllSiteTextWordDefinition>(
        ...getAllSiteTextWordDefinition(filter),
      );

      const siteTextIds = res.rows.map((row) => +row.site_text_id);

      const { error, site_text_word_definitions } = await this.reads(
        siteTextIds,
        pgClient,
      );

      if (error !== ErrorType.NoError) {
        return {
          error,
          site_text_word_definition_list: [],
        };
      }

      return {
        error: ErrorType.NoError,
        site_text_word_definition_list: site_text_word_definitions.filter(
          (definition) => definition,
        ) as SiteTextWordDefinition[],
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
