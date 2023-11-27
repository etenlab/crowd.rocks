import { Injectable, Logger } from '@nestjs/common';
import { ErrorType } from '../../common/types';
import { calc_vote_weight } from '../../common/utility';
import { PostgresService } from '../../core/postgres.service';
import { LanguageInput } from '../common/types';
import {
  PericopiesService,
  WORDS_JOINER,
} from '../pericopies/pericopies.service';
import {
  getPericopeDescriptionWithTranslationSql,
  getPericopeTanslationsIdsWithVotesSql,
  getPericopeTranslationSql,
  GetPericopeTranslationSqlR,
  PericopeDescriptionWithTranslationSqlR,
  PericopeTanslationsIdsWithVotesSqlR,
} from './sql-string';
import {
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
      const pericopies =
        await this.pericopiesService.getRecomendedPericopiesByDocumentId(
          documentId,
          first,
          after,
        );
      if (!(pericopies.length > 0)) {
        return {
          edges: [],
          error: ErrorType.NoError,
          pageInfo: errorishPageInfo,
        };
      }

      const edges: Array<PericopiesTextsWithTranslationEdge> = [];

      const startCursor: string = pericopies[0].cursor;
      const endCursor: string = pericopies.at(-1)!.cursor;

      for (const pericope of pericopies) {
        const [words, translation, descriptionsWithTr] = await Promise.all([
          this.pericopiesService.getWordsTillNextPericope(
            documentId,
            pericope.start_word,
          ),
          this.getRecomendedPericopeTranslation(
            pericope.pericope_id,
            targetLang,
          ),
          this.getPericopiesDescriptionsWithTranslation(
            [pericope.pericope_id],
            targetLang,
          ),
        ]);

        const pericope_text = words
          .map((w) => w.wordlike_string)
          .join(WORDS_JOINER);
        const descriptionWithTr = descriptionsWithTr[0];

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
          cursor: pericope.cursor,
          node: {
            pericope_id: pericope.pericope_id,
            pericope_text,
            pericope_description_text: descriptionWithTr?.description || '',
            translation,
            error: ErrorType.NoError,
          },
        };
        edges.push(edge);
      }

      return {
        error: ErrorType.NoError,
        edges,
        pageInfo: {
          hasNextPage: true, // todo!!!
          hasPreviousPage: true, // todo!!!
          endCursor,
          startCursor,
        },
      };
    } catch (e) {
      Logger.error(e);
      return {
        error: ErrorType.PericopeGetTranslationError,
        edges: [],
        pageInfo: errorishPageInfo,
      };
    }
  }

  async getPericopiesDescriptionsWithTranslation(
    pericopiesIds: string[],
    targetLang: LanguageInput,
  ): Promise<PericopeDescriptionWithTranslationSqlR[]> {
    const resQ =
      await this.pg.pool.query<PericopeDescriptionWithTranslationSqlR>(
        ...getPericopeDescriptionWithTranslationSql({
          pericopiesIds,
          targetLang,
        }),
      );
    return resQ.rows;
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
      ...getPericopeTranslationSql({ translationIds }),
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
          description_translation: r.description_translation,
          created_at: r.created_at,
          created_by: r.created_by,
        } as PericopeTranslation),
    );
  }
}
