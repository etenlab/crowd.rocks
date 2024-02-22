create or replace procedure g1_node_create(
  in p_node_type varchar(32),
  in p_props jsonb,
  inout p_node_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare

begin
  p_error_type := 'UnknownError';

  if p_node_type is null then
    p_error_type := 'InvalidNodeType';
    return;
  end if;

  insert into g1_nodes(node_type, props)
  values (p_node_type, p_props)
  on conflict do nothing
  returning g1_node_id 
  into p_node_id;

  if p_node_id is null then
    return;
  end if;

  p_error_type := 'NoError';

end; $$;