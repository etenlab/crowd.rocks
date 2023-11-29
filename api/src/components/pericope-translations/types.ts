import { Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';
import { GenericOutput } from 'src/common/types';
import { LanguageInput, LanguageOutput, PageInfo } from '../common/types';
import { Pericope, PericopeTextWithDescription } from '../pericopies/types';

@ObjectType()
export class PericopeTranslation {
  @Field(() => ID) pericope_translation_id: string;
  @Field(() => String) translation: string;
  @Field(() => String, { nullable: true }) description_translation_id:
    | string
    | null;
  @Field(() => String, { nullable: true }) description_translation:
    | string
    | null;
  @Field(() => String) pericope_id: string;
  @Field(() => LanguageOutput) language: LanguageOutput;
  @Field(() => String) created_by: string;
}
@ObjectType()
export class PericopeTranslationWithVotes extends PericopeTranslation {
  @Field(() => Int) upvotes: number;
  @Field(() => Int) downvotes: number;
}

@ObjectType()
export class PericopeTextWithTranslationAndDescription extends PericopeTextWithDescription {
  @Field(() => PericopeTranslation, { nullable: true })
  translation: PericopeTranslation | null;
}
@ObjectType()
export class PericopeTextWithAllTranslationsAndDescription extends PericopeTextWithDescription {
  @Field(() => [PericopeTranslationWithVotes])
  translations: PericopeTranslationWithVotes[];
}

@ObjectType()
export class PericopiesTextsWithTranslationOutput extends GenericOutput {
  @Field(() => [Pericope])
  pericopiesWithTr: Array<PericopeTextWithTranslationAndDescription>;
}

@ObjectType()
export class PericopiesTextsWithTranslationEdge {
  @Field(() => ID) cursor: string;
  @Field(() => PericopeTextWithTranslationAndDescription)
  node: PericopeTextWithTranslationAndDescription;
}

@ObjectType()
export class PericopiesTextsWithTranslationConnection extends GenericOutput {
  @Field(() => [PericopiesTextsWithTranslationEdge])
  edges: PericopiesTextsWithTranslationEdge[];
  @Field(() => PageInfo) pageInfo: PageInfo;
}

@InputType()
export class GetPericopiesTrInput {
  @Field(() => String) documentId: string;
  @Field(() => LanguageInput) targetLang: LanguageInput;
  @Field(() => String, { nullable: true }) filter?: string | null;
  @Field(() => LanguageInput, { nullable: true })
  onlyTranslatedTo?: LanguageInput | null;
  @Field(() => LanguageInput, { nullable: true })
  onlyNotTranslatedTo?: LanguageInput | null;
}
@InputType()
export class GetPericopeTextInput {
  @Field(() => String) pericopeId: string;
}

@InputType()
export class AddPericopeTrAndDescInput {
  @Field(() => String) pericopeId: string;
  @Field(() => LanguageInput) targetLang: LanguageInput;
  @Field(() => String) translation: string;
  @Field(() => String) description_tr: string;
}

@ObjectType()
export class AddPericopeTrAndDescOutput extends GenericOutput {
  @Field(() => PericopiesTextsWithTranslationEdge)
  pericopeWithTranslationEdge: PericopiesTextsWithTranslationEdge;
}
