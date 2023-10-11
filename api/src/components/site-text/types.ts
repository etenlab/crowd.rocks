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
  WordToWordTranslationWithVote,
  WordToPhraseTranslationWithVote,
  PhraseToWordTranslationWithVote,
  PhraseToPhraseTranslationWithVote,
  TranslationWithVote,
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
export class SiteTextLanguageWithTranslationInfo extends SiteTextLanguage {
  @Field(() => Int) total_count: number;
  @Field(() => Int) translated_count: number;
}

@ObjectType()
export class SiteTextLanguageWithTranslationInfoListOutput extends GenericOutput {
  @Field(() => [SiteTextLanguageWithTranslationInfo], { nullable: 'items' })
  site_text_language_with_translation_info_list: (SiteTextLanguageWithTranslationInfo | null)[];
}

@ObjectType()
export class TranslationWithVoteListByLanguage {
  @Field(() => [TranslationWithVote], { nullable: 'items' })
  translation_with_vote_list:
    | (
        | WordToWordTranslationWithVote
        | WordToPhraseTranslationWithVote
        | PhraseToWordTranslationWithVote
        | PhraseToPhraseTranslationWithVote
        | null
      )[];
  @Field(() => String) language_code: string;
  @Field(() => String, { nullable: true }) dialect_code: string | null;
  @Field(() => String, { nullable: true }) geo_code: string | null;
}

@ObjectType()
export class TranslationWithVoteListByLanguageOutput extends GenericOutput {
  @Field(() => TranslationWithVoteListByLanguage)
  translation_with_vote_list_by_language: TranslationWithVoteListByLanguage;
}

@ObjectType()
export class TranslationWithVoteListByLanguageListOutput extends GenericOutput {
  @Field(() => [TranslationWithVoteListByLanguage], { nullable: true })
  translation_with_vote_list_by_language_list:
    | TranslationWithVoteListByLanguage[]
    | null;
}
