import { Injectable } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ErrorType } from 'src/common/types';
import {
  createToken,
  getBearer,
  get_avatar_image_url,
} from 'src/common/utility';
import { PostgresService } from 'src/core/postgres.service';
import { S3Service } from 'src/core/s3.service';
import {
  AvatarUpdateInput,
  AvatarUpdateOutput,
  FileUploadUrlRequest,
  FileUploadUrlResponse,
  User,
} from './types';

@Injectable()
@Resolver(User)
export class AvatarUpdateResolver {
  constructor(private pg: PostgresService, private s3: S3Service) {}

  @Mutation(() => AvatarUpdateOutput)
  async avatarUpdateResolver(
    @Args('input') input: AvatarUpdateInput,
    @Context() req: any,
  ): Promise<AvatarUpdateOutput> {
    console.log('avatar update resolver');
    try {
      const bearer = getBearer(req);

      const res1 = await this.pg.pool.query(
        `
        call user_avatar_update($1, $2, 0, '', '');
      `,
        [bearer, input.avatar],
      );

      if (res1.rows[0] !== null) {
        return {
          error: ErrorType.NoError,
          user: {
            avatar: input.avatar,
            avatar_url: res1.rows[0].p_url,
            user_id: res1.rows[0].p_user_id,
          },
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      user: null,
    };
  }

  @Query(() => FileUploadUrlResponse)
  async fileUploadUrlRequest(
    @Args('input') input: FileUploadUrlRequest,
    @Context() req: any,
  ): Promise<FileUploadUrlResponse> {
    console.log('file upload url resolver');
    try {
      const bearer = getBearer(req);

      if (!bearer)
        return {
          error: ErrorType.Unauthorized,
          url: null,
          avatar_image_url: null,
        };

      const object_key = `avatars/${Date.now()}-${createToken(8)}`;

      const upload_url = await this.s3.get_signed_url_for_file(object_key);

      if (upload_url) {
        const user_id = await this.get_user_id_from_bearer(bearer);

        if (!user_id)
          return {
            error: ErrorType.Unauthorized,
            url: null,
            avatar_image_url: null,
          };

        const res1 = await this.pg.pool.query(
          `
            update avatars
            set url = $2
            where user_id = $1;
          `,
          [user_id, object_key],
        );

        return {
          error: ErrorType.NoError,
          url: upload_url,
          avatar_image_url: get_avatar_image_url(object_key),
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      url: null,
      avatar_image_url: null,
    };
  }

  async get_user_id_from_bearer(token: string): Promise<number | null> {
    const res1 = await this.pg.pool.query(
      `
        select user_id
        from tokens
        where token = $1;
      `,
      [token],
    );

    if (res1.rowCount == 1) {
      return res1.rows[0].user_id;
    }

    return null;
  }
}
