import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';

import { pgClientOrPool } from 'src/common/utility';

import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';

import {
  SiteTextTranslationVoteOutput,
  SiteTextTranslationVoteStatus,
  SiteTextTranslationVoteStatusOutput,
  SiteTextTranslationVoteStatusOutputRow,
} from './types';

import {
  SiteTextTranslationVoteUpsertProcedureOutputRow,
  callSiteTextTranslationVoteUpsertProcedure,
  GetSiteTextTranslationVoteObjectById,
  getSiteTextTranslationVoteObjById,
  GetSiteTextTranslationVoteStatus,
  getSiteTextTranslationVoteStatusFromIds,
  ToggleSiteTextTranslationVoteStatus,
  toggleSiteTextTranslationVoteStatus,
} from './sql-string';

export function makeStr(
  translation_id: string,
  from_type_is_word: boolean,
  to_type_is_word: boolean,
) {
  return `${translation_id}-${from_type_is_word ? 'true' : 'false'}-${
    to_type_is_word ? 'true' : 'false'
  }`;
}

@Injectable()
export class SiteTextTranslationVotesService {
  constructor(private pg: PostgresService) {}

  async read(
    id: number,
    pgClient: PoolClient | null,
  ): Promise<SiteTextTranslationVoteOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetSiteTextTranslationVoteObjectById>(
        ...getSiteTextTranslationVoteObjById(id),
      );

      if (res.rowCount !== 1) {
        console.error(`no site-text-translation-vote for id: ${id}`);
      } else {
        return {
          error: ErrorType.NoError,
          site_text_translation_vote: {
            site_text_translation_vote_id: id + '',
            translation_id: res.rows[0].translation_id + '',
            from_type_is_word: res.rows[0].from_type_is_word,
            to_type_is_word: res.rows[0].to_type_is_word,
            user_id: res.rows[0].user_id + '',
            vote: res.rows[0].vote,
            last_updated_at: new Date(res.rows[0].last_updated_at),
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
    pgClient: PoolClient | null,
  ): Promise<SiteTextTranslationVoteOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<SiteTextTranslationVoteUpsertProcedureOutputRow>(
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

      return this.read(+site_text_translation_vote_id, pgClient);
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
    pgClient: PoolClient | null,
  ): Promise<SiteTextTranslationVoteStatusOutputRow> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetSiteTextTranslationVoteStatus>(
        ...getSiteTextTranslationVoteStatusFromIds([
          {
            translation_id: translation_id,
            from_type_is_word,
            to_type_is_word,
          },
        ]),
      );

      if (res.rowCount !== 1) {
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
            upvotes: res.rows[0].upvotes,
            downvotes: res.rows[0].downvotes,
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

  async getVoteStatusFromIds(
    ids: {
      translation_id: number;
      from_type_is_word: boolean;
      to_type_is_word: boolean;
    }[],
    pgClient: PoolClient | null,
  ): Promise<SiteTextTranslationVoteStatusOutput> {
    try {
      if (ids.length === 0) {
        return {
          error: ErrorType.NoError,
          vote_status_list: [],
        };
      }

      await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query(
        `
          do $$
          begin
            if not exists (select 1 from pg_type where typname = 'site_text_translation_vote_id_type') then
              create type site_text_translation_vote_id_type as (
                translation_id bigint,
                from_type_is_word bool,
                to_type_is_word bool
              );
            end if;
          end $$;
        `,
      );

      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetSiteTextTranslationVoteStatus>(
        ...getSiteTextTranslationVoteStatusFromIds(ids),
      );

      const voteStatusMap = new Map<string, SiteTextTranslationVoteStatus>();

      res.rows.forEach((row) => {
        voteStatusMap.set(
          makeStr(
            row.translation_id,
            row.from_type_is_word,
            row.to_type_is_word,
          ),
          {
            translation_id: row.translation_id,
            from_type_is_word: row.from_type_is_word,
            to_type_is_word: row.to_type_is_word,
            upvotes: row.upvotes,
            downvotes: row.downvotes,
          },
        );
      });

      return {
        error: ErrorType.NoError,
        vote_status_list: ids.map((id) => {
          const voteStatus = voteStatusMap.get(
            makeStr(
              id.translation_id + '',
              id.from_type_is_word,
              id.to_type_is_word,
            ),
          );

          return voteStatus
            ? voteStatus
            : {
                translation_id: id.translation_id + '',
                from_type_is_word: id.from_type_is_word,
                to_type_is_word: id.to_type_is_word,
                upvotes: 0,
                downvotes: 0,
              };
        }),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      vote_status_list: [],
    };
  }

  async toggleVoteStatus(
    translation_id: number,
    from_type_is_word: boolean,
    to_type_is_word: boolean,
    vote: boolean,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<SiteTextTranslationVoteStatusOutputRow> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<ToggleSiteTextTranslationVoteStatus>(
        ...toggleSiteTextTranslationVoteStatus({
          translation_id,
          from_type_is_word,
          to_type_is_word,
          vote,
          token,
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
          vote_status: null,
        };
      }

      return this.getVoteStatus(
        translation_id,
        from_type_is_word,
        to_type_is_word,
        pgClient,
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
