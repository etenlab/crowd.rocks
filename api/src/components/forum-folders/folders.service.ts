import { Injectable, Logger } from '@nestjs/common';
import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';
import {
  callForumFolderDeleteProcedure,
  callForumFolderUpsertProcedure,
  ForumFolderDeleteProcedureOutputRow,
  ForumFolderUpsertProcedureOutputRow,
  getForumFolderObjById,
  GetForumFolderObjectById,
} from '../forum-folders/sql-string';
import {
  ForumFolderReadInput,
  ForumFolderReadOutput,
  ForumFolderListOutput,
  ForumFolder,
  ForumFolderUpsertInput,
  ForumFolderDeleteInput,
  ForumFolderDeleteOutput,
} from './types';

@Injectable()
export class ForumFoldersService {
  constructor(private pg: PostgresService) {}

  async read(input: ForumFolderReadInput): Promise<ForumFolderReadOutput> {
    try {
      const res1 = await this.pg.pool.query<GetForumFolderObjectById>(
        ...getForumFolderObjById(+input.folder_id),
      );

      if (res1.rowCount !== 1) {
        Logger.error(`no forum for id: ${input.folder_id}`);
      } else {
        return {
          error: ErrorType.NoError,
          folder: {
            folder_id: input.folder_id,
            name: res1.rows[0].name,
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

  async listByForumId(forum_id: number): Promise<ForumFolderListOutput> {
    try {
      const res1 = await this.pg.pool.query(
        `
          select
            fr.forum_folder_id,
            fr.name
          from 
            forums f
          join forum_folders fr
            on f.forum_id = fr.forum_id
          where f.forum_id = $1
        `,
        [forum_id + ''],
      );
      const folders = res1.rows.map<ForumFolder>(
        ({ name, forum_folder_id }) => ({
          name: name,
          folder_id: forum_folder_id,
        }),
      );

      return {
        error: ErrorType.NoError,
        folders,
      };
    } catch (e) {
      Logger.error(e);
      return {
        error: ErrorType.UnknownError,
        folders: [],
      };
    }
  }

  async upsert(
    input: ForumFolderUpsertInput,
    token: string,
  ): Promise<ForumFolderReadOutput> {
    try {
      const res = await this.pg.pool.query<ForumFolderUpsertProcedureOutputRow>(
        ...callForumFolderUpsertProcedure({
          name: input.name,
          forum_id: input.forum_id,
          forum_folder_id: input.folder_id,
          token: token,
        }),
      );

      const creatingError = res.rows[0].p_error_type;
      const folder_id = res.rows[0].p_forum_folder_id;
      Logger.debug(creatingError);
      Logger.debug(folder_id);

      if (creatingError !== ErrorType.NoError || !folder_id) {
        return {
          error: creatingError,
          folder: null,
        };
      }

      const { error: readingError, folder } = await this.read({
        folder_id: folder_id + '',
      });

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
    input: ForumFolderDeleteInput,
    token: string,
  ): Promise<ForumFolderDeleteOutput> {
    try {
      const res = await this.pg.pool.query<ForumFolderDeleteProcedureOutputRow>(
        ...callForumFolderDeleteProcedure({
          id: input.folder_id,
          token: token,
        }),
      );

      const deletingError = res.rows[0].p_error_type;

      return {
        error: deletingError,
        folder_id: res.rows[0].p_forum_folder_id + '',
      };
    } catch (e) {
      Logger.error(e);
      return {
        error: ErrorType.UnknownError,
        folder_id: '',
      };
    }
  }
}
