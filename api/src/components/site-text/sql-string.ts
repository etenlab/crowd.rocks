import { ErrorType } from 'src/common/types';

export type GetSiteTextWordDefinitionObjectById = {
  site_text_id: string;
  word_definition_id: string;
};

export function getSiteTextWordDefinitionObjByIds(
  ids: number[],
): [string, [number[]]] {
  return [
    `
      select 
        site_text_id,
        word_definition_id
      from site_text_word_definitions
      where site_text_id = any($1);
    `,
    [ids],
  ];
}

export type SiteTextWordDefinitionUpsertProcedureOutputRow = {
  p_site_text_id: string;
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
  phrase_definition_id: string;
};

export function getSiteTextPhraseDefinitionObjByIds(
  ids: number[],
): [string, [number[]]] {
  return [
    `
      select 
        site_text_id,
        phrase_definition_id
      from site_text_phrase_definitions
      where site_text_id = any($1)
    `,
    [ids],
  ];
}

export type SiteTextPhraseDefinitionUpsertProcedureOutputRow = {
  p_site_text_id: string;
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

export type GetAllSiteTextWordDefinition = {
  site_text_id: string;
};

export function getAllSiteTextWordDefinition({
  filter,
  after,
  first,
}: {
  filter?: string;
  first: number | null;
  after: string | null;
}): [string, unknown[]] {
  const returnArr: unknown[] = [];
  let filterStr = '';
  let limitStr = '';
  let cursorStr = '';

  if (filter) {
    returnArr.push(`%${filter.trim().toLowerCase()}%`);
    filterStr = `lower(wlss.wordlike_string) like $${returnArr.length}`;
  }

  if (first) {
    returnArr.push(first);
    limitStr = `limit $${returnArr.length}`;
  }

  if (after) {
    returnArr.push(after);
    cursorStr = `and lower(wlss.wordlike_string) > $${returnArr.length}`;
  }

  return [
    `
      select distinct
        site_text_id,
        lower(wlss.wordlike_string)
      from site_text_word_definitions as stwds
      join word_definitions as wds
      on stwds.word_definition_id = wds.word_definition_id
      join words as ws
      on ws.word_id = wds.word_id
      join wordlike_strings as wlss
      on wlss.wordlike_string_id = ws.wordlike_string_id
      ${filterStr.trim() === '' && cursorStr.trim() === '' ? '' : 'where'}
        ${filterStr}
        ${cursorStr}
      order by lower(wlss.wordlike_string)
      ${limitStr};
      `,
    [...returnArr],
  ];
}

export type GetAllSiteTextPhraseDefinition = {
  site_text_id: string;
};

export function getAllSiteTextPhraseDefinition({
  filter,
  first,
  after,
}: {
  filter?: string;
  first: number | null;
  after: string | null;
}): [string, unknown[]] {
  const returnArr: unknown[] = [];
  let filterStr = '';
  let limitStr = '';
  let cursorStr = '';

  if (filter) {
    returnArr.push(`%${filter.trim().toLowerCase()}%`);
    filterStr = `lower(ps.phraselike_string) like $${returnArr.length}`;
  }

  if (first) {
    returnArr.push(first);
    limitStr = `limit $${returnArr.length}`;
  }

  if (after) {
    returnArr.push(after);
    cursorStr = `and lower(ps.phraselike_string) > $${returnArr.length}`;
  }

  return [
    `
      select distinct
        site_text_id,
        lower(ps.phraselike_string)
      from site_text_phrase_definitions as stpds
      join phrase_definitions as pds
      on pds.phrase_definition_id = stpds.phrase_definition_id
      join phrases as ps
      on ps.phrase_id = pds.phrase_id
      ${filterStr.trim() === '' && cursorStr.trim() === '' ? '' : 'where'}
        ${filterStr}
        ${cursorStr}
      order by lower(ps.phraselike_string)
      ${limitStr};
      `,
    [...returnArr],
  ];
}

export type GetDefinitionIdBySiteTextId = {
  definition_id: string;
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
      select distinct
        ws.language_code as language_code,
        ws.dialect_code as dialect_code,
        ws.geo_code as geo_code
      from word_to_word_translations as wtwts
      join word_definitions as wds_from
      on wtwts.from_word_definition_id = wds_from.word_definition_id
      join word_definitions as wds_to
      on wtwts.to_word_definition_id = wds_to.word_definition_id
      join words as ws
      on wds_from.word_id = ws.word_id or wds_to.word_id = ws.word_id

      union distinct

      select distinct
        ws.language_code as language_code,
        ws.dialect_code as dialect_code,
        ws.geo_code as geo_code
      from word_to_phrase_translations as wtpts
      join word_definitions as wds_from
      on wtpts.from_word_definition_id = wds_from.word_definition_id
      join phrase_definitions as pds_to
      on wtpts.to_phrase_definition_id = pds_to.phrase_definition_id
      join (
        select
          phrase_id,
          words[1] as word_id
        from phrases
      ) as ps
      on pds_to.phrase_id = ps.phrase_id
      join words as ws
      on wds_from.word_id = ws.word_id or ps.word_id = ws.word_id

      union distinct

      select distinct
        ws.language_code as language_code,
        ws.dialect_code as dialect_code,
        ws.geo_code as geo_code
      from phrase_to_word_translations as ptwts
      join word_definitions as wds_to
      on ptwts.to_word_definition_id = wds_to.word_definition_id
      join phrase_definitions as pds_from
      on ptwts.from_phrase_definition_id = pds_from.phrase_definition_id
      join (
        select
          phrase_id,
          words[1] as word_id
        from phrases
      ) as ps
      on pds_from.phrase_id = ps.phrase_id
      join words as ws
      on wds_to.word_id = ws.word_id or ps.word_id = ws.word_id
      
      union distinct

      select distinct
        ws.language_code as language_code,
        ws.dialect_code as dialect_code,
        ws.geo_code as geo_code
      from phrase_to_phrase_translations as ptpts
      join phrase_definitions as pds_from
      on ptpts.from_phrase_definition_id = pds_from.phrase_definition_id
      join phrase_definitions as pds_to
      on ptpts.to_phrase_definition_id = pds_to.phrase_definition_id
      join (
        select
          phrase_id,
          words[1] as word_id
        from phrases
      ) as ps
      on pds_from.phrase_id = ps.phrase_id or pds_to.phrase_id = ps.phrase_id
      join words as ws
      on ps.word_id = ws.word_id
    `,
    [],
  ];
}

export type GetDefinitionIdFromWordId = {
  word_definition_id: string;
};

export function getDefinitionIdFromWordId(word_id: number): [string, [number]] {
  return [
    `
      select
        stwds.word_definition_id
      from site_text_word_definitions as stwds
      join word_definitions as wds
      on stwds.word_definition_id = wds.word_definition_id
      where wds.word_id = $1;
    `,
    [word_id],
  ];
}

export type GetDefinitionIdFromPhraseId = {
  phrase_definition_id: string;
};

export function getDefinitionIdFromPhraseId(
  phrase_id: number,
): [string, [number]] {
  return [
    `
      select
        stpds.phrase_definition_id
      from site_text_phrase_definitions as stpds
      join phrase_definitions as pds
      on stpds.phrase_definition_id = pds.phrase_definition_id
      where pds.phrase_id = $1;
    `,
    [phrase_id],
  ];
}

export type SiteTextDefinitionTranslationCountUpsertsProcedureOutput = {
  p_site_text_translation_count_ids: string[];
  p_error_types: ErrorType[];
  p_error_type: ErrorType;
};

export function callSiteTextDefinitionTranslationCountUpsertsProcedure({
  site_text_ids,
  is_word_definitions,
  language_codes,
  dialect_codes,
  geo_codes,
  counts,
}: {
  site_text_ids: number[];
  is_word_definitions: boolean[];
  language_codes: string[];
  dialect_codes: (string | null)[];
  geo_codes: (string | null)[];
  counts: number[];
}): [
  string,
  [
    number[],
    boolean[],
    string[],
    (string | null)[],
    (string | null)[],
    number[],
  ],
] {
  return [
    `
      call batch_site_text_translation_count_upsert($1::bigint[], $2::bool[], $3::text[], $4::text[], $5::text[], $6::int[], null, null, '');
    `,
    [
      site_text_ids,
      is_word_definitions,
      language_codes,
      dialect_codes,
      geo_codes,
      counts,
    ],
  ];
}

export type GetSiteTextLanguageListV2 = {
  language_code: string;
  dialect_code: string | null;
  geo_code: string | null;
};

export function getSiteTextLanguageListV2(): [string, []] {
  return [
    `
      select 
        language_code,
        dialect_code,
        geo_code
      from site_text_translation_counts
      group by language_code, dialect_code, geo_code;
    `,
    [],
  ];
}

export type SiteTextTranslationCountRow = {
  site_text_translation_count_id: string;
  site_text_id: string;
  is_word_definition: boolean;
  language_code: string;
  dialect_code: string | null;
  geo_code: string | null;
  count: number;
};

export function getSiteTextTranslationCount(): [string, []] {
  return [
    `
      select 
        site_text_translation_count_id,
        site_text_id,
        is_word_definition,
        language_code,
        dialect_code,
        geo_code,
        count
      from site_text_translation_counts
      order by language_code, dialect_code, geo_code;
    `,
    [],
  ];
}
