import { ErrorType } from 'src/common/types';

export type GetSiteTextWordDefinitionObjectById = {
  site_text_id: string;
  word_definition_id: number;
};

export function getSiteTextWordDefinitionObjById(
  id: number,
): [string, [number]] {
  return [
    `
      select 
        site_text_id,
        word_definition_id
      from site_text_word_definitions
      where site_text_id = $1
    `,
    [id],
  ];
}

export type SiteTextWordDefinitionUpsertProcedureOutputRow = {
  p_site_text_id: number;
  p_error_type: ErrorType;
};

export function callSiteTextWordDefinitionUpsertProcedure({
  word_definition_id,
  token,
}: {
  word_definition_id: number;
  token: string;
}): [string, [number, string]] {
  return [
    `
      call site_text_word_definition_upsert($1, $2, 0, '');
    `,
    [word_definition_id, token],
  ];
}

export type GetSiteTextPhraseDefinitionObjectById = {
  site_text_id: string;
  phrase_definition_id: number;
};

export function getSiteTextPhraseDefinitionObjById(
  id: number,
): [string, [number]] {
  return [
    `
      select 
        site_text_id,
        phrase_definition_id
      from site_text_phrase_definitions
      where site_text_id = $1
    `,
    [id],
  ];
}

export type SiteTextPhraseDefinitionUpsertProcedureOutputRow = {
  p_site_text_id: number;
  p_error_type: ErrorType;
};

export function callSiteTextPhraseDefinitionUpsertProcedure({
  phrase_definition_id,
  token,
}: {
  phrase_definition_id: number;
  token: string;
}): [string, [number, string]] {
  return [
    `
      call site_text_phrase_definition_upsert($1, $2, 0, '');
    `,
    [phrase_definition_id, token],
  ];
}

export type GetSiteTextTranslationObjectById = {
  site_text_translation_id: number;
  from_definition_id: number;
  to_definition_id: number;
  from_type_is_word: boolean;
  to_type_is_word: boolean;
};

export function getSiteTextTranslationObjById(id: number): [string, [number]] {
  return [
    `
      select 
        site_text_translation_id,
        from_definition_id,
        to_definition_id,
        from_type_is_word,
        to_type_is_word
      from site_text_translations
      where site_text_translation_id = $1
    `,
    [id],
  ];
}

export type SiteTextTranslationUpsertProcedureOutputRow = {
  p_site_text_translation_id: number;
  p_error_type: ErrorType;
};

export function callSiteTextTranslationUpsertProcedure({
  from_definition_id,
  to_definition_id,
  from_type_is_word,
  to_type_is_word,
  token,
}: {
  from_definition_id: number;
  to_definition_id: number;
  from_type_is_word: boolean;
  to_type_is_word: boolean;
  token: string;
}): [string, [number, number, boolean, boolean, string]] {
  return [
    `
      call site_text_translation_upsert($1, $2, $3, $4, $5, 0, '');
    `,
    [
      from_definition_id,
      to_definition_id,
      from_type_is_word,
      to_type_is_word,
      token,
    ],
  ];
}

export type GetSiteTextTranslationVoteObjectById = {
  site_text_translation_vote_id: number;
  site_text_translation_id: number;
  user_id: number;
  vote: boolean;
  last_updated_at: string;
};

export function getSiteTextTranslationVoteObjById(
  id: number,
): [string, [number]] {
  return [
    `
      select 
        site_text_translation_vote_id,
        site_text_translation_id,
        user_id,
        vote,
        last_updated_at
      from site_text_translation_votes
      where site_text_translation_vote_id = $1
    `,
    [id],
  ];
}

export type SiteTextTranslationVoteUpsertProcedureOutputRow = {
  p_site_text_translation_vote_id: number;
  p_error_type: ErrorType;
};

export function callSiteTextTranslationVoteUpsertProcedure({
  site_text_translation_id,
  vote,
  token,
}: {
  site_text_translation_id: number;
  vote: boolean;
  token: string;
}): [string, [number, boolean, string]] {
  return [
    `
      call site_text_translation_vote_upsert($1, $2, $3, 0, '');
    `,
    [site_text_translation_id, vote, token],
  ];
}

export type GetSiteTextTranslationVoteStatus = {
  site_text_translation_id: number;
  upvotes: number;
  downvotes: number;
};

export function getSiteTextTranslationVoteStatus(
  site_text_translation_id: number,
): [string, [number]] {
  return [
    `
      select 
        v.site_text_translation_id as site_text_translation_id, 
        count(
          case when v.vote = true then 1 else null end
        ) as upvotes, 
        count(
          case when v.vote = false then 1 else null end
        ) as downvotes 
      from 
        site_text_translation_votes AS v 
      where 
        v.site_text_translation_id = $1
      group BY 
        v.site_text_translation_id 
      order by 
        count(
          case when v.vote = true then 1 when v.vote = false then 0 else null end
        ) desc;
    `,
    [site_text_translation_id],
  ];
}

export type GetAllSiteTextTranslation = {
  site_text_translation_id: number;
  created_at: string;
};

export function getAllSiteTextWordTranslation({
  site_text_id,
  language_code,
  dialect_code,
  geo_code,
}: {
  site_text_id: number;
  language_code: string;
  dialect_code?: string;
  geo_code?: string;
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
    | [number, string] = [site_text_id, language_code];

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
  } else if (!!dialect_code && !geo_code) {
    wherePlsStr = ``;
    returnArr = [...returnArr];
  }

  return [
    `
      select
        stts.site_text_translation_id,
        stts.created_at
      from site_text_translations as stts
      join (
        select site_text_word_definitions.word_definition_id
        from site_text_word_definitions
        where site_text_word_definitions.site_text_id = $1
      ) as stwds
      on stts.from_definition_id = stwds.word_definition_id
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
      on wds.word_definition_id = stts.to_definition_id
      where from_type_is_word = true
        and to_type_is_word = true

      union

      select
        stts.site_text_translation_id,
        stts.created_at
      from site_text_translations as stts
      join (
        select site_text_word_definitions.word_definition_id
        from site_text_word_definitions
        where site_text_word_definitions.site_text_id = $1
      ) as stwds
      on stts.from_definition_id = stwds.word_definition_id
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
      on pds.phrase_definition_id = stts.to_definition_id
      where from_type_is_word = true
        and to_type_is_word = false;
    `,
    returnArr,
  ];
}

export function getAllSiteTextPhraseTranslation({
  site_text_id,
  language_code,
  dialect_code,
  geo_code,
}: {
  site_text_id: number;
  language_code: string;
  dialect_code: string;
  geo_code: string;
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
    | [number, string] = [site_text_id, language_code];

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
  } else if (!!dialect_code && !geo_code) {
    wherePlsStr = ``;
    returnArr = [...returnArr];
  }

  return [
    `
      select 
        stts.site_text_translation_id,
        stts.created_at
      from site_text_translations as stts
      join (
        select site_text_phrase_definitions.phrase_definition_id
        from site_text_phrase_definitions
        where site_text_phrase_definitions.site_text_id = $1
      ) as stpds
      on stts.from_definition_id = stpds.phrase_definition_id
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
      on wds.word_definition_id = stts.to_definition_id
      where from_type_is_word = false
        and to_type_is_word = true

      union

      select 
        stts.site_text_translation_id,
        stts.created_at
      from site_text_translations as stts
      join (
        select site_text_phrase_definitions.phrase_definition_id
        from site_text_phrase_definitions
        where site_text_phrase_definitions.site_text_id = $1
      ) as stpds
      on stts.from_definition_id = stpds.phrase_definition_id
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
      on pds.phrase_definition_id = stts.to_definition_id
      where from_type_is_word = false
        and to_type_is_word = false;
    `,
    returnArr,
  ];
}

export type GetAllSiteTextWordDefinition = {
  site_text_id: number;
};

export function getAllSiteTextWordDefinition(): [string, []] {
  return [
    `
      select 
        site_text_id
      from site_text_word_definitions;
    `,
    [],
  ];
}

export type GetAllSiteTextPhraseDefinition = {
  site_text_id: number;
};

export function getAllSiteTextPhraseDefinition(): [string, []] {
  return [
    `
      select 
        site_text_id
      from site_text_word_definitions;
    `,
    [],
  ];
}

export type ToggleSiteTextTranslationVoteStatus = {
  p_site_text_translation_vote_id: number;
  p_error_type: ErrorType;
};

export function toggleSiteTextTranslationVoteStatus({
  site_text_translation_id,
  vote,
  token,
}: {
  site_text_translation_id: number;
  vote: boolean;
  token: string;
}): [string, [number, boolean, string]] {
  return [
    `
      call site_text_translation_vote_toggle($1, $2, $3, 0, '');
    `,
    [site_text_translation_id, vote, token],
  ];
}

export type GetDefinitionIdBySiteTextId = {
  definition_id: number;
};

export function getDefinitionIdBySiteTextId(
  site_text_id: number,
  is_word_definition: boolean,
): [string, [number]] {
  const columnStr = is_word_definition
    ? 'word_definition_id'
    : 'phrase_definition_id';

  const tablename = is_word_definition
    ? 'site_text_word_definitions'
    : 'site_text_phrase_definitions';
  return [
    `
      select 
        ${columnStr} as definition_id
      from ${tablename}
      where site_text_id = $1;
    `,
    [site_text_id],
  ];
}

export type GetSiteTextLanguageList = {
  language_code: string;
  dialect_code: string | null;
  geo_code: string | null;
};

export function getSiteTextLanguageList(): [string, []] {
  return [
    `
      select
        ws.language_code as language_code,
        ws.dialect_code as dialect_code,
        ws.geo_code as geo_code
      from site_text_translations as stts
      join word_definitions as wds_from
      on stts.from_type_is_word is true and stts.from_definition_id = wds_from.word_definition_id
      join word_definitions as wds_to
      on stts.to_type_is_word is true and stts.to_definition_id = wds_to.word_definition_id
      join words as ws
      on wds_from.word_id = ws.word_id or wds_to.word_id = ws.word_id

      union distinct

      select
        ws.language_code as language_code,
        ws.dialect_code as dialect_code,
        ws.geo_code as geo_code
      from site_text_translations as stts
      join phrase_definitions as pds_from
      on stts.from_type_is_word is false and stts.from_definition_id = pds_from.phrase_definition_id
      join phrase_definitions as pds_to
      on stts.to_type_is_word is false and stts.to_definition_id = pds_to.phrase_definition_id
      join (
        select
          phrase_id,
          words[1] as word_id
        from phrases
      ) as ps
      on pds_from.phrase_id = ps.phrase_id or pds_to.phrase_id = ps.phrase_id
      join words as ws
      on ws.word_id = ps.word_id;
    `,
    [],
  ];
}
