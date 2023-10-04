import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';

import { pgClientOrPool } from 'src/common/utility';

import { ErrorType, TableNameType } from 'src/common/types';

import { PostgresService } from 'src/core/postgres.service';

import { WordRangesService } from 'src/components/documents/word-ranges.service';
import { QuestionItemsService } from './question-items.service';

import { WordRange } from 'src/components/documents/types';
import {
  QuestionItem,
  QuestionsOutput,
  QuestionUpsertInput,
  QuestionOnWordRangesOutput,
  QuestionOnWordRange,
  CreateQuestionOnWordRangeUpsertInput,
} from './types';

import {
  callQuestionUpsertsProcedure,
  QuestionUpsertsProcedureOutput,
  getQuestionsObjByIds,
  getQuestionsObjByRefs,
  GetQuestionsObjectRow,
} from './sql-string';

@Injectable()
export class QuestionsService {
  constructor(
    private pg: PostgresService,
    private questionItemService: QuestionItemsService,
    private wordRangesService: WordRangesService,
  ) {}

  private async convertQueryResultToQuestions(
    rows: GetQuestionsObjectRow[],
    pgClient: PoolClient | null,
  ): Promise<QuestionsOutput> {
    try {
      const questionsMap = new Map<string, GetQuestionsObjectRow>();

      const questionItemIds: number[] = [];

      rows.forEach((row) => {
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
        questions: rows.map((row) => {
          const questionItems = row.question_items
            .map(
              (question_item_id) =>
                questionItemsMap.get(question_item_id) || null,
            )
            .filter((questionItem) => questionItem) as QuestionItem[];

          return {
            ...row,
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

  async reads(
    ids: number[],
    pgClient: PoolClient | null,
  ): Promise<QuestionsOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetQuestionsObjectRow>(...getQuestionsObjByIds(ids));

      return this.convertQueryResultToQuestions(res.rows, pgClient);
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      questions: [],
    };
  }

  async getQuestionsByRefs(
    refs: {
      parent_table: TableNameType;
      parent_id: number;
    }[],
    pgClient: PoolClient | null,
  ): Promise<QuestionsOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetQuestionsObjectRow>(...getQuestionsObjByRefs(refs));

      return this.convertQueryResultToQuestions(res.rows, pgClient);
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

  async createQuestionOnWordRange(
    input: CreateQuestionOnWordRangeUpsertInput,
    token,
    pgClient: PoolClient | null,
  ): Promise<QuestionOnWordRangesOutput> {
    try {
      const { error: wordRangeError, word_ranges } =
        await this.wordRangesService.upserts(
          [
            {
              begin_document_word_entry_id: input.begin_document_word_entry_id,
              end_document_word_entry_id: input.end_document_word_entry_id,
            },
          ],
          token,
          pgClient,
        );

      if (wordRangeError !== ErrorType.NoError || word_ranges.length === 0) {
        return {
          error: wordRangeError,
          questions: [],
        };
      }

      const { error: questionItemError, question_items } =
        await this.questionItemService.upserts(input.question_items, pgClient);

      if (questionItemError !== ErrorType.NoError) {
        return {
          error: questionItemError,
          questions: [],
        };
      }

      const { error: questionError, questions } = await this.upserts(
        [
          {
            parent_table: TableNameType.word_ranges,
            parent_id: word_ranges[0]!.word_range_id,
            question_type_is_multiselect: input.question_type_is_multiselect,
            question: input.question,
            question_items: (
              question_items.filter(
                (question_item) => question_item,
              ) as QuestionItem[]
            ).map((item) => item.question_item_id),
          },
        ],
        token,
        pgClient,
      );

      if (questionError !== ErrorType.NoError || questions.length === 0) {
        return {
          error: questionError,
          questions: [],
        };
      }

      return {
        error: ErrorType.NoError,
        questions: [
          {
            ...questions[0]!,
            begin: word_ranges[0]!.begin,
            end: word_ranges[0]!.end,
          },
        ],
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      questions: [],
    };
  }

  async getQuestionOnWordRangesByDocumentId(
    document_id: number,
    pgClient,
  ): Promise<QuestionOnWordRangesOutput> {
    try {
      const { error: wordRangeError, word_ranges } =
        await this.wordRangesService.getByDocumentId(document_id, pgClient);

      if (wordRangeError !== ErrorType.NoError) {
        return {
          error: wordRangeError,
          questions: [],
        };
      }

      const wordRangesMap = new Map<string, WordRange>();

      const refs = (
        word_ranges.map((word_range) => word_range) as WordRange[]
      ).map((word_range) => {
        wordRangesMap.set(word_range.word_range_id, word_range);

        return {
          parent_table: TableNameType.word_ranges,
          parent_id: +word_range.word_range_id,
        };
      });

      const { error: questionError, questions } = await this.getQuestionsByRefs(
        refs,
        pgClient,
      );

      if (questionError !== ErrorType.NoError) {
        return {
          error: questionError,
          questions: [],
        };
      }

      return {
        error: ErrorType.NoError,
        questions: questions
          .map((question) => {
            if (!question) {
              return null;
            }

            const wordRange = wordRangesMap.get(question.parent_id);

            if (!wordRange) {
              return null;
            }

            return {
              ...question,
              begin: wordRange.begin,
              end: wordRange.end,
            };
          })
          .filter((question) => question) as QuestionOnWordRange[],
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      questions: [],
    };
  }
}
