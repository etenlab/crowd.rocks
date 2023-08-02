import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { WordTranslations } from '../words/types';
import { LanguageInput, LanguageOutput } from '../definitions/types';

@ObjectType()
export class MapFileOutput {
  @Field(() => Boolean) is_original: boolean;
  @Field(() => ID) original_map_id: string;
  @Field(() => ID, { nullable: true }) translated_map_id?: string;
  @Field(() => String) map_file_name: string;
  @Field(() => String) created_at: string;
  @Field(() => LanguageOutput) language: LanguageOutput;
  @Field(() => ID) created_by: string;
}
@InputType()
export class GetOrigMapListInput {
  @Field(() => String, { nullable: true }) search?: string;
}

@ObjectType()
export class GetOrigMapsListOutput {
  @Field(() => [MapFileOutput]) origMapList: MapFileOutput[];
}

@InputType()
export class GetAllMapsListInput {
  @Field(() => LanguageInput, { nullable: true }) lang?: LanguageInput;
}

@ObjectType()
export class GetAllMapsListOutput {
  @Field(() => [MapFileOutput]) allMapsList: MapFileOutput[];
}

@InputType()
export class GetOrigMapContentInput {
  @Field(() => ID) original_map_id: string;
}
@ObjectType()
export class GetOrigMapContentOutput extends MapFileOutput {
  @Field(() => String) content: string;
}

@InputType()
export class GetTranslatedMapContentInput {
  @Field(() => ID) translated_map_id: string;
}
@ObjectType()
export class GetTranslatedMapContentOutput extends GetOrigMapContentOutput {}

@InputType()
export class GetOrigMapWordsInput {
  @Field(() => ID, { nullable: true }) original_map_id?: string;
  @Field(() => String, { nullable: true }) o_language_code?: string;
  @Field(() => String, { nullable: true }) o_dialect_code?: string;
  @Field(() => String, { nullable: true }) o_geo_code?: string;
  @Field(() => String, { nullable: true }) t_language_code?: string;
  @Field(() => String, { nullable: true }) t_dialect_code?: string;
  @Field(() => String, { nullable: true }) t_geo_code?: string;
}

@ObjectType()
export class GetOrigMapWordsOutput {
  @Field(() => [WordTranslations]) origMapWords: WordTranslations[];
}

export type OriginalMapWordInput = {
  word_id: string;
  original_map_id: string;
};
