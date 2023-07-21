import {
  Field,
  ID,
  InputType,
  ObjectType,
  createUnionType,
} from '@nestjs/graphql';

import { GenericOutput } from 'src/common/types';

import { Word } from 'src/components/words/types';
import { Phrase } from 'src/components/phrases/types';

@ObjectType()
export class WordDefinition {
  @Field(() => ID) word_definition_id: string;
  @Field(() => String) definition: string;
  @Field(() => Word) word: Word;
}

@ObjectType()
export class PhraseDefinition {
  @Field(() => ID) phrase_definition_id: string;
  @Field(() => String) definition: string;
  @Field(() => Phrase) phrase: Phrase;
}

export const Definition = createUnionType({
  name: 'Definition',
  types: () => [WordDefinition, PhraseDefinition] as const,
  resolveType(value) {
    if (value.phrase_definition_id) {
      return PhraseDefinition;
    }
    if (value.word_definition_id) {
      return WordDefinition;
    }
    return null;
  },
});

@InputType()
export class WordDefinitionUpsertInput {
  @Field(() => ID) word_id: string;
  @Field(() => String) definition: string;
}

@InputType()
export class PhraseDefinitionUpsertInput {
  @Field(() => ID) phrase_id: string;
  @Field(() => String) definition: string;
}

@ObjectType()
export class WordDefinitionUpsertOutput extends GenericOutput {
  @Field(() => WordDefinition, { nullable: true })
  word_definition: WordDefinition | null;
}

@ObjectType()
export class PhraseDefinitionUpsertOutput extends GenericOutput {
  @Field(() => PhraseDefinition, { nullable: true })
  phrase_definition: PhraseDefinition | null;
}

@ObjectType()
export class WordDefinitionReadOutput extends GenericOutput {
  @Field(() => WordDefinition, { nullable: true })
  word_definition: WordDefinition | null;
}

@ObjectType()
export class PhraseDefinitionReadOutput extends GenericOutput {
  @Field(() => PhraseDefinition, { nullable: true })
  phrase_definition: PhraseDefinition | null;
}

@InputType()
export class FromWordAndDefintionlikeStringUpsertInput {
  @Field(() => String) wordlike_string: string;
  @Field(() => String) definitionlike_string: string;
  @Field(() => String) language_code: string;
  @Field(() => String, { nullable: true }) dialect_code: string | null;
  @Field(() => String, { nullable: true }) geo_code: string | null;
}

@InputType()
export class FromPhraseAndDefintionlikeStringUpsertInput {
  @Field(() => String) phraselike_string: string;
  @Field(() => String) definitionlike_string: string;
  @Field(() => String) language_code: string;
  @Field(() => String, { nullable: true }) dialect_code: string | null;
  @Field(() => String, { nullable: true }) geo_code: string | null;
}
