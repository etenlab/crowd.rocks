import { Injectable } from '@nestjs/common';
import { Args, Query, Resolver, Mutation, Context } from '@nestjs/graphql';

import { ThreadsService } from './threads.service';

import {
  Thread,
  ThreadDeleteInput,
  ThreadDeleteOutput,
  ThreadListInput,
  ThreadListOutput,
  ThreadReadInput,
  ThreadReadOutput,
  ThreadUpsertInput,
  ThreadUpsertOutput,
} from './types';
import { getBearer } from 'src/common/utility';

@Injectable()
@Resolver(Thread)
export class ThreadResolver {
  constructor(private threadService: ThreadsService) {}

  @Query(() => ThreadReadOutput)
  async threadRead(
    @Args('input') input: ThreadReadInput,
  ): Promise<ThreadReadOutput> {
    console.log('thread read resolver, thread_id:', input.thread_id);

    return this.threadService.read(input);
  }

  @Query(() => ThreadListOutput)
  async threads(
    @Args('input') input: ThreadListInput,
  ): Promise<ThreadListOutput> {
    console.log('thread list resolver');
    return this.threadService.listByFolderId(+input.folder_id);
  }

  @Mutation(() => ThreadUpsertOutput)
  async threadUpsert(
    @Args('input') input: ThreadUpsertInput,
    @Context() req: any,
  ): Promise<ThreadUpsertOutput> {
    console.log('thread upsert resolver, name: ', input.name);
    console.log('thread_id', input.thread_id);

    return this.threadService.upsert(input, getBearer(req) || '');
  }

  @Mutation(() => ThreadDeleteOutput)
  async threadDelete(
    @Args('input') input: ThreadDeleteInput,
    @Context() req: any,
  ): Promise<ThreadDeleteOutput> {
    console.log('thread delete resolver, thread_id: ', input.thread_id);
    return this.threadService.delete(input, getBearer(req) || '');
  }
}
