import {
  createUnionType,
  Field,
  ID,
  InputType,
  ObjectType,
} from '@nestjs/graphql';
import { LanguageInput, LanguageOutput } from 'src/components/common/types';
import { GenericOutput } from '../../common/types';
import { PageInfo } from 'src/components/common/types';
import { Phrase } from '../phrases/types';
import { Word } from '../words/types';

@ObjectType()
export class MapFileOutput {
  @Field(() => Boolean) is_original: boolean;
  @Field(() => ID) original_map_id: string;
  @Field(() => String, { nullable: true }) translated_percent?: string;
  @Field(() => String) map_file_name: string;
  @Field(() => String) map_file_name_with_langs: string;
  @Field(() => String) created_at: string;
  @Field(() => LanguageOutput) language: LanguageOutput;
  @Field(() => ID) created_by: string;
  @Field(() => ID, { nullable: true }) translated_map_id?: string;
  @Field(() => ID, { nullable: true }) preview_file_url?: string;
  @Field(() => ID, { nullable: true }) preview_file_id?: string;
}
@InputType()
export class GetOrigMapListInput {
  @Field(() => String, { nullable: true }) search?: string;
}
@ObjectType()
export class MapUploadOutput extends GenericOutput {
  @Field(() => MapFileOutput, { nullable: true })
  mapFileOutput?: MapFileOutput | null | undefined;
}
@InputType()
export class MapDeleteInput {
  @Field(() => String) mapId: string;
  @Field(() => Boolean) is_original: boolean;
}

@ObjectType()
export class MapDeleteOutput extends GenericOutput {
  @Field(() => String, { nullable: true })
  deletedMapId?: string | null | undefined;
}

@ObjectType()
export class GetOrigMapsListOutput {
  @Field(() => [MapFileOutput]) mapList: MapFileOutput[];
}

@InputType()
export class GetAllMapsListInput {
  @Field(() => LanguageInput, { nullable: true }) lang?: LanguageInput;
}

@ObjectType()
export class MapFileOutputEdge {
  @Field(() => ID) cursor: string;
  @Field(() => MapFileOutput) node: MapFileOutput;
}

@ObjectType()
export class MapFileListConnection {
  @Field(() => [MapFileOutputEdge]) edges: MapFileOutputEdge[];
  @Field(() => PageInfo) pageInfo: PageInfo;
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
  @Field(() => [MapWordTranslations]) origMapWords: MapWordTranslations[];
}
@InputType()
export class GetOrigMapPhrasesInput {
  @Field(() => ID, { nullable: true }) original_map_id?: string;
  @Field(() => String, { nullable: true }) o_language_code?: string;
  @Field(() => String, { nullable: true }) o_dialect_code?: string;
  @Field(() => String, { nullable: true }) o_geo_code?: string;
  @Field(() => String, { nullable: true }) t_language_code?: string;
  @Field(() => String, { nullable: true }) t_dialect_code?: string;
  @Field(() => String, { nullable: true }) t_geo_code?: string;
}

@ObjectType()
export class GetOrigMapPhrasesOutput {
  @Field(() => [MapPhraseTranslations])
  origMapPhrases: MapPhraseTranslations[];
}

export type OriginalMapWordInput = {
  word_id: string;
  original_map_id: string;
};

export type OriginalMapPhraseInput = {
  phrase_id: string;
  original_map_id: string;
};

@ObjectType()
export class MapPhraseWithDefinition extends Phrase {
  @Field(() => String) language_code: string;
  @Field(() => String, { nullable: true }) dialect_code: string | null;
  @Field(() => String, { nullable: true }) geo_code: string | null;
  @Field(() => String, { nullable: true }) definition: string;
  @Field(() => String, { nullable: true }) definition_id: string;
}

// todo: rename to MapPhraseAsTranslationWithVotes
@ObjectType()
export class MapPhraseWithVotes extends MapPhraseWithDefinition {
  @Field(() => String) up_votes: string;
  @Field(() => String) down_votes: string;
  @Field(() => String) translation_id: string;
}

const MapWordOrPhraseTranslationWithVotes = createUnionType({
  name: 'MapWordOrPhraseTranslationWithVotes',
  types: () => [MapPhraseWithVotes, MapWordWithVotes],
  resolveType(value) {
    if (value.phrase_id) {
      return MapPhraseWithVotes;
    }
    return MapWordWithVotes;
  },
});

@ObjectType()
export class MapPhraseTranslations extends MapPhraseWithDefinition {
  @Field(() => [MapWordOrPhraseTranslationWithVotes], { nullable: true })
  translations?: Array<MapPhraseWithVotes | MapWordWithVotes>;
}

// word types

@ObjectType()
export class MapWordWithDefinition extends Word {
  @Field(() => String, { nullable: true }) definition: string;
  @Field(() => String, { nullable: true }) definition_id: string;
}

@ObjectType()
export class MapWordWithVotes extends MapWordWithDefinition {
  @Field(() => String) up_votes: string;
  @Field(() => String) down_votes: string;
  @Field(() => String) translation_id: string;
}

@ObjectType()
export class MapWordTranslations extends MapWordWithDefinition {
  @Field(() => [MapWordOrPhraseTranslationWithVotes], { nullable: true })
  translations?: Array<MapPhraseWithVotes | MapWordWithVotes>;
}
