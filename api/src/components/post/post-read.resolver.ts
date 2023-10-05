import { Injectable } from '@nestjs/common';
import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { PostgresService } from 'src/core/postgres.service';
import { UserReadResolver } from '../user/user-read.resolver';
import { PostService } from './post.service';
import {
  Post,
  PostCountOutput,
  PostReadInput,
  PostReadOutput,
  PostsByParentInput,
  PostsByParentOutput,
} from './types';

@Injectable()
@Resolver(Post)
export class PostReadResolver {
  constructor(
    private pg: PostgresService,
    private userRead: UserReadResolver,
    private postService: PostService,
  ) {}
  @Query(() => PostReadOutput)
  async postReadResolver(
    @Args('input') input: PostReadInput,
    @Context() req: any,
  ): Promise<PostReadOutput> {
    console.log('post read resolver, post_id:', input.post_id);
    return await this.postService.read(input, req);
  }
  @Query(() => PostsByParentOutput)
  async postsByParent(
    @Args('input') input: PostsByParentInput,
    @Context() req: any,
  ): Promise<PostsByParentOutput> {
    console.log('post read resolver, parent_id:', input.parent_id);
    console.log('post read resolver, parent_table:', input.parent_name);
    return await this.postService.getPostsByParent(input, req);
  }

  @Query(() => PostCountOutput)
  async getTotalPosts(
    @Args('input') input: PostsByParentInput,
    @Context() req: any,
  ): Promise<PostCountOutput> {
    console.log('post count, parent_id:', input.parent_id);
    console.log('post count, parent_table:', input.parent_name);
    return await this.postService.getTotalPosts(input, req);
  }
}
