create or replace procedure word_definition_upsert(
  in p_word_id bigint,
  in p_definition text,
  in p_token varchar(512),
  inout p_word_definition_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_user_id bigint;
  v_word_id bigint;
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
  if p_word_id is null or p_definition is null then
    p_error_type := 'InvalidInputs';
    return;
  end if;

  -- check for word_id existence
  select word_id
  from words
  where word_id = p_word_id
  into v_word_id;

  if v_word_id is null then
    p_error_type := 'WordNotFound';
    return;
  end if;

  insert into word_definitions(word_id, definition, created_by)
  values (p_word_id, p_definition, v_user_id)
  on conflict do nothing
  returning word_definition_id
  into p_word_definition_id;

  if p_word_definition_id is null then
    select word_definition_id
    from word_definitions
    where 
      word_id = p_word_id
      and definition = p_definition
    into p_word_definition_id;
  end if;

  if p_word_definition_id is null then
    return;
  end if;
  
  p_error_type := 'NoError';

end; $$;