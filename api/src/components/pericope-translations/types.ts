import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { GenericOutput } from 'src/common/types';
import { LanguageInput, LanguageOutput, PageInfo } from '../common/types';
import { Pericope } from '../pericopies/types';

@ObjectType()
export class PericopeTranslation {
  @Field(() => ID) pericope_translation_id: string;
  @Field(() => String) percope_id: string;
  @Field(() => String) translation: string;
  @Field(() => LanguageOutput) language: LanguageOutput;
  @Field(() => String) created_by: string;
  @Field(() => Date) created_at: string;
}

@ObjectType()
export class PericopeTextWithTranslation {
  @Field(() => ID) pericope_id: string;
  @Field(() => String) pericope_text: string;
  @Field(() => PericopeTranslation, { nullable: true })
  translation: PericopeTranslation | null;
}

@ObjectType()
export class PericopiesTextsWithTranslationOutput extends GenericOutput {
  @Field(() => [Pericope])
  pericopiesWithTr: Array<PericopeTextWithTranslation>;
}

@ObjectType()
export class PericopiesTextsWithTranslationEdge {
  @Field(() => ID) cursor: string;
  @Field(() => PericopeTextWithTranslation)
  node: PericopeTextWithTranslation;
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
}
