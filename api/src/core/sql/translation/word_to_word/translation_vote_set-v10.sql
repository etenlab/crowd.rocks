create or replace procedure word_to_word_translation_vote_set(
  in p_word_to_word_translation_id bigint,
  in p_token varchar(512),
  in p_vote boolean,
  inout p_word_to_word_translations_vote_id bigint,
  inout p_error_type varchar(32),
  in p_user_id default -1
)
language plpgsql
as $$
declare
  v_user_id bigint;
  v_word_to_word_translation_id bigint;
begin
  p_error_type := 'UnknownError';

  -- validate user
  select user_id
  into v_user_id
  from tokens
  where token = p_token;

  if p_user_id != -1 then
    v_user_id = p_user_id
  end if;

  if v_user_id is null then
    p_error_type := 'Unauthorized';
    return;
  end if;

  -- validate inpus
  if p_word_to_word_translation_id is null then
    p_error_type := 'InvalidInputs';
    return;
  end if;

  -- check for word_to_word_translation existance
  v_word_to_word_translation_id := null;

  select word_to_word_translation_id
  from word_to_word_translations
  where word_to_word_translation_id = p_word_to_word_translation_id
  into v_word_to_word_translation_id;

  if v_word_to_word_translation_id is null then
    p_error_type := 'WordToWordTranslationNotFound';
    return;
  end if;

  insert into word_to_word_translations_votes(word_to_word_translation_id, user_id, vote)
  values (p_word_to_word_translation_id, v_user_id, p_vote)
  on conflict (word_to_word_translation_id, user_id)
  do update set vote = EXCLUDED.vote
  returning word_to_word_translations_vote_id
  into p_word_to_word_translations_vote_id;

  if p_word_to_word_translations_vote_id is null then
    select word_to_word_translations_vote_id
    from word_to_word_translations_votes
    where word_to_word_translation_id = p_word_to_word_translation_id
      and user_id = v_user_id
    into p_word_to_word_translations_vote_id;
  end if;

  if p_word_to_word_translations_vote_id is null then
    return;
  end if;
  
  p_error_type := 'NoError';

end; $$;