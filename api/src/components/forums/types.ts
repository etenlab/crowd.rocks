import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { GenericOutput } from 'src/common/types';
import { ForumFolder } from '../forum-folders/types';

@ObjectType()
export class Forum {
  @Field(() => ID) forum_id: string;
  @Field(() => String) name: string;
}

@InputType()
export class ForumUpsertInput {
  @Field(() => String) name: string;
  @Field(() => ID, { nullable: true }) forum_id?: number;
}

@ObjectType()
export class ForumUpsertOutput extends GenericOutput {
  @Field(() => Forum, { nullable: true }) forum: Forum | null;
}

@InputType()
export class ForumReadInput {
  @Field(() => ID) forum_id: string;
}

@ObjectType()
export class ForumReadOutput extends GenericOutput {
  @Field(() => Forum, { nullable: true }) forum: Forum | null;
}

@InputType()
export class ForumDeleteInput {
  @Field(() => ID) forum_id: string;
}

@ObjectType()
export class ForumDeleteOutput extends GenericOutput {
  @Field(() => ID) forum_id: string;
}

@ObjectType()
export class ForumListOutput extends GenericOutput {
  @Field(() => [Forum]) forums: Forum[];
}
