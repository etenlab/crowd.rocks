create or replace procedure site_text_translation_upsert(
  in p_from_definition_id bigint,
  in p_to_definition_id bigint,
  in p_from_type_is_word bool,
  in p_to_type_is_word bool,
  in p_token varchar(512),
  inout p_site_text_translation_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_user_id bigint;
  v_from_definition_id bigint;
  v_to_definition_id bigint;
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
  if p_from_definition_id is null or p_to_definition_id is null or p_from_type_is_word is null or p_to_type_is_word is null then
    p_error_type := 'InvalidInputs';
    return;
  end if;

  -- check for p_from_type_is_word is word
  v_from_definition_id := null;
  
  if p_from_type_is_word is true then
    -- check for word-definition existence
    select word_definition_id
    from word_definitions
    where word_definition_id = p_from_definition_id
    into v_from_definition_id;

    if v_from_definition_id is null then
      p_error_type := 'WordDefinitionNotFound';
      return;
    end if;
  else
    -- check for phrase-definition existence
    select phrase_definition_id
    from phrase_definitions
    where phrase_definition_id = p_from_definition_id
    into v_from_definition_id;

    if v_from_definition_id is null then
      p_error_type := 'PhraseDefinitionNotFound';
      return;
    end if;
  end if;

  -- check for p_to_type_is_word is word
  v_to_definition_id := null;
  
  if p_to_type_is_word is true then
    -- check for word-definition existence
    select word_definition_id
    from word_definitions
    where word_definition_id = p_to_definition_id
    into v_to_definition_id;

    if v_to_definition_id is null then
      p_error_type := 'WordDefinitionNotFound';
      return;
    end if;
  else
    -- check for phrase-definition existence
    select phrase_definition_id
    from phrase_definitions
    where phrase_definition_id = p_to_definition_id
    into v_to_definition_id;

    if v_to_definition_id is null then
      p_error_type := 'WordDefinitionNotFound';
      return;
    end if;
  end if;

  insert into site_text_translations(from_definition_id, to_definition_id, from_type_is_word, to_type_is_word, created_by)
  values (p_from_definition_id, p_to_definition_id, p_from_type_is_word, p_to_type_is_word, v_user_id)
  on conflict do nothing
  returning site_text_translation_id
  into p_site_text_translation_id;

  if p_site_text_translation_id is null then
    select site_text_translation_id
    from site_text_translations
    where from_definition_id = p_from_definition_id
      and to_definition_id = p_to_definition_id
      and from_type_is_word = p_from_type_is_word
      and to_type_is_word = p_to_type_is_word
    into p_site_text_translation_id;
  end if;

  if p_site_text_translation_id is null then
    return;
  end if;
  
  p_error_type := 'NoError';

end; $$;