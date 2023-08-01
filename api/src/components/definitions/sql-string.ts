import { ErrorType } from 'src/common/types';

export type GetWordDefinitionObjectById = {
  word_definition_id?: number;
  word_id: number;
  definition: string;
};

export function getWordDefinitionObjById(id: number): [string, [number]] {
  return [
    `
      select 
        word_definition_id,
        word_id,
        definition
      from word_definitions
      where word_definitions.word_definition_id = $1
    `,
    [id],
  ];
}

export type WordDefinitionUpsertProcedureOutputRow = {
  p_word_definition_id: number;
  p_error_type: ErrorType;
};

export function callWordDefinitionUpsertProcedure({
  word_id,
  definition,
  token,
}: {
  word_id: number;
  definition: string;
  token: string;
}): [string, [number, string, string | null]] {
  return [
    `
      call word_definition_upsert($1, $2, $3, 0, '');
    `,
    [word_id, definition, token],
  ];
}

export type GetPhraseDefinitionObjectById = {
  phrase_definition_id?: number;
  phrase_id: number;
  definition: string;
};

export function getPhraseDefinitionObjById(id: number): [string, [number]] {
  return [
    `
      select 
        phrase_definition_id,
        phrase_id,
        definition
      from phrase_definitions
      where phrase_definitions.phrase_definition_id = $1
    `,
    [id],
  ];
}

export type PhraseDefinitionUpsertProcedureOutputRow = {
  p_phrase_definition_id: number;
  p_error_type: ErrorType;
};

export function callPhraseDefinitionUpsertProcedure({
  phrase_id,
  definition,
  token,
}: {
  phrase_id: number;
  definition: string;
  token: string;
}): [string, [number, string, string]] {
  return [
    `
      call phrase_definition_upsert($1, $2, $3, 0, '');
    `,
    [phrase_id, definition, token],
  ];
}

export type WordDefinitionUpdateProcedureOutputRow = {
  p_error_type: ErrorType;
};

export function callWordDefinitionUpdateProcedure({
  word_definition_id,
  definition,
  token,
}: {
  word_definition_id: number;
  definition: string;
  token: string;
}): [string, [number, string, string]] {
  return [
    `
      call word_definition_update($1, $2, $3, '');
    `,
    [word_definition_id, definition, token],
  ];
}

export type PhraseDefinitionUpdateProcedureOutputRow = {
  p_error_type: ErrorType;
};

export function callPhraseDefinitionUpdateProcedure({
  phrase_definition_id,
  definition,
  token,
}: {
  phrase_definition_id: number;
  definition: string;
  token: string;
}): [string, [number, string, string]] {
  return [
    `
      call phrase_definition_update($1, $2, $3, '');
    `,
    [phrase_definition_id, definition, token],
  ];
}

export type GetWordDefinitionListByLang = {
  word_definition_id: number;
  created_at: string;
};

export function getWordDefinitionListByLang({
  language_code,
  dialect_code,
  geo_code,
}: {
  language_code: string;
  dialect_code?: string;
  geo_code?: string;
}): [string, [string] | [string, string] | [string, string, string]] {
  let wherePlsStr = '';
  let returnArr: [string, string, string] | [string, string] | [string] = [
    language_code,
  ];

  if (dialect_code && geo_code) {
    wherePlsStr = `
      and words.dialect_code = $2
      and words.geo_code = $3
    `;
    returnArr = [...returnArr, dialect_code, geo_code];
  } else if (dialect_code && !geo_code) {
    wherePlsStr = `
      and words.dialect_code = $2
    `;
    returnArr = [...returnArr, dialect_code];
  } else if (!dialect_code && geo_code) {
    wherePlsStr = `
      and words.geo_code = $2
    `;
    returnArr = [...returnArr, geo_code];
  } else if (!dialect_code && !geo_code) {
    wherePlsStr = ``;
    returnArr = [...returnArr];
  }

  return [
    `
      select 
        word_definitions.word_definition_id,
        word_definitions.created_at
      from word_definitions
      join (
        select words.word_id
        from words
        where words.language_code = $1
          ${wherePlsStr}
      ) as ws
      on ws.word_id = word_definitions.word_id
    `,
    returnArr,
  ];
}

export type GetWordDefinitionListByWordId = {
  word_definition_id: number;
  created_at: string;
};

export function getWordDefinitionListByWordId(
  word_id: number,
): [string, [number]] {
  return [
    `
      select 
        word_definition_id,
        created_at
      from word_definitions
      where word_id = $1
    `,
    [word_id],
  ];
}

export type GetPhraseDefinitionListByLang = {
  phrase_definition_id: number;
  created_at: string;
};

export function getPhraseDefinitionListByLang({
  language_code,
  dialect_code,
  geo_code,
}: {
  language_code: string;
  dialect_code?: string;
  geo_code?: string;
}): [string, [string] | [string, string] | [string, string, string]] {
  let wherePlsStr = '';
  let returnArr: [string, string, string] | [string, string] | [string] = [
    language_code,
  ];

  if (dialect_code && geo_code) {
    wherePlsStr = `
      and words.dialect_code = $2
      and words.geo_code = $3
    `;
    returnArr = [...returnArr, dialect_code, geo_code];
  } else if (dialect_code && !geo_code) {
    wherePlsStr = `
      and words.dialect_code = $2
    `;
    returnArr = [...returnArr, dialect_code];
  } else if (!dialect_code && geo_code) {
    wherePlsStr = `
      and words.geo_code = $2
    `;
    returnArr = [...returnArr, geo_code];
  } else if (!dialect_code && !geo_code) {
    wherePlsStr = ``;
    returnArr = [...returnArr];
  }

  return [
    `
      select 
        phrase_definitions.phrase_definition_id,
        phrase_definitions.created_at
      from phrase_definitions
      join (
        select phrases.phrase_id
        from phrases
        join words
        on words.word_id = any(phrases.words)
        where words.language_code = $2
          ${wherePlsStr}
      ) as ps
      on ps.phrase_id = phrase_definitions.phrase_id
    `,
    returnArr,
  ];
}

export type GetPhraseDefinitionListByPhraseId = {
  phrase_definition_id: number;
  created_at: string;
};

export function getPhraseDefinitionListByPhraseId(
  phrase_id: number,
): [string, [number]] {
  return [
    `
      select 
        phrase_definition_id,
        created_at
      from phrase_definitions
      where phrase_id = $1
    `,
    [phrase_id],
  ];
}

export type GetWordDefinitionVoteObjectById = {
  word_definitions_vote_id: number;
  word_definition_id: number;
  user_id: number;
  vote: boolean;
  last_updated_at: string;
};

export function getWordDefinitionVoteObjById(id: number): [string, [number]] {
  return [
    `
      select 
        word_definitions_vote_id,
        word_definition_id,
        user_id,
        vote,
        last_updated_at
      from word_definitions_votes
      where word_definitions_vote_id = $1
    `,
    [id],
  ];
}

export type WordDefinitionVoteUpsertProcedureOutputRow = {
  p_word_definitions_vote_id: number;
  p_error_type: ErrorType;
};

export function callWordDefinitionVoteUpsertProcedure({
  word_definition_id,
  vote,
  token,
}: {
  word_definition_id: number;
  vote: boolean;
  token: string;
}): [string, [number, boolean, string]] {
  return [
    `
      call word_definition_vote_upsert($1, $2, $3, 0, '');
    `,
    [word_definition_id, vote, token],
  ];
}

export type GetWordDefinitionVoteStatus = {
  word_definition_id: number;
  upvotes: number;
  downvotes: number;
};

export function getWordDefinitionVoteStatus(
  word_definition_id: number,
): [string, [number]] {
  return [
    `
      select 
        v.word_definition_id as word_definition_id, 
        count(
          case when v.vote = true then 1 else null end
        ) as upvotes, 
        count(
          case when v.vote = false then 1 else null end
        ) as downvotes 
      from 
        word_definitions_votes AS v 
      where 
        v.word_definition_id = $1
      group BY 
        v.word_definition_id 
      order by 
        count(
          case when v.vote = true then 1 when v.vote = false then 0 else null end
        ) desc;
    `,
    [word_definition_id],
  ];
}

export type ToggleWordDefinitionVoteStatus = {
  p_word_definitions_vote_id: number;
  p_error_type: ErrorType;
};

export function toggleWordDefinitionVoteStatus({
  word_definition_id,
  vote,
  token,
}: {
  word_definition_id: number;
  vote: boolean;
  token: string;
}): [string, [number, boolean, string]] {
  return [
    `
      call word_definition_vote_toggle($1, $2, $3, 0, '');
    `,
    [word_definition_id, vote, token],
  ];
}

export type GetPhraseDefinitionVoteObjectById = {
  phrase_definitions_vote_id: number;
  phrase_definition_id: number;
  user_id: number;
  vote: boolean;
  last_updated_at: string;
};

export function getPhraseDefinitionVoteObjById(id: number): [string, [number]] {
  return [
    `
      select 
        phrase_definitions_vote_id,
        phrase_definition_id,
        user_id,
        vote,
        last_updated_at
      from word_definitions_votes
      where word_definitions_vote_id = $1
    `,
    [id],
  ];
}

export type PhraseDefinitionVoteUpsertProcedureOutputRow = {
  p_phrase_definitions_vote_id: number;
  p_error_type: ErrorType;
};

export function callPhraseDefinitionVoteUpsertProcedure({
  phrase_definition_id,
  vote,
  token,
}: {
  phrase_definition_id: number;
  vote: boolean;
  token: string;
}): [string, [number, boolean, string]] {
  return [
    `
      call phrase_definition_vote_upsert($1, $2, $3, 0, '');
    `,
    [phrase_definition_id, vote, token],
  ];
}

export type GetPhraseDefinitionVoteStatus = {
  phrase_definition_id: number;
  upvotes: number;
  downvotes: number;
};

export function getPhraseDefinitionVoteStatus(
  phrase_definition_id: number,
): [string, [number]] {
  return [
    `
      select 
        v.phrase_definition_id as phrase_definition_id, 
        count(
          case when v.vote = true then 1 else null end
        ) as upvotes, 
        count(
          case when v.vote = false then 1 else null end
        ) as downvotes 
      from 
        phrase_definitions_votes AS v 
      where 
        v.phrase_definition_id = $1
      group BY 
        v.phrase_definition_id 
      order by 
        count(
          case when v.vote = true then 1 when v.vote = false then 0 else null end
        ) desc;
    `,
    [phrase_definition_id],
  ];
}

export type TogglePhraseDefinitionVoteStatus = {
  p_phrase_definitions_vote_id: number;
  p_error_type: ErrorType;
};

export function togglePhraseDefinitionVoteStatus({
  phrase_definition_id,
  vote,
  token,
}: {
  phrase_definition_id: number;
  vote: boolean;
  token: string;
}): [string, [number, boolean, string]] {
  return [
    `
      call phrase_definition_vote_toggle($1, $2, $3, 0, '');
    `,
    [phrase_definition_id, vote, token],
  ];
}

export type GetWordDefinitionlikeStringListByWordId = {
  definition: string;
};

export function getWordDefinitionlikeStringListByWordId(
  word_id: number,
): [string, [number]] {
  return [
    `
      select 
        definition
      from word_definitions
      where word_id = $1
    `,
    [word_id],
  ];
}

export type GetPhraseDefinitionlikeStringListByPhraseId = {
  definition: string;
};

export function getPhraseDefinitionlikeStringListByPhraseId(
  phrase_id: number,
): [string, [number]] {
  return [
    `
      select 
        definition
      from phrase_definitions
      where phrase_id = $1
    `,
    [phrase_id],
  ];
}
