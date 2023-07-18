import { Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';
import { GenericOutput } from 'src/common/types';

@ObjectType()  
export class WordDefinition {
  @Field((type) => ID) word_definition_id: string;
  @Field((type) => String) definition: string;
}

@ObjectType()
export class Word {
  @Field((type) => ID) word_id: string;
  @Field((type) => String) word: string;
  @Field((type) => WordDefinition, { nullable: true })
  definition: WordDefinition | null;
  @Field((type) => String) language_code: string;
  @Field((type) => String, { nullable: true }) dialect_code: string | null;
  @Field((type) => String, { nullable: true }) geo_code: string | null;
}

@InputType()
export class WordUpsertInput {
  @Field((type) => String) wordlike_string: string;
  @Field((type) => String) language_code: string;
  @Field((type) => String, { nullable: true }) dialect_code: string | null;
  @Field((type) => String, { nullable: true }) geo_code: string | null;
}

@ObjectType()
export class WordUpsertOutput extends GenericOutput {
  @Field((type) => Word, { nullable: true }) word: Word | null;
}

@InputType()
export class WordReadInput {
  @Field((type) => ID) word_id: string;
}

@ObjectType()
export class WordReadOutput extends GenericOutput {
  @Field((type) => Word, { nullable: true }) word: Word | null;
}
