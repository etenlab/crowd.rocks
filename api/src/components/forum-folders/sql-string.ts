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

export type GetForumFolder = {
  forum_folder_id: string;
  forum_id: string;
  name: string;
  description: string | null;
  created_by: string;
  total_threads: number;
  total_posts: number;
};

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
  const returnArr: unknown[] = [forum_id, `%${filter || ''}%`];
  let limitStr = '';
  let cursorStr = '';

  if (after) {
    returnArr.push(after);
    cursorStr = `and lower(forum_folders.name) > $${returnArr.length}`;
  }

  if (first) {
    returnArr.push(first);
    limitStr = `limit $${returnArr.length}`;
  }

  return [
    `
      select
        forum_folders.forum_folder_id,
        forum_folders.forum_id,
        forum_folders.name,
        forum_folders.description,
        coalesce(count(threads_v2.thread_id), 0) as total_threads,
        coalesce(sum(threads_v2.post_count), 0) as total_posts,
        forum_folders.created_by
      from forum_folders
      left join (
        select 
          threads.thread_id,
          threads.forum_folder_id,
          coalesce(count(posts.post_id), 0) as post_count
        from threads
        left join posts
        on posts.parent_table = 'threads'
          and posts.parent_id = threads.thread_id
        group by threads.thread_id
      ) as threads_v2
      on threads_v2.forum_folder_id = forum_folders.forum_folder_id
      where forum_folders.forum_id = $1 
        and lower(forum_folders.name) like $2
        ${cursorStr}
      group by forum_folders.forum_folder_id
      order by lower(forum_folders.name)
      ${limitStr}
    `,
    [...returnArr],
  ];
}

export type GetForumFoldersTotalSize = {
  total_records: number;
};

export function getForumFoldersTotalSize(
  forum_id: number,
  filter: string | null,
): [string, [number, string]] {
  return [
    `
      select count(*) as total_records
      from forum_folders
      where forum_folders.forum_id = $1 
        and lower(forum_folders.name) like $2;
    `,
    [forum_id, `%${filter || ''}%`],
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
