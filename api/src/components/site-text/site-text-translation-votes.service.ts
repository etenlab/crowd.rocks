import { Injectable } from '@nestjs/common';

import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';

import {
  SiteTextTranslationVoteOutput,
  SiteTextTranslationVoteStatusOutputRow,
} from './types';

import {
  SiteTextTranslationVoteUpsertProcedureOutputRow,
  callSiteTextTranslationVoteUpsertProcedure,
  GetSiteTextTranslationVoteObjectById,
  getSiteTextTranslationVoteObjById,
  GetSiteTextTranslationVoteStatus,
  getSiteTextTranslationVoteStatus,
  ToggleSiteTextTranslationVoteStatus,
  toggleSiteTextTranslationVoteStatus,
} from './sql-string';

@Injectable()
export class SiteTextTranslationVotesService {
  constructor(private pg: PostgresService) {}

  async read(id: number): Promise<SiteTextTranslationVoteOutput> {
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
            translation_id: res1.rows[0].translation_id + '',
            from_type_is_word: res1.rows[0].from_type_is_word,
            to_type_is_word: res1.rows[0].to_type_is_word,
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
    translation_id: number,
    from_type_is_word: boolean,
    to_type_is_word: boolean,
    vote: boolean,
    token: string,
  ): Promise<SiteTextTranslationVoteOutput> {
    try {
      const res =
        await this.pg.pool.query<SiteTextTranslationVoteUpsertProcedureOutputRow>(
          ...callSiteTextTranslationVoteUpsertProcedure({
            translation_id,
            from_type_is_word,
            to_type_is_word,
            vote,
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

  async getVoteStatus(
    translation_id: number,
    from_type_is_word: boolean,
    to_type_is_word: boolean,
  ): Promise<SiteTextTranslationVoteStatusOutputRow> {
    try {
      const res1 = await this.pg.pool.query<GetSiteTextTranslationVoteStatus>(
        ...getSiteTextTranslationVoteStatus(
          translation_id,
          from_type_is_word,
          to_type_is_word,
        ),
      );

      if (res1.rowCount !== 1) {
        return {
          error: ErrorType.NoError,
          vote_status: {
            translation_id: translation_id + '',
            from_type_is_word,
            to_type_is_word,
            upvotes: 0,
            downvotes: 0,
          },
        };
      } else {
        return {
          error: ErrorType.NoError,
          vote_status: {
            translation_id: translation_id + '',
            from_type_is_word,
            to_type_is_word,
            upvotes: res1.rows[0].upvotes,
            downvotes: res1.rows[0].downvotes,
          },
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      vote_status: null,
    };
  }

  async toggleVoteStatus(
    translation_id: number,
    from_type_is_word: boolean,
    to_type_is_word: boolean,
    vote: boolean,
    token: string,
  ): Promise<SiteTextTranslationVoteStatusOutputRow> {
    try {
      const res1 =
        await this.pg.pool.query<ToggleSiteTextTranslationVoteStatus>(
          ...toggleSiteTextTranslationVoteStatus({
            translation_id,
            from_type_is_word,
            to_type_is_word,
            vote,
            token,
          }),
        );

      const creatingError = res1.rows[0].p_error_type;
      const site_text_translation_vote_id =
        res1.rows[0].p_site_text_translation_vote_id;

      if (
        creatingError !== ErrorType.NoError ||
        !site_text_translation_vote_id
      ) {
        return {
          error: creatingError,
          vote_status: null,
        };
      }

      return this.getVoteStatus(
        translation_id,
        from_type_is_word,
        to_type_is_word,
      );
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      vote_status: null,
    };
  }
}
