create or replace procedure g1_relationship_create(
  in p_from_g1_node_id bigint,
  in p_to_g1_node_id bigint,
  inout p_rel_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare

begin
  p_error_type := 'UnknownError';

  insert into g1_relationships(from_node, to_node)
  values (p_from_g1_node_id, p_to_g1_node_id)
  on conflict do nothing
  returning g1_rel_id 
  into p_rel_id;

  if p_rel_id is null then
    return;
  end if;

  p_error_type := 'NoError';

end; $$;