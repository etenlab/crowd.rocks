import { Field, Int, InputType, ObjectType } from '@nestjs/graphql';
import { GenericOutput } from 'src/common/types';

@ObjectType()
export class PhraseDefinition {
  @Field(() => Int) phrase_definition_id: number;
  @Field(() => String) definition: string;
}

@ObjectType()
export class Phrase {
  @Field(() => Int) phrase_id: number;
  @Field(() => String) phrase: string;
  @Field(() => PhraseDefinition, { nullable: true })
  definition: PhraseDefinition | null;
  @Field(() => String) language_code: string;
  @Field(() => String, { nullable: true }) dialect_code: string | null;
  @Field(() => String, { nullable: true }) geo_code: string | null;
}

@InputType()
export class PhraseUpsertInput {
  @Field(() => String) phraselike_string: string;
  @Field(() => String) language_code: string;
  @Field(() => String, { nullable: true }) dialect_code: string | null;
  @Field(() => String, { nullable: true }) geo_code: string | null;
}

@ObjectType()
export class PhraseUpsertOutput extends GenericOutput {
  @Field(() => Phrase, { nullable: true }) phrase: Phrase | null;
}

@InputType()
export class PhraseReadInput {
  @Field(() => Int) phrase_id: number;
}

@ObjectType()
export class PhraseReadOutput extends GenericOutput {
  @Field(() => Phrase, { nullable: true }) phrase: Phrase | null;
}
