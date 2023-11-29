import { ErrorType, GenericOutput } from '../../common/types';
import { LanguageInput } from '../common/types';
import { AddPericopeTrAndDescInput } from './types';

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
  description_translation_id: string;
  description_translation: string;
  language_code: string;
  dialect_code: string;
  geo_code: string;
  created_at: string;
  created_by: string;
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
	      pdt.translation as description_translation,
	      pdt.pericope_description_translation_id as description_translation_id,
        pt.language_code,
        pt.dialect_code,
        pt.geo_code,
        pt.created_at,
        pt.created_by
      from pericope_translations pt
      left join pericope_descriptions pd on pt.pericope_id = pd.pericope_id
      left join pericope_description_translations pdt on pd.pericope_description_id = pdt.pericope_description_id 
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
  description_translation_id: string;
  description_translation: string;
  language_code: string;
  dialect_code: string;
  geo_code: string;
  created_at: string;
  created_by: string;
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
      select 
        pt.pericope_id,
        pt.pericope_translation_id, 
        pt.translation as translation,
	      pdt.translation as description_translation,
	      pdt.pericope_description_translation_id as description_translation_id,
        pt.language_code,
        pt.dialect_code,
        pt.geo_code,
        pt.created_at,
        pt.created_by,
        votes.upvotes,
        votes.downvotes
      from pericope_translations pt
      left join pericope_descriptions pd on pt.pericope_id = pd.pericope_id
      left join pericope_description_translations pdt on pd.pericope_description_id = pdt.pericope_description_id 
      left join votes on pt.pericope_translation_id = votes.pericope_translation_id
      where true and
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
  p_pericope_description_tr_id: string;
  p_error_type: ErrorType;
  p_created_by: string;
};
export function callPericopeTrInsertProcedure(
  {
    pericopeId,
    description_tr,
    translation,
    targetLang: { dialect_code, geo_code, language_code },
  }: AddPericopeTrAndDescInput,
  token: string,
): [
  string,
  [string, string, string, string, string, string | null, string | null],
] {
  return [
    `
      call pericope_translation_insert($1, $2, $3, $4, $5, $6, $7, null, null, null, null);
    `,
    [
      token,
      pericopeId,
      translation,
      description_tr,
      language_code,
      dialect_code,
      geo_code,
    ],
  ];
}
