import { ErrorType } from 'src/common/types';

export type GetForumFolderObjectById = {
  forum_folder_id: string;
  forum_id: string;
  name: string;
  description: string | null;
  created_by: string;
};

export function getForumFolderObjById(id: number): [string, [number]] {
  return [
    `
      select
        forum_folder_id,
        forum_id,
        name,
        description,
        created_by
      from forum_folders
      where forum_folders.forum_folder_id = $1
    `,
    [id],
  ];
}

export function getForumFolders({
  forum_id,
  filter,
  first,
  after,
}: {
  forum_id: number;
  filter: string | null;
  first: number | null;
  after: string | null;
}): [string, unknown[]] {
  const returnArr: unknown[] = [forum_id, filter || ''];
  let limitStr = '';
  let cursorStr = '';

  if (after) {
    returnArr.push(after);
    cursorStr = `lower(forum_folders.name) > $${returnArr.length}`;
  }

  if (first) {
    returnArr.push(first);
    limitStr = `limit $${returnArr.length}`;
  }

  return [
    `
      select 
        forum_folder_id,
        forum_id,
        name,
        description,
        created_by
      from forum_folders
      where forum_folders.forum_id = $1 
        and lower(forum_folders.name) like $2
        ${cursorStr}
      order by lower(forum_folders.name)
      ${limitStr}
    `,
    [...returnArr],
  ];
}

export type GetForumFoldersTotalSize = {
  totalRecords: number;
};

export function getForumFoldersTotalSize(
  forum_id: number,
  filter: string | null,
): [string, [number, string]] {
  return [
    `
      select count(*) as totalRecords
      from forum_folders
      where forum_folders.forum_id = $1 
        and lower(forum_folders.name) like $2;
    `,
    [forum_id, filter || ''],
  ];
}

export type ForumFolderUpsertProcedureOutputRow = {
  p_forum_folder_id: string;
  p_error_type: ErrorType;
};

export function callForumFolderUpsertProcedure({
  name,
  description,
  forum_id,
  forum_folder_id,
  token,
}: {
  name: string;
  description: string | null;
  forum_id: string;
  forum_folder_id: string | null;
  token: string;
}): [
  string,
  (
    | [string, string | null, string, string]
    | [string, string | null, string, string, string]
  ),
] {
  if (forum_folder_id) {
    return [
      `
        call forum_folder_upsert($1, $2, $3, $4, $5, null);
      `,
      [name, description, token, forum_id, forum_folder_id],
    ];
  } else {
    return [
      `
        call forum_folder_upsert($1, $2, $3, $4, null, null);
      `,
      [name, description, token, forum_id],
    ];
  }
}

export type ForumFolderDeleteProcedureOutputRow = {
  p_forum_folder_id: string;
  p_error_type: ErrorType;
};

export function callForumFolderDeleteProcedure({
  id,
  token,
}: {
  id: number;
  token: string;
}): [string, [string, number]] {
  return [
    `
      call forum_folder_delete($1, $2, null);
    `,
    [token, id],
  ];
}
