import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { GenericOutput } from 'src/common/types';
import { PageInfo } from '../common/types';

@ObjectType()
export class Thread {
  @Field(() => ID) thread_id: string;
  @Field(() => String) forum_folder_id: string;
  @Field(() => String) name: string;
  @Field(() => String) created_by: string;
}

@InputType()
export class ThreadUpsertInput {
  @Field(() => String) name: string;
  @Field(() => String) forum_folder_id: string;
  @Field(() => ID, { nullable: true }) thread_id: string | null;
}

@ObjectType()
export class ThreadOutput extends GenericOutput {
  @Field(() => Thread, { nullable: true })
  thread: Thread | null;
}

@ObjectType()
export class ThreadDeleteOutput extends GenericOutput {
  @Field(() => ID) thread_id: string;
}

@ObjectType()
export class ThreadEdge {
  @Field(() => ID) cursor: string;
  @Field(() => Thread) node: Thread;
}

@ObjectType()
export class ThreadListConnection extends GenericOutput {
  @Field(() => [ThreadEdge])
  edges: ThreadEdge[];
  @Field(() => PageInfo) pageInfo: PageInfo;
}
