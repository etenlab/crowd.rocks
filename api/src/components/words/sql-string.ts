import { ErrorType } from 'src/common/types';

export type GetWordObjectById = {
  word_id: string;
  word: string;
  language_code: string;
  dialect_code: string | null;
  geo_code: string | null;
  created_at: string;
  user_id: string;
  is_bot: boolean;
  avatar: string;
  avatar_url: string | null;
};

export function getWordObjByIds(ids: number[]): [string, [number[]]] {
  return [
    `
    select 
      words.word_id as word_id,
      wordlike_string as word,
      language_code,
      dialect_code, 
      geo_code,
      words.created_at,
      words.created_by as user_id,
      u.is_bot,
      a.avatar,
      a.url as avatar_url
    from words
    inner join wordlike_strings
      on wordlike_strings.wordlike_string_id = words.wordlike_string_id
    join users u
      on u.user_id = words.created_by
    join avatars a
      on u.user_id = a.user_id
    where words.word_id = any($1)
    `,
    [ids],
  ];
}

export type WordUpsertProcedureOutputRow = {
  p_word_id: string;
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
  dialect_code: string | null;
  geo_code: string | null;
  token: string;
}): [string, [string, string, string | null, string | null, string]] {
  return [
    `
      call word_upsert($1::text, $2::text, $3::text, $4::text, $5::text, 0, '');
    `,
    [wordlike_string, language_code, dialect_code, geo_code, token],
  ];
}

export type WordUpsertsProcedureOutput = {
  p_word_ids: string[];
  p_error_types: ErrorType[];
  p_error_type: ErrorType;
};

export function callWordUpsertsProcedure({
  wordlike_strings,
  language_codes,
  dialect_codes,
  geo_codes,
  token,
}: {
  wordlike_strings: string[];
  language_codes: string[];
  dialect_codes: (string | null)[];
  geo_codes: (string | null)[];
  token: string;
}): [
  string,
  [string[], string[], (string | null)[], (string | null)[], string],
] {
  return [
    `
      call batch_word_upsert($1::text[], $2::text[], $3::text[], $4::text[], $5, null, null, '');
    `,
    [wordlike_strings, language_codes, dialect_codes, geo_codes, token],
  ];
}

export type WordlikeStringUpsertsProcedureOutput = {
  p_wordlike_string_ids: string[];
  p_error_types: ErrorType[];
  p_error_type: ErrorType;
};

export function callWordlikeStringUpsertsProcedure({
  wordlike_strings,
  token,
}: {
  wordlike_strings: string[];
  token: string;
}): [string, [string[], string]] {
  return [
    `
      call batch_wordlike_string_upsert($1::text[], $2, null, null, '');
    `,
    [wordlike_strings, token],
  ];
}

export type GetWordlikeStringsObjectByIds = {
  wordlike_string_id: string;
  wordlike_string: string;
};

export function getWordlikeStringsObjByIds(
  ids: number[],
): [string, [number[]]] {
  return [
    `
      select 
        wordlike_string_id,
        wordlike_string
      from wordlike_strings
      where wordlike_string_id = any($1)
    `,
    [ids],
  ];
}

export type GetWordVoteObjectById = {
  words_vote_id: string;
  word_id: string;
  user_id: string;
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
  p_words_vote_id: string;
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
  word_id: string;
  upvotes: number;
  downvotes: number;
};

export function getWordVoteStatusFromWordIds(
  wordIds: number[],
): [string, [number[]]] {
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
        v.word_id = any($1)
      group BY 
        v.word_id 
      order by 
        count(
          case when v.vote = true then 1 when v.vote = false then 0 else null end
        ) desc;
    `,
    [wordIds],
  ];
}

export type ToggleWordVoteStatus = {
  p_words_vote_id: string;
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

export type GetWordObjectByDefinitionId = {
  word_id: string;
  word: string;
  definition: string;
  definition_id: string;
  language_code: string;
  dialect_code: string | null;
  geo_code: string | null;
  created_at: string;
  user_id: string;
  is_bot: boolean;
  avatar: string;
  avatar_url: string | null;
};

export function getWordByDefinitionIdSql(id: number): [string, [number]] {
  return [
    `
    select
      w.word_id ,
      ws.wordlike_string as word,
      w.language_code ,
      w.dialect_code,
      w.geo_code,
      wd.word_definition_id,
      wd.definition,
      w.created_at,
      w.created_by as user_id,
      u.is_bot,
      a.avatar,
      a.url as avatar_url
    from
      words w
    left join word_definitions wd on
      w.word_id = wd.word_id
    left join wordlike_strings ws on
      w.wordlike_string_id = ws.wordlike_string_id
    join users u
      on u.user_id = w.created_by
    join avatars a
      on u.user_id = a.user_id
    where
      wd.word_definition_id = $1
    `,
    [id],
  ];
}
