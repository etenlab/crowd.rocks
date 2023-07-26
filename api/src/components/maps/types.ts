import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Word } from '../words/types';

@ObjectType()
export class MapFileOutput {
  @Field(() => ID) original_map_id: string;
  @Field(() => String) map_file_name: string;
  @Field(() => String) created_at: string;
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
export class GetOrigMapContentInput {
  @Field(() => ID) original_map_id: string;
}
@ObjectType()
export class GetOrigMapContentOutput extends MapFileOutput {
  @Field(() => String) content: string;
}

@InputType()
export class GetOrigMapWordsInput {
  @Field(() => ID, { nullable: true }) original_map_id?: string;
}
@ObjectType()
export class GetOrigMapWordsOutput {
  @Field(() => [Word]) origMapWords: Word[];
}

export type OriginalMapWordInput = {
  word_id: string;
  original_map_id: string;
};
