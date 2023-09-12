import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Post, PostCreateInput, PostCreateOutput } from './types';

@Resolver(Post)
export class PostCreateResolver {
  constructor(private postService: PostService) {}
  @Mutation(() => PostCreateOutput)
  async postCreateResolver(
    @Args('input') input: PostCreateInput,
    @Context() req: any,
  ): Promise<PostCreateOutput> {
    console.log(`post create resolver. content: ${input.content}`);
    return await this.postService.create(input, req);
  }
}
