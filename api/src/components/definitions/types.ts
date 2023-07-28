import {
  Field,
  ID,
  Int,
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

@InputType()
export class DefinitionUpdateaInput {
  @Field(() => ID) definition_id: string;
  @Field(() => Boolean) definition_type_is_word: boolean;
  @Field(() => String) definitionlike_string: string;
}

@InputType()
export class WordDefinitionUpdateInput {
  @Field(() => ID) word_definition_id: string;
  @Field(() => String) definitionlike_string: string;
}

@InputType()
export class PhraseDefinitionUpdateInput {
  @Field(() => ID) phrase_definition_id: string;
  @Field(() => String) definitionlike_string: string;
}

@ObjectType()
export class DefinitionUpdateOutput extends GenericOutput {
  @Field(() => WordDefinition, { nullable: true })
  word_definition: WordDefinition | null;
  @Field(() => PhraseDefinition, { nullable: true })
  phrase_definition: PhraseDefinition | null;
}

@InputType()
export class LanguageInput {
  @Field(() => String) language_code: string;
  @Field(() => String, { nullable: true }) dialect_code: string | null;
  @Field(() => String, { nullable: true }) geo_code: string | null;
}

@ObjectType()
export class WordDefinitionWithVote extends WordDefinition {
  @Field(() => String) created_at: string;
  @Field(() => Int) upvotes: number;
  @Field(() => Int) downvotes: number;
}

@ObjectType()
export class PhraseDefinitionWithVote extends PhraseDefinition {
  @Field(() => String) created_at: string;
  @Field(() => Int) upvotes: number;
  @Field(() => Int) downvotes: number;
}

@ObjectType()
export class WordDefinitionWithVoteListOutput extends GenericOutput {
  @Field(() => [WordDefinitionWithVote], { nullable: 'items' })
  word_definition_list: WordDefinitionWithVote[];
}

@ObjectType()
export class PhraseDefinitionWithVoteListOutput extends GenericOutput {
  @Field(() => [PhraseDefinitionWithVote], { nullable: 'items' })
  phrase_definition_list: PhraseDefinitionWithVote[];
}

@ObjectType()
export class WordDefinitionVote {
  @Field(() => ID) word_definitions_vote_id: string;
  @Field(() => ID) word_definition_id: string;
  @Field(() => ID) user_id: string;
  @Field(() => Boolean) vote: boolean;
  @Field(() => Date) last_updated_at: Date;
}

@ObjectType()
export class PhraseDefinitionVote {
  @Field(() => ID) phrase_definitions_vote_id: string;
  @Field(() => ID) phrase_definition_id: string;
  @Field(() => ID) user_id: string;
  @Field(() => Boolean) vote: boolean;
  @Field(() => Date) last_updated_at: Date;
}

@InputType()
export class DefinitionVoteUpsertInput {
  @Field(() => ID) definition_id: string;
  @Field(() => Boolean) vote: boolean;
}

@ObjectType()
export class WordDefinitionVoteOutput extends GenericOutput {
  @Field(() => WordDefinitionVote, { nullable: true })
  word_definition_vote: WordDefinitionVote;
}

@ObjectType()
export class PhraseDefinitionVoteOutput extends GenericOutput {
  @Field(() => PhraseDefinitionVote, { nullable: true })
  phrase_definition_vote: PhraseDefinitionVote;
}

@ObjectType()
export class DefinitionVoteStatus {
  @Field(() => ID) definition_id: string;
  @Field(() => Int) upvotes: number;
  @Field(() => Int) downvotes: number;
}

@ObjectType()
export class DefinitionVoteStatusOutputRow extends GenericOutput {
  @Field(() => DefinitionVoteStatus, { nullable: true })
  vote_status: DefinitionVoteStatus;
}
