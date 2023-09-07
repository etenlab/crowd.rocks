import { ErrorType } from 'src/common/types';

export type GetForumFolderObjectById = {
  name: string;
};

export function getForumFolderObjById(id: number): [string, [number]] {
  return [
    `
      select 
        name
      from forum_folders
      where forum_folders.forum_folder_id = $1
    `,
    [id],
  ];
}

export type ForumFolderUpsertProcedureOutputRow = {
  p_forum_folder_id: number;
  p_error_type: ErrorType;
};

export function callForumFolderUpsertProcedure({
  name,
  forum_id,
  forum_folder_id,
  token,
}: {
  name: string;
  forum_id: string;
  forum_folder_id?: number;
  token: string;
}): [string, [string, string, string] | [string, string, string, string]] {
  let returnArry: [string, string, string] | [string, string, string, string] =
    [name, token, forum_id];
  if (forum_folder_id) {
    returnArry = [...returnArry, forum_folder_id + ''];
  }
  return [
    `
      call forum_folder_upsert($1, $2, $3, ${
        forum_folder_id ? `$${returnArry.length}` : null
      },null);
    `,
    [...returnArry],
  ];
}

export type ForumFolderDeleteProcedureOutputRow = {
  p_forum_folder_id: number;
  p_error_type: ErrorType;
};

export function callForumFolderDeleteProcedure({
  id,
  token,
}: {
  id: string;
  token: string;
}): [string, [string, string]] {
  return [
    `
      call forum_folder_delete($1, $2, null);
    `,
    [token, id],
  ];
}
