create or replace procedure word_upsert(
  in p_word_id bigint,
  in p_original_map_id bigint,
  in p_token varchar(512),
  inout p_original_map_word_id bigint,
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
  from tokens
  into v_user_id
  where token = p_token;

  if v_user_id is null then
    p_error_type := 'Unauthorized';
    return;
  end if;

  -- check for string existence
  select wordlike_string_id
  from wordlike_strings
  where wordlike_string = p_wordlike_string
  into v_current_wordlike_string_id;

  -- create wordlike string if needed
  if v_current_wordlike_string_id is null then
    insert into wordlike_strings (wordlike_string, created_by)
    values (p_wordlike_string, v_user_id)
    on conflict do nothing
    returning wordlike_string_id
    into v_current_wordlike_string_id;

    if v_current_wordlike_string_id is null then
      select wordlike_string_id
      from wordlike_strings
      where wordlike_string = p_wordlike_string
      into v_current_wordlike_string_id;
    end if;
  end if;

  if v_current_wordlike_string_id is null then
    p_error_type := 'WordLikeStringInsertFailed';
    return;
  end if;

  -- check for word existence
  if p_dialect_code is null and p_geo_code is null then
    select word_id
    from words
    where wordlike_string_id = v_current_wordlike_string_id
      and language_code = p_language_code
    into p_word_id;
  elsif p_dialect_code is not null and p_geo_code is null then
    select word_id
    from words
    where wordlike_string_id = v_current_wordlike_string_id
      and language_code = p_language_code
      and dialect_code = p_dialect_code
      and geo_code is null
    into p_word_id;
  elsif p_dialect_code is null and p_geo_code is not null then
    select word_id
    from words
    where wordlike_string_id = v_current_wordlike_string_id
      and language_code = p_language_code
      and dialect_code is null
      and geo_code = p_geo_code
    into p_word_id;
  elsif p_dialect_code is not null and p_geo_code is not null then
    select word_id
    from words
    where wordlike_string_id = v_current_wordlike_string_id
      and language_code = p_language_code
      and dialect_code = p_dialect_code
      and geo_code = p_geo_code
    into p_word_id;
  end if;

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
    on conflict do nothing
    returning word_id
    into p_word_id;
  end if;

  if p_word_id is null then
    p_error_type := 'WordInsertFailed';
    return;
  end if;

  p_error_type := 'NoError';

end; $$;