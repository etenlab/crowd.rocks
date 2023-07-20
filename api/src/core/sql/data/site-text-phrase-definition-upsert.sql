create or replace procedure site_text_phrase_definition_upsert(
  in p_phrase_definition_id bigint,
  in p_token varchar(512),
  inout p_site_text_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_user_id bigint;
  v_phrase_definition_id bigint;
begin
  p_error_type := 'UnknownError';

  -- validate user
  select user_id
  into v_user_id
  from tokens
  where token = p_token;

  if v_user_id is null then
    p_error_type := 'Unauthorized';
    return;
  end if;

  -- validate inpus
  if p_phrase_definition_id is null then
    p_error_type := 'InvalidInputs';
    return;
  end if;

  -- check for phrase existence
  select phrase_definition_id
  from phrase_definitions
  where phrase_definition_id = p_phrase_definition_id
  into v_phrase_definition_id;

  if v_phrase_definition_id is null then
    p_error_type := 'PhraseDefinitionNotFound';
    return;
  end if;

  insert into site_text_phrase_definitions(phrase_definition_id, created_by)
  values (p_phrase_definition_id, v_user_id)
  on conflict do nothing
  returning site_text_id
  into p_site_text_id;

  if p_site_text_id is null then
    select site_text_id
    from site_text_phrase_definitions
    where phrase_definition_id = p_phrase_definition_id
    into p_site_text_id;
  end if;

  if p_site_text_id is null then
    return;
  end if;
  
  p_error_type := 'NoError';

end; $$;