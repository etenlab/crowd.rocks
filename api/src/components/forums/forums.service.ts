import { Injectable } from '@nestjs/common';
import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';
import {
  callForumDeleteProcedure,
  callForumUpsertProcedure,
  ForumDeleteProcedureOutputRow,
  ForumUpsertProcedureOutputRow,
  getForumObjById,
  GetForumObjectById,
} from './sql-string';
import {
  Forum,
  ForumDeleteInput,
  ForumDeleteOutput,
  ForumListOutput,
  ForumReadInput,
  ForumReadOutput,
  ForumUpsertInput,
} from './types';

@Injectable()
export class ForumsService {
  constructor(private pg: PostgresService) {}

  async read(input: ForumReadInput): Promise<ForumReadOutput> {
    const res1 = await this.pg.pool.query<GetForumObjectById>(
      ...getForumObjById(+input.forum_id),
    );

    if (res1.rowCount !== 1) {
      console.error(`no forum for id: ${input.forum_id}`);
    } else {
      return {
        error: ErrorType.NoError,
        forum: {
          forum_id: input.forum_id,
          name: res1.rows[0].name,
        },
      };
    }

    return {
      error: ErrorType.UnknownError,
      forum: null,
    };
  }

  async list(): Promise<ForumListOutput> {
    const res1 = await this.pg.pool.query(`
        select
          forum_id,
          name
        from 
          forums
      `);
    const forums = res1.rows.map<Forum>(({ name, forum_id }) => ({
      name: name,
      forum_id: forum_id,
    }));

    return {
      error: ErrorType.NoError,
      forums,
    };
  }

  async upsert(
    input: ForumUpsertInput,
    token: string,
  ): Promise<ForumReadOutput> {
    try {
      const res = await this.pg.pool.query<ForumUpsertProcedureOutputRow>(
        ...callForumUpsertProcedure({
          name: input.name,
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

      const { error: readingError, forum } = await this.read({
        forum_id: forum_id + '',
      });

      return {
        error: readingError,
        forum,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      forum: null,
    };
  }

  async delete(
    input: ForumDeleteInput,
    token: string,
  ): Promise<ForumDeleteOutput> {
    const res = await this.pg.pool.query<ForumDeleteProcedureOutputRow>(
      ...callForumDeleteProcedure({
        id: input.forum_id,
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
