create or replace procedure forum_folder_delete(
  in p_token varchar(512),
  inout p_forum_folder_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_forum_folder_id bigint;
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
  delete from forum_folders
  where forum_folder_id = p_forum_folder_id;

  select forum_folder_id 
  from forum_folders
  into v_forum_folder_id
  where forum_folder_id = p_forum_folder_id;

  if v_forum_folder_id is not null then
    p_error_type := 'ForumFolderDeleteFailed';
    return;
  end if;

  p_error_type := 'NoError';

end; $$;