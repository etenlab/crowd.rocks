import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { GenericOutput } from 'src/common/types';
import { LanguageInput, PageInfo } from '../common/types';
import { Pericope } from '../pericopies/types';

@ObjectType()
export class PericopeTranslation {
  @Field(() => ID) pericope_translation_id: string;
  @Field(() => String) percope_id: string;
  @Field(() => String) translation: string;
  @Field(() => LanguageInput) language: LanguageInput;
  @Field(() => String) created_by: string;
  @Field(() => Date) created_at: Date;
}

export class PericopeTextWithTranslation {
  @Field(() => ID) pericope_id: string;
  @Field(() => String) pericope_text: string;
  @Field(() => PericopeTranslation) translation: PericopeTranslation;
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
  @Field(() => String) filter: string;
}
