import { Injectable } from '@nestjs/common';

import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';

import { PhraseDefinitionsService } from 'src/components/definitions/phrase-definitions.service';

import {
  SiteTextPhraseDefinitionReadOutput,
  SiteTextPhraseDefinitionUpsertInput,
  SiteTextPhraseDefinitionUpsertOutput,
} from './types';

import {
  getSiteTextPhraseDefinitionObjById,
  GetSiteTextPhraseDefinitionObjectById,
  callSiteTextPhraseDefinitionUpsertProcedure,
  SiteTextPhraseDefinitionUpsertProcedureOutputRow,
} from './sql-string';

@Injectable()
export class SiteTextPhraseDefinitionsService {
  constructor(
    private pg: PostgresService,
    private phraseDefinitionService: PhraseDefinitionsService,
  ) {}

  async read(id: number): Promise<SiteTextPhraseDefinitionReadOutput> {
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

  async upsert(
    input: SiteTextPhraseDefinitionUpsertInput,
    token?: string,
  ): Promise<SiteTextPhraseDefinitionUpsertOutput> {
    try {
      const res =
        await this.pg.pool.query<SiteTextPhraseDefinitionUpsertProcedureOutputRow>(
          ...callSiteTextPhraseDefinitionUpsertProcedure({
            phrase_definition_id: +input.phrase_definition_id,
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
}
