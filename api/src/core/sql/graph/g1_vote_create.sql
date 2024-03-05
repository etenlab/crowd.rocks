create or replace procedure g1_vote_create(
  in p_user_id bigint,
  in p_entity_id bigint,
  in p_vote bool,
  inout p_g1_vote_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_type g1_entity_types;
  v_votes_true int;
  v_votes_false int;
begin
  p_error_type := 'UnknownError';

  -- get the type of the entity, which also checks for existence
  select entity_type
  into v_type
  from g1_entities
  where entity_id = p_entity_id;

  if v_type is null then
    p_error_type := 'EntityDoesNotExist';
    return;
  end if;

  -- add the vote, overwriting any existing vote
  insert into g1_votes(user_id, entity_id, vote)
  values (p_user_id, p_entity_id, p_vote)
  on conflict (user_id, entity_id) do update set vote = excluded.vote
  returning g1_vote_id 
  into p_g1_vote_id;

  if p_g1_vote_id is null then
    return;
  end if;

  -- based on the type, update the vote count
  if v_type = 'Value'::g1_entity_types then 

    select count(g1_vote_id)
    into v_votes_true
    from g1_votes
    where 
          entity_id = p_entity_id
      and vote = true;

    update g1_entities
    set votes = v_votes_true
    where entity_id = p_entity_id;

  else 

    select count(g1_vote_id)
    into v_votes_true
    from g1_votes
    where 
          entity_id = p_entity_id
      and vote = true;

    select count(g1_vote_id)
    into v_votes_false
    from g1_votes
    where 
          entity_id = p_entity_id
      and vote = false;

    update g1_entities
    set votes = v_votes_true - v_votes_false
    where entity_id = p_entity_id;

  end if;

  p_error_type := 'NoError';

end; $$;