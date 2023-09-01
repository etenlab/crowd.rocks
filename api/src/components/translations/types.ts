import {
  ID,
  Int,
  Field,
  InputType,
  ObjectType,
  createUnionType,
} from '@nestjs/graphql';

import { GenericOutput } from 'src/common/types';
import { PartialVoteStatus } from 'src/components/common/types';

import { WordDefinition } from 'src/components/definitions/types';
import { PhraseDefinition } from 'src/components/definitions/types';
import { WordUpsertInput } from 'src/components/words/types';

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

export const Translation = createUnionType({
  name: 'Translation',
  types: () =>
    [
      WordToWordTranslation,
      WordToPhraseTranslation,
      PhraseToWordTranslation,
      PhraseToPhraseTranslation,
    ] as const,
  resolveType(value) {
    if (value.word_to_word_translation_id) {
      return WordToWordTranslation;
    }
    if (value.word_to_phrase_translation_id) {
      return WordToPhraseTranslation;
    }
    if (value.phrase_to_word_translation_id) {
      return PhraseToWordTranslation;
    }
    if (value.phrase_to_phrase_translation_id) {
      return PhraseToPhraseTranslation;
    }
    return null;
  },
});

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
export class WordToPhraseTranslationVoteStatus extends PartialVoteStatus {
  @Field(() => ID) word_to_phrase_translation_id: string;
}

@ObjectType()
export class PhraseToWordTranslationVoteStatus extends PartialVoteStatus {
  @Field(() => ID) phrase_to_word_translation_id: string;
}

@ObjectType()
export class PhraseToPhraseTranslationVoteStatus extends PartialVoteStatus {
  @Field(() => ID) phrase_to_phrase_translation_id: string;
}

export const TranslationVoteStatus = createUnionType({
  name: 'TranslationVoteStatus',
  types: () =>
    [
      WordTrVoteStatus,
      WordToPhraseTranslationVoteStatus,
      PhraseToWordTranslationVoteStatus,
      PhraseToPhraseTranslationVoteStatus,
    ] as const,
  resolveType(value) {
    if (value.word_to_word_translation_id) {
      return WordTrVoteStatus;
    }
    if (value.word_to_phrase_translation_id) {
      return WordToPhraseTranslationVoteStatus;
    }
    if (value.phrase_to_word_translation_id) {
      return PhraseToWordTranslationVoteStatus;
    }
    if (value.phrase_to_phrase_translation_id) {
      return PhraseToPhraseTranslationVoteStatus;
    }
    return null;
  },
});

@InputType()
export class WordTrVoteStatusInput {
  @Field(() => ID) word_to_word_translation_id: string;
  @Field(() => Boolean) vote: boolean;
}

@ObjectType()
export class WordTrVoteStatusOutputRow extends GenericOutput {
  @Field(() => WordTrVoteStatus, { nullable: true })
  vote_status: WordTrVoteStatus | null;
}

@InputType()
export class WordToPhraseTranslationVoteStatusInput {
  @Field(() => ID) word_to_phrase_translation_id: string;
  @Field(() => Boolean) vote: boolean;
}

@ObjectType()
export class WordToPhraseTranslationVoteStatusOutputRow extends GenericOutput {
  @Field(() => WordToPhraseTranslationVoteStatus, { nullable: true })
  vote_status: WordToPhraseTranslationVoteStatus | null;
}

@InputType()
export class PhraseToWordTranslationVoteStatusInput {
  @Field(() => ID) phrase_to_word_translation_id: string;
  @Field(() => Boolean) vote: boolean;
}

@ObjectType()
export class PhraseToWordTranslationVoteStatusOutputRow extends GenericOutput {
  @Field(() => PhraseToWordTranslationVoteStatus, { nullable: true })
  vote_status: PhraseToWordTranslationVoteStatus | null;
}

@InputType()
export class PhraseToPhraseTranslationVoteStatusInput {
  @Field(() => ID) phrase_to_phrase_translation_id: string;
  @Field(() => Boolean) vote: boolean;
}

@ObjectType()
export class PhraseToPhraseTranslationVoteStatusOutputRow extends GenericOutput {
  @Field(() => PhraseToPhraseTranslationVoteStatus, { nullable: true })
  vote_status: PhraseToPhraseTranslationVoteStatus | null;
}

@ObjectType()
export class TranslationVoteStatusOutputRow extends GenericOutput {
  @Field(() => TranslationVoteStatus, { nullable: true })
  translation_vote_status:
    | WordTrVoteStatus
    | WordToPhraseTranslationVoteStatus
    | PhraseToWordTranslationVoteStatus
    | PhraseToPhraseTranslationVoteStatus
    | null;
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

export const TranslationWithVote = createUnionType({
  name: 'TranslationWithVote',
  types: () =>
    [
      WordToWordTranslationWithVote,
      WordToPhraseTranslationWithVote,
      PhraseToWordTranslationWithVote,
      PhraseToPhraseTranslationWithVote,
    ] as const,
  resolveType(value) {
    if (value.word_to_word_translation_id) {
      return WordToWordTranslationWithVote;
    }
    if (value.word_to_phrase_translation_id) {
      return WordToPhraseTranslationWithVote;
    }
    if (value.phrase_to_word_translation_id) {
      return PhraseToWordTranslationWithVote;
    }
    if (value.phrase_to_phrase_translation_id) {
      return PhraseToPhraseTranslationWithVote;
    }
    return null;
  },
});

@ObjectType()
export class TranslationWithVoteOutput extends GenericOutput {
  @Field(() => TranslationWithVote, { nullable: true })
  translation_with_vote:
    | WordToWordTranslationWithVote
    | WordToPhraseTranslationWithVote
    | PhraseToWordTranslationWithVote
    | PhraseToPhraseTranslationWithVote
    | null;
}

@ObjectType()
export class WordToWordTranslationWithVoteListOutput extends GenericOutput {
  @Field(() => [WordToWordTranslationWithVote], { nullable: true })
  word_to_word_tr_with_vote_list: WordToWordTranslationWithVote[] | null;
}

@ObjectType()
export class WordToPhraseTranslationWithVoteListOutput extends GenericOutput {
  @Field(() => [WordToPhraseTranslationWithVote], { nullable: true })
  word_to_phrase_tr_with_vote_list: WordToPhraseTranslationWithVote[] | null;
}

@ObjectType()
export class PhraseToWordTranslationWithVoteListOutput extends GenericOutput {
  @Field(() => [PhraseToWordTranslationWithVote], { nullable: true })
  phrase_to_word_tr_with_vote_list: PhraseToWordTranslationWithVote[] | null;
}

@ObjectType()
export class PhraseToPhraseTranslationWithVoteListOutput extends GenericOutput {
  @Field(() => [PhraseToPhraseTranslationWithVote], { nullable: true })
  phrase_to_phrase_tr_with_vote_list:
    | PhraseToPhraseTranslationWithVote[]
    | null;
}

@ObjectType()
export class TranslationWithVoteListOutput extends GenericOutput {
  @Field(() => [TranslationWithVote], { nullable: true })
  translation_with_vote_list:
    | (
        | WordToWordTranslationWithVote
        | WordToPhraseTranslationWithVote
        | PhraseToWordTranslationWithVote
        | PhraseToPhraseTranslationWithVote
      )[]
    | null;
}

@InputType()
export class ToDefinitionInput {
  @Field(() => String) word_or_phrase: string;
  @Field(() => Boolean) is_type_word: boolean;
  @Field(() => String) definition: string;
  @Field(() => String) language_code: string;
  @Field(() => String, { nullable: true }) dialect_code: string | null;
  @Field(() => String, { nullable: true }) geo_code: string | null;
}

@ObjectType()
export class TranslationUpsertOutput extends GenericOutput {
  @Field(() => Translation, { nullable: true })
  translation:
    | WordToWordTranslation
    | WordToPhraseTranslation
    | PhraseToWordTranslation
    | PhraseToPhraseTranslation
    | null;
}

@ObjectType()
export class LanguageForGoogleTranslate {
  @Field(() => String) code: string;
  @Field(() => String) name: string;
}

@ObjectType()
export class LanguageListForGoogleTranslateOutput extends GenericOutput {
  @Field(() => [LanguageForGoogleTranslate], { nullable: true })
  languages: LanguageForGoogleTranslate[] | null;
}

@ObjectType()
export class TranslateAllWordsAndPhrasesByGoogleResult {
  @Field(() => Int) requestedCharactors: number;
  @Field(() => Int) totalWordCount: number;
  @Field(() => Int) totalPhraseCount: number;
  @Field(() => Int) translatedWordCount: number;
  @Field(() => Int) translatedPhraseCount: number;
}

@ObjectType()
export class TranslateAllWordsAndPhrasesByGoogleOutput extends GenericOutput {
  @Field(() => TranslateAllWordsAndPhrasesByGoogleResult, { nullable: true })
  result: TranslateAllWordsAndPhrasesByGoogleResult;
}
