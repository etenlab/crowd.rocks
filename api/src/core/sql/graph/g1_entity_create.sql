create or replace procedure g1_entity_create(
  in p_entity_type varchar(32),
  in p_props jsonb,
  inout p_g1_entity_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_type varchar(32);
begin
  p_error_type := 'UnknownError';

  if p_entity_type is null then
    p_error_type := 'InvalidEntityType';
    return;
  end if;

  select g1_entity_type 
  from g1_entity_types
  where g1_entity_type = p_entity_type
  into v_type;

  if v_type is null then
    p_error_type := 'InvalidEntityType';
    return;
  end if;

  insert into g1_entities(g1_entity_type, props)
  values (p_entity_type, p_props)
  on conflict do nothing
  returning g1_entity_id 
  into p_g1_entity_id;

  if p_g1_entity_id is null then
    return;
  end if;

  select g2_node_type 
  from g2_node_types
  where g2_node_type = p_entity_type
  into v_type;

  if v_type is not null then -- create g2 node

    insert into g2_nodes (g1_entity_id, g2_node_type)
    values (p_g1_entity_id, p_entity_type);

  else 

    select g2_rel_type 
    from g2_relationship_types
    where g2_rel_type = p_entity_type
    into v_type;

    if v_type is not null then -- create g2 relationship
      insert into g2_relationships (g1_entity_id, g2_rel_type)
      values (p_g1_entity_id, p_entity_type);
    end if;

  end if;

  p_error_type := 'NoError';

end; $$;