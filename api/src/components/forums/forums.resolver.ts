import { Injectable, Logger } from '@nestjs/common';
import {
  Args,
  Query,
  Resolver,
  Mutation,
  Context,
  ID,
  Int,
} from '@nestjs/graphql';

import { ForumsService } from './forums.service';

import {
  ForumOutput,
  ForumDeleteOutput,
  ForumListConnection,
  ForumUpsertInput,
} from './types';
import { getBearer } from 'src/common/utility';

@Injectable()
@Resolver()
export class ForumsResolver {
  constructor(private forumsService: ForumsService) {}

  @Query(() => ForumOutput)
  async forumRead(
    @Args('forum_id', { type: () => ID }) forum_id: string,
  ): Promise<ForumOutput> {
    Logger.log('forum read resolver, forum_id:', forum_id);

    return this.forumsService.read(+forum_id);
  }

  @Query(() => ForumListConnection)
  async getForumsList(
    @Args('filter', { type: () => String, nullable: true })
    filter: string | null,
    @Args('first', { type: () => Int, nullable: true }) first: number | null,
    @Args('after', { type: () => ID, nullable: true }) after: string | null,
  ): Promise<ForumListConnection> {
    Logger.log('forum list resolver', { filter, first, after });
    return this.forumsService.list({ filter, first, after });
  }

  @Mutation(() => ForumOutput)
  async forumUpsert(
    @Args('input') input: ForumUpsertInput,
    @Context() req: any,
  ): Promise<ForumOutput> {
    Logger.log('forum upsert resolver, name: ', input.name);

    return this.forumsService.upsert(input, getBearer(req) || '');
  }

  @Mutation(() => ForumDeleteOutput)
  async forumDelete(
    @Args('forum_id', { type: () => ID }) forum_id: string,
    @Context() req: any,
  ): Promise<ForumDeleteOutput> {
    Logger.log('forum delete resolver, forum_id: ', forum_id);
    return this.forumsService.delete(+forum_id, getBearer(req) || '');
  }
}
