import { ErrorType } from 'src/common/types';

export type GetThreadObjectById = {
  name: string;
};

export function getThreadObjById(id: number): [string, [number]] {
  return [
    `
      select 
        name
      from threads
      where threads.thread_id = $1
    `,
    [id],
  ];
}

export type ThreadUpsertProcedureOutputRow = {
  p_thread_id: number;
  p_error_type: ErrorType;
};

export function callThreadUpsertProcedure({
  name,
  folder_id,
  thread_id,
  token,
}: {
  name: string;
  folder_id: string;
  thread_id?: number;
  token: string;
}): [string, [string, string, string] | [string, string, string, string]] {
  let returnArry: [string, string, string] | [string, string, string, string] =
    [name, token, folder_id];
  if (thread_id) {
    returnArry = [...returnArry, thread_id + ''];
  }
  return [
    `
      call thread_upsert($1, $2, $3, ${
        thread_id ? `$${returnArry.length}` : null
      },null);
    `,
    [...returnArry],
  ];
}

export type ThreadDeleteProcedureOutputRow = {
  p_thread_id: number;
  p_error_type: ErrorType;
};

export function callThreadDeleteProcedure({
  id,
  token,
}: {
  id: string;
  token: string;
}): [string, [string, string]] {
  return [
    `
      call thread_delete($1, $2, null);
    `,
    [token, id],
  ];
}
