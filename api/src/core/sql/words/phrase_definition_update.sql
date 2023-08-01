create or replace procedure phrase_definition_update(
  in p_phrase_definition_id bigint,
  in p_definition text,
  in p_token varchar(512),
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
  from tokens
  into v_user_id
  where token = p_token;

  if v_user_id is null then
    p_error_type := 'Unauthorized';
    return;
  end if;

  -- validate inpus
  if p_phrase_definition_id is null or p_definition is null then
    p_error_type := 'InvalidInputs';
    return;
  end if;

  -- check for phrase_definition_id existence
  select phrase_definition_id
  from phrase_definitions
  where word_definition_id = p_word_definition_id
  into v_phrase_definition_id;

  if v_phrase_definition_id is null then
    p_error_type := 'PhraseDefinitionNotFound';
    return;
  end if;

  update phrase_definitions 
  set definition = p_definition
  where phrase_definition_id = p_phrase_definition_id;
  
  p_error_type := 'NoError';

end; $$;