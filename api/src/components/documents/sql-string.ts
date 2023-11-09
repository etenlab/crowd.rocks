import { ErrorType } from 'src/common/types';
import { TextyDocumentInput } from './types';
import { LanguageInput } from '../common/types';

export type GetDocumentById = {
  document_id: string;
  file_id: string;
  file_name: string;
  file_url: string;
  language_code: string;
  dialect_code: string | null;
  geo_code: string | null;
};

export function getDocumentById(document_id: number): [string, [number]] {
  return [
    `
      select
        d.document_id,
        d.language_code,
        d.dialect_code,
        d.geo_code,
        d.file_id,
        f.file_name,
        f.file_url
      from
        documents d
      left join files f on
        d.file_id  = f.file_id
      where d.document_id = $1
      limit 1;
    `,
    [document_id],
  ];
}

export function getAllDocuments({
  lang,
  first,
  after,
}: {
  lang: LanguageInput | null;
  after: string | null;
  first: number | null;
}): [string, unknown[]] {
  const params: unknown[] = [];
  let languageClause = '';
  let limitStr = '';
  let cursorStr = '';
  let filterStr = '';

  if (lang?.language_code) {
    params.push(lang?.language_code);
    languageClause += ` and language_code = $${params.length}`;
  }

  if (lang?.dialect_code) {
    params.push(lang?.dialect_code);
    languageClause += ` and dialect_code = $${params.length}`;
  }

  if (lang?.geo_code) {
    params.push(lang?.geo_code);
    languageClause += ` and geo_code = $${params.length}`;
  }

  if (lang?.filter) {
    params.push(`%${lang?.filter || ''}%`);
    filterStr = ` and lower(f.file_name) like $${params.length}`;
  }

  if (after) {
    params.push(after);
    cursorStr = ` and lower(f.file_name) > $${params.length}`;
  }

  if (first) {
    params.push(first);
    limitStr = `limit $${params.length}`;
  }

  return [
    `
      select
        d.document_id,
        d.language_code,
        d.dialect_code,
        d.geo_code,
        d.file_id,
        f.file_name,
        f.file_url
      from
        documents d
      left join files f on
        d.file_id  = f.file_id
      where true
      ${languageClause}
      ${filterStr}
      ${cursorStr}
      order by lower(f.file_name)
      ${limitStr}
    `,
    [...params],
  ];
}

export type GetDocumentsTotalSize = {
  total_records: number;
};

export function getDocumentsTotalSize({
  lang,
}: {
  lang: LanguageInput | null;
}): [string, unknown[]] {
  const params: unknown[] = [];
  let languageClause = '';
  let filterStr = '';

  if (lang?.language_code) {
    params.push(lang?.language_code);
    languageClause += ` and language_code = $${params.length}`;
  }

  if (lang?.dialect_code) {
    params.push(lang?.dialect_code);
    languageClause += ` and dialect_code = $${params.length}`;
  }

  if (lang?.geo_code) {
    params.push(lang?.geo_code);
    languageClause += ` and geo_code = $${params.length}`;
  }

  if (lang?.filter) {
    params.push(`%${lang?.filter || ''}%`);
    filterStr = ` and lower(f.file_name) like $${params.length}`;
  }

  return [
    `
      select
        d.document_id,
        d.language_code,
        d.dialect_code,
        d.geo_code,
        d.file_id,
        f.file_name,
        f.file_url
      from
        documents d
      left join files f on
        d.file_id  = f.file_id
      where true
      ${languageClause}
      ${filterStr}
    `,
    [...params],
  ];
}

export type GetDocumentWordEntryRow = {
  document_word_entry_id: string;
  document_id: string;
  wordlike_string_id: string;
  parent_document_word_entry_id: string;
  page: number;
};

export function getDocumentWordEntryByIds(ids: number[]): [string, [number[]]] {
  return [
    `
      select 
        document_word_entry_id,
        document_id,
        wordlike_string_id,
        parent_document_word_entry_id
        page
      from document_word_entries
      where document_word_entry_id = any($1)
    `,
    [ids],
  ];
}

export type GetDocumentWordEntriesTotalPageSize = {
  total_pages: number;
};

export function getDocumentWordEntriesTotalPageSize(
  document_id: number,
): [string, [number]] {
  return [
    `
      select 
        count(distinct page) as total_pages
      from document_word_entries
      where document_id = $1;
    `,
    [document_id],
  ];
}

export function getDocumentWordEntryByDocumentId(
  document_id: number,
  first: number | null,
  page: number,
): [string, unknown[]] {
  const returnArr: unknown[] = [];
  let limitStr = '';
  let cursorStr = '';

  if (page) {
    returnArr.push(page);
    cursorStr = `and page > $${returnArr.length}`;
  }

  if (first) {
    returnArr.push(page + first + 1);
    limitStr = `and page < $${returnArr.length}`;
  }

  return [
    `
      select 
        document_word_entry_id,
        document_id,
        wordlike_string_id,
        parent_document_word_entry_id,
        page
      from document_word_entries
      where document_id = $1
        ${cursorStr}
        ${limitStr}
      order by page;
    `,
    [document_id, page],
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
  pages,
  isSequentialUpsert,
  token,
}: {
  document_ids: number[];
  wordlike_string_ids: number[];
  parent_document_word_entry_ids: (number | null)[];
  pages: number[];
  isSequentialUpsert: boolean;
  token: string;
}): [
  string,
  [number[], number[], (number | null)[], number[], boolean, string],
] {
  return [
    `
      call batch_document_word_entry_upsert($1::bigint[], $2::bigint[], $3::bigint[], $4::bigint[], $5, $6, null, null, '');
    `,
    [
      document_ids,
      wordlike_string_ids,
      parent_document_word_entry_ids,
      pages,
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
      call batch_word_range_upsert($1::bigint[], $2::bigint[], $3::text, null, null, '');
    `,
    [begin_words, end_words, token],
  ];
}

export type CreateDocumentProcedureOutputRow = {
  p_document_id: string;
  p_error_type: ErrorType;
};

export function callCreateDocumentProcedure(
  { file_id, language_code, dialect_code, geo_code }: TextyDocumentInput,
  token: string,
): [string, [string, string, string, string | null, string | null]] {
  return [
    `
      call document_create($1, $2, $3, $4, $5, null, null, null, null);
    `,
    [file_id, token, language_code, dialect_code, geo_code],
  ];
}
