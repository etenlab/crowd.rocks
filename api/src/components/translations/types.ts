import {
  ID,
  Int,
  Field,
  InputType,
  ObjectType,
  createUnionType,
  extend,
} from '@nestjs/graphql';

import { BotType, GenericOutput } from 'src/common/types';
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
export class WordToWordTranslationOutput extends GenericOutput {
  @Field(() => WordToWordTranslation, { nullable: true })
  word_to_word_translation: WordToWordTranslation | null;
}

@ObjectType()
export class WordToWordTranslationsOutput extends GenericOutput {
  @Field(() => [WordToWordTranslation], { nullable: 'items' })
  word_to_word_translations: (WordToWordTranslation | null)[];
}

@ObjectType()
export class WordToPhraseTranslationOutput extends GenericOutput {
  @Field(() => WordToPhraseTranslation, { nullable: true })
  word_to_phrase_translation: WordToPhraseTranslation | null;
}

@ObjectType()
export class WordToPhraseTranslationsOutput extends GenericOutput {
  @Field(() => [WordToPhraseTranslation], { nullable: 'items' })
  word_to_phrase_translations: (WordToPhraseTranslation | null)[];
}

@ObjectType()
export class PhraseToWordTranslationOutput extends GenericOutput {
  @Field(() => PhraseToWordTranslation, { nullable: true })
  phrase_to_word_translation: PhraseToWordTranslation | null;
}

@ObjectType()
export class PhraseToWordTranslationsOutput extends GenericOutput {
  @Field(() => [PhraseToWordTranslation], { nullable: 'items' })
  phrase_to_word_translations: (PhraseToWordTranslation | null)[];
}

@ObjectType()
export class PhraseToPhraseTranslationOutput extends GenericOutput {
  @Field(() => PhraseToPhraseTranslation, { nullable: true })
  phrase_to_phrase_translation: PhraseToPhraseTranslation | null;
}

@ObjectType()
export class PhraseToPhraseTranslationsOutput extends GenericOutput {
  @Field(() => [PhraseToPhraseTranslation], { nullable: 'items' })
  phrase_to_phrase_translations: (PhraseToPhraseTranslation | null)[];
}

@InputType()
export class AddWordAsTranslationForWordInput {
  @Field(() => String) originalDefinitionId: string;
  @Field(() => WordUpsertInput) translationWord: WordUpsertInput;
  @Field(() => String) translationDefinition: string;
}

@ObjectType()
export class AddWordAsTranslationForWordOutput extends GenericOutput {
  @Field(() => String, { nullable: true }) wordTranslationId: string | null;
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

@ObjectType()
export class WordTrVoteStatusOutput extends GenericOutput {
  @Field(() => [WordTrVoteStatus], { nullable: 'items' })
  vote_status_list: (WordTrVoteStatus | null)[];
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

@ObjectType()
export class WordToPhraseTranslationVoteStatusOutput extends GenericOutput {
  @Field(() => [WordToPhraseTranslationVoteStatus], { nullable: 'items' })
  vote_status_list: (WordToPhraseTranslationVoteStatus | null)[];
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

@ObjectType()
export class PhraseToWordTranslationVoteStatusOutput extends GenericOutput {
  @Field(() => [PhraseToWordTranslationVoteStatus], { nullable: 'items' })
  vote_status_list: (PhraseToWordTranslationVoteStatus | null)[];
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
export class PhraseToPhraseTranslationVoteStatusOutput extends GenericOutput {
  @Field(() => [PhraseToPhraseTranslationVoteStatus], { nullable: 'items' })
  vote_status_list: (PhraseToPhraseTranslationVoteStatus | null)[];
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
  @Field(() => [WordToWordTranslationWithVote], { nullable: 'items' })
  word_to_word_tr_with_vote_list: (WordToWordTranslationWithVote | null)[];
}

@ObjectType()
export class WordToWordTranslationWithVoteListFromIdsOutput extends GenericOutput {
  @Field(() => [[WordToWordTranslationWithVote]], { nullable: 'items' })
  word_to_word_tr_with_vote_list: (WordToWordTranslationWithVote | null)[][];
}

@ObjectType()
export class WordToPhraseTranslationWithVoteListOutput extends GenericOutput {
  @Field(() => [WordToPhraseTranslationWithVote], { nullable: 'items' })
  word_to_phrase_tr_with_vote_list: (WordToPhraseTranslationWithVote | null)[];
}

@ObjectType()
export class WordToPhraseTranslationWithVoteListFromIdsOutput extends GenericOutput {
  @Field(() => [[WordToPhraseTranslationWithVote]], { nullable: 'items' })
  word_to_phrase_tr_with_vote_list: (WordToPhraseTranslationWithVote | null)[][];
}

@ObjectType()
export class PhraseToWordTranslationWithVoteListOutput extends GenericOutput {
  @Field(() => [PhraseToWordTranslationWithVote], { nullable: 'items' })
  phrase_to_word_tr_with_vote_list: (PhraseToWordTranslationWithVote | null)[];
}

@ObjectType()
export class PhraseToWordTranslationWithVoteListFromIdsOutput extends GenericOutput {
  @Field(() => [[PhraseToWordTranslationWithVote]], { nullable: 'items' })
  phrase_to_word_tr_with_vote_list: (PhraseToWordTranslationWithVote | null)[][];
}

@ObjectType()
export class PhraseToPhraseTranslationWithVoteListOutput extends GenericOutput {
  @Field(() => [PhraseToPhraseTranslationWithVote], { nullable: 'items' })
  phrase_to_phrase_tr_with_vote_list: (PhraseToPhraseTranslationWithVote | null)[];
}

@ObjectType()
export class PhraseToPhraseTranslationWithVoteListFromIdsOutput extends GenericOutput {
  @Field(() => [[PhraseToPhraseTranslationWithVote]], { nullable: 'items' })
  phrase_to_phrase_tr_with_vote_list: (PhraseToPhraseTranslationWithVote | null)[][];
}

@ObjectType()
export class TranslationWithVoteListOutput extends GenericOutput {
  @Field(() => [TranslationWithVote], { nullable: 'items' })
  translation_with_vote_list:
    | (
        | WordToWordTranslationWithVote
        | WordToPhraseTranslationWithVote
        | PhraseToWordTranslationWithVote
        | PhraseToPhraseTranslationWithVote
        | null
      )[];
}

@ObjectType()
export class TranslationWithVoteListFromIdsOutput extends GenericOutput {
  @Field(() => [[TranslationWithVote]], { nullable: true })
  translation_with_vote_list:
    | (
        | WordToWordTranslationWithVote
        | WordToPhraseTranslationWithVote
        | PhraseToWordTranslationWithVote
        | PhraseToPhraseTranslationWithVote
        | null
      )[][];
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
export class TranslationOutput extends GenericOutput {
  @Field(() => Translation, { nullable: true })
  translation:
    | WordToWordTranslation
    | WordToPhraseTranslation
    | PhraseToWordTranslation
    | PhraseToPhraseTranslation
    | null;
}

@ObjectType()
export class TranslationsOutput extends GenericOutput {
  @Field(() => [Translation], { nullable: 'items' })
  translations: (
    | WordToWordTranslation
    | WordToPhraseTranslation
    | PhraseToWordTranslation
    | PhraseToPhraseTranslation
    | null
  )[];
}

@ObjectType()
export class LanguageForBotTranslate {
  @Field(() => String) code: string;
  @Field(() => String) name: string;
}

@ObjectType()
export class LanguageListForBotTranslateOutput extends GenericOutput {
  @Field(() => [LanguageForBotTranslate], { nullable: true })
  languages: LanguageForBotTranslate[] | null;
}

@InputType()
export class LanguageListForBotTranslateInput {
  @Field(() => String) botType: BotType;
}

@InputType()
export class TranslatedLanguageInfoInput {
  @Field(() => ID)
  fromLanguageCode: string;
  @Field(() => ID, { nullable: true })
  toLanguageCode?: string;
}

@ObjectType()
export class TranslatedLanguageInfoOutput extends GenericOutput {
  @Field(() => Int) totalWordCount: number;
  @Field(() => Int) totalPhraseCount: number;
  @Field(() => Int, { nullable: true }) translatedMissingWordCount?: number;
  @Field(() => Int, { nullable: true }) translatedMissingPhraseCount?: number;
  @Field(() => Int) googleTranslateTotalLangCount: number;
  @Field(() => Int) liltTranslateTotalLangCount: number;
  @Field(() => Int) smartcatTranslateTotalLangCount: number;
}

@ObjectType()
export class TranslateAllWordsAndPhrasesByBotResult {
  @Field(() => Int) requestedCharacters: number;
  @Field(() => Int) totalWordCount: number;
  @Field(() => Int) totalPhraseCount: number;
  @Field(() => Int) translatedWordCount: number;
  @Field(() => Int) translatedPhraseCount: number;
  @Field(() => String, { nullable: true }) status?:
    | 'Completed'
    | 'Progressing'
    | 'Error';
  @Field(() => String, { nullable: true }) message?: string;
  @Field(() => [String], { nullable: true }) errors?: string[];
  @Field(() => Int, { nullable: true }) total?: number;
  @Field(() => Int, { nullable: true }) completed?: number;
}

@ObjectType()
export class TranslateAllWordsAndPhrasesByBotOutput extends GenericOutput {
  @Field(() => TranslateAllWordsAndPhrasesByBotResult, { nullable: true })
  result: TranslateAllWordsAndPhrasesByBotResult | null;
}
@ObjectType()
export class TranslateAllWordsAndPhrasesByGoogleOutput extends TranslateAllWordsAndPhrasesByBotOutput {}
