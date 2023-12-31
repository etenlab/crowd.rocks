import { ErrorType } from 'src/common/types';

export type GetPhraseObjByIdResultRow = {
  phrase_id: string;
  phrase: string;
  language_code: string;
  dialect_code: string | null;
  geo_code: string | null;
  created_at: string;
  user_id: string;
  is_bot: boolean;
  avatar: string;
  avatar_url: string | null;
};

export function getPhraseObjByIds(ids: number[]): [string, [number[]]] {
  return [
    `
    select 
      phrases.phrase_id as phrase_id,
      phrases.phraselike_string as phrase,
      words.language_code as language_code,
      words.dialect_code as dialect_code,
      words.geo_code as geo_code,
      phrases.created_at,
      phrases.created_by as user_id,
      u.is_bot,
      a.avatar,
      a.url as avatar_url
    from phrases
    join words
      on words.word_id = any(phrases.words)
    join users u
      on u.user_id = phrases.created_by
    join avatars a
      on u.user_id = a.user_id
    where phrases.phrase_id = any($1)
    `,
    [ids],
  ];
}

export type PhraseUpsertProcedureOutputRow = {
  p_phrase_id: string;
  p_error_type: ErrorType;
};

export function callPhraseUpsertProcedure({
  phraselike_string,
  wordIds,
  token,
}: {
  phraselike_string: string;
  wordIds: (number | null)[];
  token: string;
}): [string, [string, (number | null)[], string]] {
  return [
    `
      call phrase_upsert($1, $2, $3, 0, '');
    `,
    [phraselike_string, wordIds, token],
  ];
}

export type PhraseUpsertsProcedureOutput = {
  p_phrase_ids: string[];
  p_error_types: ErrorType[];
  p_error_type: ErrorType;
};

export function callPhraseUpsertsProcedure({
  phraselike_strings,
  wordIds_list,
  token,
}: {
  phraselike_strings: string[];
  wordIds_list: number[][];
  token: string;
}): [string, [string[], string[], string]] {
  return [
    `
      call batch_phrase_upsert($1::text[], $2::jsonb[], $3, null, null, '');
    `,
    [
      phraselike_strings,
      wordIds_list.map((wordIds) =>
        JSON.stringify(
          wordIds.map((id) => ({
            id,
          })),
        ),
      ),
      token,
    ],
  ];
}

export type GetPhraseVoteObjectById = {
  phrase_vote_id: string;
  phrase_id: string;
  user_id: string;
  vote: boolean;
  last_updated_at: string;
};

export function getPhraseVoteObjById(id: number): [string, [number]] {
  return [
    `
      select 
        phrase_vote_id,
        phrase_id,
        user_id,
        vote,
        last_updated_at
      from phrase_votes
      where phrase_vote_id = $1
    `,
    [id],
  ];
}

export type PhraseVoteUpsertProcedureOutputRow = {
  p_phrase_vote_id: string;
  p_error_type: ErrorType;
};

export function callPhraseVoteUpsertProcedure({
  phrase_id,
  vote,
  token,
}: {
  phrase_id: number;
  vote: boolean;
  token: string;
}): [string, [number, boolean, string]] {
  return [
    `
      call phrase_vote_upsert($1, $2, $3, 0, '');
    `,
    [phrase_id, vote, token],
  ];
}

export type GetPhraseVoteStatus = {
  phrase_id: string;
  upvotes: number;
  downvotes: number;
};

export function getPhraseVoteStatusFromPhraseIds(
  phraseIds: number[],
): [string, [number[]]] {
  return [
    `
      select 
        v.phrase_id as phrase_id, 
        count(
          case when v.vote = true then 1 else null end
        ) as upvotes, 
        count(
          case when v.vote = false then 1 else null end
        ) as downvotes 
      from 
        phrase_votes AS v 
      where 
        v.phrase_id = any($1)
      group BY 
        v.phrase_id 
      order by 
        count(
          case when v.vote = true then 1 when v.vote = false then 0 else null end
        ) desc;
    `,
    [phraseIds],
  ];
}

export type TogglePhraseVoteStatus = {
  p_phrase_vote_id: string;
  p_error_type: ErrorType;
};

export function togglePhraseVoteStatus({
  phrase_id,
  vote,
  token,
}: {
  phrase_id: number;
  vote: boolean;
  token: string;
}): [string, [number, boolean, string]] {
  return [
    `
      call phrase_vote_toggle($1, $2, $3, 0, '');
    `,
    [phrase_id, vote, token],
  ];
}

export type GetPhraseListByLang = {
  phrase_id: string;
  phraselike_string: string;
};

export function getPhraseListByLang({
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
      and p.phraselike_string like $${returnArr.length + 1}
    `;
    returnArr = [...returnArr, `%${filter.trim()}%`];
  }

  return [
    `
      select distinct 
        p.phrase_id as phrase_id,
        p.phraselike_string as phraselike_string
      from phrases as p
      join words as w
      on w.word_id = any(p.words)
      where w.language_code = $1
        ${wherePlsStr}
      order by p.phraselike_string;
    `,
    [...returnArr],
  ];
}

export type GetPhraseObjectByDefinitionId = {
  phrase_id: string;
  phrase: string;
  language_code: string;
  dialect_code: string | null;
  geo_code: string | null;
  definition: string;
  definition_id: string;
  created_at: string;
  user_id: string;
  is_bot: boolean;
  avatar: string;
  avatar_url: string | null;
};

export function getPhraseByDefinitionIdSql(id: number): [string, [number]] {
  return [
    `
  select
    p.words,
    p.phrase_id ,
    p.phraselike_string as phrase,
    w.language_code ,
    w.dialect_code,
    w.geo_code,
    phd.phrase_definition_id,
    phd.definition,
    p.created_at,
    p.created_by as user_id,
    u.is_bot,
    a.avatar,
    a.url as avatar_url
  from
    phrases p
  left join phrase_definitions phd on
    p.phrase_id = phd.phrase_id
  left join words w on 
    w.word_id = p.words[1]
  join users u
    on u.user_id = p.created_by
  join avatars a
    on u.user_id = a.user_id
  where
    phd.phrase_definition_id = $1
    `,
    [id],
  ];
}
