import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { GenericOutput } from 'src/common/types';
import { PageInfo } from '../common/types';

@ObjectType()
export class ForumFolder {
  @Field(() => ID) forum_folder_id: string;
  @Field(() => String) forum_id: string;
  @Field(() => String) name: string;
  @Field(() => String, { nullable: true }) description: string | null;
  @Field(() => String) created_by: string;
}

@InputType()
export class ForumFolderUpsertInput {
  @Field(() => String) name: string;
  @Field(() => String, { nullable: true }) description: string | null;
  @Field(() => ID) forum_id: string;
  @Field(() => ID, { nullable: true }) forum_folder_id: string | null;
}

@ObjectType()
export class ForumFolderOutput extends GenericOutput {
  @Field(() => ForumFolder, { nullable: true })
  folder: ForumFolder | null;
}

@ObjectType()
export class ForumFolderDeleteOutput extends GenericOutput {
  @Field(() => ID) forum_folder_id: string;
}

@ObjectType()
export class ForumFolderEdge {
  @Field(() => ID) cursor: string;
  @Field(() => ForumFolder) node: ForumFolder;
}

@ObjectType()
export class ForumFolderListConnection extends GenericOutput {
  @Field(() => [ForumFolderEdge])
  edges: ForumFolderEdge[];
  @Field(() => PageInfo) pageInfo: PageInfo;
}
