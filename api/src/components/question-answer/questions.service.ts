import { Injectable, Logger } from '@nestjs/common';
import { PoolClient } from 'pg';

import { pgClientOrPool } from 'src/common/utility';

import { ErrorType, TableNameType } from 'src/common/types';

import { PostgresService } from 'src/core/postgres.service';

import { WordRangesService } from 'src/components/documents/word-ranges.service';
import { QuestionItemsService } from './question-items.service';

import { WordRange } from 'src/components/documents/types';
import {
  Question,
  QuestionItem,
  QuestionsOutput,
  QuestionUpsertInput,
  QuestionOnWordRangesOutput,
  QuestionOnWordRange,
  CreateQuestionOnWordRangeUpsertInput,
  QuestionWithStatisticOutput,
  QuestionItemWithStatistic,
  QuestionOnWordRangesListConnection,
} from './types';

import {
  callQuestionUpsertsProcedure,
  QuestionUpsertsProcedureOutput,
  getQuestionsObjByIds,
  getQuestionsObjByRefs,
  GetQuestionsObjectRow,
} from './sql-string';
import { AuthorizationService } from '../authorization/authorization.service';

@Injectable()
export class QuestionsService {
  constructor(
    private pg: PostgresService,
    private questionItemService: QuestionItemsService,
    private wordRangesService: WordRangesService,
    private authService: AuthorizationService,
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
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      questions: [],
    };
  }

  async getQuestionStatistic(
    question_id: number,
    pgClient: PoolClient | null,
  ): Promise<QuestionWithStatisticOutput> {
    try {
      const { error, questions } = await this.reads([question_id], pgClient);

      if (error !== ErrorType.NoError || questions.length !== 1) {
        return {
          error,
          question_with_statistic: null,
        };
      }

      const question_item_ids: number[] = questions[0]!.question_items.map(
        (question_item) => +question_item.question_item_id,
      );

      const { error: qiError, question_item_with_statistics } =
        await this.questionItemService.getStatistics(
          question_item_ids,
          pgClient,
        );

      if (qiError !== ErrorType.NoError) {
        return {
          error,
          question_with_statistic: null,
        };
      }

      const questionItemMap = new Map<string, QuestionItemWithStatistic>();

      question_item_with_statistics.forEach((item) => {
        if (item) {
          questionItemMap.set(item.question_item_id, item);
        }
      });

      return {
        error: ErrorType.NoError,
        question_with_statistic: {
          ...questions[0]!,
          question_items: questions[0]!.question_items.map((item) => {
            const data = questionItemMap.get(item.question_item_id);

            if (data) {
              return data;
            } else {
              return {
                ...item,
                statistic: 0,
              };
            }
          }),
        },
      };
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      question_with_statistic: null,
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
      Logger.error(e);
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

    if (!(await this.authService.is_authorized(token))) {
      return {
        error: ErrorType.Unauthorized,
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
      Logger.error(e);
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
    if (!(await this.authService.is_authorized(token))) {
      return {
        error: ErrorType.Unauthorized,
        questions: [],
      };
    }
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
        await this.questionItemService.upserts(
          input.question_items,
          pgClient,
          token,
        );

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
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      questions: [],
    };
  }

  async getQuestionOnWordRangesByDocumentId(
    document_id: number,
    first: number | null,
    after: string | null,
    pgClient,
  ): Promise<QuestionOnWordRangesListConnection> {
    try {
      const {
        error: wordRangeError,
        edges,
        pageInfo,
      } = await this.wordRangesService.getByDocumentId(
        document_id,
        first,
        after,
        pgClient,
      );

      if (wordRangeError !== ErrorType.NoError) {
        return {
          error: wordRangeError,
          edges: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null,
          },
        };
      }

      const refs = (
        edges
          .reduce<WordRange[]>((acc, edge) => [...acc, ...edge.node], [])
          .map((word_range) => word_range) as WordRange[]
      ).map((word_range) => {
        return {
          parent_table: TableNameType.word_ranges,
          parent_id: +word_range.word_range_id,
        };
      });

      const questionsMap = new Map<string, Question[]>();

      const { error: questionError, questions } = await this.getQuestionsByRefs(
        refs,
        pgClient,
      );

      if (questionError !== ErrorType.NoError) {
        return {
          error: questionError,
          edges: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null,
          },
        };
      }

      questions.forEach((question) => {
        if (!question) {
          return;
        }

        const entries = questionsMap.get(question.parent_id);

        if (entries) {
          entries.push(question);
        } else {
          questionsMap.set(question.parent_id, [question]);
        }
      });

      const questionEdges = edges.map((edge) => {
        const node: QuestionOnWordRange[] = [];

        edge.node.map((item) => {
          const entries = questionsMap.get(item.word_range_id);

          if (entries) {
            node.push(
              ...entries.map((entry) => ({
                ...entry,
                begin: item.begin,
                end: item.end,
              })),
            );
          }
        });

        return {
          cursor: edge.cursor,
          node,
        };
      });

      return {
        error: ErrorType.NoError,
        edges: questionEdges,
        pageInfo,
      };
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      },
    };
  }
}
