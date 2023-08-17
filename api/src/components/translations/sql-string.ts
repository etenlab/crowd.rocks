import { ErrorType } from 'src/common/types';

export type GetWordToWordTranslationObjectByIdRow = {
  word_to_word_translation_id: number;
  from_word_definition_id: number;
  to_word_definition_id: number;
};

export function getWordToWordTranslationObjById(
  id: number,
): [string, [number]] {
  return [
    `
      select 
        word_to_word_translation_id,
        from_word_definition_id,
        to_word_definition_id
      from word_to_word_translations
      where word_to_word_translation_id = $1
    `,
    [id],
  ];
}

export type WordToWordTranslationUpsertProcedureOutputRow = {
  p_word_to_word_translation_id: number;
  p_error_type: ErrorType;
};

export function callWordToWordTranslationUpsertProcedure({
  fromWordDefinitionId,
  toWordDefinitionId,
  token,
}: {
  fromWordDefinitionId: number;
  toWordDefinitionId: number;
  token: string;
}): [string, [number, number, string]] {
  return [
    `
      call word_to_word_translation_upsert($1, $2, $3, 0, '');
    `,
    [fromWordDefinitionId, toWordDefinitionId, token],
  ];
}

export type GetWordToPhraseTranslationObjectByIdRow = {
  word_to_phrase_translation_id: number;
  from_word_definition_id: number;
  to_phrase_definition_id: number;
};

export function getWordToPhraseTranslationObjById(
  id: number,
): [string, [number]] {
  return [
    `
      select 
        word_to_phrase_translation_id,
        from_word_definition_id,
        to_phrase_definition_id
      from word_to_phrase_translations
      where word_to_phrase_translation_id = $1
    `,
    [id],
  ];
}

export type WordToPhraseTranslationUpsertProcedureOutputRow = {
  p_word_to_phrase_translation_id: number;
  p_error_type: ErrorType;
};

export function callWordToPhraseTranslationUpsertProcedure({
  fromWordDefinitionId,
  toPhraseDefinitionId,
  token,
}: {
  fromWordDefinitionId: number;
  toPhraseDefinitionId: number;
  token: string;
}): [string, [number, number, string]] {
  return [
    `
      call word_to_phrase_translation_upsert($1, $2, $3, 0, '');
    `,
    [fromWordDefinitionId, toPhraseDefinitionId, token],
  ];
}

export type GetPhraseToWordTranslationObjectByIdRow = {
  phrase_to_word_translation_id: number;
  from_phrase_definition_id: number;
  to_word_definition_id: number;
};

export function getPhraseToWordTranslationObjById(
  id: number,
): [string, [number]] {
  return [
    `
      select 
        phrase_to_word_translation_id,
        from_phrase_definition_id,
        to_word_definition_id
      from phrase_to_word_translations
      where phrase_to_word_translation_id = $1
    `,
    [id],
  ];
}

export type PhraseToWordTranslationUpsertProcedureOutputRow = {
  p_phrase_to_word_translation_id: number;
  p_error_type: ErrorType;
};

export function callPhraseToWordTranslationUpsertProcedure({
  fromPhraseDefinitionId,
  toWordDefinitionId,
  token,
}: {
  fromPhraseDefinitionId: number;
  toWordDefinitionId: number;
  token: string;
}): [string, [number, number, string]] {
  return [
    `
      call phrase_to_word_translation_upsert($1, $2, $3, 0, '');
    `,
    [fromPhraseDefinitionId, toWordDefinitionId, token],
  ];
}

export type GetPhraseToPhraseTranslationObjectByIdRow = {
  phrase_to_phrase_translation_id: number;
  from_phrase_definition_id: number;
  to_phrase_definition_id: number;
};

export function getPhraseToPhraseTranslationObjById(
  id: number,
): [string, [number]] {
  return [
    `
      select 
        phrase_to_phrase_translation_id,
        from_phrase_definition_id,
        to_phrase_definition_id
      from phrase_to_phrase_translations
      where phrase_to_phrase_translation_id = $1
    `,
    [id],
  ];
}

export type PhraseToPhraseTranslationUpsertProcedureOutputRow = {
  p_phrase_to_phrase_translation_id: number;
  p_error_type: ErrorType;
};

export function callPhraseToPhraseTranslationUpsertProcedure({
  fromPhraseDefinitionId,
  toPhraseDefinitionId,
  token,
}: {
  fromPhraseDefinitionId: number;
  toPhraseDefinitionId: number;
  token: string;
}): [string, [number, number, string]] {
  return [
    `
      call phrase_to_phrase_translation_upsert($1, $2, $3, 0, '');
    `,
    [fromPhraseDefinitionId, toPhraseDefinitionId, token],
  ];
}

export type GetWordToWordTranslationVoteStatus = {
  word_to_word_translation_id: number;
  upvotes: number;
  downvotes: number;
};

export function getWordToWordTranslationVoteStatus(
  word_to_word_translation_id: number,
): [string, [number]] {
  return [
    `
      select 
        v.word_to_word_translation_id as word_to_word_translation_id, 
        count(
          case when v.vote = true then 1 else null end
        ) as upvotes, 
        count(
          case when v.vote = false then 1 else null end
        ) as downvotes 
      from 
        word_to_word_translations_votes AS v 
      where 
        v.word_to_word_translation_id = $1
      group BY 
        v.word_to_word_translation_id 
      order by 
        count(
          case when v.vote = true then 1 when v.vote = false then 0 else null end
        ) desc;
    `,
    [word_to_word_translation_id],
  ];
}

export type GetWordToPhraseTranslationVoteStatus = {
  word_to_phrase_translation_id: number;
  upvotes: number;
  downvotes: number;
};

export function getWordToPhraseTranslationVoteStatus(
  word_to_phrase_translation_id: number,
): [string, [number]] {
  return [
    `
      select 
        v.word_to_phrase_translation_id as word_to_phrase_translation_id, 
        count(
          case when v.vote = true then 1 else null end
        ) as upvotes, 
        count(
          case when v.vote = false then 1 else null end
        ) as downvotes 
      from 
        word_to_phrase_translations_votes AS v 
      where 
        v.word_to_phrase_translation_id = $1
      group BY 
        v.word_to_phrase_translation_id 
      order by 
        count(
          case when v.vote = true then 1 when v.vote = false then 0 else null end
        ) desc;
    `,
    [word_to_phrase_translation_id],
  ];
}

export type ToggleWordToPhraseTranslationVoteStatus = {
  p_word_to_phrase_translations_vote_id: number;
  p_error_type: ErrorType;
};

export function toggleWordToPhraseTranslationVoteStatus({
  word_to_phrase_translation_id,
  vote,
  token,
}: {
  word_to_phrase_translation_id: number;
  vote: boolean;
  token: string;
}): [string, [number, boolean, string]] {
  return [
    `
      call word_to_phrase_translation_vote_toggle($1, $2, $3, 0, '');
    `,
    [word_to_phrase_translation_id, vote, token],
  ];
}

export type GetPhraseToWordTranslationVoteStatus = {
  phrase_to_word_translation_id: number;
  upvotes: number;
  downvotes: number;
};

export function getPhraseToWordTranslationVoteStatus(
  phrase_to_word_translation_id: number,
): [string, [number]] {
  return [
    `
      select 
        v.phrase_to_word_translation_id as phrase_to_word_translation_id, 
        count(
          case when v.vote = true then 1 else null end
        ) as upvotes, 
        count(
          case when v.vote = false then 1 else null end
        ) as downvotes 
      from 
        phrase_to_word_translations_votes AS v 
      where 
        v.phrase_to_word_translation_id = $1
      group BY 
        v.phrase_to_word_translation_id 
      order by 
        count(
          case when v.vote = true then 1 when v.vote = false then 0 else null end
        ) desc;
    `,
    [phrase_to_word_translation_id],
  ];
}

export type TogglePhraseToWordTranslationVoteStatus = {
  p_phrase_to_word_translations_vote_id: number;
  p_error_type: ErrorType;
};

export function togglePhraseToWordTranslationVoteStatus({
  phrase_to_word_translation_id,
  vote,
  token,
}: {
  phrase_to_word_translation_id: number;
  vote: boolean;
  token: string;
}): [string, [number, boolean, string]] {
  return [
    `
      call phrase_to_word_translation_vote_toggle($1, $2, $3, 0, '');
    `,
    [phrase_to_word_translation_id, vote, token],
  ];
}

export type GetPhraseToPhraseTranslationVoteStatus = {
  phrase_to_phrase_translation_id: number;
  upvotes: number;
  downvotes: number;
};

export function getPhraseToPhraseTranslationVoteStatus(
  phrase_to_phrase_translation_id: number,
): [string, [number]] {
  return [
    `
      select 
        v.phrase_to_phrase_translation_id as phrase_to_phrase_translation_id, 
        count(
          case when v.vote = true then 1 else null end
        ) as upvotes, 
        count(
          case when v.vote = false then 1 else null end
        ) as downvotes 
      from 
        phrase_to_phrase_translations_votes AS v 
      where 
        v.phrase_to_phrase_translation_id = $1
      group BY 
        v.phrase_to_phrase_translation_id 
      order by 
        count(
          case when v.vote = true then 1 when v.vote = false then 0 else null end
        ) desc;
    `,
    [phrase_to_phrase_translation_id],
  ];
}

export type TogglePhraseToPhraseTranslationVoteStatus = {
  p_phrase_to_phrase_translations_vote_id: number;
  p_error_type: ErrorType;
};

export function togglePhraseToPhraseTranslationVoteStatus({
  phrase_to_phrase_translation_id,
  vote,
  token,
}: {
  phrase_to_phrase_translation_id: number;
  vote: boolean;
  token: string;
}): [string, [number, boolean, string]] {
  return [
    `
      call phrase_to_phrase_translation_vote_toggle($1, $2, $3, 0, '');
    `,
    [phrase_to_phrase_translation_id, vote, token],
  ];
}

export type GetWordToWordTranslationListByFromWordDefinitionId = {
  word_to_word_translation_id: number;
  created_at: string;
};

export function getWordToWordTranslationListByFromWordDefinitionId({
  from_word_definition_id,
  language_code,
  dialect_code,
  geo_code,
}: {
  from_word_definition_id: number;
  language_code: string;
  dialect_code: string | null;
  geo_code: string | null;
}): [
  string,
  (
    | [number, string, string, string]
    | [number, string, string]
    | [number, string]
  ),
] {
  let wherePlsStr = '';
  let returnArr:
    | [number, string, string, string]
    | [number, string, string]
    | [number, string] = [from_word_definition_id, language_code];

  if (dialect_code && geo_code) {
    wherePlsStr = `
      and words.dialect_code = $3
      and words.geo_code = $4
    `;
    returnArr = [...returnArr, dialect_code, geo_code];
  } else if (dialect_code && !geo_code) {
    wherePlsStr = `
      and words.dialect_code = $3
    `;
    returnArr = [...returnArr, dialect_code];
  } else if (!dialect_code && geo_code) {
    wherePlsStr = `
      and words.geo_code = $3
    `;
    returnArr = [...returnArr, geo_code];
  } else if (!dialect_code && !geo_code) {
    wherePlsStr = ``;
    returnArr = [...returnArr];
  }

  return [
    `
      select distinct 
        wtwts.word_to_word_translation_id,
        wtwts.created_at
      from word_to_word_translations as wtwts
      join (
        select word_definitions.word_definition_id
        from word_definitions
        join (
          select words.word_id
          from words
          where words.language_code = $2
            ${wherePlsStr}
        ) as ws
        on ws.word_id = word_definitions.word_id
      ) as wds
      on wds.word_definition_id = wtwts.to_word_definition_id
      where wtwts.from_word_definition_id = $1;
    `,
    returnArr,
  ];
}

export type GetWordToPhraseTranslationListByFromWordDefinitionId = {
  word_to_phrase_translation_id: number;
  created_at: string;
};

export function getWordToPhraseTranslationListByFromWordDefinitionId({
  from_word_definition_id,
  language_code,
  dialect_code,
  geo_code,
}: {
  from_word_definition_id: number;
  language_code: string;
  dialect_code: string | null;
  geo_code: string | null;
}): [
  string,
  (
    | [number, string, string, string]
    | [number, string, string]
    | [number, string]
  ),
] {
  let wherePlsStr = '';
  let returnArr:
    | [number, string, string, string]
    | [number, string, string]
    | [number, string] = [from_word_definition_id, language_code];

  if (dialect_code && geo_code) {
    wherePlsStr = `
      and words.dialect_code = $3
      and words.geo_code = $4
    `;
    returnArr = [...returnArr, dialect_code, geo_code];
  } else if (dialect_code && !geo_code) {
    wherePlsStr = `
      and words.dialect_code = $3
    `;
    returnArr = [...returnArr, dialect_code];
  } else if (!dialect_code && geo_code) {
    wherePlsStr = `
      and words.geo_code = $3
    `;
    returnArr = [...returnArr, geo_code];
  } else if (!dialect_code && !geo_code) {
    wherePlsStr = ``;
    returnArr = [...returnArr];
  }

  return [
    `
      select distinct 
        wtpts.word_to_phrase_translation_id,
        wtpts.created_at
      from word_to_phrase_translations as wtpts
      join (
        select phrase_definitions.phrase_definition_id
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
      ) as pds
      on pds.phrase_definition_id = wtpts.to_phrase_definition_id
      where wtpts.from_word_definition_id = $1
    `,
    returnArr,
  ];
}

export type GetPhraseToWordTranslationListByFromPhraseDefinitionId = {
  phrase_to_word_translation_id: number;
  created_at: string;
};

export function getPhraseToWordTranslationListByFromPhraseDefinitionId({
  from_phrase_definition_id,
  language_code,
  dialect_code,
  geo_code,
}: {
  from_phrase_definition_id: number;
  language_code: string;
  dialect_code: string | null;
  geo_code: string | null;
}): [
  string,
  (
    | [number, string, string, string]
    | [number, string, string]
    | [number, string]
  ),
] {
  let wherePlsStr = '';
  let returnArr:
    | [number, string, string, string]
    | [number, string, string]
    | [number, string] = [from_phrase_definition_id, language_code];

  if (dialect_code && geo_code) {
    wherePlsStr = `
      and words.dialect_code = $3
      and words.geo_code = $4
    `;
    returnArr = [...returnArr, dialect_code, geo_code];
  } else if (dialect_code && !geo_code) {
    wherePlsStr = `
      and words.dialect_code = $3
    `;
    returnArr = [...returnArr, dialect_code];
  } else if (!dialect_code && geo_code) {
    wherePlsStr = `
      and words.geo_code = $3
    `;
    returnArr = [...returnArr, geo_code];
  } else if (!dialect_code && !geo_code) {
    wherePlsStr = ``;
    returnArr = [...returnArr];
  }

  return [
    `
      select distinct 
        ptwts.phrase_to_word_translation_id,
        ptwts.created_at
      from phrase_to_word_translations as ptwts
      join (
        select word_definitions.word_definition_id
        from word_definitions
        join (
          select words.word_id
          from words
          where words.language_code = $2
            ${wherePlsStr}
        ) as ws
        on ws.word_id = word_definitions.word_id
      ) as wds
      on wds.word_definition_id = ptwts.to_word_definition_id
      where ptwts.from_phrase_definition_id = $1
    `,
    returnArr,
  ];
}

export type GetPhraseToPhraseTranslationListByFromPhraseDefinitionId = {
  phrase_to_phrase_translation_id: number;
  created_at: string;
};

export function getPhraseToPhraseTranslationListByFromPhraseDefinitionId({
  from_phrase_definition_id,
  language_code,
  dialect_code,
  geo_code,
}: {
  from_phrase_definition_id: number;
  language_code: string;
  dialect_code: string | null;
  geo_code: string | null;
}): [
  string,
  (
    | [number, string, string, string]
    | [number, string, string]
    | [number, string]
  ),
] {
  let wherePlsStr = '';
  let returnArr:
    | [number, string, string, string]
    | [number, string, string]
    | [number, string] = [from_phrase_definition_id, language_code];

  if (dialect_code && geo_code) {
    wherePlsStr = `
      and words.dialect_code = $3
      and words.geo_code = $4
    `;
    returnArr = [...returnArr, dialect_code, geo_code];
  } else if (dialect_code && !geo_code) {
    wherePlsStr = `
      and words.dialect_code = $3
    `;
    returnArr = [...returnArr, dialect_code];
  } else if (!dialect_code && geo_code) {
    wherePlsStr = `
      and words.geo_code = $3
    `;
    returnArr = [...returnArr, geo_code];
  } else if (!dialect_code && !geo_code) {
    wherePlsStr = ``;
    returnArr = [...returnArr];
  }

  return [
    `
      select distinct 
        ptpts.phrase_to_phrase_translation_id,
        ptpts.created_at
      from phrase_to_phrase_translations as ptpts
      join (
        select phrase_definitions.phrase_definition_id
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
      ) as pds
      on pds.phrase_definition_id = ptpts.to_phrase_definition_id
      where ptpts.from_phrase_definition_id = $1
    `,
    returnArr,
  ];
}
