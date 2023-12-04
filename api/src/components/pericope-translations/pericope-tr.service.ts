import { Inject, Injectable, Logger } from '@nestjs/common';
import { ErrorType } from '../../common/types';
import { calc_vote_weight } from '../../common/utility';
import { PostgresService } from '../../core/postgres.service';
import { PUB_SUB } from '../../pubSub.module';
import { PubSub } from 'graphql-subscriptions';
import { LanguageInput } from '../common/types';
import {
  PericopiesService,
  WORDS_JOINER,
} from '../pericopies/pericopies.service';
import { WordsTillEndOfDocumentSqlR } from '../pericopies/sql-string';
import {
  callPericopeTrInsertProcedure,
  getPericopeDescription,
  getPericopeTanslationsIdsWithVotesSql,
  getPericopeTranslationsByIdsSql,
  getPericopeTranslationsByPericopeIdSql,
  GetPericopeTranslationsByPericopeIdSqlR,
  GetPericopeTranslationSqlR,
  getPericopeTrVoteStatusFromPericopeIdsSql,
  GetPericopeTrVoteStatusSqlR,
  PericopeDescriptionSqlR,
  PericopeTanslationsIdsWithVotesSqlR,
  PericopeTrUpsertProcedureR,
  togglePericopeTrVoteStatusSql,
  TogglePericopeTrVoteStatusSqlR,
} from './sql-string';
import {
  AddPericopeTranslationInput,
  GetPericopiesTrInput,
  PericopeTranslation,
  PericopeTranslationWithVotes,
  PericopeTrVoteStatus,
  PericopeTrVoteStatusListOutput,
  PericopiesTextsWithTranslationConnection,
  PericopiesTextsWithTranslationEdge,
} from './types';

const errorishPageInfo = {
  hasNextPage: false,
  hasPreviousPage: false,
  startCursor: null,
  endCursor: null,
};

@Injectable()
export class PericopeTrService {
  constructor(
    private pg: PostgresService,
    private pericopiesService: PericopiesService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  async getPericopiesTextsWithTranslationConnection(
    {
      documentId,
      targetLang,
      filter,
      onlyTranslatedTo,
      onlyNotTranslatedTo,
    }: GetPericopiesTrInput,
    first: number | null,
    after: string | null,
  ): Promise<PericopiesTextsWithTranslationConnection> {
    try {
      const recommendedPericopies =
        await this.pericopiesService.getRecomendedPericopiesByDocumentId(
          documentId,
        );
      if (!(recommendedPericopies.length > 0)) {
        return {
          edges: [],
          error: ErrorType.NoError,
          pageInfo: errorishPageInfo,
        };
      }

      const allPericopies = await this.getOrderedPericopiesOfDocument(
        documentId,
        recommendedPericopies.map((rp) => rp.pericope_id),
      );

      const startIdx = after
        ? allPericopies.findIndex((p) => String(p.pericopeCursor) === after) + 1
        : 0;
      const count = first ? first : (allPericopies.length = startIdx);

      const hasPreviousPage = startIdx > 0;
      const hasNextPage = startIdx + count < allPericopies.length;

      const edges: Array<PericopiesTextsWithTranslationEdge> = [];

      for (
        let i = startIdx;
        i < startIdx + count && i < allPericopies.length;
        i++
      ) {
        if (!allPericopies[i]?.pericopeId) continue; // first pericope could be absent
        const [translation, description] = await Promise.all([
          this.getRecomendedPericopeTranslation(
            allPericopies[i].pericopeId,
            targetLang,
          ),
          this.getPericopeDescription(allPericopies[i].pericopeId),
        ]);

        const pericope_text = allPericopies[i].words
          .map((w) => w.wordlike_string)
          .join(WORDS_JOINER);

        if (!!onlyTranslatedTo && !translation) continue;
        if (!!onlyNotTranslatedTo && translation) continue;
        if (
          !!filter &&
          !pericope_text.toUpperCase().includes(filter.toUpperCase()) &&
          !translation?.translation.toUpperCase().includes(filter.toUpperCase())
        ) {
          continue;
        }

        const edge: PericopiesTextsWithTranslationEdge = {
          cursor: String(allPericopies[i].pericopeCursor),
          node: {
            pericope_id: allPericopies[i].pericopeId,
            pericope_text,
            pericope_description_text: description?.description || '',
            translation,
            error: ErrorType.NoError,
          },
        };
        edges.push(edge);
      }

      const startCursor = edges.length > 0 ? edges[0].cursor : null;
      const endCursor = edges.length > 0 ? edges.at(-1)!.cursor : null;

      return {
        error: ErrorType.NoError,
        edges: edges,
        pageInfo: {
          hasPreviousPage,
          hasNextPage,
          endCursor,
          startCursor,
        },
      };
    } catch (e) {
      Logger.error(
        `PericopeTrSercice#getPericopiesTextsWithTranslationConnection ${e}`,
      );
      return {
        error: ErrorType.PericopeGetTranslationError,
        edges: [],
        pageInfo: errorishPageInfo,
      };
    }
  }

  async getOrderedPericopiesOfDocument(
    documentId: string,
    recommendedPericopiesIds: string[],
  ): Promise<
    Array<{
      pericopeCursor: number;
      pericopeId: string;
      words: WordsTillEndOfDocumentSqlR[];
    }>
  > {
    const start_word = await this.pericopiesService.getFirstWordOfDocument(
      documentId,
    );
    const allWords =
      start_word === null
        ? []
        : await this.pericopiesService.getWordsTillEndOfDocument(
            documentId,
            start_word,
          );
    const ordered_pericopies: Array<{
      pericopeCursor: number;
      pericopeId: string;
      words: WordsTillEndOfDocumentSqlR[];
    }> = [];
    let currPericopeCursor = 0;
    let currPericopeid;
    allWords.forEach((word) => {
      if (
        word.pericope_id &&
        recommendedPericopiesIds.includes(word.pericope_id) &&
        word.pericope_id != currPericopeid
      ) {
        currPericopeid = word.pericope_id;
        currPericopeCursor++;
      }
      // it's better to make ordered_pericopies plain zero-based array
      ordered_pericopies[currPericopeCursor - 1] = {
        pericopeCursor: currPericopeCursor,
        pericopeId: currPericopeid,
        words: [...(ordered_pericopies[currPericopeCursor]?.words || []), word],
      };
    });
    return ordered_pericopies;
  }

  async getPericopeDescription(
    pericopeId: string,
  ): Promise<PericopeDescriptionSqlR> {
    const resQ = await this.pg.pool.query<PericopeDescriptionSqlR>(
      ...getPericopeDescription({
        pericopeId,
      }),
    );
    return resQ.rows[0];
  }

  async getRecomendedPericopeTranslation(
    pericopeId: string,
    targetLang: LanguageInput,
  ): Promise<PericopeTranslation | null> {
    const resQ = await this.pg.pool.query<PericopeTanslationsIdsWithVotesSqlR>(
      ...getPericopeTanslationsIdsWithVotesSql({ pericopeId, targetLang }),
    );
    const recomendedTranslationIdWithVotes = this.filterRecomendedTranslations(
      resQ.rows,
    );

    if (!recomendedTranslationIdWithVotes) return null;
    const recomendedTranslation = await this.getPericopeTranslations([
      recomendedTranslationIdWithVotes.pericope_translation_id,
    ]);
    return recomendedTranslation[0];
  }

  filterRecomendedTranslations(
    translations: PericopeTanslationsIdsWithVotesSqlR[],
  ): PericopeTanslationsIdsWithVotesSqlR | null {
    if (!(translations.length > 0)) return null;
    return translations.reduce((best, t) => {
      const currWeight = calc_vote_weight(t.upvotes, t.downvotes);
      const bestWeight = calc_vote_weight(best.upvotes, best.downvotes);
      if (bestWeight > currWeight) return best;
      return t;
    }, translations[0]);
  }

  async getPericopeTranslations(
    translationIds: string[],
  ): Promise<PericopeTranslation[]> {
    const resQ = await this.pg.pool.query<GetPericopeTranslationSqlR>(
      ...getPericopeTranslationsByIdsSql({ translationIds }),
    );
    return resQ.rows.map(
      (r) =>
        ({
          pericope_id: r.pericope_id,
          pericope_translation_id: r.pericope_translation_id,
          language: {
            language_code: r.language_code,
            dialect_code: r.dialect_code,
            geo_code: r.geo_code,
          },
          translation: r.translation,
          translation_description: r.description,
          created_at: r.created_at,
          created_by_user: {
            user_id: r.user_id,
            avatar: r.avatar,
            avatar_url: r.avatar_url,
            is_bot: r.is_bot,
          },
        } as PericopeTranslation),
    );
  }

  async getPericopeTranslationsByPericopeId(
    pericopeId: string,
    targetLang: LanguageInput,
  ): Promise<PericopeTranslationWithVotes[]> {
    const resQ =
      await this.pg.pool.query<GetPericopeTranslationsByPericopeIdSqlR>(
        ...getPericopeTranslationsByPericopeIdSql({ pericopeId, targetLang }),
      );
    return resQ.rows.map(
      (r) =>
        ({
          pericope_id: r.pericope_id,
          pericope_translation_id: r.pericope_translation_id,
          language: {
            language_code: r.language_code,
            dialect_code: r.dialect_code,
            geo_code: r.geo_code,
          },
          translation: r.translation,
          translation_description: r.description,
          created_at: r.created_at,
          created_by_user: {
            user_id: r.user_id,
            avatar: r.avatar,
            avatar_url: r.avatar_url,
            is_bot: r.is_bot,
          },
          upvotes: r.upvotes,
          downvotes: r.downvotes,
        } as PericopeTranslationWithVotes),
    );
  }

  async addPericopeTrAndDesc(
    input: AddPericopeTranslationInput,
    token: string,
  ): Promise<PericopeTranslation> {
    const res = await this.pg.pool.query<PericopeTrUpsertProcedureR>(
      ...callPericopeTrInsertProcedure(input, token),
    );
    if (res.rows.length != 1) {
      Logger.error(
        `resQ.rows.length != 1: ${JSON.stringify(res.rows)}`,
        `PericopeTrService#addPericopeTrAndDesc`,
      );
    }
    if (res.rows[0].p_error_type !== ErrorType.NoError) {
      Logger.error(
        JSON.stringify(res.rows),
        `PericopeTrService#addPericopeTrAndDesc`,
      );
    }

    return {
      pericope_id: input.pericopeId,
      translation: input.translation,
      translation_description: input.tanslation_description,
      created_by_user: {
        user_id: res.rows[0].p_user_id,
        avatar: res.rows[0].p_avatar,
        avatar_url: res.rows[0].p_avatar_url,
        is_bot: res.rows[0].p_is_bot,
      },
      created_at: res.rows[0].p_created_at,
      pericope_translation_id: res.rows[0].p_pericope_translation_id,
      language: input.targetLang,
    };
  }

  async toggleVoteStatus(
    pericope_translation_id: string,
    vote: boolean,
    token: string,
  ): Promise<PericopeTrVoteStatusListOutput> {
    try {
      const res = await this.pg.pool.query<TogglePericopeTrVoteStatusSqlR>(
        ...togglePericopeTrVoteStatusSql({
          pericope_translation_id,
          vote,
          token,
        }),
      );

      const creatingError = res.rows[0].p_error_type;
      const pericope_translation_vote_id =
        res.rows[0].p_pericope_translation_vote_id;

      if (
        creatingError !== ErrorType.NoError ||
        !pericope_translation_vote_id
      ) {
        return {
          error: creatingError,
          vote_status_list: [],
        };
      }

      return this.getVoteStatusFromIds([pericope_translation_id]);
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      vote_status_list: [],
    };
  }

  async getVoteStatusFromIds(
    pericopeTrIds: string[],
  ): Promise<PericopeTrVoteStatusListOutput> {
    try {
      const res = await this.pg.pool.query<GetPericopeTrVoteStatusSqlR>(
        ...getPericopeTrVoteStatusFromPericopeIdsSql(pericopeTrIds),
      );

      const voteStatusMap = new Map<string, PericopeTrVoteStatus>();

      res.rows.forEach((row) =>
        voteStatusMap.set(row.pericope_translation_id, row),
      );

      return {
        error: ErrorType.NoError,
        vote_status_list: pericopeTrIds.map((pericope_translation_id) => {
          const voteStatus = voteStatusMap.get(pericope_translation_id + '');

          return voteStatus
            ? voteStatus
            : {
                pericope_translation_id: pericope_translation_id + '',
                upvotes: 0,
                downvotes: 0,
              };
        }),
      };
    } catch (e) {
      Logger.error(e);
    }
    return {
      error: ErrorType.UnknownError,
      vote_status_list: [],
    };
  }

  async getPericopeIdsAndLangsOfTranslationIds(
    pericope_translation_ids: string[],
  ): Promise<Array<{ pericopeId: string; lang: LanguageInput }>> {
    const res = await this.pg.pool.query<{
      pericope_id: string;
      language_code: string;
      dialect_code: string;
      geo_code: string;
    }>(
      `
      select 
        pt.pericope_id,
        pt.language_code,
        pt.dialect_code,
        pt.geo_code
        from pericope_translations pt
        where pt.pericope_translation_id  = any($1)
    `,
      [pericope_translation_ids],
    );

    return res.rows.map((row) => ({
      pericopeId: row.pericope_id,
      lang: {
        language_code: row.language_code,
        dialect_code: row.dialect_code,
        geo_code: row.geo_code,
      },
    }));
  }
}
