import { ErrorType } from 'src/common/types';

export type GetPhraseObjByIdResultRow = {
  phrase_id: string;
  phrase: string;
  language_code: string;
  dialect_code: string | null;
  geo_code: string | null;
};

export function getPhraseObjByIds(ids: number[]): [string, [number[]]] {
  return [
    `
      select 
        phrases.phrase_id as phrase_id,
        phrases.phraselike_string as phrase,
        words.language_code as language_code,
        words.dialect_code as dialect_code,
        words.geo_code as geo_code
      from phrases
      join words
      on words.word_id = any(phrases.words)
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
  wordIds: number[];
  token: string;
}): [string, [string, number[], string]] {
  return [
    `
      call phrase_upsert($1, $2, $3, 0, '');
    `,
    [phraselike_string, wordIds, token],
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
