import { Injectable, Logger } from '@nestjs/common';
import { ErrorType } from '../../common/types';
import { calc_vote_weight } from '../../common/utility';
import { PostgresService } from '../../core/postgres.service';
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
  PericopeDescriptionSqlR,
  PericopeTanslationsIdsWithVotesSqlR,
  PericopeTrUpsertProcedureR,
} from './sql-string';
import {
  AddPericopeTranslationInput,
  GetPericopiesTrInput,
  PericopeTranslation,
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
        ? allPericopies.findIndex((p) => String(p.pericopeCursor) === after)
        : 0;
      const count = first ? first : (allPericopies.length = startIdx);

      const hasPreviousPage = startIdx > 0;
      const hasNextPage = startIdx + count < allPericopies.length;

      const edges: Array<PericopiesTextsWithTranslationEdge> = [];

      for (let i = startIdx; i <= count && i < allPericopies.length; i++) {
        if (!allPericopies[i].pericopeId) continue; // first pericope could be absent
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
      ordered_pericopies[currPericopeCursor] = {
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
          created_by: r.created_by,
        } as PericopeTranslation),
    );
  }

  async getPericopeTranslationsByPericopeId(
    pericopeId: string,
    targetLang: LanguageInput,
  ): Promise<PericopeTranslation[]> {
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
          created_by: r.created_by,
        } as PericopeTranslation),
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
    return {
      pericope_id: input.pericopeId,
      translation: input.translation,
      translation_description: input.tanslation_description,
      created_by: res.rows[0].p_created_by,
      pericope_translation_id: res.rows[0].p_pericope_translation_id,
      language: input.targetLang,
    };
  }
}
