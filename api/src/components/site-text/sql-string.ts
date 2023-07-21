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
