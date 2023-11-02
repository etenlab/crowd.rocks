import { Injectable } from '@nestjs/common';
import {
  Args,
  Query,
  Resolver,
  Mutation,
  Context,
  ID,
  Int,
} from '@nestjs/graphql';

import { ThreadsService } from './threads.service';

import {
  Thread,
  ThreadDeleteOutput,
  ThreadOutput,
  ThreadUpsertInput,
  ThreadListConnection,
} from './types';
import { getBearer } from 'src/common/utility';

@Injectable()
@Resolver(Thread)
export class ThreadResolver {
  constructor(private threadService: ThreadsService) {}

  @Query(() => ThreadOutput)
  async threadRead(
    @Args('thread_id', { type: () => ID }) thread_id: string,
  ): Promise<ThreadOutput> {
    console.log('thread read resolver, thread_id:', thread_id);

    return this.threadService.getThread(+thread_id);
  }

  @Query(() => ThreadListConnection)
  async threads(
    @Args('filter', { type: () => String, nullable: true })
    filter: string | null,
    @Args('forum_folder_id', { type: () => String })
    forum_folder_id: string,
    @Args('first', { type: () => Int, nullable: true }) first: number | null,
    @Args('after', { type: () => ID, nullable: true }) after: string | null,
  ): Promise<ThreadListConnection> {
    console.log('thread list resolver', {
      filter,
      forum_folder_id,
      first,
      after,
    });
    return this.threadService.listByFolderId({
      filter,
      forum_folder_id: +forum_folder_id,
      first,
      after,
    });
  }

  @Mutation(() => ThreadOutput)
  async threadUpsert(
    @Args('input') input: ThreadUpsertInput,
    @Context() req: any,
  ): Promise<ThreadOutput> {
    console.log('thread upsert resolver, name: ', input.name);
    console.log('thread_id', input.thread_id);

    return this.threadService.upsert(input, getBearer(req) || '');
  }

  @Mutation(() => ThreadDeleteOutput)
  async threadDelete(
    @Args('thread_id', { type: () => ID }) thread_id: string,
    @Context() req: any,
  ): Promise<ThreadDeleteOutput> {
    console.log('thread delete resolver, thread_id: ', thread_id);
    return this.threadService.delete(+thread_id, getBearer(req) || '');
  }
}
