import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';

import { pgClientOrPool } from 'src/common/utility';

import { ErrorType } from 'src/common/types';

import { PostgresService } from 'src/core/postgres.service';

import { QuestionItem, QuestionsOutput, QuestionUpsertInput } from './types';

import {
  callQuestionUpsertsProcedure,
  QuestionUpsertsProcedureOutput,
  getQuestionsObjByIds,
  GetQuestionsObjectByIds,
} from './sql-string';
import { QuestionItemsService } from './question-items.service';

@Injectable()
export class QuestionsService {
  constructor(
    private pg: PostgresService,
    private questionItemService: QuestionItemsService,
  ) {}

  async reads(
    ids: number[],
    pgClient: PoolClient | null,
  ): Promise<QuestionsOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetQuestionsObjectByIds>(...getQuestionsObjByIds(ids));

      const questionsMap = new Map<string, GetQuestionsObjectByIds>();

      const questionItemIds: number[] = [];

      res.rows.forEach((row) => {
        questionsMap.set(row.question_id, row);
        row.question_items.forEach((item) => questionItemIds.push(+item));
      });

      const { error: questionItemError, question_items } =
        await this.questionItemService.reads(questionItemIds, pgClient);

      if (questionItemError !== ErrorType.NoError) {
        return {
          error: questionItemError,
          questions: [],
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
        questions: ids.map((id) => {
          const questionObj = questionsMap.get(id + '');

          if (!questionObj) {
            return null;
          }

          const questionItems = questionObj.question_items
            .map(
              (question_item_id) =>
                questionItemsMap.get(question_item_id) || null,
            )
            .filter((questionItem) => questionItem) as QuestionItem[];

          return {
            ...questionObj,
            question_items: questionItems,
          };
        }),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      questions: [],
    };
  }

  async upserts(
    input: QuestionUpsertInput[],
    token: string,
    pgClient: PoolClient | null,
  ): Promise<QuestionsOutput> {
    if (input.length === 0) {
      return {
        error: ErrorType.NoError,
        questions: [],
      };
    }

    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<QuestionUpsertsProcedureOutput>(
        ...callQuestionUpsertsProcedure({
          parent_tables: input.map((item) => item.parent_table),
          parent_ids: input.map((item) => +item.parent_id),
          question_type_is_multiselects: input.map(
            (item) => item.question_type_is_multiselect,
          ),
          questions: input.map((item) => item.question),
          question_items_list: input.map((item) =>
            item.question_items.map((id) => +id),
          ),
          token,
        }),
      );

      const creatingError = res.rows[0].p_error_type;
      const question_ids = res.rows[0].p_question_ids;

      if (creatingError !== ErrorType.NoError) {
        return {
          error: creatingError,
          questions: [],
        };
      }

      return this.reads(
        question_ids.map((item) => +item),
        pgClient,
      );
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      questions: [],
    };
  }
}
