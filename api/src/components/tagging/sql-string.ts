import { ErrorType } from 'src/common/types';

export type WordRangeTagUpsertsProcedureOutput = {
  p_word_range_tag_ids: string[];
  p_error_types: ErrorType[];
  p_error_type: ErrorType;
};

export function callWordRangeTagUpsertsProcedure({
  word_range_ids,
  tag_names,
  token,
}: {
  word_range_ids;
  tag_names;
  token;
}): [string, [number[], string[], string]] {
  return [
    `
      call batch_word_range_tag_upsert($1::bigint[], $2::jsonb[], $3, null, null, '');
    `,
    [word_range_ids, tag_names.map((tag_name) => ({ tag_name })), token],
  ];
}

export type WordRangeTagRow = {
  word_range_tag_id: string;
  word_range_id: string;
  word_range_tag: string;
};

export function getWordRangeTagsByIds(ids: number[]): [string, [number[]]] {
  return [
    `
      select 
        word_range_tag_id,
        word_range_id,
        word_range_tag
      from word_range_tags
      where word_range_tag_id = any($1)
    `,
    [ids],
  ];
}

export function getWordRangeTagsByWordRangeIds(
  word_range_ids: number[],
): [string, [number[]]] {
  return [
    `
      select 
        word_range_tag_id,
        word_range_id,
        word_range_tag
      from word_range_tags
      where word_range_id = any($1)
    `,
    [word_range_ids],
  ];
}

export type GetWordRangeTagVoteStatus = {
  word_range_tag_id: string;
  upvotes: number;
  downvotes: number;
};

export function getWordRangeTagVoteStatusFromWordIds(
  word_range_tag_ids: number[],
): [string, [number[]]] {
  return [
    `
      select 
        v.word_range_tag_id as word_range_tag_id, 
        count(
          case when v.vote = true then 1 else null end
        ) as upvotes, 
        count(
          case when v.vote = false then 1 else null end
        ) as downvotes 
      from 
        word_range_tags_votes AS v 
      where 
        v.word_range_tag_id = any($1)
      group BY 
        v.word_range_tag_id 
      order by 
        count(
          case when v.vote = true then 1 when v.vote = false then 0 else null end
        ) desc;
    `,
    [word_range_tag_ids],
  ];
}

export type ToggleWordRangeTagVoteStatus = {
  p_word_range_tags_vote_id: string;
  p_error_type: ErrorType;
};

export function toggleWordRangeTagVoteStatus({
  word_range_tag_id,
  vote,
  token,
}: {
  word_range_tag_id: number;
  vote: boolean;
  token: string;
}): [string, [number, boolean, string]] {
  return [
    `
      call word_range_tag_vote_toggle($1, $2, $3, 0, '');
    `,
    [word_range_tag_id, vote, token],
  ];
}
