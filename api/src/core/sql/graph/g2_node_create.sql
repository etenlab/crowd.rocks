create or replace procedure g2_node_create(
  in p_node_type varchar(32),
  in p_props jsonb,
  inout p_entity_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_key varchar;
  v_value jsonb;
  v_id bigint;
  v_error varchar(32);
begin
  p_error_type := 'UnknownError';

  -- add to g1 entities table as a node type
  insert into g1_entities(entity_type, node_type)
  values ('Node'::g1_entity_types, p_node_type)
  on conflict do nothing
  returning entity_id 
  into p_entity_id;

  if p_entity_id is null then
    return;
  end if;

  -- if props are null we use the default prop, an empty object {}
  if p_props is null then 

    insert into g2_nodes (entity_id, node_type)
    values (p_entity_id, p_node_type); 

  -- if we have props, we need to add them to the g1 entities table as keys and values
  else 
  
    insert into g2_nodes (entity_id, node_type, props)
    values (p_entity_id, p_node_type, p_props);

    for v_key, v_value in select * from jsonb_each (p_props)
    loop
      call g1_key_create(4, ('"' || v_key || '"')::jsonb, v_value, v_id, v_error);
    end loop;

  end if;
  
  p_error_type := 'NoError';

end; $$;