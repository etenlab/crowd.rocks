drop procedure if exists translated_map_vote_toggle;
create or replace procedure translated_map_vote_toggle(
  in p_map_id bigint,
  in p_vote boolean,
  in p_token varchar(512),
  inout p_maps_vote_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_user_id bigint;
  v_vote boolean;
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
  if p_map_id is null or p_vote is null then
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

  v_vote := null;

  select vote
  from translated_maps_votes
  where map_id = p_map_id
    and user_id = v_user_id
  into v_vote;

  if v_vote is not null and v_vote = p_vote then
    p_vote := null;
  end if;

  insert into translated_maps_votes(map_id, user_id, vote)
  values (p_map_id, v_user_id, p_vote)
  on conflict (map_id, user_id)
  do update set vote = EXCLUDED.vote
  returning maps_vote_id
  into p_maps_vote_id;

  if p_maps_vote_id is null then
    select maps_vote_id
    from translated_maps_votes
    where map_id = p_map_id
      and user_id = v_user_id
    into p_maps_vote_id;
  end if;

  if p_maps_vote_id is null then
    return;
  end if;
  
  p_error_type := 'NoError';

end; $$;