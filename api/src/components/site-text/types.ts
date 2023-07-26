import { Field, ID, Int, InputType, ObjectType } from '@nestjs/graphql';

import { GenericOutput } from 'src/common/types';
import {
  Definition,
  WordDefinition,
  PhraseDefinition,
} from 'src/components/definitions/types';

@ObjectType()
export class SiteTextWordDefinition {
  @Field(() => ID) site_text_id: string;
  @Field(() => WordDefinition) word_definition: WordDefinition;
}

@ObjectType()
export class SiteTextPhraseDefinition {
  @Field(() => ID) site_text_id: string;
  @Field(() => PhraseDefinition) phrase_definition: PhraseDefinition;
}

@InputType()
export class SiteTextWordDefinitionUpsertInput {
  @Field(() => ID) word_definition_id: string;
}

@InputType()
export class SiteTextPhraseDefinitionUpsertInput {
  @Field(() => ID) phrase_definition_id: string;
}

@ObjectType()
export class SiteTextWordDefinitionReadOutput extends GenericOutput {
  @Field(() => SiteTextWordDefinition, { nullable: true })
  site_text_word_definition: SiteTextWordDefinition | null;
}

@ObjectType()
export class SiteTextPhraseDefinitionReadOutput extends GenericOutput {
  @Field(() => SiteTextPhraseDefinition, { nullable: true })
  site_text_phrase_definition: SiteTextPhraseDefinition | null;
}

@ObjectType()
export class SiteTextWordDefinitionUpsertOutput extends GenericOutput {
  @Field(() => SiteTextWordDefinition, { nullable: true })
  site_text_word_definition: SiteTextWordDefinition | null;
}

@ObjectType()
export class SiteTextPhraseDefinitionUpsertOutput extends GenericOutput {
  @Field(() => SiteTextPhraseDefinition, { nullable: true })
  site_text_phrase_definition: SiteTextPhraseDefinition | null;
}

@InputType()
export class SiteTextUpsertInput {
  @Field(() => String) siteTextlike_string: string;
  @Field(() => String) definitionlike_string: string;
  @Field(() => String) language_code: string;
  @Field(() => String, { nullable: true }) dialect_code: string | null;
  @Field(() => String, { nullable: true }) geo_code: string | null;
}

@ObjectType()
export class SiteTextUpsertOutput extends GenericOutput {
  @Field(() => SiteTextWordDefinition, { nullable: true })
  site_text_word_definition: SiteTextWordDefinition | null;
  @Field(() => SiteTextPhraseDefinition, { nullable: true })
  site_text_phrase_definition: SiteTextPhraseDefinition | null;
}

@InputType()
export class SiteTextTranslationsFromInput {
  @Field(() => ID) from_definition_id: string;
  @Field(() => Boolean) from_type_is_word: boolean;
}

@InputType()
export class SiteTextTranslationsToInput {
  @Field(() => String) translationlike_string: string;
  @Field(() => String) definitionlike_string: string;
  @Field(() => String) language_code: string;
  @Field(() => String, { nullable: true }) dialect_code: string | null;
  @Field(() => String, { nullable: true }) geo_code: string | null;
}

@ObjectType()
export class SiteTextTranslation {
  @Field(() => ID) site_text_translation_id: string;
  @Field(() => Definition) from_definition: WordDefinition | PhraseDefinition;
  @Field(() => Definition) to_definition: WordDefinition | PhraseDefinition;
  @Field(() => Boolean) from_type_is_word: boolean;
  @Field(() => Boolean) to_type_is_word: boolean;
}

@ObjectType()
export class SiteTextTranslationUpsertOutput extends GenericOutput {
  @Field(() => SiteTextTranslation, { nullable: true })
  site_text_translation: SiteTextTranslation;
}

@ObjectType()
export class SiteTextTranslationReadOutput extends GenericOutput {
  @Field(() => SiteTextTranslation, { nullable: true })
  site_text_translation: SiteTextTranslation;
}

@InputType()
export class SiteTextTranslationInput {
  @Field(() => ID) from_definition_id: string;
  @Field(() => ID) to_definition_id: string;
  @Field(() => Boolean) from_type_is_word: boolean;
  @Field(() => Boolean) to_type_is_word: boolean;
}

@ObjectType()
export class SiteTextTranslationVote {
  @Field(() => ID) site_text_translation_vote_id: string;
  @Field(() => ID) site_text_translation_id: string;
  @Field(() => ID) user_id: string;
  @Field(() => Boolean) vote: boolean;
  @Field(() => Date) last_updated_at: Date;
}

@InputType()
export class SiteTextTranslationVoteUpsertInput {
  @Field(() => ID) site_text_translation_id: string;
  @Field(() => Boolean) vote: boolean;
}

@ObjectType()
export class SiteTextTranslationVoteUpsertOutput extends GenericOutput {
  @Field(() => SiteTextTranslation, { nullable: true })
  site_text_translation_vote: SiteTextTranslationVote;
}

@ObjectType()
export class SiteTextTranslationVoteReadOutput extends GenericOutput {
  @Field(() => SiteTextTranslation, { nullable: true })
  site_text_translation_vote: SiteTextTranslationVote;
}

@ObjectType()
export class VoteStatus {
  @Field(() => String) site_text_translation_id: string;
  @Field(() => Int) upvotes: number;
  @Field(() => Int) downvotes: number;
}

@ObjectType()
export class VoteStatusOutputRow extends GenericOutput {
  @Field(() => VoteStatus, { nullable: true })
  vote_status: VoteStatus;
}

@ObjectType()
export class SiteTextTranslationWithVote extends SiteTextTranslation {
  @Field(() => String) created_at: string;
  @Field(() => Int) upvotes: number;
  @Field(() => Int) downvotes: number;
}

@ObjectType()
export class SiteTextTranslationWithVoteOutput extends GenericOutput {
  @Field(() => SiteTextTranslationWithVote, { nullable: true })
  site_text_translation_with_vote: SiteTextTranslationWithVote;
}

@ObjectType()
export class SiteTextTranslationWithVoteListOutput extends GenericOutput {
  @Field(() => [SiteTextTranslationWithVote], { nullable: 'items' })
  site_text_translation_with_vote_list: SiteTextTranslationWithVote[];
}

@InputType()
export class SiteTextPhraseDefinitionUpdateInput {
  @Field(() => ID) phrase_definition_id: string;
  @Field(() => String) definitionlike_string: string;
}

@InputType()
export class SiteTextWordDefinitionUpdateInput {
  @Field(() => ID) word_definition_id: string;
  @Field(() => String) definitionlike_string: string;
}

@ObjectType()
export class SiteTextPhraseDefinitionListOutput extends GenericOutput {
  @Field(() => [SiteTextPhraseDefinition], { nullable: 'items' })
  site_text_phrase_definition_list: SiteTextPhraseDefinition[];
}

@ObjectType()
export class SiteTextWordDefinitionListOutput extends GenericOutput {
  @Field(() => [SiteTextWordDefinition], { nullable: 'items' })
  site_text_word_definition_list: SiteTextWordDefinition[];
}

@ObjectType()
export class SiteTextDefinitionListOutput extends GenericOutput {
  @Field(() => [SiteTextWordDefinition], { nullable: 'items' })
  site_text_word_definition_list: SiteTextWordDefinition[];

  @Field(() => [SiteTextPhraseDefinition], { nullable: 'items' })
  site_text_phrase_definition_list: SiteTextPhraseDefinition[];
}

@InputType()
export class SiteTextTranslationUpsertInput {
  @Field(() => ID) site_text_id: string;
  @Field(() => Boolean) is_word_definition: boolean;
  @Field(() => String) translationlike_string: string;
  @Field(() => String) definitionlike_string: string;
  @Field(() => String) language_code: string;
  @Field(() => String, { nullable: true }) dialect_code: string | null;
  @Field(() => String, { nullable: true }) geo_code: string | null;
}
