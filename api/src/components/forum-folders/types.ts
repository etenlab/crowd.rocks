import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { GenericOutput } from 'src/common/types';

@ObjectType()
export class ForumFolder {
  @Field(() => ID) folder_id: string;
  @Field(() => String) name: string;
}

@InputType()
export class ForumFolderUpsertInput {
  @Field(() => String) name: string;
  @Field(() => ID) forum_id: string;
  @Field(() => ID, { nullable: true }) folder_id?: number;
}

@ObjectType()
export class ForumFolderUpsertOutput extends GenericOutput {
  @Field(() => ForumFolder, { nullable: true })
  folder: ForumFolder | null;
}

@InputType()
export class ForumFolderReadInput {
  @Field(() => ID) folder_id: string;
}

@InputType()
export class ForumFolderListInput {
  @Field(() => ID) forum_id: string;
}

@ObjectType()
export class ForumFolderReadOutput extends GenericOutput {
  @Field(() => ForumFolder, { nullable: true })
  folder: ForumFolder | null;
}

@InputType()
export class ForumFolderDeleteInput {
  @Field(() => ID) folder_id: string;
}

@ObjectType()
export class ForumFolderDeleteOutput extends GenericOutput {
  @Field(() => ID) folder_id: string;
}

@ObjectType()
export class ForumFolderListOutput extends GenericOutput {
  @Field(() => [ForumFolder]) folders: ForumFolder[];
}
