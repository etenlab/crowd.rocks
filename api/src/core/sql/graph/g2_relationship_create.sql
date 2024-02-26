create or replace procedure g2_relationship_create(
  in p_rel_type varchar(32),
  in p_from bigint,
  in p_to bigint,
  in p_props jsonb,
  inout p_entity_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_key varchar;
  v_value jsonb;
  v_entity_id bigint;
  v_id bigint;
  v_error varchar(32);
begin
  p_error_type := 'UnknownError';

  select entity_id
  from g1_entities
  where entity_id = p_from
  into v_entity_id;

  if v_entity_id is null then
    p_error_type := 'FromNodeNotFound';
    return;
  end if;

  select entity_id
  from g1_entities
  where entity_id = p_to
  into v_entity_id;

  if v_entity_id is null then
    p_error_type := 'ToNodeNotFound';
    return;
  end if;

  select entity_id
  from g2_relationships
  where 
    from_node = p_from
    and to_node = p_to
  into v_entity_id;

  if v_entity_id is not null then
    p_error_type := 'RelationshipAlreadyExists';
    return;
  end if;

  insert into g1_entities(entity_type, from_entity, to_entity, rel_type)
  values ('Relationship'::g1_entity_types, p_from, p_to, p_rel_type)
  on conflict do nothing
  returning entity_id 
  into p_entity_id;

  if p_entity_id is null then
    return;
  end if;

  insert into g2_relationships (entity_id, from_node, to_node, rel_type, props)
  values (p_entity_id, p_from, p_to, p_rel_type, p_props);

  if p_props is not null then
  FOR v_key, v_value IN SELECT * FROM jsonb_each (p_props)
  LOOP
    RAISE NOTICE 'k %, v %', v_key, v_value;

    call g1_key_create(4, ('"' || v_key || '"')::jsonb, v_value, v_id, v_error);
  END LOOP;
end if;

  p_error_type := 'NoError';

end; $$;