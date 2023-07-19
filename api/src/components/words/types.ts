import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { GenericOutput } from 'src/common/types';

@ObjectType()
export class Word {
  @Field(() => ID) word_id: string;
  @Field(() => String) word: string;
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
  @Field(() => ID) word_id: string;
}

@ObjectType()
export class WordReadOutput extends GenericOutput {
  @Field(() => Word, { nullable: true }) word: Word | null;
}
