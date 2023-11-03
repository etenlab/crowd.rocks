import { Injectable, Logger } from '@nestjs/common';
import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';
import {
  callThreadDeleteProcedure,
  callThreadUpsertProcedure,
  getThreadObjById,
  GetThreadObjectById,
  ThreadDeleteProcedureOutputRow,
  ThreadUpsertProcedureOutputRow,
  getTheads,
  GetThreadsTotalSize,
  getThreadsTotalSize,
} from './sql-string';
import {
  ThreadOutput,
  ThreadListConnection,
  ThreadEdge,
  ThreadUpsertInput,
  ThreadDeleteOutput,
} from './types';

@Injectable()
export class ThreadsService {
  constructor(private pg: PostgresService) {}

  async getThread(thread_id: number): Promise<ThreadOutput> {
    try {
      const res = await this.pg.pool.query<GetThreadObjectById>(
        ...getThreadObjById(thread_id),
      );

      if (res.rowCount !== 1) {
        console.error(`no thread for id: ${thread_id}`);
      } else {
        return {
          error: ErrorType.NoError,
          thread: {
            thread_id: res.rows[0].thread_id,
            forum_folder_id: res.rows[0].forum_folder_id,
            name: res.rows[0].name,
            created_by: res.rows[0].created_by,
          },
        };
      }
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      thread: null,
    };
  }

  async listByFolderId(input: {
    forum_folder_id: number;
    filter: string | null;
    after: string | null;
    first: number | null;
  }): Promise<ThreadListConnection> {
    try {
      const res = await this.pg.pool.query<GetThreadObjectById>(
        ...getTheads({
          forum_folder_id: input.forum_folder_id,
          filter: input.filter,
          first: input.first ? input.first * 2 : null,
          after: input.after,
        }),
      );

      const res1 = await this.pg.pool.query<GetThreadsTotalSize>(
        ...getThreadsTotalSize(input.forum_folder_id, input.filter),
      );

      const tempEdges: ThreadEdge[] = res.rows.map((item) => ({
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

  async upsert(input: ThreadUpsertInput, token: string): Promise<ThreadOutput> {
    try {
      const res = await this.pg.pool.query<ThreadUpsertProcedureOutputRow>(
        ...callThreadUpsertProcedure({
          name: input.name,
          forum_folder_id: +input.forum_folder_id,
          thread_id: input.thread_id ? +input.thread_id : null,
          token: token,
        }),
      );

      const creatingError = res.rows[0].p_error_type;
      const thread_id = res.rows[0].p_thread_id;

      if (creatingError !== ErrorType.NoError || !thread_id) {
        return {
          error: creatingError,
          thread: null,
        };
      }

      const { error: readingError, thread } = await this.getThread(+thread_id);

      return {
        error: readingError,
        thread,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      thread: null,
    };
  }

  async delete(thread_id: number, token: string): Promise<ThreadDeleteOutput> {
    try {
      const res = await this.pg.pool.query<ThreadDeleteProcedureOutputRow>(
        ...callThreadDeleteProcedure({
          id: thread_id,
          token: token,
        }),
      );

      const deletingError = res.rows[0].p_error_type;

      return {
        error: deletingError,
        thread_id: res.rows[0].p_thread_id + '',
      };
    } catch (e) {
      Logger.error(e);
      return {
        error: ErrorType.UnknownError,
        thread_id: '',
      };
    }
  }

  getDiscussionTitle = async (id: string): Promise<string> => {
    const thread = await this.getThread(+id);
    if (thread.error !== ErrorType.NoError || thread.thread == null) {
      Logger.error(thread.error);
      return 'Thread';
    }
    return thread.thread.name;
  };
}
