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

export type GetForums = {
  forum_id: string;
  name: string;
  description: string | null;
  created_by: string;
  total_topics: number;
  total_threads: number;
  total_posts: number;
};

export function getForums({
  filter,
  first,
  after,
}: {
  filter: string | null;
  first: number | null;
  after: string | null;
}): [string, unknown[]] {
  const returnArr: unknown[] = [`%${filter || ''}%`];
  let limitStr = '';
  let cursorStr = '';

  if (after) {
    returnArr.push(after);
    cursorStr = `and lower(forums.name) > $${returnArr.length}`;
  }

  if (first) {
    returnArr.push(first);
    limitStr = `limit $${returnArr.length}`;
  }

  return [
    `
      select 
        forums.forum_id,
        forums.name,
        forums.description,
        coalesce(count(forum_folders_v2.forum_folder_id), 0) as total_topics,
        coalesce(sum(forum_folders_v2.total_threads), 0) as total_threads,
        coalesce(sum(forum_folders_v2.total_posts), 0) as total_posts,
        forums.created_by
      from forums
      left join (
        select
          forum_folders.forum_folder_id,
          forum_folders.forum_id,
          coalesce(count(threads_v2.thread_id), 0) as total_threads,
          coalesce(sum(threads_v2.post_count), 0) as total_posts
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
        group by forum_folders.forum_folder_id
      ) as forum_folders_v2
      on forums.forum_id = forum_folders_v2.forum_id
      where lower(forums.name) like $1
      ${cursorStr}
      group by forums.forum_id
      order by lower(forums.name)
      ${limitStr}
    `,
    [...returnArr],
  ];
}

export type GetForumsTotalSize = {
  total_records: number;
};

export function getForumsTotalSize(filter: string | null): [string, [string]] {
  return [
    `
      select count(*) as total_records
      from forums
      where lower(forums.name) like $1
    `,
    [`%${filter || ''}%`],
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
