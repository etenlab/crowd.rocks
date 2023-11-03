import {
  createUnionType,
  Field,
  ID,
  InputType,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import { LanguageInput, LanguageOutput } from 'src/components/common/types';
import { GenericOutput, SubscriptionStatus } from '../../common/types';
import { PageInfo } from 'src/components/common/types';
import { Phrase } from '../phrases/types';
import { Word } from '../words/types';
import { User } from '../user/types';

@ObjectType()
export class MapDetailsInfo {
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
export class MapDetailsOutput extends GenericOutput {
  @Field(() => MapDetailsInfo, { nullable: true })
  mapDetails?: MapDetailsInfo | null;
}
@InputType()
export class GetOrigMapListInput {
  @Field(() => String, { nullable: true }) search?: string;
}
@ObjectType()
export class MapUploadOutput extends GenericOutput {
  @Field(() => MapDetailsOutput, { nullable: true })
  mapDetailsOutput?: MapDetailsOutput | null | undefined;
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
  @Field(() => [MapDetailsOutput]) mapList: MapDetailsOutput[];
}

@InputType()
export class GetAllMapsListInput {
  @Field(() => LanguageInput, { nullable: true }) lang?: LanguageInput;
}

@ObjectType()
export class MapDetailsOutputEdge {
  @Field(() => ID) cursor: string;
  @Field(() => MapDetailsOutput) node: MapDetailsOutput;
}

@ObjectType()
export class MapListConnection {
  @Field(() => [MapDetailsOutputEdge]) edges: MapDetailsOutputEdge[];
  @Field(() => PageInfo) pageInfo: PageInfo;
}

@InputType()
export class GetMapDetailsInput {
  @Field(() => ID) map_id: string;
  @Field(() => Boolean) is_original: boolean;
}

@InputType()
export class GetOrigMapWordsAndPhrasesInput {
  @Field(() => String, { nullable: true }) original_map_id: string | null;
  @Field(() => LanguageInput) lang: LanguageInput;
  @Field(() => String, { nullable: true }) filter: string | null;
  @Field(() => LanguageInput, { nullable: true })
  onlyTranslatedTo?: LanguageInput | null;
  @Field(() => LanguageInput, { nullable: true })
  onlyNotTranslatedTo?: LanguageInput | null;
  @Field(() => Boolean, { nullable: true }) isSortDescending?: boolean | null;
  @Field(() => String, { nullable: true }) quickFilter?: string | null;
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
  @Field(() => Date) o_created_at: string;
  @Field(() => User) o_created_by_user: User;
}
@ObjectType()
export class MapWordsAndPhrasesEdge {
  @Field(() => ID) cursor: string;
  @Field(() => MapWordOrPhrase) node: MapWordOrPhrase;
}

@ObjectType()
export class MapWordsAndPhrasesConnection extends GenericOutput {
  @Field(() => [MapWordsAndPhrasesEdge])
  edges: MapWordsAndPhrasesEdge[];
  @Field(() => PageInfo) pageInfo: PageInfo;
}

const MapWordOrPhraseAsTranslation = createUnionType({
  name: 'MapWordOrPhraseAsTranslation',
  types: () => [MapPhraseAsTranslation, MapWordAsTranslation],
  resolveType(value) {
    if (value.word_id) {
      return MapWordAsTranslation;
    }
    return MapPhraseAsTranslation;
  },
});

const MapWordOrPhraseAsOrig = createUnionType({
  name: 'MapWordOrPhraseAsOrig',
  types: () => [WordWithDefinition, PhraseWithDefinition],
  resolveType(value) {
    if (value.word_id) {
      return WordWithDefinition;
    }
    return PhraseWithDefinition;
  },
});

@ObjectType()
export class MapWordOrPhraseAsOrigOutput extends GenericOutput {
  @Field(() => MapWordOrPhraseAsOrig, { nullable: true })
  wordOrPhrase: WordWithDefinition | PhraseWithDefinition | null;
}
@ObjectType()
export class MapWordsAndPhrasesCountOutput extends GenericOutput {
  @Field(() => Number, { nullable: true })
  count: number | null;
}
@ObjectType()
export class OrigMapWordsAndPhrasesOutput extends GenericOutput {
  @Field(() => [MapWordOrPhrase], { nullable: true })
  mapWordsOrPhrases: MapWordOrPhrase[] | null;
}

@InputType()
export class GetMapWordOrPhraseByDefinitionIdInput {
  @Field(() => ID) definition_id: string;
  @Field(() => Boolean) is_word_definition: boolean;
}

// phrase types
@ObjectType()
export class PhraseWithDefinition extends Phrase {
  @Field(() => String, { nullable: true }) definition: string;
  @Field(() => String, { nullable: true }) definition_id: string;
}

@ObjectType()
export class MapPhraseAsTranslation extends PhraseWithDefinition {
  @Field(() => String) up_votes: string;
  @Field(() => String) down_votes: string;
  @Field(() => String) translation_id: string;
}
@ObjectType()
export class MapPhraseWithTranslations extends PhraseWithDefinition {
  @Field(() => [MapWordOrPhraseAsTranslation], { nullable: true })
  translations?: Array<MapPhraseAsTranslation | MapWordAsTranslation>;
}

// word types

@ObjectType()
export class WordWithDefinition extends Word {
  @Field(() => String, { nullable: true }) definition: string;
  @Field(() => String, { nullable: true }) definition_id: string;
}

@ObjectType()
export class MapWordAsTranslation extends WordWithDefinition {
  @Field(() => String) up_votes: string;
  @Field(() => String) down_votes: string;
  @Field(() => String) translation_id: string;
}

@ObjectType()
export class MapWordWithTranslations extends WordWithDefinition {
  @Field(() => [MapWordOrPhraseAsTranslation], { nullable: true })
  translations?: Array<MapPhraseAsTranslation | MapWordAsTranslation>;
}

// for internal purposes (map translation routines)
export type OriginalMapWordInput = {
  word_id: string;
  original_map_id: string;
};

// for internal purposes (map translation routines)
export type OriginalMapPhraseInput = {
  phrase_id: string;
  original_map_id: string;
};


////////////////////////////////////////////////////
////////////////////Voting//////////////////////////
////////////////////////////////////////////////////

@ObjectType()
export class MapVote {
  @Field(() => ID) maps_vote_id: string;
  @Field(() => ID) map_id: string;
  @Field(() => Boolean) is_original: boolean;
  @Field(() => ID) user_id: string;
  @Field(() => Boolean) vote: boolean;
  @Field(() => Date) last_updated_at: Date;
}

@ObjectType()
export class MapVoteOutput extends GenericOutput {
  @Field(() => MapVote, { nullable: true })
  map_vote: MapVote | null;
}

@InputType()
export class MapVoteUpsertInput {
  @Field(() => ID) map_id: string;
  @Field(() => Boolean) is_original: boolean;
  @Field(() => Boolean) vote: boolean;
}

@ObjectType()
export class MapVoteStatus {
  @Field(() => ID) map_id: string;
  @Field(() => Boolean) is_original: boolean;
  @Field(() => Int) upvotes: number;
  @Field(() => Int) downvotes: number;
}

@ObjectType()
export class MapVoteStatusOutputRow extends GenericOutput {
  @Field(() => MapVoteStatus, { nullable: true })
  vote_status: MapVoteStatus | null;
}

@ObjectType()
export class MapVoteStatusOutput extends GenericOutput {
  @Field(() => [MapVoteStatus])
  vote_status_list: MapVoteStatus[];
}

////////////// Zip
@InputType()
export class StartZipMapDownloadInput {
  @Field(() => LanguageInput) language: LanguageInput;
}
@ObjectType()
export class StartZipMapOutput extends GenericOutput {}

@ObjectType()
export class ZipMapResult {
  @Field(() => String, { nullable: true }) resultZipUrl: string | null;
  @Field(() => SubscriptionStatus) status: SubscriptionStatus;
  @Field(() => String, { nullable: true }) message?: string;
  @Field(() => [String], { nullable: true }) errors?: string[];
}
