import { ErrorType } from 'src/common/types';

export type PericopeUpsertsProcedureOutput = {
  p_pericope_ids: string[];
  p_error_types: ErrorType[];
  p_error_type: ErrorType;
};

export function callPericopeUpsertsProcedure({
  start_words,
  token,
}: {
  start_words: number[];
  token: string;
}): [string, [number[], string]] {
  return [
    `
      call batch_pericope_upsert($1::bigint[], $2, null, null, '');
    `,
    [start_words, token],
  ];
}

export type GetPericopiesObjectRow = {
  pericope_id: string;
  start_word: string;
};

export function getPericopiesObjByIds({
  ids,
}: {
  ids: number[];
}): [string, [number[]]] {
  return [
    `
      select
        pericope_id,
        start_word
      from pericopies
      where pericope_id = any($1);
    `,
    [ids],
  ];
}

export function getPericopiesObjByDocumentId(
  document_id: number,
  page: number | null,
): [string, number[]] {
  const params: number[] = [document_id];
  let pageConstraints = ``;

  if (page) {
    params.push(page);
    pageConstraints = `and document_word_entries.page = $2`;
  }

  return [
    `
      select
        pericope_id,
        start_word
      from pericopies
      join (
        select 
          document_word_entry_id
        from document_word_entries
        where document_word_entries.document_id = $1
          ${pageConstraints}
      ) as dwes
      on pericopies.start_word = dwes.document_word_entry_id;
    `,
    [...params],
  ];
}

export type GetPericopeVoteStatus = {
  pericope_id: string;
  upvotes: number;
  downvotes: number;
};

export function getPericopeVoteStatusFromPericopeIds(
  pericopeIds: number[],
): [string, [number[]]] {
  return [
    `
      select 
        v.pericope_id as pericope_id, 
        count(
          case when v.vote = true then 1 else null end
        ) as upvotes, 
        count(
          case when v.vote = false then 1 else null end
        ) as downvotes 
      from 
        pericope_votes AS v 
      where 
        v.pericope_id = any($1)
      group BY 
        v.pericope_id 
      order by 
        count(
          case when v.vote = true then 1 when v.vote = false then 0 else null end
        ) desc;
    `,
    [pericopeIds],
  ];
}

export type TogglePericopeVoteStatus = {
  p_pericope_vote_id: string;
  p_error_type: ErrorType;
};

export function togglePericopeVoteStatus({
  pericope_id,
  vote,
  token,
}: {
  pericope_id: number;
  vote: boolean;
  token: string;
}): [string, [number, boolean, string]] {
  return [
    `
      call pericope_vote_toggle($1, $2, $3, 0, '');
    `,
    [pericope_id, vote, token],
  ];
}
