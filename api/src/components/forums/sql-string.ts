import { ErrorType } from 'src/common/types';

export type GetForumObjectById = {
  forum_id: string;
  name: string;
  description: string | null;
  created_by: string;
};

export function getForumObjById(id: number): [string, [number]] {
  return [
    `
      select 
        forum_id,
        name,
        description,
        created_by
      from forums
      where forums.forum_id = $1
    `,
    [id],
  ];
}

export function getForums({
  filter,
  first,
  after,
}: {
  filter: string | null;
  first: number | null;
  after: string | null;
}): [string, unknown[]] {
  const returnArr: unknown[] = [filter || ''];
  let limitStr = '';
  let cursorStr = '';

  if (after) {
    returnArr.push(after);
    cursorStr = `lower(forums.name) > $${returnArr.length}`;
  }

  if (first) {
    returnArr.push(first);
    limitStr = `limit $${returnArr.length}`;
  }

  return [
    `
      select 
        forum_id,
        name,
        description,
        created_by
      from forums
      where lower(forums.name) like $1
        ${cursorStr}
      order by lower(forums.name)
      ${limitStr}
    `,
    [...returnArr],
  ];
}

export type GetForumsTotalSize = {
  totalRecords: number;
};

export function getForumsTotalSize(filter: string | null): [string, [string]] {
  return [
    `
      select count(*) as totalRecords
      from forums
      where lower(forums.name) like $1
    `,
    [filter || ''],
  ];
}

export type ForumUpsertProcedureOutputRow = {
  p_forum_id: string;
  p_error_type: ErrorType;
};

export function callForumUpsertProcedure({
  name,
  description,
  forum_id,
  token,
}: {
  name: string;
  forum_id: string | null;
  description: string | null;
  token: string;
}): [
  string,
  [string, string | null, string] | [string, string | null, string, string],
] {
  if (forum_id) {
    return [
      `
        call forum_upsert($1, $2, $3, $4, null);
      `,
      [name, description, token, forum_id],
    ];
  } else {
    return [
      `
        call forum_upsert($1, $2, $3, null, null);
      `,
      [name, description, token],
    ];
  }
}

export type ForumDeleteProcedureOutputRow = {
  p_forum_id: string;
  p_error_type: ErrorType;
};

export function callForumDeleteProcedure({
  id,
  token,
}: {
  id: number;
  token: string;
}): [string, [string, number]] {
  return [
    `
      call forum_delete($1, $2, null);
    `,
    [token, id],
  ];
}

export type GetForumVoteObjectById = {
  words_vote_id: number;
  word_id: number;
  user_id: number;
  vote: boolean;
  last_updated_at: string;
};
