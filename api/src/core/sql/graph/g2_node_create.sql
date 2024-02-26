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

  insert into g1_entities(entity_type, node_type)
  values ('Node'::g1_entity_types, p_node_type)
  on conflict do nothing
  returning entity_id 
  into p_entity_id;

  if p_entity_id is null then
    return;
  end if;

  insert into g2_nodes (entity_id, node_type, props)
  values (p_entity_id, p_node_type, p_props);

  if p_props is not null then
    FOR v_key, v_value IN SELECT * FROM jsonb_each (p_props)
    LOOP
      RAISE NOTICE 'k %, v %', v_key, v_value;

      call g1_key_create(4, ('"' || v_key || '"')::jsonb, v_value, v_id, v_error);
    END LOOP;
  end if;
  
  p_error_type := 'NoError';

end; $$;