import { Injectable, Logger } from '@nestjs/common';
import {
  Args,
  Query,
  Resolver,
  Mutation,
  Context,
  ID,
  Int,
} from '@nestjs/graphql';
import { getBearer } from 'src/common/utility';

import { QuestionItemsService } from './question-items.service';
import { QuestionsService } from './questions.service';
import { AnswersService } from './answers.service';

import {
  CreateQuestionOnWordRangeUpsertInput,
  QuestionOnWordRangesOutput,
  QuestionItemsOutput,
  QuestionsOutput,
  AnswersOutput,
  QuestionUpsertInput,
  AnswerUpsertInput,
  QuestionWithStatisticOutput,
  QuestionOnWordRangesListConnection,
} from './types';
import { TableNameType } from 'src/common/types';

@Injectable()
@Resolver()
export class QuestionAndAnswersResolver {
  constructor(
    private questionItemService: QuestionItemsService,
    private questionService: QuestionsService,
    private answerService: AnswersService,
  ) {}

  @Query(() => QuestionItemsOutput)
  async readQuestionItems(
    @Args('ids', { type: () => [ID] }) ids: string[],
  ): Promise<QuestionItemsOutput> {
    Logger.log('readQuestionItems, ids:', ids);

    return this.questionItemService.reads(
      ids.map((id) => +id),
      null,
    );
  }

  @Mutation(() => QuestionItemsOutput)
  async upsertQuestionItems(
    @Args('items', { type: () => [String] })
    items: string[],
    @Context() req: any,
  ): Promise<QuestionItemsOutput> {
    Logger.log('upsertQuestionItems: ', items);

    return this.questionItemService.upserts(items, null, getBearer(req));
  }

  @Query(() => QuestionsOutput)
  async readQuestions(
    @Args('ids', { type: () => [ID] }) ids: string[],
  ): Promise<QuestionsOutput> {
    Logger.log('readQuestions, ids:', ids);

    return this.questionService.reads(
      ids.map((id) => +id),
      null,
    );
  }

  @Query(() => QuestionWithStatisticOutput)
  async getQuestionStatistic(
    @Args('question_id', { type: () => ID }) question_id: string,
  ): Promise<QuestionWithStatisticOutput> {
    Logger.log('getQuestionStatistic, question_id:', question_id);

    return this.questionService.getQuestionStatistic(+question_id, null);
  }

  @Query(() => QuestionsOutput)
  async getQuestionsByRefs(
    @Args('parent_tables', { type: () => [TableNameType] })
    parent_tables: TableNameType[],
    @Args('parent_ids', { type: () => [ID] })
    parent_ids: string[],
  ): Promise<QuestionsOutput> {
    Logger.log('getQuestionsByRefs', parent_tables, parent_ids);

    return this.questionService.getQuestionsByRefs(
      parent_tables.map((parent_table, index) => ({
        parent_table,
        parent_id: +parent_ids[index],
      })),
      null,
    );
  }

  @Query(() => QuestionOnWordRangesListConnection)
  async getQuestionOnWordRangesByDocumentId(
    @Args('document_id', { type: () => ID })
    document_id: string,
    @Args('first', { type: () => Int, nullable: true }) first: number | null,
    @Args('after', { type: () => ID, nullable: true }) after: string | null,
  ): Promise<QuestionOnWordRangesListConnection> {
    Logger.log(
      'getQuestionOnWordRangesByDocumentId',
      JSON.stringify({ document_id, first, after }, null, 2),
    );

    return this.questionService.getQuestionOnWordRangesByDocumentId(
      +document_id,
      first,
      after,
      null,
    );
  }

  @Mutation(() => QuestionsOutput)
  async upsertQuestions(
    @Args('input', { type: () => [QuestionUpsertInput] })
    input: QuestionUpsertInput[],
    @Context() req: any,
  ): Promise<QuestionsOutput> {
    Logger.log('upsertQuestions: ', input);

    return this.questionService.upserts(input, getBearer(req) || '', null);
  }

  @Mutation(() => QuestionOnWordRangesOutput)
  async createQuestionOnWordRange(
    @Args('input', { type: () => CreateQuestionOnWordRangeUpsertInput })
    input: CreateQuestionOnWordRangeUpsertInput,
    @Context() req: any,
  ): Promise<QuestionOnWordRangesOutput> {
    Logger.log('upsertQuestions: ', input);

    return this.questionService.createQuestionOnWordRange(
      input,
      getBearer(req) || '',
      null,
    );
  }

  @Query(() => AnswersOutput)
  async readAnswers(
    @Args('ids', { type: () => [ID] }) ids: string[],
  ): Promise<AnswersOutput> {
    Logger.log('readAnswers, ids:', ids);

    return this.answerService.reads(
      ids.map((id) => +id),
      null,
    );
  }

  @Query(() => AnswersOutput)
  async getAnswersByQuestionIds(
    @Args('ids', { type: () => [ID] }) ids: string[],
  ): Promise<AnswersOutput> {
    Logger.log('getAnswersByQuestionIds, ids:', ids);

    return this.answerService.getAnswersByQuestionIds(
      ids.map((id) => +id),
      null,
    );
  }

  @Query(() => AnswersOutput)
  async getAnswerByUserId(
    @Args('question_id', { type: () => ID }) question_id: string,
    @Args('user_id', { type: () => ID }) user_id: string,
  ): Promise<AnswersOutput> {
    Logger.log('getAnswerByUserId, ids:', { question_id, user_id });

    return this.answerService.getAnswerByUserId(+question_id, +user_id, null);
  }

  @Mutation(() => AnswersOutput)
  async upsertAnswers(
    @Args('input', { type: () => [AnswerUpsertInput] })
    input: AnswerUpsertInput[],
    @Context() req: any,
  ): Promise<AnswersOutput> {
    Logger.log('upsertAnswers: ', input);

    return this.answerService.upserts(input, getBearer(req) || '', null);
  }
}
