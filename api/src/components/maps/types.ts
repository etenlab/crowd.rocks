import { Field, ID, ObjectType } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';

@ObjectType()
export class MapFileInput {
  @Field(() => GraphQLUpload) mapFile: FileUpload;
}

@ObjectType()
export class MapFileOutput {
  @Field(() => ID) original_map_id: string;
  @Field(() => String) map_file_name: string;
}
