import {
  Field,
  ID,
  Int,
  InputType,
  ObjectType,
  createUnionType,
} from '@nestjs/graphql';

import { GenericOutput } from 'src/common/types';
import {
  WordDefinition,
  PhraseDefinition,
} from 'src/components/definitions/types';
import {
  WordToWordTranslation,
  WordToPhraseTranslation,
  PhraseToWordTranslation,
  PhraseToPhraseTranslation,
} from 'src/components/translations/types';

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

export const SiteTextDefinition = createUnionType({
  name: 'SiteTextDefinition',
  types: () => [SiteTextWordDefinition, SiteTextPhraseDefinition] as const,
  resolveType(value) {
    if (value.word_definition) {
      return SiteTextWordDefinition;
    }
    if (value.phrase_definition) {
      return SiteTextPhraseDefinition;
    }
    return null;
  },
});

@ObjectType()
export class SiteTextWordDefinitionOutput extends GenericOutput {
  @Field(() => SiteTextWordDefinition, { nullable: true })
  site_text_word_definition: SiteTextWordDefinition | null;
}

@ObjectType()
export class SiteTextWordDefinitionsOutput extends GenericOutput {
  @Field(() => [SiteTextWordDefinition], { nullable: 'items' })
  site_text_word_definitions: (SiteTextWordDefinition | null)[];
}

@ObjectType()
export class SiteTextPhraseDefinitionOutput extends GenericOutput {
  @Field(() => SiteTextPhraseDefinition, { nullable: true })
  site_text_phrase_definition: SiteTextPhraseDefinition | null;
}

@ObjectType()
export class SiteTextPhraseDefinitionsOutput extends GenericOutput {
  @Field(() => [SiteTextPhraseDefinition], { nullable: 'items' })
  site_text_phrase_definitions: (SiteTextPhraseDefinition | null)[];
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
export class SiteTextDefinitionOutput extends GenericOutput {
  @Field(() => SiteTextDefinition, { nullable: true })
  site_text_definition:
    | SiteTextWordDefinition
    | SiteTextPhraseDefinition
    | null;
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
export class SiteTextTranslationVote {
  @Field(() => ID) site_text_translation_vote_id: string;
  @Field(() => ID) translation_id: string;
  @Field(() => Boolean) from_type_is_word: boolean;
  @Field(() => Boolean) to_type_is_word: boolean;
  @Field(() => ID) user_id: string;
  @Field(() => Boolean) vote: boolean;
  @Field(() => Date) last_updated_at: Date;
}

@ObjectType()
export class SiteTextTranslationVoteOutput extends GenericOutput {
  @Field(() => SiteTextTranslationVote, { nullable: true })
  site_text_translation_vote: SiteTextTranslationVote | null;
}

@ObjectType()
export class SiteTextTranslationVoteStatus {
  @Field(() => ID) translation_id: string;
  @Field(() => Boolean) from_type_is_word: boolean;
  @Field(() => Boolean) to_type_is_word: boolean;
  @Field(() => Int) upvotes: number;
  @Field(() => Int) downvotes: number;
}

@ObjectType()
export class SiteTextTranslationVoteStatusOutputRow extends GenericOutput {
  @Field(() => SiteTextTranslationVoteStatus, { nullable: true })
  vote_status: SiteTextTranslationVoteStatus | null;
}

@ObjectType()
export class SiteTextTranslationVoteStatusOutput extends GenericOutput {
  @Field(() => [SiteTextTranslationVoteStatus])
  vote_status_list: SiteTextTranslationVoteStatus[];
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
  @Field(() => [SiteTextWordDefinition])
  site_text_word_definition_list: SiteTextWordDefinition[];
}

@ObjectType()
export class SiteTextDefinitionListOutput extends GenericOutput {
  @Field(() => [SiteTextDefinition], { nullable: 'items' })
  site_text_definition_list:
    | (SiteTextWordDefinition | SiteTextPhraseDefinition | null)[];
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

@ObjectType()
export class SiteTextLanguage {
  @Field(() => String) language_code: string;
  @Field(() => String, { nullable: true }) dialect_code: string | null;
  @Field(() => String, { nullable: true }) geo_code: string | null;
}

@ObjectType()
export class SiteTextLanguageListOutput extends GenericOutput {
  @Field(() => [SiteTextLanguage], { nullable: true })
  site_text_language_list: SiteTextLanguage[] | null;
}

@ObjectType()
export class SiteTextWordToWordTranslationWithVote extends WordToWordTranslation {
  @Field(() => Int) upvotes: number;
  @Field(() => Int) downvotes: number;
}

@ObjectType()
export class SiteTextWordToPhraseTranslationWithVote extends WordToPhraseTranslation {
  @Field(() => Int) upvotes: number;
  @Field(() => Int) downvotes: number;
}

@ObjectType()
export class SiteTextPhraseToWordTranslationWithVote extends PhraseToWordTranslation {
  @Field(() => Int) upvotes: number;
  @Field(() => Int) downvotes: number;
}

@ObjectType()
export class SiteTextPhraseToPhraseTranslationWithVote extends PhraseToPhraseTranslation {
  @Field(() => Int) upvotes: number;
  @Field(() => Int) downvotes: number;
}

export const SiteTextTranslationWithVote = createUnionType({
  name: 'SiteTextTranslationWithVote',
  types: () =>
    [
      SiteTextWordToWordTranslationWithVote,
      SiteTextWordToPhraseTranslationWithVote,
      SiteTextPhraseToWordTranslationWithVote,
      SiteTextPhraseToPhraseTranslationWithVote,
    ] as const,
  resolveType(value) {
    if (value.word_to_word_translation_id) {
      return SiteTextWordToWordTranslationWithVote;
    }
    if (value.word_to_phrase_translation_id) {
      return SiteTextWordToPhraseTranslationWithVote;
    }
    if (value.phrase_to_word_translation_id) {
      return SiteTextPhraseToWordTranslationWithVote;
    }
    if (value.phrase_to_phrase_translation_id) {
      return SiteTextPhraseToPhraseTranslationWithVote;
    }
    return null;
  },
});

@ObjectType()
export class SiteTextTranslationWithVoteOutput extends GenericOutput {
  @Field(() => SiteTextTranslationWithVote, { nullable: true })
  site_text_translation_with_vote:
    | SiteTextWordToWordTranslationWithVote
    | SiteTextWordToPhraseTranslationWithVote
    | SiteTextPhraseToWordTranslationWithVote
    | SiteTextPhraseToPhraseTranslationWithVote
    | null;
}

@ObjectType()
export class SiteTextTranslationWithVoteListOutput extends GenericOutput {
  @Field(() => [SiteTextTranslationWithVote], { nullable: 'items' })
  site_text_translation_with_vote_list:
    | (
        | SiteTextWordToWordTranslationWithVote
        | SiteTextWordToPhraseTranslationWithVote
        | SiteTextPhraseToWordTranslationWithVote
        | SiteTextPhraseToPhraseTranslationWithVote
        | null
      )[];
}

@ObjectType()
export class SiteTextTranslationWithVoteListFromIdsOutput extends GenericOutput {
  @Field(() => [[SiteTextTranslationWithVote]])
  site_text_translation_with_vote_list:
    | (
        | SiteTextWordToWordTranslationWithVote
        | SiteTextWordToPhraseTranslationWithVote
        | SiteTextPhraseToWordTranslationWithVote
        | SiteTextPhraseToPhraseTranslationWithVote
        | null
      )[][];
}

@ObjectType()
export class SiteTextTranslationWithVoteListByLanguage {
  @Field(() => [SiteTextTranslationWithVote], { nullable: 'items' })
  site_text_translation_with_vote_list:
    | (
        | SiteTextWordToWordTranslationWithVote
        | SiteTextWordToPhraseTranslationWithVote
        | SiteTextPhraseToWordTranslationWithVote
        | SiteTextPhraseToPhraseTranslationWithVote
        | null
      )[];
  @Field(() => String) language_code: string;
  @Field(() => String, { nullable: true }) dialect_code: string | null;
  @Field(() => String, { nullable: true }) geo_code: string | null;
}

@ObjectType()
export class SiteTextTranslationWithVoteListByLanguageOutput extends GenericOutput {
  @Field(() => SiteTextTranslationWithVoteListByLanguage)
  site_text_translation_with_vote_list_by_language: SiteTextTranslationWithVoteListByLanguage;
}

@ObjectType()
export class SiteTextTranslationWithVoteListByLanguageListOutput extends GenericOutput {
  @Field(() => [SiteTextTranslationWithVoteListByLanguage], { nullable: true })
  site_text_translation_with_vote_list_by_language_list:
    | SiteTextTranslationWithVoteListByLanguage[]
    | null;
}
