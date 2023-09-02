import { ErrorType } from 'src/common/types';

export type GetForumObjectById = {
  name: string;
};

export function getForumObjById(id: number): [string, [number]] {
  return [
    `
      select 
        name
      from forums
      where forums.forum_id = $1
    `,
    [id],
  ];
}

export function getForums() {
  `select 
      name, forum_id
    from forums
  `;
}

export type ForumUpsertProcedureOutputRow = {
  p_forum_id: number;
  p_error_type: ErrorType;
};

export function callForumUpsertProcedure({
  name,
  forum_id,
  token,
}: {
  name: string;
  forum_id?: number;
  token: string;
}): [string, [string, string] | [string, string, string]] {
  let returnArry: [string, string] | [string, string, string] = [name, token];
  if (forum_id) {
    returnArry = [...returnArry, forum_id + ''];
  }
  return [
    `
      call forum_upsert($1, $2, ${
        forum_id ? `$${returnArry.length}` : null
      },null);
    `,
    [...returnArry],
  ];
}

export type ForumDeleteProcedureOutputRow = {
  p_forum_id: number;
  p_error_type: ErrorType;
};

export function callForumDeleteProcedure({
  id,
  token,
}: {
  id: string;
  token: string;
}): [string, [string, string]] {
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
