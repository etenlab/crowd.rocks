create or replace procedure phrase_upsert(
  in p_phraselike_string text,
  in p_words bigint[],
  in p_token varchar(512),
  inout p_phrase_id bigint,
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
  from tokens
  into v_user_id
  where token = p_token;

  if v_user_id is null then
    p_error_type := 'Unauthorized';
    return;
  end if;

  -- insert phrase
  insert into phrases(phraselike_string, words, created_by)
  values (p_phraselike_string, p_words, v_user_id)
  on conflict do nothing
  returning phrase_id
  into p_phrase_id;

  if p_phrase_id is null then
    select phrase_id
    from phrases
    where words = p_words
    into p_phrase_id;
  end if;

  if p_phrase_id is null then
    return;
  end if;

  p_error_type := 'NoError';

end; $$;