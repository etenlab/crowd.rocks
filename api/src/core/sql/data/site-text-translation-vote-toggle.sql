create or replace procedure site_text_translation_vote_toggle(
  in p_translation_id bigint,
  in p_from_type_is_word boolean,
  in p_to_type_is_word boolean,
  in p_vote boolean,
  in p_token varchar(512),
  inout p_site_text_translation_vote_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_user_id bigint;
  v_vote boolean;
  v_translation_id bigint;
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
  if p_translation_id is null or p_vote is null or p_from_type_is_word is null or p_to_type_is_word is null then
    p_error_type := 'InvalidInputs';
    return;
  end if;

  -- check for translation existance
  v_translation_id := null;

  if p_from_type_is_word is true and p_to_type_is_word is true then
    select word_to_word_translation_id
    from word_to_word_translations
    where word_to_word_translation_id = p_translation_id
    into v_translation_id;

    if v_translation_id is null then
      p_error_type := 'WordToWordTranslationNotFound';
      return;
    end if;
  end if;

  if p_from_type_is_word is true and p_to_type_is_word is false then
    select word_to_phrase_translation_id
    from word_to_phrase_translations
    where word_to_phrase_translation_id = p_translation_id
    into v_translation_id;

    if v_translation_id is null then
      p_error_type := 'WordToPhraseTranslationNotFound';
      return;
    end if;
  end if;

  if p_from_type_is_word is false and p_to_type_is_word is true then
    select phrase_to_word_translation_id
    from phrase_to_word_translations
    where phrase_to_word_translation_id = p_translation_id
    into v_translation_id;

    if v_translation_id is null then
      p_error_type := 'PhraseToWordTranslationNotFound';
      return;
    end if;
  end if;

  if p_from_type_is_word is false and p_to_type_is_word is false then
    select phrase_to_phrase_translation_id
    from phrase_to_phrase_translations
    where phrase_to_phrase_translation_id = p_translation_id
    into v_translation_id;

    if v_translation_id is null then
      p_error_type := 'PhraseToPhraseTranslationNotFound';
      return;
    end if;
  end if;

  v_vote := null;

  select vote
  from site_text_translation_votes
  where translation_id = v_translation_id
    and from_type_is_word = p_from_type_is_word
    and to_type_is_word = p_to_type_is_word
    and user_id = v_user_id
  into v_vote;

  if v_vote is not null and v_vote = p_vote then
    p_vote := null;
  end if;

  insert into site_text_translation_votes(translation_id, from_type_is_word, to_type_is_word, user_id, vote)
  values (p_translation_id, p_from_type_is_word, p_to_type_is_word, v_user_id, p_vote)
  on conflict (translation_id, from_type_is_word, to_type_is_word, user_id)
  do update set vote = EXCLUDED.vote
  returning site_text_translation_vote_id
  into p_site_text_translation_vote_id;

  if p_site_text_translation_vote_id is null then
    select site_text_translation_vote_id
    from site_text_translation_votes
    where translation_id = p_translation_id
      and from_type_is_word = p_from_type_is_word
      and to_type_is_word = p_to_type_is_word
      and user_id = v_user_id
    into p_site_text_translation_vote_id;
  end if;

  if p_site_text_translation_vote_id is null then
    return;
  end if;
  
  p_error_type := 'NoError';

end; $$;