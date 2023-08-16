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
export class SiteTextPhraseDefinitionOutput extends GenericOutput {
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
  @Field(() => [SiteTextPhraseDefinition], { nullable: true })
  site_text_phrase_definition_list: SiteTextPhraseDefinition[] | null;
}

@ObjectType()
export class SiteTextWordDefinitionListOutput extends GenericOutput {
  @Field(() => [SiteTextWordDefinition], { nullable: true })
  site_text_word_definition_list: SiteTextWordDefinition[] | null;
}

@ObjectType()
export class SiteTextDefinitionListOutput extends GenericOutput {
  @Field(() => [SiteTextDefinition], { nullable: true })
  site_text_definition_list:
    | (SiteTextWordDefinition | SiteTextPhraseDefinition)[]
    | null;
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
