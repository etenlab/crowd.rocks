import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MapFileOutput {
  @Field(() => ID) original_map_id: string;
  @Field(() => String) map_file_name: string;
}
