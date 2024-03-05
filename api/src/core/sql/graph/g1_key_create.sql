create or replace procedure g1_key_create(
  in p_from bigint,
  in p_key text,
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
  v_value_id bigint;
  v_value_error varchar(32);
  v_g2_id bigint;
  v_props jsonb;
begin
  p_error_type := 'UnknownError';

  -- check to see if parent entity exists
  select entity_id
  from g1_entities
  where entity_id = p_from
  into v_entity_id;

  if v_entity_id is null then
    p_error_type := 'FromEntityNotFound';
    return;
  end if;

  -- add to g1 entities table
  -- a node cannot have two keys of the same name
  -- on conflict, we just return the id of the existing key
  insert into g1_entities(entity_type, from_entity, props)
  values ('Key'::g1_entity_types, p_from, ('"' || p_key || '"')::jsonb)
  on conflict do nothing
  returning entity_id 
  into p_entity_id;

  if p_entity_id is null then
    return;
  end if;

  -- a key can be created with our without a value
  if p_value is not null then
    call g1_value_create(p_entity_id, p_value, v_value_id, v_value_error);
  end if;

  -- if the parent is a node/relationship we concat the key to the g2 node
  -- for the first version of this code we don't build out nested trees in 
  -- g2 nodes. props are shallow. so we only build one key deep objects for g2 nodes
  select entity_id, props
  from g2_nodes
  where entity_id = p_from
  into v_g2_id, v_props;

  if v_g2_id is not null then
    update g2_nodes
    set props = jsonb_concat(('{"'|| p_key || '":null}')::jsonb, props)
    where entity_id = v_g2_id;
  end if;

  select entity_id, props
  from g2_relationships
  where entity_id = p_from
  into v_g2_id, v_props;

  if v_g2_id is not null then
    update g2_relatioships
    set props = jsonb_concat(('{"'|| p_key || '":null}')::jsonb, props)
    where entity_id = v_g2_id;
  end if;

  p_error_type := 'NoError';

end; $$;