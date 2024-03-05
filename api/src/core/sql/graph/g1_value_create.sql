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

  -- add value to the g1 entities table
  insert into g1_entities(entity_type, from_entity, props)
  values ('Value'::g1_entity_types, p_from, p_value)
  on conflict do nothing
  returning entity_id 
  into p_entity_id;

  if p_entity_id is null then
    return;
  end if;

  -- update g2 node/relationship

  -- todo, must use votes table

  p_error_type := 'NoError';

end; $$;