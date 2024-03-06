create or replace procedure g1_value_create(
  in p_from bigint,
  in p_value jsonb,
  inout p_entity_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_entity_id bigint;
  v_key varchar;
  v_value jsonb;
  v_current_id bigint;
begin
  p_error_type := 'UnknownError';

  -- ensure the parent entity exists
  select entity_id
  from g1_entities
  where entity_id = p_from
  into v_entity_id;

  if v_entity_id is null then
    p_error_type := 'FromEntityNotFound';
    return;
  end if;

  -- ensure the value doesn't already exist for this key
  select entity_id
  into v_current_id
  from g1_entities
  where from_entity = p_from and props = p_value;

  if v_current_id is not null then
    p_error_type := 'ValueAlreadyExistsOnParent';
    return;
  end if;

  -- add value to the g1 entities table
  insert into g1_entities(entity_type, from_entity, props)
  values ('Value'::g1_entity_types, p_from, p_value)
  on conflict do nothing
  returning entity_id 
  into p_entity_id;

  if p_entity_id is null then
    return;
  end if;

  -- update g2 node/relationship as needed
  call g1_process_value_election(p_entity_id, p_error_type);

  p_error_type := 'NoError';

end; $$;