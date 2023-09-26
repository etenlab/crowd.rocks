import { ErrorType } from 'src/common/types';

export type GetDocumentWordEntryRow = {
  document_word_entry_id: string;
  document_id: string;
  wordlike_string_id: string;
  parent_wordlike_string_id: string;
};

export function getDocumentWordEntryByIds(ids: number[]): [string, [number[]]] {
  return [
    `
      select 
        document_word_entry_id,
        document_id,
        wordlike_string_id,
        parent_wordlike_string_id
      from document_word_entries
      where document_word_entry_id = any($1)
    `,
    [ids],
  ];
}

export function getDocumentWordEntryByDocumentId(
  id: number,
): [string, [number]] {
  return [
    `
      select 
        document_word_entry_id,
        document_id,
        wordlike_string_id,
        parent_wordlike_string_id
      from document_word_entries
      where document_id = $1
    `,
    [id],
  ];
}

export type DocumentWordEntryUpsertsProcedureOutputRow = {
  p_document_word_entry_ids: string[];
  p_error_types: ErrorType[];
  p_error_type: ErrorType;
};

export function callDocumentWordEntryUpsertsProcedure({
  document_ids,
  wordlike_string_ids,
  parent_wordlike_string_ids,
  token,
}: {
  document_ids: number[];
  wordlike_string_ids: number[];
  parent_wordlike_string_ids: number[];
  token: string;
}): [string, [number[], number[], number[], string]] {
  return [
    `
      call batch_document_word_entry_upsert($1::bigint[], $2::bigint[], $3::bigint[], $4, null, null, '');
    `,
    [document_ids, wordlike_string_ids, parent_wordlike_string_ids, token],
  ];
}
