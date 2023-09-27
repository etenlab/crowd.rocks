import { Injectable } from '@nestjs/common';
import { Args, Query, Resolver, Mutation, Context, ID } from '@nestjs/graphql';
import { getBearer } from 'src/common/utility';

import { QuestionItemsService } from './question-items.service';
import { QuestionsService } from './questions.service';
import { AnswersService } from './answers.service';

import {
  QuestionItemsOutput,
  QuestionsOutput,
  AnswersOutput,
  QuestionUpsertInput,
  AnswerUpsertInput,
} from './types';

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
    console.log('readQuestionItems, ids:', ids);

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
    console.log('upsertQuestionItems: ', items);

    return this.questionItemService.upserts(items, getBearer(req) || '', null);
  }

  @Query(() => QuestionsOutput)
  async readQuestions(
    @Args('ids', { type: () => [ID] }) ids: string[],
  ): Promise<QuestionsOutput> {
    console.log('readQuestions, ids:', ids);

    return this.questionService.reads(
      ids.map((id) => +id),
      null,
    );
  }

  @Mutation(() => QuestionsOutput)
  async upsertQuestions(
    @Args('input', { type: () => [QuestionUpsertInput] })
    input: QuestionUpsertInput[],
    @Context() req: any,
  ): Promise<QuestionsOutput> {
    console.log('upsertQuestions: ', input);

    return this.questionService.upserts(input, getBearer(req) || '', null);
  }

  @Query(() => AnswersOutput)
  async readAnswers(
    @Args('ids', { type: () => [ID] }) ids: string[],
  ): Promise<AnswersOutput> {
    console.log('readAnswers, ids:', ids);

    return this.answerService.reads(
      ids.map((id) => +id),
      null,
    );
  }

  @Mutation(() => AnswersOutput)
  async upsertAnswers(
    @Args('input', { type: () => [AnswerUpsertInput] })
    input: AnswerUpsertInput[],
    @Context() req: any,
  ): Promise<AnswersOutput> {
    console.log('upsertAnswers: ', input);

    return this.answerService.upserts(input, getBearer(req) || '', null);
  }
}
