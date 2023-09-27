import { ErrorType } from 'src/common/types';

export type GetMapVoteObjectById = {
  maps_vote_id: string;
  map_id: string;
  user_id: string;
  vote: boolean;
  last_updated_at: string;
};

export function getMapVoteObjById(
  id: number,
  is_original: boolean,
): [string, [number]] {
  const map_votes_table_name = is_original
    ? 'original_maps_votes'
    : 'translated_maps_votes';

  return [
    `
      select 
        maps_vote_id,
        map_id,
        user_id,
        vote,
        last_updated_at
      from ${map_votes_table_name}
      where maps_vote_id = $1
    `,
    [id],
  ];
}

export type MapVoteUpsertProcedureOutputRow = {
  p_maps_vote_id: string;
  p_error_type: ErrorType;
};

export function callMapVoteUpsertProcedure({
  map_id,
  is_original,
  vote,
  token,
}: {
  map_id: number;
  is_original: boolean;
  vote: boolean;
  token: string;
}): [string, [number, boolean, string]] {
  if (is_original) {
    return [
      `
      call original_map_vote_upsert($1, $2, $3, 0, '');
    `,
      [map_id, vote, token],
    ];
  } else {
    return [
      `
      call translated_map_vote_upsert($1, $2, $3, 0, '');
    `,
      [map_id, vote, token],
    ];
  }
}

export type GetMapVoteStatus = {
  map_id: string;
  upvotes: number;
  downvotes: number;
};

export function getMapVoteStatusFromMapIds(
  mapIds: number[],
  is_original: boolean,
): [string, [number[]]] {
  const map_votes_table_name = is_original
    ? 'original_maps_votes'
    : 'translated_maps_votes';

  return [
    `
      select 
        v.map_id as map_id, 
        count(
          case when v.vote = true then 1 else null end
        ) as upvotes, 
        count(
          case when v.vote = false then 1 else null end
        ) as downvotes 
      from 
        ${map_votes_table_name} AS v 
      where 
        v.map_id = any($1)
      group BY 
        v.map_id 
      order by 
        count(
          case when v.vote = true then 1 when v.vote = false then 0 else null end
        ) desc;
    `,
    [mapIds],
  ];
}

export type ToggleMapVoteStatus = {
  p_maps_vote_id: string;
  p_error_type: ErrorType;
};

export function toggleMapVoteStatus({
  map_id,
  is_original,
  vote,
  token,
}: {
  map_id: number;
  is_original: boolean;
  vote: boolean;
  token: string;
}): [string, [number, boolean, string]] {
  if (is_original) {
    return [
      `
        call original_map_vote_toggle($1, $2, $3, 0, '');
      `,
      [map_id, vote, token],
    ];
  } else {
    return [
      `
        call translated_map_vote_toggle($1, $2, $3, 0, '');
      `,
      [map_id, vote, token],
    ];
  }
}
