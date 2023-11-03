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

import { ForumFoldersService } from './folders.service';

import {
  ForumFolder,
  ForumFolderOutput,
  ForumFolderUpsertInput,
  ForumFolderDeleteOutput,
  ForumFolderListConnection,
} from './types';
import { getBearer } from 'src/common/utility';

@Injectable()
@Resolver(ForumFolder)
export class ForumFolderResolver {
  constructor(private folderService: ForumFoldersService) {}

  @Query(() => ForumFolderOutput)
  async forumFolderRead(
    @Args('forum_folder_id', { type: () => ID }) forum_folder_id: string,
  ): Promise<ForumFolderOutput> {
    Logger.log('forum read resolver, forum_folder_id:', forum_folder_id);

    return this.folderService.read(+forum_folder_id);
  }

  @Query(() => ForumFolderListConnection)
  async getForumFoldersList(
    @Args('filter', { type: () => String, nullable: true })
    filter: string | null,
    @Args('forum_id', { type: () => ID }) forum_id: string,
    @Args('first', { type: () => Int, nullable: true }) first: number | null,
    @Args('after', { type: () => ID, nullable: true }) after: string | null,
  ): Promise<ForumFolderListConnection> {
    Logger.log('getForumFoldersList resolver', {
      filter,
      forum_id,
      first,
      after,
    });
    return this.folderService.listByForumId({
      forum_id: +forum_id,
      filter,
      first,
      after,
    });
  }

  @Mutation(() => ForumFolderOutput)
  async forumFolderUpsert(
    @Args('input') input: ForumFolderUpsertInput,
    @Context() req: any,
  ): Promise<ForumFolderOutput> {
    Logger.log('forum upsert resolver, name: ', input);

    return this.folderService.upsert(input, getBearer(req) || '');
  }

  @Mutation(() => ForumFolderDeleteOutput)
  async forumFolderDelete(
    @Args('forum_folder_id', { type: () => ID }) forum_folder_id: string,
    @Context() req: any,
  ): Promise<ForumFolderDeleteOutput> {
    Logger.log('forum delete resolver, forum_id: ', forum_folder_id);
    return this.folderService.delete(+forum_folder_id, getBearer(req) || '');
  }
}
