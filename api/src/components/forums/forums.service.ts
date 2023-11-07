import { Injectable, Logger } from '@nestjs/common';
import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';
import {
  callForumDeleteProcedure,
  callForumUpsertProcedure,
  ForumDeleteProcedureOutputRow,
  ForumUpsertProcedureOutputRow,
  getForumObjById,
  getForums,
  GetForumObjectById,
  getForumsTotalSize,
  GetForumsTotalSize,
  GetForums,
} from './sql-string';
import {
  ForumOutput,
  ForumListConnection,
  ForumDeleteOutput,
  ForumUpsertInput,
  ForumEdge,
} from './types';

@Injectable()
export class ForumsService {
  constructor(private pg: PostgresService) {}

  async read(forum_id: number): Promise<ForumOutput> {
    try {
      const res = await this.pg.pool.query<GetForumObjectById>(
        ...getForumObjById(forum_id),
      );

      if (res.rowCount !== 1) {
        Logger.error(`no forum for id: ${forum_id}`);
      } else {
        return {
          error: ErrorType.NoError,
          forum: res.rows[0],
        };
      }
    } catch (err) {
      Logger.error(err);
    }

    return {
      error: ErrorType.UnknownError,
      forum: null,
    };
  }

  async list(input: {
    filter: string | null;
    first: number | null;
    after: string | null;
  }): Promise<ForumListConnection> {
    try {
      const res = await this.pg.pool.query<GetForums>(
        ...getForums({
          filter: input.filter,
          first: input.first ? input.first * 2 : null,
          after: input.after,
        }),
      );

      const res1 = await this.pg.pool.query<GetForumsTotalSize>(
        ...getForumsTotalSize(input.filter),
      );

      const tempEdges: ForumEdge[] = res.rows.map((item) => ({
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
          hasNextPage: input.first ? res.rowCount > input.first : false,
          hasPreviousPage: false,
          startCursor: edges.length > 0 ? edges[0].cursor : null,
          endCursor:
            edges.length > 0 ? edges[edges.length - 1].cursor || null : null,
          totalEdges: res1.rowCount > 0 ? res1.rows[0].total_records : 0,
        },
      };
    } catch (err) {
      Logger.error(err);
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

  async upsert(input: ForumUpsertInput, token: string): Promise<ForumOutput> {
    try {
      const res = await this.pg.pool.query<ForumUpsertProcedureOutputRow>(
        ...callForumUpsertProcedure({
          name: input.name,
          description: input.description,
          forum_id: input.forum_id,
          token: token,
        }),
      );

      const creatingError = res.rows[0].p_error_type;
      const forum_id = res.rows[0].p_forum_id;

      if (creatingError !== ErrorType.NoError || !forum_id) {
        return {
          error: creatingError,
          forum: null,
        };
      }

      const { error: readingError, forum } = await this.read(+forum_id);

      return {
        error: readingError,
        forum,
      };
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      forum: null,
    };
  }

  async delete(forum_id: number, token: string): Promise<ForumDeleteOutput> {
    const res = await this.pg.pool.query<ForumDeleteProcedureOutputRow>(
      ...callForumDeleteProcedure({
        id: forum_id,
        token: token,
      }),
    );

    const deletingError = res.rows[0].p_error_type;

    return {
      error: deletingError,
      forum_id: res.rows[0].p_forum_id + '',
    };
  }
}
