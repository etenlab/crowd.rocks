import { Injectable, Logger } from '@nestjs/common';
import { error } from 'console';
import { ErrorType } from '../../common/types';
import { PostgresService } from '../../core/postgres.service';
import { PericopiesService } from '../pericopies/pericopies.service';
import {
  GetPericopiesTrInput,
  PericopeTranslation,
  PericopiesTextsWithTranslationConnection,
  PericopiesTextsWithTranslationEdge,
} from './types';

const WORDS_JOINER = ' ';

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

  async getPericopiesTextsWithTranslation(
    { documentId, filter }: GetPericopiesTrInput,
    first: number | null,
    after: string | null,
  ): Promise<PericopiesTextsWithTranslationConnection> {
    try {
      const pericopies =
        await this.pericopiesService.getRecomendedPericopiesByDocumentId(
          documentId,
        );
      const edges: Array<PericopiesTextsWithTranslationEdge> = [];
      for (const pericope of pericopies) {
        const [words, translation] = await Promise.all([
          this.pericopiesService.getWordsTillNextPericope(
            documentId,
            pericope.start_word,
          ),
          this.getPericopeTranslation(pericope.pericope_id),
        ]);

        const edge = {
          cursor: pericope.pericope_id,
          node: {
            pericope_id: pericope.pericope_id,
            pericope_text: words
              .map((w) => w.wordlike_string)
              .join(WORDS_JOINER),
            translation,
          },
        };
        edges.push(edge);
      }

      // todo: map to edges[] and implement filtering

      return {
        error: ErrorType.NoError,
        edges: [
          {
            cursor: '',
            node: {
              pericope_id: '1',
              pericope_text: 'zxvc',
              translation: {
                percope_id: '1',
                pericope_translation_id: '1',
                language: {
                  language_code: 'en',
                  dialect_code: null,
                  geo_code: null,
                },
                translation: 'фіва',
                created_at: new Date(),
                created_by: '1',
              },
            },
          },
        ],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
          endCursor: null,
          startCursor: null,
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

  async getPericopeTranslation(
    pericopeId: string,
  ): Promise<PericopeTranslation> {
    //todo
  }
}
