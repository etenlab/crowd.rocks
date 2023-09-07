import { Injectable } from '@nestjs/common';
import { Args, Query, Resolver, Mutation, Context } from '@nestjs/graphql';

import { ForumFoldersService } from './folders.service';

import {
  ForumFolder,
  ForumFolderDeleteInput,
  ForumFolderDeleteOutput,
  ForumFolderListInput,
  ForumFolderListOutput,
  ForumFolderReadInput,
  ForumFolderReadOutput,
  ForumFolderUpsertInput,
  ForumFolderUpsertOutput,
} from './types';
import { getBearer } from 'src/common/utility';

@Injectable()
@Resolver(ForumFolder)
export class ForumFolderResolver {
  constructor(private folderService: ForumFoldersService) {}

  @Query(() => ForumFolderReadOutput)
  async forumFolderRead(
    @Args('input') input: ForumFolderReadInput,
  ): Promise<ForumFolderReadOutput> {
    console.log('forum read resolver, word_id:', input.folder_id);

    return this.folderService.read(input);
  }

  @Query(() => ForumFolderListOutput)
  async forumFolders(
    @Args('input') input: ForumFolderListInput,
  ): Promise<ForumFolderListOutput> {
    console.log('forum list resolver');
    return this.folderService.listByForumId(+input.forum_id);
  }

  @Mutation(() => ForumFolderUpsertOutput)
  async forumFolderUpsert(
    @Args('input') input: ForumFolderUpsertInput,
    @Context() req: any,
  ): Promise<ForumFolderUpsertOutput> {
    console.log('forum upsert resolver, name: ', input.name);
    console.log('forum_id', input.forum_id);

    return this.folderService.upsert(input, getBearer(req) || '');
  }

  @Mutation(() => ForumFolderDeleteOutput)
  async forumFolderDelete(
    @Args('input') input: ForumFolderDeleteInput,
    @Context() req: any,
  ): Promise<ForumFolderDeleteOutput> {
    console.log('forum delete resolver, forum_id: ', input.folder_id);
    return this.folderService.delete(input, getBearer(req) || '');
  }
}
