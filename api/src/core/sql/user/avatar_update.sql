create or replace procedure user_avatar_update(
  in p_token varchar(512),
  in p_avatar varchar(64),
  inout p_user_id bigint,
  inout p_url varchar(128),
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
begin
  -- validate user
  select user_id
  into p_user_id
  from tokens
  where token = p_token;

  if p_user_id is null then
    p_error_type := 'Unauthorized';
    return;
  end if;

  update avatars
  set avatar = p_avatar
  where user_id = p_user_id
  returning url
  into p_url;

  p_error_type := 'NoError';

end; $$;