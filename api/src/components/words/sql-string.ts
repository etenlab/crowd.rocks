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
}): [string, [string, string, string | null, string | null, string]] {
  return [
    `
      call word_upsert($1, $2, $3, $4, $5, 0, '');
    `,
    [wordlike_string, language_code, dialect_code, geo_code, token],
  ];
}

export type GetWordVoteObjectById = {
  words_vote_id: number;
  word_id: number;
  user_id: number;
  vote: boolean;
  last_updated_at: string;
};

export function getWordVoteObjById(id: number): [string, [number]] {
  return [
    `
      select 
        words_vote_id,
        word_id,
        user_id,
        vote,
        last_updated_at
      from words_votes
      where words_vote_id = $1
    `,
    [id],
  ];
}

export type WordVoteUpsertProcedureOutputRow = {
  p_words_vote_id: number;
  p_error_type: ErrorType;
};

export function callWordVoteUpsertProcedure({
  word_id,
  vote,
  token,
}: {
  word_id: number;
  vote: boolean;
  token: string;
}): [string, [number, boolean, string]] {
  return [
    `
      call word_vote_upsert($1, $2, $3, 0, '');
    `,
    [word_id, vote, token],
  ];
}

export type GetWordVoteStatus = {
  word_id: number;
  upvotes: number;
  downvotes: number;
};

export function getWordVoteStatus(word_id: number): [string, [number]] {
  return [
    `
      select 
        v.word_id as word_id, 
        count(
          case when v.vote = true then 1 else null end
        ) as upvotes, 
        count(
          case when v.vote = false then 1 else null end
        ) as downvotes 
      from 
        words_votes AS v 
      where 
        v.word_id = $1
      group BY 
        v.word_id 
      order by 
        count(
          case when v.vote = true then 1 when v.vote = false then 0 else null end
        ) desc;
    `,
    [word_id],
  ];
}

export type ToggleWordVoteStatus = {
  p_words_vote_id: number;
  p_error_type: ErrorType;
};

export function toggleWordVoteStatus({
  word_id,
  vote,
  token,
}: {
  word_id: number;
  vote: boolean;
  token: string;
}): [string, [number, boolean, string]] {
  return [
    `
      call word_vote_toggle($1, $2, $3, 0, '');
    `,
    [word_id, vote, token],
  ];
}

export type GetWordListByLang = {
  word_id: string;
  wordlike_string: string;
};

export function getWordListByLang({
  language_code,
  dialect_code,
  geo_code,
  filter,
}: {
  language_code: string;
  dialect_code: string | null;
  geo_code: string | null;
  filter?: string | null;
}): [
  string,
  (
    | [string, string, string, string]
    | [string, string, string]
    | [string, string]
    | [string]
  ),
] {
  let wherePlsStr = '';
  let returnArr:
    | [string, string, string, string]
    | [string, string, string]
    | [string, string]
    | [string] = [language_code];

  if (dialect_code && geo_code) {
    wherePlsStr = `
      and w.dialect_code = $2
      and w.geo_code = $3
    `;
    returnArr = [...returnArr, dialect_code, geo_code];
  } else if (dialect_code && !geo_code) {
    wherePlsStr = `
      and w.dialect_code = $2
    `;
    returnArr = [...returnArr, dialect_code];
  } else if (!dialect_code && geo_code) {
    wherePlsStr = `
      and w.geo_code = $2
    `;
    returnArr = [...returnArr, geo_code];
  } else if (!dialect_code && !geo_code) {
    wherePlsStr = ``;
    returnArr = [...returnArr];
  }

  if (filter && filter.trim().length > 0) {
    wherePlsStr = `
      ${wherePlsStr}
      and ws.wordlike_string like $${returnArr.length + 1}
    `;
    returnArr = [...returnArr, `%${filter.trim()}%`];
  }

  return [
    `
      select distinct
        w.word_id as word_id,
        ws.wordlike_string as wordlike_string
      from words as w
      join wordlike_strings as ws
      on ws.wordlike_string_id = w.wordlike_string_id
      where w.language_code = $1
        ${wherePlsStr}
      order by ws.wordlike_string;
    `,
    [...returnArr],
  ];
}
