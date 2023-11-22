import { Injectable, Logger } from '@nestjs/common';
import { error } from 'console';
import { ErrorType } from '../../common/types';
import { PostgresService } from '../../core/postgres.service';
import { PericopiesService } from '../pericopies/pericopies.service';
import {
  GetPericopiesTrInput,
  PericopiesTextsWithTranslationConnection,
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

  async getPericopiesTextsWithTranslation(
    { documentId, filter }: GetPericopiesTrInput,
    first: number | null,
    after: string | null,
  ): Promise<PericopiesTextsWithTranslationConnection> {
    try {
      if (isNaN(Number(documentId))) {
        throw new Error(
          `documentId isn't a numeric value: ${JSON.stringify(documentId)} `,
        );
      }

      const pericopies =
        await this.pericopiesService.getRecomendedPericopiesByDocumentId(
          Number(documentId),
        );

      const pericopiesIds = pericopies.map((p) => p.pericope_id);

      const pericopiesTexts = await this.pericopiesService.getPericopiesTexts(
        pericopiesIds,
      );

      const pericopiesTranslations = await this.getPericopiesTranslations(
        pericopiesIds,
      );
      
      // todo: map to edges[] and implement filtering
      stopped here

      
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
  
  async getPericopiesTranslations(pericopiesIds): Promise<{ [key: number]: string }> {
   //todo
    stopped here  
  }  
}
