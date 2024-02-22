create or replace procedure g1_entity_create(
  in p_entity_type varchar(32),
  in p_props jsonb,
  inout p_entity_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare

begin
  p_error_type := 'UnknownError';

  if p_entity_type is null then
    p_error_type := 'InvalidEntityType';
    return;
  end if;

  insert into g1_entities(g1_entity_type, props)
  values (p_entity_type, p_props)
  on conflict do nothing
  returning g1_entity_id 
  into p_entity_id;

  if p_entity_id is null then
    return;
  end if;

  p_error_type := 'NoError';

end; $$;