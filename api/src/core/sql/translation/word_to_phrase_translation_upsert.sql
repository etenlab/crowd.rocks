create or replace procedure word_to_phrase_translation_upsert(
  in p_from_word_id bigint,
  in p_to_phrase_id bigint,
  in p_token varchar(512),
  inout p_word_to_phrase_translation_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_user_id bigint;
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
  if p_from_word_id is null or p_to_phrase_id is null then
    p_error_type := 'InvalidInputs';
    return;
  end if;

  insert into word_to_phrase_translations(from_word, to_phrase, created_by)
  values (p_from_word_id, p_to_phrase_id, v_user_id)
  on conflict do nothing
  returning word_to_phrase_translation_id
  into p_word_to_phrase_translation_id;

  if p_word_to_phrase_translation_id is null then
    select word_to_phrase_translation_id
    from word_to_phrase_translations
    where 
      from_word = p_from_word_id
      and to_phrase = p_to_phrase_id
    into p_word_to_phrase_translation_id;
  end if;

  if p_word_to_phrase_translation_id is null then
    return;
  end if;
  
  p_error_type := 'NoError';

end; $$;