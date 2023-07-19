create or replace procedure phrase_definition_upsert(
  in p_phrase_id bigint,
  in p_definition text,
  in p_token varchar(512),
  inout p_phrase_definition_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_user_id bigint;
  v_phrase_id bigint;
begin
  p_error_type := 'UnknownError';

  -- validate user
  select user_id
  from tokens
  into v_user_id
  where token = p_token;

  if v_user_id is null then
    p_error_type := 'Unauthorized';
    return;
  end if;

  -- validate inpus
  if p_phrase_id is null or p_definition is null then
    p_error_type := 'InvalidInputs';
    return;
  end if;

  -- check for phrase_id existence
  select phrase_id
  from phrases
  where phrase_id = p_phrase_id
  into v_phrase_id;

  if v_phrase_id is null then
    p_error_type := 'PhraseNotFound';
    return;
  end if;

  insert into phrase_definitions(phrase_id, definition, created_by)
  values (p_phrase_id, p_definition, v_user_id)
  on conflict do nothing
  returning phrase_definition_id
  into p_phrase_definition_id;

  if p_phrase_definition_id is null then
    select phrase_definition_id
    from phrase_definitions
    where 
      phrase_id = p_phrase_id
      and definition = p_definition
    into p_phrase_definition_id;
  end if;

  if p_phrase_definition_id is null then
    return;
  end if;
  
  p_error_type := 'NoError';

end; $$;