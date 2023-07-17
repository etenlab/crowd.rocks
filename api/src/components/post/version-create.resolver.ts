import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ErrorType } from 'src/common/types';
import { getBearer } from 'src/common/utility';
import { PostgresService } from 'src/core/postgres.service';
import { PostReadResolver } from './post-read.resolver';
import { Post, VersionCreateInput, VersionCreateOutput } from './types';

@Resolver(Post)
export class VersionCreateResolver {
  constructor(
    private pg: PostgresService,
    private postRead: PostReadResolver,
  ) {}
  @Mutation(() => VersionCreateOutput)
  async versionCreateResolver(
    @Args('input') input: VersionCreateInput,
    @Context() req: any,
    contentType = 1,
  ): Promise<VersionCreateOutput> {
    console.log('version create resolver');
    try {
      const bearer = getBearer(req);

      // const res = await this.pg.pool.query(`
      //   call post_version_create($1, $2::bigint, $3, $4, 0::bigint, '', '');
      // `, [bearer, +input.part_id, input.content.value, input.license_title])

      // const error = res.rows[0].p_error_type
      // const created_at = res.rows[0].p_new_created_at
      // const version_id = res.rows[0].p_new_version_id

      // if (error !== ErrorType.NoError || !version_id) {
      //   return {
      //     error,
      //     version: null,
      //   }
      // }

      // return {
      //   error,
      //   version: {
      //     version_id,
      //     part_id: input.part_id.toString(),
      //     created_at,
      //     content: input.content.value,
      //   },
      // }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      version: null,
    };
  }
}
