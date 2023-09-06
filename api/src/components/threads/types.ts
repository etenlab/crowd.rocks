import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { GenericOutput } from 'src/common/types';

@ObjectType()
export class Thread {
  @Field(() => ID) thread_id: string;
  @Field(() => String) name: string;
}

@InputType()
export class ThreadUpsertInput {
  @Field(() => String) name: string;
  @Field(() => ID) folder_id: string;
  @Field(() => ID, { nullable: true }) thread_id?: number;
}

@ObjectType()
export class ThreadUpsertOutput extends GenericOutput {
  @Field(() => Thread, { nullable: true })
  thread: Thread | null;
}

@InputType()
export class ThreadReadInput {
  @Field(() => ID) thread_id: string;
}

@InputType()
export class ThreadListInput {
  @Field(() => ID) folder_id: string;
}

@ObjectType()
export class ThreadReadOutput extends GenericOutput {
  @Field(() => Thread, { nullable: true })
  thread: Thread | null;
}

@InputType()
export class ThreadDeleteInput {
  @Field(() => ID) thread_id: string;
}

@ObjectType()
export class ThreadDeleteOutput extends GenericOutput {
  @Field(() => ID) thread_id: string;
}

@ObjectType()
export class ThreadListOutput extends GenericOutput {
  @Field(() => [Thread]) threads: Thread[];
}
