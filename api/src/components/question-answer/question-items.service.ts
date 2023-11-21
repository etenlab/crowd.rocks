import { Injectable, Logger } from '@nestjs/common';
import { PoolClient } from 'pg';

import { pgClientOrPool } from 'src/common/utility';

import { ErrorType } from 'src/common/types';

import { PostgresService } from 'src/core/postgres.service';

import {
  QuestionItemsOutput,
  QuestionItem,
  QuestionItemWithStatisticsOutput,
} from './types';

import {
  callQuestionItemUpsertsProcedure,
  QuestionItemUpsertsProcedureOutput,
  getQuestionItemsObjByIds,
  GetQuestionItemsObjectByIds,
  GetQuestionItemStatistic,
  getQuestionItemStatistic,
} from './sql-string';
import { AuthorizationService } from '../authorization/authorization.service';

@Injectable()
export class QuestionItemsService {
  constructor(
    private pg: PostgresService,
    private authService: AuthorizationService,
  ) {}

  async reads(
    ids: number[],
    pgClient: PoolClient | null,
  ): Promise<QuestionItemsOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetQuestionItemsObjectByIds>(...getQuestionItemsObjByIds(ids));

      const questionItemsMap = new Map<string, QuestionItem>();

      res.rows.forEach((row) =>
        questionItemsMap.set(row.question_item_id, {
          question_item_id: row.question_item_id,
          item: row.item,
        }),
      );

      return {
        error: ErrorType.NoError,
        question_items: ids.map((id) => questionItemsMap.get(id + '') || null),
      };
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      question_items: [],
    };
  }

  async getStatistics(
    question_id: number,
    pgClient: PoolClient | null,
  ): Promise<QuestionItemWithStatisticsOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetQuestionItemStatistic>(
        ...getQuestionItemStatistic(question_id),
      );

      return {
        error: ErrorType.NoError,
        question_item_with_statistics: res.rows.map((row) => ({
          question_item_id: row.question_item_id,
          item: row.item,
          statistic: +row.statistic,
        })),
      };
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      question_item_with_statistics: [],
    };
  }

  async upserts(
    items: string[],
    pgClient: PoolClient | null,
    token?: string,
  ): Promise<QuestionItemsOutput> {
    if (items.length === 0) {
      return {
        error: ErrorType.NoError,
        question_items: [],
      };
    }

    if (!(await this.authService.is_authorized(token))) {
      return {
        error: ErrorType.Unauthorized,
        question_items: [],
      };
    }

    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<QuestionItemUpsertsProcedureOutput>(
        ...callQuestionItemUpsertsProcedure({
          items,
        }),
      );

      const creatingErrors = res.rows[0].p_error_types;
      const creatingError = res.rows[0].p_error_type;
      const question_item_ids = res.rows[0].p_question_item_ids;

      if (creatingError !== ErrorType.NoError) {
        return {
          error: creatingError,
          question_items: [],
        };
      }

      return {
        error: ErrorType.NoError,
        question_items: question_item_ids.map((id, index) => {
          if (creatingErrors[index] !== ErrorType.NoError) {
            return null;
          }

          return {
            question_item_id: id,
            item: items[index],
          };
        }),
      };
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      question_items: [],
    };
  }
}
