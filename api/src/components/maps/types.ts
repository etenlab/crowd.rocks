import { Field, ID, InputType, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MapFileOutput {
  @Field(() => ID) original_map_id: string;
  @Field(() => String) map_file_name: string;
  @Field(() => String) created_at: string;
  @Field(() => Int) created_by: number;
}

@InputType()
export class GetMapListInput {}

@ObjectType()
export class GetOrigMapsListOutput {
  @Field(() => [MapFileOutput]) origMapList: MapFileOutput[];
}
@ObjectType()
export class GetOrigMapContentOutput {
  @Field(() => String) map_file_name: string;
  @Field(() => String) content: string;
}
