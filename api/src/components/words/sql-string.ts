import { ErrorType } from 'src/common/types';

export type GetWordObjectById = {
  word: string;
  language_code: string;
  dialect_code?: string;
  geo_code?: string;
};

export function getWordObjById(id: number): [string, [number]] {
  return [
    `
      select 
        wordlike_string as word,
        language_code,
        dialect_code, 
        geo_code
      from words
      inner join wordlike_strings
        on wordlike_strings.wordlike_string_id = words.wordlike_string_id
      where words.word_id = $1
    `,
    [id],
  ];
}

export type WordUpsertProcedureOutputRow = {
  p_word_id: number;
  p_error_type: ErrorType;
};

export function callWordUpsertProcedure({
  wordlike_string,
  language_code,
  dialect_code,
  geo_code,
  token,
}: {
  wordlike_string: string;
  language_code: string;
  dialect_code?: string;
  geo_code?: string;
  token: string;
}): [string, [string, string, string | null, string | null, string | null]] {
  return [
    `
      call word_upsert($1, $2, $3, $4, $5, 0, '');
    `,
    [wordlike_string, language_code, dialect_code, geo_code, token],
  ];
}
