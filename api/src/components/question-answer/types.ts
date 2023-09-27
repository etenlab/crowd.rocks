import { Field, ID, Int, InputType, ObjectType } from '@nestjs/graphql';
import { GenericOutput, TableNameType } from 'src/common/types';

@ObjectType()
export class QuestionItem {
  @Field(() => ID) question_item_id: string;
  @Field(() => String) item: string;
}

@ObjectType()
export class Question {
  @Field(() => ID) question_id: string;
  @Field(() => TableNameType) parent_table: TableNameType;
  @Field(() => String) parent_id: string;
  @Field(() => Boolean) question_type_is_multiselect: boolean;
  @Field(() => String) question: string;
  @Field(() => [QuestionItem]) question_items: QuestionItem[];
  @Field(() => Date) created_at: Date;
  @Field(() => String) created_by: string;
}

@InputType()
export class Answer {
  @Field(() => ID) answer_id: string;
  @Field(() => String) question_id: string;
  @Field(() => String, { nullable: true }) answer: string | null;
  @Field(() => [QuestionItem]) question_items: QuestionItem[];
  @Field(() => Date) created_at: Date;
  @Field(() => String) created_by: string;
}

@ObjectType()
export class QuestionItemsOutput extends GenericOutput {
  @Field(() => [QuestionItem], { nullable: true })
  question_items: (QuestionItem | null)[];
}

@ObjectType()
export class QuestionsOutput extends GenericOutput {
  @Field(() => [Question], { nullable: 'items' })
  questions: (Question | null)[];
}

@ObjectType()
export class AnswersOutput extends GenericOutput {
  @Field(() => [Answer], { nullable: 'items' })
  answers: (Answer | null)[];
}

@ObjectType()
export class QuestionUpsertInput {
  @Field(() => TableNameType) parent_table: TableNameType;
  @Field(() => Int) parent_id: string;
  @Field(() => Boolean) question_type_is_multiselect: boolean;
  @Field(() => String) question: string;
  @Field(() => [String]) question_items: string[];
}

@ObjectType()
export class AnswerUpsertInput {
  @Field(() => ID) question_id: string;
  @Field(() => String) answer: string;
  @Field(() => [String]) question_items: string[];
}
