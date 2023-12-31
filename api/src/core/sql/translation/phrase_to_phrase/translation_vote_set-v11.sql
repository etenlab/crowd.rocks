create or replace procedure phrase_to_phrase_translation_vote_set(
  in p_phrase_to_phrase_translation_id bigint,
  in p_token varchar(512),
  in p_vote boolean,
  inout p_phrase_to_phrase_translations_vote_id bigint,
  inout p_error_type varchar(32),
  in p_user_id bigint default -1
)
language plpgsql
as $$
declare
  v_user_id bigint;
  v_phrase_to_phrase_translation_id bigint;
begin
  p_error_type := 'UnknownError';

  -- validate user
  select user_id
  into v_user_id
  from tokens
  where token = p_token;

  if p_user_id != -1 then
    v_user_id = p_user_id;
  end if;

  if v_user_id is null then
    p_error_type := 'Unauthorized';
    return;
  end if;

  -- validate inpus
  if p_phrase_to_phrase_translation_id is null then
    p_error_type := 'InvalidInputs';
    return;
  end if;

  -- check for phrase_to_phrase_translation existance
  v_phrase_to_phrase_translation_id := null;

  select phrase_to_phrase_translation_id
  from phrase_to_phrase_translations
  where phrase_to_phrase_translation_id = p_phrase_to_phrase_translation_id
  into v_phrase_to_phrase_translation_id;

  if v_phrase_to_phrase_translation_id is null then
    p_error_type := 'PhraseToPhraseTranslationNotFound';
    return;
  end if;

  insert into phrase_to_phrase_translations_votes(phrase_to_phrase_translation_id, user_id, vote)
  values (p_phrase_to_phrase_translation_id, v_user_id, p_vote)
  on conflict (phrase_to_phrase_translation_id, user_id)
  do update set vote = EXCLUDED.vote
  returning phrase_to_phrase_translations_vote_id
  into p_phrase_to_phrase_translations_vote_id;

  if p_phrase_to_phrase_translations_vote_id is null then
    select phrase_to_phrase_translations_vote_id
    from phrase_to_phrase_translations_votes
    where phrase_to_phrase_translation_id = p_phrase_to_phrase_translation_id
      and user_id = v_user_id
    into p_phrase_to_phrase_translations_vote_id;
  end if;

  if p_phrase_to_phrase_translations_vote_id is null then
    return;
  end if;
  
  p_error_type := 'NoError';

end; $$;