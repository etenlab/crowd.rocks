create or replace procedure word_definition_update(
  in p_word_definition_id bigint,
  in p_definition text,
  in p_token varchar(512),
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_user_id bigint;
  v_word_definition_id bigint;
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
  if p_word_definition_id is null or p_definition is null then
    p_error_type := 'InvalidInputs';
    return;
  end if;

  -- check for word_definition_id existence
  select word_definition_id
  from word_definitions
  where word_definition_id = p_word_definition_id
  into v_word_definition_id;

  if v_word_definition_id is null then
    p_error_type := 'WordDefinitionNotFound';
    return;
  end if;

  update word_definitions 
  set definition = p_definition
  where word_definition_id = p_word_definition_id;
  
  p_error_type := 'NoError';

end; $$;