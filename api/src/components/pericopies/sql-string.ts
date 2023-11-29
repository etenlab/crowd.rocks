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

export type PericopeDeleteProcedureOutput = {
  p_error_type: ErrorType;
};

export function callPericopeDeleteProcedure({
  pericope_id,
  token,
}: {
  pericope_id: number;
  token: string;
}): [string, [number, string]] {
  return [
    `
      call pericope_delete($1, $2, '');
    `,
    [pericope_id, token],
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

export type GetPericopiesObjByDocumentId = {
  pericope_id: string;
  start_word: string;
  page: string;
};

export function getPericopiesObjByDocumentId(
  document_id: number,
  first: number | null,
  page: number,
): [string, number[]] {
  const returnArr: number[] = [document_id];
  let limitStr = '';
  let cursorStr = '';

  if (page) {
    returnArr.push(page);
    cursorStr = `and document_word_entries.page > $${returnArr.length}`;
  }

  if (first) {
    returnArr.push(page + first + 1);
    limitStr = `and document_word_entries.page < $${returnArr.length}`;
  }

  return [
    `
      select
        pericope_id,
        start_word,
        dwes.page
      from pericopies
      join (
        select 
          document_word_entries.document_word_entry_id,
          document_word_entries.page
        from document_word_entries
        where document_word_entries.document_id = $1
          ${cursorStr}
          ${limitStr}
      ) as dwes
      on pericopies.start_word = dwes.document_word_entry_id;
    `,
    [...returnArr],
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

export type PericopeWithVotesSqlR = {
  cursor: string;
  pericope_id: string;
  start_word: string;
  upvotes: number;
  downvotes: number;
};
export function getPericopiesWithVotesByDocumentIdSql({
  documentId,
  after,
  first,
}: {
  documentId: string;
  after: string | null;
  first: number | null;
}): [string, [string, string?, number?]] {
  const params: [string, string?, number?] = [documentId];
  let afterClause = '';
  let firstClause = '';
  if (after) {
    params.push(after);
    afterClause += ` and p.pericope_id >= $${params.length}`;
  }
  if (first) {
    params.push(first);
    firstClause += ` limit $${params.length}`;
  }
  return [
    ` 
      with votes as (
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
            group BY 
              v.pericope_id 
      )
      select 
        p.pericope_id as cursor, 
        p.pericope_id as pericope_id, 
        p.start_word, 
        votes.upvotes, 
        votes.downvotes 
      from pericopies p
      left join votes on p.pericope_id = votes.pericope_id
      join document_word_entries dwe on p.start_word = dwe.document_word_entry_id  
      join  documents d ON d.document_id =dwe.document_id
      where d.document_id = $1
      ${afterClause}
      order by p.pericope_id
      ${firstClause}
    `,
    params,
  ];
}

export type DocumentWordSqlR = {
  document_word_entry_id: string;
  wordlike_string: string;
};
export function getWordsTillNextPericopeSql({
  documentId,
  start_word_id,
}: {
  documentId: string;
  start_word_id: string;
}): [string, [string, string]] {
  const params: [string, string] = [documentId, start_word_id];

  return [
    ` 
      WITH RECURSIVE DWE_CTE AS (
        SELECT
          document_word_entry_id,
          document_id,
          wordlike_string_id,
          parent_document_word_entry_id,
          null :: bigint as pericope_id,
          1 AS level
        FROM public.document_word_entries
        WHERE document_id=$1
        and document_word_entry_id = $2
      --
        UNION
        SELECT
          dwe.document_word_entry_id,
          dwe.document_id,
          dwe.wordlike_string_id,
          dwe.parent_document_word_entry_id,
          p.pericope_id as pericope_id,
          DWE_CTE.level +1 as level
        FROM public.document_word_entries dwe
        left join pericopies p on document_word_entry_id = p.start_word
        JOIN DWE_CTE ON DWE_CTE.document_word_entry_id = dwe.parent_document_word_entry_id
        where dwe.document_id=$1
        and p.pericope_id is null
      )
      SELECT DWE_CTE.document_word_entry_id, ws.wordlike_string, DWE_CTE.document_id, level, pericope_id
      FROM DWE_CTE
      join wordlike_strings ws on DWE_CTE.wordlike_string_id = ws.wordlike_string_id
      order by level
    `,
    params,
  ];
}
