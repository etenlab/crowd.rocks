create or replace procedure phrase_upsert(
  in words bigint[],
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

  -- check for phrase existence


  p_error_type := 'NoError';

end; $$;