import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { GenericOutput } from 'src/common/types';

@ObjectType()
export class Phrase {
  @Field(() => ID) phrase_id: string;
  @Field(() => String) phrase: string;
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
  @Field(() => ID) phrase_id: string;
}

@ObjectType()
export class PhraseReadOutput extends GenericOutput {
  @Field(() => Phrase, { nullable: true }) phrase: Phrase | null;
}
