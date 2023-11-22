export type GetPericopeTanslationsOrderedRows = {
  pericope_translation_id: number;
  upvotes: number;
  downwotes: number;
  weight: number;
};
export function getPericopeTanslationsWithVotesRows({
  translationIds,
}: {
  translationIds: number[];
}): [string, [number[]]] {
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
            ) as downvotes,
            count(
              case when v.vote = true then 1 else null end
            ) *2 - 
            count(
              case when v.vote = false then 1 else null end
            ) as weight
          from 
            pericope_translations_votes AS v 
          where 
            v.pericope_translation_id = any($1)
          group BY 
            v.pericope_translation_id 
          )
    select * from pericope_translations pt
          left join votes on pt.pericope_translation_id = votes.pericope_translation_id
          where pt.pericope_translation_id = any($1)
    `,
    [translationIds],
  ];
}
