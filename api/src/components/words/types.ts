import { Field, Int, InputType, ObjectType } from '@nestjs/graphql';
import { GenericOutput } from 'src/common/types';

@ObjectType()
export class WordDefinition {
  @Field(() => Int) word_definition_id: number;
  @Field(() => String) definition: string;
}

@ObjectType()
export class Word {
  @Field(() => Int) word_id: number;
  @Field(() => String) word: string;
  @Field(() => WordDefinition, { nullable: true })
  definition: WordDefinition | null;
  @Field(() => String) language_code: string;
  @Field(() => String, { nullable: true }) dialect_code: string | null;
  @Field(() => String, { nullable: true }) geo_code: string | null;
}

@InputType()
export class WordUpsertInput {
  @Field(() => String) wordlike_string: string;
  @Field(() => String) language_code: string;
  @Field(() => String, { nullable: true }) dialect_code: string | null;
  @Field(() => String, { nullable: true }) geo_code: string | null;
}

@ObjectType()
export class WordUpsertOutput extends GenericOutput {
  @Field(() => Word, { nullable: true }) word: Word | null;
}

@InputType()
export class WordReadInput {
  @Field(() => Int) word_id: number;
}

@ObjectType()
export class WordReadOutput extends GenericOutput {
  @Field(() => Word, { nullable: true }) word: Word | null;
}
