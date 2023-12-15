import { Injectable, Logger, Inject } from '@nestjs/common';
import {
  Args,
  Query,
  Resolver,
  Mutation,
  Subscription,
  Context,
  ID,
  Int,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { SubscriptionToken } from 'src/common/subscription-token';
import { PUB_SUB } from 'src/pubSub.module';

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
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
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

  @Query(() => QuestionOnWordRangesOutput)
  async getQuestionOnWordRangesByBeginWordEntryId(
    @Args('begin_document_word_entry_id', { type: () => ID })
    begin_document_word_entry_id: string,
  ): Promise<QuestionOnWordRangesOutput> {
    Logger.log(
      'getQuestionOnWordRangesByBeginWordEntryId',
      JSON.stringify({ begin_document_word_entry_id }, null, 2),
    );

    return this.questionService.getQuestionOnWordRangesByBeginWordEntryId(
      +begin_document_word_entry_id,
      null,
    );
  }

  @Query(() => QuestionOnWordRangesOutput)
  async getQuestionOnWordRangesByWordRangeId(
    @Args('word_range_id', { type: () => ID })
    word_range_id: string,
  ): Promise<QuestionOnWordRangesOutput> {
    Logger.log(
      'getQuestionOnWordRangesByWordRangeId',
      JSON.stringify({ word_range_id }, null, 2),
    );

    return this.questionService.getQuestionOnWordRangesByWordRangeId(
      +word_range_id,
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

  @Mutation(() => QuestionsOutput)
  async upsertQuestions(
    @Args('input', { type: () => [QuestionUpsertInput] })
    input: QuestionUpsertInput[],
    @Context() req: any,
  ): Promise<QuestionsOutput> {
    Logger.log('upsertQuestions: ', input);

    const newQuestions = await this.questionService.upserts(
      input,
      getBearer(req) || '',
      null,
    );

    this.pubSub.publish(SubscriptionToken.questionsAdded, {
      [SubscriptionToken.questionsAdded]: newQuestions,
    });

    return newQuestions;
  }

  @Subscription(() => QuestionsOutput, {
    name: SubscriptionToken.questionsAdded,
  })
  subscribeToQuestionsAdded() {
    return this.pubSub.asyncIterator(SubscriptionToken.questionsAdded);
  }

  @Mutation(() => QuestionOnWordRangesOutput)
  async createQuestionOnWordRange(
    @Args('input', { type: () => CreateQuestionOnWordRangeUpsertInput })
    input: CreateQuestionOnWordRangeUpsertInput,
    @Context() req: any,
  ): Promise<QuestionOnWordRangesOutput> {
    Logger.log('upsertQuestions: ', input);

    const newQuestions = await this.questionService.createQuestionOnWordRange(
      input,
      getBearer(req) || '',
      null,
    );

    this.pubSub.publish(SubscriptionToken.questionsOnWordRangeAdded, {
      [SubscriptionToken.questionsOnWordRangeAdded]: newQuestions,
    });

    return newQuestions;
  }

  @Subscription(() => QuestionOnWordRangesOutput, {
    name: SubscriptionToken.questionsOnWordRangeAdded,
  })
  subscribeToQuestionsOnWordrangeAdded() {
    return this.pubSub.asyncIterator(
      SubscriptionToken.questionsOnWordRangeAdded,
    );
  }

  @Mutation(() => AnswersOutput)
  async upsertAnswers(
    @Args('input', { type: () => [AnswerUpsertInput] })
    input: AnswerUpsertInput[],
    @Context() req: any,
  ): Promise<AnswersOutput> {
    Logger.log('upsertAnswers: ', input);

    const answersAdded = await this.answerService.upserts(
      input,
      getBearer(req) || '',
      null,
    );

    this.pubSub.publish(SubscriptionToken.answersAdded, {
      [SubscriptionToken.answersAdded]: answersAdded,
    });

    return answersAdded;
  }

  @Subscription(() => AnswersOutput, {
    name: SubscriptionToken.answersAdded,
  })
  subscribeToAnswersAdded() {
    return this.pubSub.asyncIterator(SubscriptionToken.answersAdded);
  }
}
