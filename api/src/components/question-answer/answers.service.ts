import { Injectable, Logger } from '@nestjs/common';
import { PoolClient } from 'pg';

import { pgClientOrPool } from 'src/common/utility';

import { ErrorType } from 'src/common/types';

import { PostgresService } from 'src/core/postgres.service';

import { AnswersOutput, AnswerUpsertInput, QuestionItem } from './types';

import {
  callAnswerUpsertsProcedure,
  AnswerUpsertsProcedureOutput,
  getAnswersObjByIds,
  getAnswersObjByQuestionIds,
  getAnswersObjByUserIdAndQuestionId,
  GetAnswersObjectRow,
} from './sql-string';
import { QuestionItemsService } from './question-items.service';
import { AuthorizationService } from '../authorization/authorization.service';

@Injectable()
export class AnswersService {
  constructor(
    private pg: PostgresService,
    private questionItemService: QuestionItemsService,
    private authService: AuthorizationService,
  ) {}

  private async convertQueryResultToAnswers(
    rows: GetAnswersObjectRow[],
    pgClient: PoolClient | null,
  ): Promise<AnswersOutput> {
    try {
      const answersMap = new Map<string, GetAnswersObjectRow>();

      const questionItemIds: number[] = [];

      rows.forEach((row) => {
        answersMap.set(row.question_id, row);
        row.question_items.forEach((item) => questionItemIds.push(+item));
      });

      const { error: questionItemError, question_items } =
        await this.questionItemService.reads(questionItemIds, pgClient);

      if (questionItemError !== ErrorType.NoError) {
        return {
          error: questionItemError,
          answers: [],
        };
      }

      const questionItemsMap = new Map<string, QuestionItem>();

      question_items.forEach((question_item) =>
        question_item
          ? questionItemsMap.set(question_item.question_item_id, question_item)
          : null,
      );

      return {
        error: ErrorType.NoError,
        answers: rows.map((row) => {
          const questionItems = row.question_items
            .map(
              (question_item_id) =>
                questionItemsMap.get(question_item_id) || null,
            )
            .filter((questionItem) => questionItem) as QuestionItem[];

          return {
            ...row,
            question_items: questionItems,
            created_by_user: {
              user_id: row.user_id,
              avatar: row.avatar,
              avatar_url: row.avatar_url,
              is_bot: row.is_bot,
            },
          };
        }),
      };
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      answers: [],
    };
  }

  async reads(
    ids: number[],
    pgClient: PoolClient | null,
  ): Promise<AnswersOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetAnswersObjectRow>(...getAnswersObjByIds(ids));

      return this.convertQueryResultToAnswers(res.rows, pgClient);
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      answers: [],
    };
  }

  async getAnswerByUserId(
    question_id: number,
    user_id: number,
    pgClient: PoolClient | null,
  ): Promise<AnswersOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetAnswersObjectRow>(
        ...getAnswersObjByUserIdAndQuestionId({ question_id, user_id }),
      );

      return this.convertQueryResultToAnswers(res.rows, pgClient);
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      answers: [],
    };
  }

  async getAnswersByQuestionIds(
    ids: number[],
    pgClient: PoolClient | null,
  ): Promise<AnswersOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetAnswersObjectRow>(...getAnswersObjByQuestionIds(ids));

      return this.convertQueryResultToAnswers(res.rows, pgClient);
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      answers: [],
    };
  }

  async upserts(
    input: AnswerUpsertInput[],
    token: string,
    pgClient: PoolClient | null,
  ): Promise<AnswersOutput> {
    if (input.length === 0) {
      return {
        error: ErrorType.NoError,
        answers: [],
      };
    }

    if (!(await this.authService.is_authorized(token))) {
      return {
        error: ErrorType.Unauthorized,
        answers: [],
      };
    }

    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<AnswerUpsertsProcedureOutput>(
        ...callAnswerUpsertsProcedure({
          question_ids: input.map((item) => +item.question_id),
          answers: input.map((item) => item.answer),
          question_items_list: input.map((item) =>
            item.question_item_ids.map((id) => +id),
          ),
          token,
        }),
      );

      const creatingError = res.rows[0].p_error_type;
      const answer_ids = res.rows[0].p_answer_ids;

      if (creatingError !== ErrorType.NoError) {
        return {
          error: creatingError,
          answers: [],
        };
      }

      return this.reads(
        answer_ids.map((id) => +id),
        pgClient,
      );
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      answers: [],
    };
  }
}
