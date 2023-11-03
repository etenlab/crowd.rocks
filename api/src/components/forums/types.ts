import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { GenericOutput } from 'src/common/types';
import { PageInfo } from '../common/types';

@ObjectType()
export class Forum {
  @Field(() => ID) forum_id: string;
  @Field(() => String) name: string;
  @Field(() => String, { nullable: true }) description: string | null;
  @Field(() => String) created_by: string;
}

@InputType()
export class ForumUpsertInput {
  @Field(() => String) name: string;
  @Field(() => String, { nullable: true }) description: string | null;
  @Field(() => ID, { nullable: true }) forum_id: string | null;
}

@ObjectType()
export class ForumOutput extends GenericOutput {
  @Field(() => Forum, { nullable: true }) forum: Forum | null;
}

@ObjectType()
export class ForumDeleteOutput extends GenericOutput {
  @Field(() => ID) forum_id: string;
}

@ObjectType()
export class ForumEdge {
  @Field(() => ID) cursor: string;
  @Field(() => Forum) node: Forum;
}

@ObjectType()
export class ForumListConnection extends GenericOutput {
  @Field(() => [ForumEdge])
  edges: ForumEdge[];
  @Field(() => PageInfo) pageInfo: PageInfo;
}
