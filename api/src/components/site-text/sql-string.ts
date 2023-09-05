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

export type GetSiteTextTranslationVoteObjectById = {
  site_text_translation_vote_id: string;
  translation_id: string;
  from_type_is_word: boolean;
  to_type_is_word: boolean;
  user_id: string;
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
        translation_id,
        from_type_is_word,
        to_type_is_word,
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
  p_site_text_translation_vote_id: string;
  p_error_type: ErrorType;
};

export function callSiteTextTranslationVoteUpsertProcedure({
  translation_id,
  from_type_is_word,
  to_type_is_word,
  vote,
  token,
}: {
  translation_id: number;
  from_type_is_word: boolean;
  to_type_is_word: boolean;
  vote: boolean;
  token: string;
}): [string, [number, boolean, boolean, boolean, string]] {
  return [
    `
      call site_text_translation_vote_upsert($1, $2, $3, $4, $5, 0, '');
    `,
    [translation_id, from_type_is_word, to_type_is_word, vote, token],
  ];
}

export type GetSiteTextTranslationVoteStatus = {
  translation_id: string;
  from_type_is_word: boolean;
  to_type_is_word: boolean;
  upvotes: number;
  downvotes: number;
};

export function getSiteTextTranslationVoteStatusFromIds(
  ids: {
    translation_id: number;
    from_type_is_word: boolean;
    to_type_is_word: boolean;
  }[],
): [string, [string]] {
  return [
    `
      select 
        v.translation_id as translation_id,
        v.from_type_is_word as from_type_is_word,
        v.to_type_is_word as to_type_is_word,
        count(
          case when v.vote = true then 1 else null end
        ) as upvotes, 
        count(
          case when v.vote = false then 1 else null end
        ) as downvotes 
      from 
        site_text_translation_votes AS v
      join (
        select * 
        from jsonb_populate_recordset(
          null::site_text_translation_vote_id_type, 
          $1
        ) 
      ) as t
      on v.translation_id = t.translation_id
        and v.from_type_is_word = t.from_type_is_word
        and v.to_type_is_word = t.to_type_is_word
      group BY 
        v.translation_id,
        v.from_type_is_word,
        v.to_type_is_word
      order by 
        count(
          case when v.vote = true then 1 when v.vote = false then 0 else null end
        ) desc;
    `,
    [JSON.stringify(ids)],
  ];
}

export type ToggleSiteTextTranslationVoteStatus = {
  p_site_text_translation_vote_id: string;
  p_error_type: ErrorType;
};

export function toggleSiteTextTranslationVoteStatus({
  translation_id,
  from_type_is_word,
  to_type_is_word,
  vote,
  token,
}: {
  translation_id: number;
  from_type_is_word: boolean;
  to_type_is_word: boolean;
  vote: boolean;
  token: string;
}): [string, [number, boolean, boolean, boolean, string]] {
  return [
    `
      call site_text_translation_vote_toggle($1, $2, $3, $4, $5, 0, '');
    `,
    [translation_id, from_type_is_word, to_type_is_word, vote, token],
  ];
}

export type GetAllSiteTextWordDefinition = {
  site_text_id: string;
};

export function getAllSiteTextWordDefinition(
  filter?: string,
): [string, [string] | []] {
  if (filter) {
    return [
      `
        select distinct
          site_text_id
        from site_text_word_definitions as stwds
        join word_definitions as wds
        on stwds.word_definition_id = wds.word_definition_id
        join words as ws
        on ws.word_id = wds.word_id
        join wordlike_strings as wlss
        on wlss.wordlike_string_id = ws.wordlike_string_id
        where wlss.wordlike_string like $1;
      `,
      [`%${filter.trim()}%`],
    ];
  } else {
    return [
      `
        select distinct
          site_text_id
        from site_text_word_definitions;
      `,
      [],
    ];
  }
}

export type GetAllSiteTextPhraseDefinition = {
  site_text_id: string;
};

export function getAllSiteTextPhraseDefinition(
  filter?: string,
): [string, [string] | []] {
  if (filter) {
    return [
      `
        select distinct
          site_text_id
        from site_text_phrase_definitions as stpds
        join phrase_definitions as pds
        on pds.phrase_definition_id = stpds.phrase_definition_id
        join phrases as ps
        on ps.phrase_id = pds.phrase_id
        where ps.phraselike_string like $1;
      `,
      [`%${filter.trim()}%`],
    ];
  } else {
    return [
      `
        select distinct
          site_text_id
        from site_text_phrase_definitions;      
      `,
      [],
    ];
  }
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
