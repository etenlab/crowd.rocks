create or replace procedure site_text_phrase_upsert(
  in p_phrase_id bigint,
  in p_token varchar(512),
  inout p_site_text_id bigint,
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
  into v_user_id
  from tokens
  where token = p_token;

  if v_user_id is null then
    p_error_type := 'Unauthorized';
    return;
  end if;

  -- validate inpus
  if p_word_id is null then
    p_error_type := 'InvalidInputs';
    return;
  end if;

  -- check for phrase existence
  select phrase_id
  from phrases
  where phrase_id = p_phrase_id
  into v_phrase_id;

  if v_phrase_id is null then
    p_error_type := 'PhraseNotFound';
    return;
  end if;

  insert into site_text_phrases(phrase_id, created_by)
  values (p_phrase_id, v_user_id)
  on conflict do nothing
  returning site_text_id
  into p_site_text_id;

  if p_site_text_id is null then
    select p_site_text_id
    from site_text_phrases
    where phrase_id = p_phrase_id
    into p_site_text_id;
  end if;

  if p_site_text_id is null then
    return;
  end if;
  
  p_error_type := 'NoError';

end; $$;