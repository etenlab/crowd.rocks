import {
  Field,
  ID,
  Int,
  InputType,
  ObjectType,
  createUnionType,
} from '@nestjs/graphql';

import { GenericOutput } from 'src/common/types';
import { PageInfo, LanguageInput } from '../common/types';
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
export class SiteTextPhraseDefinitionEdge {
  @Field(() => ID) cursor: string;
  @Field(() => SiteTextPhraseDefinition) node: SiteTextPhraseDefinition;
}

@ObjectType()
export class SiteTextPhraseDefinitionListConnection extends GenericOutput {
  @Field(() => [SiteTextPhraseDefinitionEdge])
  edges: SiteTextPhraseDefinitionEdge[];
  @Field(() => PageInfo) pageInfo: PageInfo;
}

@ObjectType()
export class SiteTextWordDefinitionEdge {
  @Field(() => ID) cursor: string;
  @Field(() => SiteTextWordDefinition) node: SiteTextWordDefinition;
}

@ObjectType()
export class SiteTextWordDefinitionListConnection extends GenericOutput {
  @Field(() => [SiteTextWordDefinitionEdge])
  edges: SiteTextWordDefinitionEdge[];
  @Field(() => PageInfo) pageInfo: PageInfo;
}

@ObjectType()
export class SiteTextDefinitionEdge {
  @Field(() => ID) cursor: string;
  @Field(() => SiteTextDefinition) node:
    | SiteTextWordDefinition
    | SiteTextPhraseDefinition;
}

@ObjectType()
export class SiteTextDefinitionListConnection extends GenericOutput {
  @Field(() => [SiteTextDefinitionEdge]) edges: SiteTextDefinitionEdge[];
  @Field(() => PageInfo) pageInfo: PageInfo;
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

@InputType()
export class SiteTextDefinitionListFilterInput {
  @Field(() => LanguageInput, { nullable: true })
  targetLanguage: LanguageInput | null;
  @Field(() => String, { nullable: true }) filter: string | null;
  @Field(() => Boolean, { nullable: true }) onlyTranslated: boolean | null;
  @Field(() => Boolean, { nullable: true }) onlyNotTranslated: boolean | null;
  @Field(() => Boolean, { nullable: true }) isSortDescending: boolean | null;
  @Field(() => String, { nullable: true }) quickFilter: string | null;
}
