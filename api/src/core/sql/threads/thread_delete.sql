create or replace procedure thread_delete(
  in p_token varchar(512),
  inout p_thread_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_thread_id bigint;
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


  -- delete row
  delete from threads
  where thread_id = p_thread_id;

  select thread_id 
  from threads
  into v_thread_id
  where thread_id = p_thread_id;

  if v_thread_id is not null then
    p_error_type := 'ForumFolderDeleteFailed';
    return;
  end if;

  p_error_type := 'NoError';

end; $$;