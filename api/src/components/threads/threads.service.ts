import { Injectable } from '@nestjs/common';
import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';
import {
  callThreadDeleteProcedure,
  callThreadUpsertProcedure,
  getThreadObjById,
  GetThreadObjectById,
  ThreadDeleteProcedureOutputRow,
  ThreadUpsertProcedureOutputRow,
} from './sql-string';
import {
  ThreadReadInput,
  ThreadReadOutput,
  ThreadListOutput,
  Thread,
  ThreadUpsertInput,
  ThreadDeleteInput,
  ThreadDeleteOutput,
} from './types';

@Injectable()
export class ThreadsService {
  constructor(private pg: PostgresService) {}

  async getThread(input: ThreadReadInput): Promise<ThreadReadOutput> {
    const res1 = await this.pg.pool.query<GetThreadObjectById>(
      ...getThreadObjById(+input.thread_id),
    );

    if (res1.rowCount !== 1) {
      console.error(`no thread for id: ${input.thread_id}`);
    } else {
      return {
        error: ErrorType.NoError,
        thread: {
          thread_id: input.thread_id,
          name: res1.rows[0].name,
        },
      };
    }

    return {
      error: ErrorType.UnknownError,
      thread: null,
    };
  }

  async listByFolderId(folder_id: number): Promise<ThreadListOutput> {
    const res1 = await this.pg.pool.query(
      `
        select
          t.thread_id,
          t.name
        from 
          threads t
        join forum_folders fr
          on t.forum_folder_id = fr.forum_folder_id
        where fr.forum_folder_id = $1
      `,
      [folder_id + ''],
    );
    const threads = res1.rows.map<Thread>(({ name, thread_id }) => ({
      name: name,
      thread_id: thread_id,
    }));

    return {
      error: ErrorType.NoError,
      threads,
    };
  }

  async upsert(
    input: ThreadUpsertInput,
    token: string,
  ): Promise<ThreadReadOutput> {
    try {
      const res = await this.pg.pool.query<ThreadUpsertProcedureOutputRow>(
        ...callThreadUpsertProcedure({
          name: input.name,
          folder_id: input.folder_id,
          thread_id: input.thread_id,
          token: token,
        }),
      );

      const creatingError = res.rows[0].p_error_type;
      const thread_id = res.rows[0].p_thread_id;
      console.log(creatingError);
      console.log(thread_id);

      if (creatingError !== ErrorType.NoError || !thread_id) {
        return {
          error: creatingError,
          thread: null,
        };
      }

      const { error: readingError, thread } = await this.getThread({
        thread_id: thread_id + '',
      });

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

  async delete(
    input: ThreadDeleteInput,
    token: string,
  ): Promise<ThreadDeleteOutput> {
    const res = await this.pg.pool.query<ThreadDeleteProcedureOutputRow>(
      ...callThreadDeleteProcedure({
        id: input.thread_id,
        token: token,
      }),
    );

    const deletingError = res.rows[0].p_error_type;

    return {
      error: deletingError,
      thread_id: res.rows[0].p_thread_id + '',
    };
  }

  getDiscussionTitle = async (id: string): Promise<string> => {
    const thread = await this.getThread({ thread_id: id });
    if (thread.error !== ErrorType.NoError || thread.thread == null) {
      console.error(thread.error);
      return 'Thread';
    }
    return thread.thread.name;
  };
}
