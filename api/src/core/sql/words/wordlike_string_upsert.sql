create or replace procedure wordlike_string_upsert(
  in p_wordlike_string varchar(64),
  in p_token varchar(512),
  inout p_wordlike_string_id bigint,
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

  p_wordlike_string_id := null;

  -- create wordlike string if needed
  insert into wordlike_strings (wordlike_string, created_by)
  values (p_wordlike_string, v_user_id)
  on conflict do nothing
  returning wordlike_string_id
  into p_wordlike_string_id;

  if p_wordlike_string_id is null then
    select wordlike_string_id
    from wordlike_strings
    where wordlike_string = p_wordlike_string
    into p_wordlike_string_id;
  end if;

  if p_wordlike_string_id is null then
    p_error_type := 'WordLikeStringInsertFailed';
    return;
  end if;

  p_error_type := 'NoError';

end; $$;