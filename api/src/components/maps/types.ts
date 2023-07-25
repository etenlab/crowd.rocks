import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MapFileOutput {
  @Field(() => ID) original_map_id: string;
  @Field(() => String) map_file_name: string;
  @Field(() => String) created_at: string;
  @Field(() => ID) created_by: string;
}

@ObjectType()
export class GetOrigMapsListOutput {
  @Field(() => [MapFileOutput]) origMapList: MapFileOutput[];
}

@ObjectType()
export class GetOrigMapContentOutput extends MapFileOutput {
  @Field(() => String) content: string;
}

@InputType()
export class GetOrigMapListInput {
  @Field(() => String, { nullable: true }) search?: string;
}
@InputType()
export class GetOrigMapContentInput {
  @Field(() => ID) original_map_id: string;
}
