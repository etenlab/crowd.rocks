import { Field, ID, Int, InputType, ObjectType } from '@nestjs/graphql';

import { GenericOutput } from 'src/common/types';
import { PartialVoteStatus } from 'src/components/common/types';

import { WordDefinition } from 'src/components/definitions/types';
import { PhraseDefinition } from 'src/components/definitions/types';
import { WordUpsertInput } from '../words/types';

@ObjectType()
export class WordToWordTranslation {
  @Field(() => ID) word_to_word_translation_id: string;
  @Field(() => WordDefinition) from_word_definition: WordDefinition;
  @Field(() => WordDefinition) to_word_definition: WordDefinition;
}

@ObjectType()
export class WordToPhraseTranslation {
  @Field(() => ID) word_to_phrase_translation_id: string;
  @Field(() => WordDefinition) from_word_definition: WordDefinition;
  @Field(() => PhraseDefinition) to_phrase_definition: PhraseDefinition;
}

@ObjectType()
export class PhraseToWordTranslation {
  @Field(() => ID) phrase_to_word_translation_id: string;
  @Field(() => PhraseDefinition) from_phrase_definition: PhraseDefinition;
  @Field(() => WordDefinition) to_word_definition: WordDefinition;
}

@ObjectType()
export class PhraseToPhraseTranslation {
  @Field(() => ID) phrase_to_phrase_translation_id: string;
  @Field(() => PhraseDefinition) from_phrase_definition: PhraseDefinition;
  @Field(() => PhraseDefinition) to_phrase_definition: PhraseDefinition;
}

@InputType()
export class WordToWordTranslationUpsertInput {
  @Field(() => ID) from_word_definition_id: string;
  @Field(() => ID) to_word_definition_id: string;
}

@InputType()
export class WordToPhraseTranslationUpsertInput {
  @Field(() => ID) from_word_definition_id: string;
  @Field(() => ID) to_phrase_definition_id: string;
}

@InputType()
export class PhraseToWordTranslationUpsertInput {
  @Field(() => ID) from_phrase_definition_id: string;
  @Field(() => ID) to_word_definition_id: string;
}

@InputType()
export class PhraseToPhraseTranslationUpsertInput {
  @Field(() => ID) from_phrase_definition_id: string;
  @Field(() => ID) to_phrase_definition_id: string;
}

@ObjectType()
export class WordToWordTranslationUpsertOutput extends GenericOutput {
  @Field(() => WordToWordTranslation, { nullable: true })
  word_to_word_translation: WordToWordTranslation | null;
}

@ObjectType()
export class WordToPhraseTranslationUpsertOutput extends GenericOutput {
  @Field(() => WordToPhraseTranslation, { nullable: true })
  word_to_phrase_translation: WordToPhraseTranslation | null;
}

@ObjectType()
export class PhraseToWordTranslationUpsertOutput extends GenericOutput {
  @Field(() => PhraseToWordTranslation, { nullable: true })
  phrase_to_word_translation: PhraseToWordTranslation | null;
}

@ObjectType()
export class PhraseToPhraseTranslationUpsertOutput extends GenericOutput {
  @Field(() => PhraseToPhraseTranslation, { nullable: true })
  phrase_to_phrase_translation: PhraseToPhraseTranslation | null;
}

@ObjectType()
export class WordToWordTranslationReadOutput extends GenericOutput {
  @Field(() => WordToWordTranslation, { nullable: true })
  word_to_word_translation: WordToWordTranslation | null;
}

@ObjectType()
export class WordToPhraseTranslationReadOutput extends GenericOutput {
  @Field(() => WordToPhraseTranslation, { nullable: true })
  word_to_phrase_translation: WordToPhraseTranslation | null;
}

@ObjectType()
export class PhraseToWordTranslationReadOutput extends GenericOutput {
  @Field(() => PhraseToWordTranslation, { nullable: true })
  phrase_to_word_translation: PhraseToWordTranslation | null;
}

@ObjectType()
export class PhraseToPhraseTranslationReadOutput extends GenericOutput {
  @Field(() => PhraseToPhraseTranslation, { nullable: true })
  phrase_to_phrase_translation: PhraseToPhraseTranslation | null;
}

@InputType()
export class AddWordAsTranslationForWordInput {
  @Field(() => String) originalDefinitionId: string;
  @Field(() => WordUpsertInput) translationWord: WordUpsertInput;
  @Field(() => String) translationDefinition: string;
}

@ObjectType()
export class AddWordAsTranslationForWordOutput extends GenericOutput {
  @Field(() => String) wordTranslationId: string;
}

@ObjectType()
export class WordTrVoteStatus extends PartialVoteStatus {
  @Field(() => String) word_to_word_translation_id: string;
}

@ObjectType()
export class WordToPhraseVoteStatus extends PartialVoteStatus {
  @Field(() => ID) word_to_phrase_translation_id: string;
}

@ObjectType()
export class PhraseToWordVoteStatus extends PartialVoteStatus {
  @Field(() => ID) phrase_to_word_translation_id: string;
}

@ObjectType()
export class PhraseToPhraseVoteStatus extends PartialVoteStatus {
  @Field(() => ID) phrase_to_phrase_translation_id: string;
}

@InputType()
export class WordTrVoteStatusInput extends GenericOutput {
  @Field(() => ID) word_to_word_translation_id: string;
  @Field(() => Boolean) vote: boolean;
}

@ObjectType()
export class WordTrVoteStatusOutputRow extends GenericOutput {
  @Field(() => WordTrVoteStatus, { nullable: true })
  vote_status: WordTrVoteStatus;
}

@InputType()
export class WordToPhraseVoteStatusInput extends GenericOutput {
  @Field(() => ID) word_to_phrase_translation_id: string;
  @Field(() => Boolean) vote: boolean;
}

@ObjectType()
export class WordToPhraseVoteStatusOutputRow extends GenericOutput {
  @Field(() => WordToPhraseVoteStatus, { nullable: true })
  vote_status: WordToPhraseVoteStatus;
}

@InputType()
export class PhraseToWordVoteStatusInput extends GenericOutput {
  @Field(() => ID) phrase_to_word_translation_id: string;
  @Field(() => Boolean) vote: boolean;
}

@ObjectType()
export class PhraseToWordVoteStatusOutputRow extends GenericOutput {
  @Field(() => PhraseToWordVoteStatus, { nullable: true })
  vote_status: PhraseToWordVoteStatus;
}

@InputType()
export class PhraseToPhraseVoteStatusInput extends GenericOutput {
  @Field(() => ID) phrase_to_phrase_translation_id: string;
  @Field(() => Boolean) vote: boolean;
}

@ObjectType()
export class PhraseToPhraseVoteStatusOutputRow extends GenericOutput {
  @Field(() => PhraseToPhraseVoteStatus, { nullable: true })
  vote_status: PhraseToPhraseVoteStatus;
}

@ObjectType()
export class WordToWordTranslationWithVote extends WordToWordTranslation {
  @Field(() => Int) upvotes: number;
  @Field(() => Int) downvotes: number;
}

@ObjectType()
export class WordToPhraseTranslationWithVote extends WordToPhraseTranslation {
  @Field(() => Int) upvotes: number;
  @Field(() => Int) downvotes: number;
}

@ObjectType()
export class PhraseToWordTranslationWithVote extends PhraseToWordTranslation {
  @Field(() => Int) upvotes: number;
  @Field(() => Int) downvotes: number;
}

@ObjectType()
export class PhraseToPhraseTranslationWithVote extends PhraseToPhraseTranslation {
  @Field(() => Int) upvotes: number;
  @Field(() => Int) downvotes: number;
}

@ObjectType()
export class WordToWordTranslationWithVoteListOutput extends GenericOutput {
  @Field(() => [WordToWordTranslationWithVote], { nullable: 'items' })
  word_to_word_tr_with_vote_list: WordToWordTranslationWithVote[];
}

@ObjectType()
export class WordToPhraseTranslationWithVoteListOutput extends GenericOutput {
  @Field(() => [WordToPhraseTranslationWithVote], { nullable: 'items' })
  word_to_phrase_tr_with_vote_list: WordToPhraseTranslationWithVote[];
}

@ObjectType()
export class PhraseToWordTranslationWithVoteListOutput extends GenericOutput {
  @Field(() => [PhraseToWordTranslationWithVote], { nullable: 'items' })
  phrase_to_word_tr_with_vote_list: PhraseToWordTranslationWithVote[];
}

@ObjectType()
export class PhraseToPhraseTranslationWithVoteListOutput extends GenericOutput {
  @Field(() => [PhraseToPhraseTranslationWithVote], { nullable: 'items' })
  phrase_to_phrase_tr_with_vote_list: PhraseToPhraseTranslationWithVote[];
}

@ObjectType()
export class TranslationWithVoteListOutput extends GenericOutput {
  @Field(() => [WordToWordTranslationWithVote], { nullable: 'items' })
  word_to_word_tr_with_vote_list: WordToWordTranslationWithVote[];

  @Field(() => [WordToPhraseTranslationWithVote], { nullable: 'items' })
  word_to_phrase_tr_with_vote_list: WordToPhraseTranslationWithVote[];

  @Field(() => [PhraseToWordTranslationWithVote], { nullable: 'items' })
  phrase_to_word_tr_with_vote_list: PhraseToWordTranslationWithVote[];

  @Field(() => [PhraseToPhraseTranslationWithVote], { nullable: 'items' })
  phrase_to_phrase_tr_with_vote_list: PhraseToPhraseTranslationWithVote[];
}
