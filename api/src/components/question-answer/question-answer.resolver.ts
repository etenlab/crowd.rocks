import { Injectable } from '@nestjs/common';
import { Args, Query, Resolver, Mutation, Context, ID } from '@nestjs/graphql';
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
  ): Promise<QuestionItemsOutput> {
    console.log('upsertQuestionItems: ', items);

    return this.questionItemService.upserts(items, null);
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

  @Query(() => QuestionsOutput)
  async getQuestionsByRefs(
    @Args('parent_tables', { type: () => [TableNameType] })
    parent_tables: TableNameType[],
    @Args('parent_ids', { type: () => [ID] })
    parent_ids: string[],
  ): Promise<QuestionsOutput> {
    console.log('getQuestionsByRefs', parent_tables, parent_ids);

    return this.questionService.getQuestionsByRefs(
      parent_tables.map((parent_table, index) => ({
        parent_table,
        parent_id: +parent_ids[index],
      })),
      null,
    );
  }

  @Query(() => QuestionOnWordRangesOutput)
  async getQuestionOnWordRangesByDocumentId(
    @Args('document_id', { type: () => ID })
    document_id: string,
  ): Promise<QuestionOnWordRangesOutput> {
    console.log('getQuestionOnWordRangesByDocumentId', document_id);

    return this.questionService.getQuestionOnWordRangesByDocumentId(
      +document_id,
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

  @Mutation(() => QuestionOnWordRangesOutput)
  async createQuestionOnWordRange(
    @Args('input', { type: () => CreateQuestionOnWordRangeUpsertInput })
    input: CreateQuestionOnWordRangeUpsertInput,
    @Context() req: any,
  ): Promise<QuestionOnWordRangesOutput> {
    console.log('upsertQuestions: ', input);

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
    console.log('readAnswers, ids:', ids);

    return this.answerService.reads(
      ids.map((id) => +id),
      null,
    );
  }

  @Query(() => AnswersOutput)
  async getAnswersByQuestionIds(
    @Args('ids', { type: () => [ID] }) ids: string[],
  ): Promise<AnswersOutput> {
    console.log('getAnswersByQuestionIds, ids:', ids);

    return this.answerService.getAnswersByQuestionIds(
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
