import { ErrorType } from 'src/common/types';

export type GetThreadObjectById = {
  thread_id: string;
  forum_folder_id: string;
  name: string;
  created_by: string;
};

export function getThreadObjById(id: number): [string, [number]] {
  return [
    `
      select
        thread_id,
        forum_folder_id,
        name,
        created_by
      from threads
      where threads.thread_id = $1
    `,
    [id],
  ];
}

export function getTheads({
  forum_folder_id,
  filter,
  first,
  after,
}: {
  forum_folder_id: number;
  filter: string | null;
  first: number | null;
  after: string | null;
}): [string, unknown[]] {
  const returnArr: unknown[] = [forum_folder_id, `%${filter || ''}%`];
  let limitStr = '';
  let cursorStr = '';

  if (after) {
    returnArr.push(after);
    cursorStr = `and lower(threads.name) > $${returnArr.length}`;
  }

  if (first) {
    returnArr.push(first);
    limitStr = `limit $${returnArr.length}`;
  }

  return [
    `
      select
        thread_id,
        forum_folder_id,
        name,
        created_by
      from threads
      where threads.forum_folder_id = $1 
        and lower(threads.name) like $2
        ${cursorStr}
      order by lower(threads.name)
      ${limitStr}
    `,
    [...returnArr],
  ];
}

export type GetThreadsTotalSize = {
  total_records: number;
};

export function getThreadsTotalSize(
  forum_folder_id: number,
  filter: string | null,
): [string, [number, string]] {
  return [
    `
      select count(*) as total_records
      from threads
      where threads.forum_folder_id = $1 
        and lower(threads.name) like $2;
    `,
    [forum_folder_id, `%${filter || ''}%`],
  ];
}

export type ThreadUpsertProcedureOutputRow = {
  p_thread_id: string;
  p_error_type: ErrorType;
};

export function callThreadUpsertProcedure({
  name,
  forum_folder_id,
  thread_id,
  token,
}: {
  name: string;
  forum_folder_id: number;
  thread_id: number | null;
  token: string;
}): [string, [string, string, number] | [string, string, number, number]] {
  if (thread_id) {
    return [
      `
      call thread_upsert($1, $2, $3, $4, null);
    `,
      [name, token, forum_folder_id, thread_id],
    ];
  } else {
    return [
      `
      call thread_upsert($1, $2, $3, null, null);
    `,
      [name, token, forum_folder_id],
    ];
  }
}

export type ThreadDeleteProcedureOutputRow = {
  p_thread_id: string;
  p_error_type: ErrorType;
};

export function callThreadDeleteProcedure({
  id,
  token,
}: {
  id: number;
  token: string;
}): [string, [string, number]] {
  return [
    `
      call thread_delete($1, $2, null);
    `,
    [token, id],
  ];
}
