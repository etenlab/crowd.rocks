create or replace procedure g1_key_create(
  in p_from bigint,
  in p_key jsonb,
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
begin
  p_error_type := 'UnknownError';

  select entity_id
  from g1_entities
  where entity_id = p_from
  into v_entity_id;

  if v_entity_id is null then
    p_error_type := 'FromEntityNotFound';
    return;
  end if;

  insert into g1_entities(entity_type, from_entity, props)
  values ('Key'::g1_entity_types, p_from, p_key)
  on conflict do nothing
  returning entity_id 
  into p_entity_id;

  if p_entity_id is null then
    return;
  end if;

  if p_value is not null then
    call g1_value_create(p_entity_id, p_value, v_value_id, v_value_error);
  end if;

  p_error_type := 'NoError';

end; $$;