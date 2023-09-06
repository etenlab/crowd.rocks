import { Injectable } from '@nestjs/common';
import { Args, Query, Resolver, Mutation, Context } from '@nestjs/graphql';

import { ForumsService } from './forums.service';

import {
  Forum,
  ForumDeleteInput,
  ForumDeleteOutput,
  ForumListOutput,
  ForumReadInput,
  ForumReadOutput,
  ForumUpsertInput,
  ForumUpsertOutput,
} from './types';
import { getBearer } from 'src/common/utility';

@Injectable()
@Resolver(Forum)
export class ForumsResolver {
  constructor(private forumsService: ForumsService) {}

  @Query(() => ForumReadOutput)
  async forumRead(
    @Args('input') input: ForumReadInput,
  ): Promise<ForumReadOutput> {
    console.log('forum read resolver, word_id:', input.forum_id);

    return this.forumsService.read(input);
  }

  @Query(() => ForumListOutput)
  async forums(): Promise<ForumListOutput> {
    console.log('forum list resolver');
    return this.forumsService.list();
  }

  @Mutation(() => ForumUpsertOutput)
  async forumUpsert(
    @Args('input') input: ForumUpsertInput,
    @Context() req: any,
  ): Promise<ForumUpsertOutput> {
    console.log('forum upsert resolver, name: ', input.name);

    return this.forumsService.upsert(input, getBearer(req));
  }

  @Mutation(() => ForumDeleteOutput)
  async forumDelete(
    @Args('input') input: ForumDeleteInput,
    @Context() req: any,
  ): Promise<ForumDeleteOutput> {
    console.log('forum delete resolver, forum_id: ', input.forum_id);
    return this.forumsService.delete(input, getBearer(req));
  }
}
