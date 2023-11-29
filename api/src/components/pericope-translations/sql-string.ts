import { ErrorType, GenericOutput } from '../../common/types';
import { LanguageInput } from '../common/types';
import { AddPericopeTranslationInput } from './types';

export type PericopeTanslationsIdsWithVotesSqlR = {
  pericope_translation_id: string;
  upvotes: number;
  downvotes: number;
};
export function getPericopeTanslationsIdsWithVotesSql({
  pericopeId,
  targetLang: { language_code, dialect_code, geo_code },
}: {
  pericopeId: string;
  targetLang: LanguageInput;
}): [string, [string, string, string?, string?]] {
  const params: [string, string, string?, string?] = [
    pericopeId,
    language_code,
  ];
  let langRestrictionClause = ` and pt.language_code = $${params.length}`;

  if (dialect_code) {
    params.push(dialect_code);
    langRestrictionClause += ` and pt.dialect_code = $${params.length}`;
  }
  if (geo_code) {
    params.push(geo_code);
    langRestrictionClause += ` and pt.geo_code = $${params.length}`;
  }
  return [
    `
    with votes as (	
          select 
            v.pericope_translation_id as pericope_translation_id,  
            count(
              case when v.vote = true then 1 else null end
            ) as upvotes, 
            count(
              case when v.vote = false then 1 else null end
            ) as downvotes
          from 
            pericope_translations_votes AS v 
          group BY 
            v.pericope_translation_id 
          )
    select pt.pericope_translation_id, upvotes, downvotes from pericope_translations pt
          left join votes on pt.pericope_translation_id = votes.pericope_translation_id
          where pt.pericope_id = $1
          ${langRestrictionClause}
    `,
    params,
  ];
}

export type GetPericopeTranslationSqlR = {
  pericope_translation_id: string;
  pericope_id: string;
  translation: string;
  description: string;
  language_code: string;
  dialect_code: string;
  geo_code: string;
  created_at: string;
  user_id: string;
  avatar: string;
  avatar_url: string;
  is_bot: boolean;
};
export function getPericopeTranslationsByIdsSql({
  translationIds,
}: {
  translationIds: string[];
}): [string, [string[]]] {
  return [
    `
      select 
        pt.pericope_id,
        pt.pericope_translation_id, 
        pt.translation as translation,
        pt.description as description,
        pt.language_code,
        pt.dialect_code,
        pt.geo_code,
        pt.created_at,
        u.user_id,
        u.is_bot,
        a.avatar,
        a.url as avatar_url
      from pericope_translations pt
      join users u
        on u.user_id = pt.created_by
      left join avatars a
        on u.user_id = a.user_id
      where true and
        pericope_translation_id = any($1)
    `,
    [translationIds],
  ];
}

export type GetPericopeTranslationsByPericopeIdSqlR = {
  pericope_translation_id: string;
  pericope_id: string;
  translation: string;
  description: string;
  language_code: string;
  dialect_code: string;
  geo_code: string;
  created_at: string;
  user_id: string;
  avatar: string;
  avatar_url: string;
  is_bot: boolean;
  upvotes: number;
  downvotes: number;
};
export function getPericopeTranslationsByPericopeIdSql({
  pericopeId,
  targetLang: { language_code, dialect_code, geo_code },
}: {
  pericopeId: string;
  targetLang: LanguageInput;
}): [string, [string, string, string?, string?]] {
  const params: [string, string, string?, string?] = [
    pericopeId,
    language_code,
  ];
  let langRestrictionClause = ` and pt.language_code = $${params.length}`;

  if (dialect_code) {
    params.push(dialect_code);
    langRestrictionClause += ` and pt.dialect_code = $${params.length}`;
  }
  if (geo_code) {
    params.push(geo_code);
    langRestrictionClause += ` and pt.geo_code = $${params.length}`;
  }
  return [
    `
      with votes as (
      select
        v.pericope_translation_id as pericope_translation_id,
        count( case when v.vote = true then 1 else null end ) as upvotes,
        count( case when v.vote = false then 1 else null end ) as downvotes
      from
        pericope_translations_votes as v
      group by
        v.pericope_translation_id 
      )
        select 
          pt.pericope_id,
          pt.pericope_translation_id, 
          pt.translation as translation,
          pt.description as description,
          pd.pericope_description_id,
          pt.language_code,
          pt.dialect_code,
          pt.geo_code,
          pt.created_at,
          pt.created_by,
          votes.upvotes,
          votes.downvotes,
          u.user_id,
          u.is_bot,
          a.avatar,
          a.url as avatar_url
      from
        pericope_translations pt
      left join pericope_descriptions pd on
        pt.pericope_id = pd.pericope_id
      left join votes on
        pt.pericope_translation_id = votes.pericope_translation_id
      join users u
        on u.user_id = pt.created_by
      left join avatars a
        on u.user_id = a.user_id
      where
        true
      and
        pt.pericope_id = $1
        ${langRestrictionClause}
    `,
    params,
  ];
}

export type PericopeDescriptionSqlR = {
  pericope_id: string;
  description: string;
};
export function getPericopeDescription({
  pericopeId,
}: {
  pericopeId: string;
}): [string, [string]] {
  const params: [string] = [pericopeId];

  return [
    `
      select
      pd.pericope_id,
      pd.description
      from pericope_descriptions pd
      where true
        and pd.pericope_id =$1
    `,
    params,
  ];
}

export type PericopeTrUpsertProcedureR = {
  p_pericope_translation_id: string;
  p_error_type: ErrorType;
  p_user_id: string;
  p_avatar: string;
  p_avatar_url: string;
  p_is_bot: boolean;
  p_created_at: string;
};
export function callPericopeTrInsertProcedure(
  {
    pericopeId,
    tanslation_description,
    translation,
    targetLang: { dialect_code, geo_code, language_code },
  }: AddPericopeTranslationInput,
  token: string,
): [
  string,
  [string, string, string, string, string, string | null, string | null],
] {
  return [
    `
      call pericope_translation_insert($1, $2, $3, $4, $5, $6, $7, null, null, null, null, null, null, null );
    `,
    [
      token,
      pericopeId,
      translation,
      tanslation_description,
      language_code,
      dialect_code,
      geo_code,
    ],
  ];
}
