drop procedure if exists translated_map_vote_upsert;
create or replace procedure translated_map_vote_upsert(
  in p_map_id bigint,
  in p_vote bool,
  in p_token varchar(512),
  inout p_translated_maps_vote_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_user_id bigint;
  v_map_id bigint;
begin
  p_error_type := 'UnknownError';

  -- validate user
  select user_id
  into v_user_id
  from tokens
  where token = p_token;

  if v_user_id is null then
    p_error_type := 'Unauthorized';
    return;
  end if;

  -- validate inpus
  if p_map_id is null then
    p_error_type := 'InvalidInputs';
    return;
  end if;

  -- check for translated_map existance
  v_map_id := null;

  select translated_map_id
  from translated_maps
  where translated_map_id = p_map_id
  into v_map_id;

  if v_map_id is null then
    p_error_type := 'MapNotFound';
    return;
  end if;

  insert into translated_maps_votes(map_id, user_id, vote)
  values (p_map_id, v_user_id, p_vote)
  on conflict (map_id, user_id)
  do update set vote = EXCLUDED.vote
  returning maps_vote_id
  into p_translated_maps_vote_id;

  if p_translated_maps_vote_id is null then
    select maps_vote_id
    from translated_maps_votes
    where map_id = p_map_id
      and user_id = v_user_id
    into p_translated_maps_vote_id;
  end if;

  if p_translated_maps_vote_id is null then
    return;
  end if;
  
  p_error_type := 'NoError';

end; $$;