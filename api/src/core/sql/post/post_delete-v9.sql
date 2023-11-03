create or replace procedure post_delete(
  in p_token varchar(512),
  inout p_post_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare 
  v_post_id bigint;
  v_created_by_id bigint;
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

  select created_by
  from forums
  into v_created_by_id
  where forum_id = p_forum_id;

  if v_created_by_id != v_user_id then
    p_error_type := 'Unauthorized';
    return;
  end if;
  
  -- delete row
  delete from posts
  where post_id = p_post_id;

  select post_id 
  from posts
  into v_post_id
  where post_id = p_post_id;

  if v_post_id is not null then
    p_error_type := 'PostDeleteFailed';
    return;
  end if;

  p_error_type := 'NoError';

end; $$;