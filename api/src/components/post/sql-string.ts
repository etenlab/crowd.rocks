import { ErrorType } from 'src/common/types';

export type PostDeletesProcedureOutput = {
  p_post_ids: string[];
  p_error_types: ErrorType[];
  p_error_type: ErrorType;
};

export function callPostDeletesProcedure({
  token,
  post_ids,
}: {
  post_ids: number[];
  token: string;
}): [string, [string, number[]]] {
  return [
    `
      call batch_post_delete($1, $2::bigint[], null, '');
    `,
    [token, post_ids],
  ];
}

export type GetPostById = {
  post_id: string;
  parent_table: string;
  parent_id: string;
};

export function getPostsFromRefsQuery(
  refs: {
    parent_table: string;
    parent_id: string;
  }[],
): [string, [string[], number[]]] {
  return [
    `
      with pairs (parent_table, parent_id) as (
        select unnest($1::text[]), unnest($2::int[])
      )
      select
        post_id,
        parent_table,
        parent_id
      from posts
      where (parent_table, parent_id) in (
        select parent_table, parent_id
        from pairs
      );
    `,
    [refs.map((ref) => ref.parent_table), refs.map((ref) => +ref.parent_id)],
  ];
}
