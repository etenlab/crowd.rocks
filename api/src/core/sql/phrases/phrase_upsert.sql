create or replace procedure phrase_upsert(
  in p_wordlike_strings varchar(64)[],
  in p_language_code varchar(32),
  in p_dialect_code varchar(32),
  in p_geo_code varchar(32),
  in p_token varchar(512),
  inout p_phrase_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_user_id bigint;
  v_current_wordlike_string_id bigint;
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

  -- check for string existence
  select wordlike_string_id
  into v_current_wordlike_string_id
  from wordlike_strings
  where wordlike_string = p_wordlike_string;

  -- create wordlike string if needed
  if v_current_wordlike_string_id is null then
    insert into wordlike_strings (wordlike_string, created_by)
    values (p_wordlike_string, v_user_id)
    returning wordlike_string_id
    into v_current_wordlike_string_id;
  end if;

  if v_current_wordlike_string_id is null then
    p_error_type := 'WordLikeStringInsertFailed';
    return;
  end if;

  -- check for word existence
  select word_id
  into p_word_id
  from words
  where wordlike_string_id = v_current_wordlike_string_id
    and language_code = p_language_code
    and dialect_code = p_dialect_code
    and geo_code = p_geo_code;

  -- create word if needed
  if p_word_id is null then
    insert into words(
      wordlike_string_id, 
      language_code, 
      dialect_code, 
      geo_code, 
      created_by
    ) values (
      v_current_wordlike_string_id,
      p_language_code,
      p_dialect_code,
      p_geo_code,
      v_user_id
    )
    returning word_id
    into p_word_id;
  end if;

  if p_word_id is null then
    p_error_type := 'WordInsertFailed';
    return;
  end if;

  p_error_type := 'NoError';

end; $$;