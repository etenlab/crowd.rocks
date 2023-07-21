import { Injectable } from '@nestjs/common';

import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';

import {
  SiteTextTranslationVoteUpsertInput,
  SiteTextTranslationVoteUpsertOutput,
  SiteTextTranslationVoteReadOutput,
} from './types';

import {
  SiteTextTranslationVoteUpsertProcedureOutputRow,
  callSiteTextTranslationVoteUpsertProcedure,
  GetSiteTextTranslationVoteObjectById,
  getSiteTextTranslationVoteObjById,
} from './sql-string';

@Injectable()
export class SiteTextTranslationVotesService {
  constructor(private pg: PostgresService) {}

  async read(id: number): Promise<SiteTextTranslationVoteReadOutput> {
    try {
      const res1 =
        await this.pg.pool.query<GetSiteTextTranslationVoteObjectById>(
          ...getSiteTextTranslationVoteObjById(id),
        );

      if (res1.rowCount !== 1) {
        console.error(`no site-text-translation-vote for id: ${id}`);
      } else {
        return {
          error: ErrorType.NoError,
          site_text_translation_vote: {
            site_text_translation_vote_id: id + '',
            site_text_translation_id:
              res1.rows[0].site_text_translation_id + '',
            user_id: res1.rows[0].user_id + '',
            vote: res1.rows[0].vote,
            last_updated_at: new Date(res1.rows[0].last_updated_at),
          },
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      site_text_translation_vote: null,
    };
  }

  async upsert(
    input: SiteTextTranslationVoteUpsertInput,
    token: string,
  ): Promise<SiteTextTranslationVoteUpsertOutput> {
    try {
      const res =
        await this.pg.pool.query<SiteTextTranslationVoteUpsertProcedureOutputRow>(
          ...callSiteTextTranslationVoteUpsertProcedure({
            site_text_translation_id: +input.site_text_translation_id,
            vote: input.vote,
            token: token,
          }),
        );

      const creatingError = res.rows[0].p_error_type;
      const site_text_translation_vote_id =
        res.rows[0].p_site_text_translation_vote_id;

      if (
        creatingError !== ErrorType.NoError ||
        !site_text_translation_vote_id
      ) {
        return {
          error: creatingError,
          site_text_translation_vote: null,
        };
      }

      return this.read(site_text_translation_vote_id);
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      site_text_translation_vote: null,
    };
  }
}
