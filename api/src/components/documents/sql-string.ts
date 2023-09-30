import { ErrorType } from 'src/common/types';

export type GetDocumentWordEntryRow = {
  document_word_entry_id: string;
  document_id: string;
  wordlike_string_id: string;
  parent_document_word_entry_id: string;
};

export function getDocumentWordEntryByIds(ids: number[]): [string, [number[]]] {
  return [
    `
      select 
        document_word_entry_id,
        document_id,
        wordlike_string_id,
        parent_document_word_entry_id
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
        parent_document_word_entry_id
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
  parent_document_word_entry_ids,
  isSequentialUpsert,
  token,
}: {
  document_ids: number[];
  wordlike_string_ids: number[];
  parent_document_word_entry_ids: (number | null)[];
  isSequentialUpsert: boolean;
  token: string;
}): [string, [number[], number[], (number | null)[], boolean, string]] {
  return [
    `
      call batch_document_word_entry_upsert($1::bigint[], $2::bigint[], $3::bigint[], $4, $5, null, null, '');
    `,
    [
      document_ids,
      wordlike_string_ids,
      parent_document_word_entry_ids,
      isSequentialUpsert,
      token,
    ],
  ];
}

export type GetWordRangeRow = {
  word_range_id: string;
  begin_word: string;
  end_word: string;
};

export function getWordRangeByIds(ids: number[]): [string, [number[]]] {
  return [
    `
      select 
        word_range_id,
        begin_word,
        end_word
      from word_ranges
      where word_range_id = any($1)
    `,
    [ids],
  ];
}

export function getWordRangeByBeginWordIds(
  ids: number[],
): [string, [number[]]] {
  return [
    `
      select distinct 
        word_range_id,
        begin_word,
        end_word
      from word_ranges
      where begin_word = any($1);
    `,
    [ids],
  ];
}

export function getWordRangeByDocumentId(id: number): [string, [number]] {
  return [
    `
      select distinct 
        word_range_id,
        begin_word,
        end_word
      from word_ranges
      join (
        select
          document_word_entry_id
        from document_word_entries
        where document_id = $1
      ) dwes
      on word_ranges.begin_word = dwes.document_word_entry_id;
    `,
    [id],
  ];
}

export type WordRangeUpsertsProcedureOutputRow = {
  p_word_range_ids: string[];
  p_error_types: ErrorType[];
  p_error_type: ErrorType;
};

export function callWordRangeUpsertsProcedure({
  begin_words,
  end_words,
  token,
}: {
  begin_words: number[];
  end_words: number[];
  token: string;
}): [string, [number[], number[], string]] {
  return [
    `
      call batch_word_range_upsert($1::bigint[], $2::bigint[], $3, null, null, '');
    `,
    [begin_words, end_words, token],
  ];
}
