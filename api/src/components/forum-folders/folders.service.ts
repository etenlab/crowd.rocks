import { Injectable, Logger } from '@nestjs/common';
import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';
import {
  callForumFolderDeleteProcedure,
  callForumFolderUpsertProcedure,
  ForumFolderDeleteProcedureOutputRow,
  ForumFolderUpsertProcedureOutputRow,
  getForumFolderObjById,
  getForumFolders,
  GetForumFolder,
  GetForumFolderObjectById,
  getForumFoldersTotalSize,
  GetForumFoldersTotalSize,
} from '../forum-folders/sql-string';
import {
  ForumFolderOutput,
  ForumFolderListConnection,
  ForumFolderEdge,
  ForumFolderUpsertInput,
  ForumFolderDeleteOutput,
} from './types';

@Injectable()
export class ForumFoldersService {
  constructor(private pg: PostgresService) {}

  async read(forum_folder_id: number): Promise<ForumFolderOutput> {
    try {
      const res = await this.pg.pool.query<GetForumFolderObjectById>(
        ...getForumFolderObjById(forum_folder_id),
      );

      if (res.rowCount !== 1) {
        Logger.error(`no forum for id: ${forum_folder_id}`);
      } else {
        return {
          error: ErrorType.NoError,
          folder: {
            forum_folder_id: res.rows[0].forum_folder_id,
            forum_id: res.rows[0].forum_id,
            name: res.rows[0].name,
            description: res.rows[0].description,
            created_by: res.rows[0].created_by,
          },
        };
      }
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      folder: null,
    };
  }

  async listByForumId(input: {
    forum_id: number;
    filter: string | null;
    first: number | null;
    after: string | null;
  }): Promise<ForumFolderListConnection> {
    try {
      const res = await this.pg.pool.query<GetForumFolder>(
        ...getForumFolders({
          forum_id: input.forum_id,
          filter: input.filter,
          first: input.first ? input.first * 2 : null,
          after: input.after,
        }),
      );

      const res1 = await this.pg.pool.query<GetForumFoldersTotalSize>(
        ...getForumFoldersTotalSize(input.forum_id, input.filter),
      );

      const tempEdges: ForumFolderEdge[] = res.rows.map((item) => ({
        cursor: item.name,
        node: item,
      }));

      const edges =
        input.first && tempEdges.length > input.first
          ? tempEdges.slice(0, input.first)
          : tempEdges;

      return {
        error: ErrorType.NoError,
        edges,
        pageInfo: {
          hasNextPage: input.first ? res.rowCount! > input.first : false,
          hasPreviousPage: false,
          startCursor: edges.length > 0 ? edges[0].cursor : null,
          endCursor:
            edges.length > 0 ? edges[edges.length - 1].cursor || null : null,
          totalEdges: res1.rowCount! > 0 ? res1.rows[0].total_records : 0,
        },
      };
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
        totalEdges: 0,
      },
    };
  }

  async upsert(
    input: ForumFolderUpsertInput,
    token: string,
  ): Promise<ForumFolderOutput> {
    try {
      const res = await this.pg.pool.query<ForumFolderUpsertProcedureOutputRow>(
        ...callForumFolderUpsertProcedure({
          name: input.name,
          description: input.description,
          forum_id: input.forum_id,
          forum_folder_id: input.forum_folder_id,
          token: token,
        }),
      );

      const creatingError = res.rows[0].p_error_type;
      const forum_folder_id = res.rows[0].p_forum_folder_id;

      if (creatingError !== ErrorType.NoError || !forum_folder_id) {
        return {
          error: creatingError,
          folder: null,
        };
      }

      const { error: readingError, folder } = await this.read(+forum_folder_id);

      return {
        error: readingError,
        folder,
      };
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      folder: null,
    };
  }

  async delete(
    forum_folder_id: number,
    token: string,
  ): Promise<ForumFolderDeleteOutput> {
    try {
      const res = await this.pg.pool.query<ForumFolderDeleteProcedureOutputRow>(
        ...callForumFolderDeleteProcedure({
          id: forum_folder_id,
          token: token,
        }),
      );

      const deletingError = res.rows[0].p_error_type;

      return {
        error: deletingError,
        forum_folder_id: res.rows[0].p_forum_folder_id + '',
      };
    } catch (e) {
      Logger.error(e);
      return {
        error: ErrorType.UnknownError,
        forum_folder_id: '',
      };
    }
  }
}
