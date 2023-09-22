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
export class MapFileInfo {
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
  @Field(() => ID) content_file_url: string;
  @Field(() => ID) content_file_id: string;
}
@ObjectType()
export class MapFileOutput extends GenericOutput {
  @Field(() => MapFileInfo, { nullable: true })
  mapFileInfo?: MapFileInfo | null;
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
export class GetMapContentInput {
  @Field(() => ID) map_id: string;
  @Field(() => Boolean) is_original: boolean;
}

//todo: check and delete (will be used only common resolver for words and pharses because of pagination)
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
//todo: check and delete (will be used only common resolver for words and pharses because of pagination)
@ObjectType()
export class GetOrigMapWordsOutput {
  @Field(() => [MapWordWithTranslations])
  origMapWords: MapWordWithTranslations[];
}
//todo: check and delete (will be used only common resolver for words and pharses because of pagination)
@ObjectType()
export class GetOrigMapPhrasesOutput {
  @Field(() => [MapPhraseWithTranslations])
  origMapPhrases: MapPhraseWithTranslations[];
}
//todo: check and delete (will be used only common resolver for words and pharses because of pagination)
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

@InputType()
export class GetOrigMapWordsAndPhrasesInput {
  @Field(() => LanguageInput) lang: LanguageInput;
  // @Field(() => String, { nullable: true }) o_language_code?: string;
  // @Field(() => String, { nullable: true }) o_dialect_code?: string;
  // @Field(() => String, { nullable: true }) o_geo_code?: string;
}

@ObjectType()
export class MapWordOrPhrase {
  @Field(() => ID) id: string;
  @Field(() => String) type: 'word' | 'phrase';
  @Field(() => String) o_id: string;
  @Field(() => String) o_like_string: string;
  @Field(() => String) o_definition: string;
  @Field(() => String) o_definition_id: string;
  @Field(() => String) o_language_code: string;
  @Field(() => String, { nullable: true }) o_dialect_code?: string | null;
  @Field(() => String, { nullable: true }) o_geo_code?: string | null;
}
@ObjectType()
export class MapWordsAndPhrasesEdge {
  @Field(() => ID) cursor: string;
  @Field(() => MapWordOrPhrase) node: MapWordOrPhrase;
}

@ObjectType()
export class MapWordsAndPhrasesConnection {
  @Field(() => [MapWordsAndPhrasesEdge])
  edges: MapWordsAndPhrasesEdge[];
  @Field(() => PageInfo) pageInfo: PageInfo;
}

const MapWordOrPhraseAsTranslation = createUnionType({
  name: 'MapWordOrPhraseAsTranslation',
  types: () => [MapPhraseAsTranslation, MapWordAsTranslation],
  resolveType(value) {
    if (value.phrase_id) {
      return MapPhraseAsTranslation;
    }
    return MapWordAsTranslation;
  },
});

// phrase types
@ObjectType()
export class MapPhraseWithDefinition extends Phrase {
  @Field(() => String, { nullable: true }) definition: string;
  @Field(() => String, { nullable: true }) definition_id: string;
}

@ObjectType()
export class MapPhraseAsTranslation extends MapPhraseWithDefinition {
  @Field(() => String) up_votes: string;
  @Field(() => String) down_votes: string;
  @Field(() => String) translation_id: string;
}
@ObjectType()
export class MapPhraseWithTranslations extends MapPhraseWithDefinition {
  @Field(() => [MapWordOrPhraseAsTranslation], { nullable: true })
  translations?: Array<MapPhraseAsTranslation | MapWordAsTranslation>;
}

// word types

@ObjectType()
export class MapWordWithDefinition extends Word {
  @Field(() => String, { nullable: true }) definition: string;
  @Field(() => String, { nullable: true }) definition_id: string;
}

@ObjectType()
export class MapWordAsTranslation extends MapWordWithDefinition {
  @Field(() => String) up_votes: string;
  @Field(() => String) down_votes: string;
  @Field(() => String) translation_id: string;
}

@ObjectType()
export class MapWordWithTranslations extends MapWordWithDefinition {
  @Field(() => [MapWordOrPhraseAsTranslation], { nullable: true })
  translations?: Array<MapPhraseAsTranslation | MapWordAsTranslation>;
}

export type OriginalMapWordInput = {
  word_id: string;
  original_map_id: string;
};

export type OriginalMapPhraseInput = {
  phrase_id: string;
  original_map_id: string;
};
