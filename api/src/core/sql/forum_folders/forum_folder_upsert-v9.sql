create or replace procedure forum_folder_upsert(
  in p_name varchar(128),
  in p_description text,
  in p_token varchar(512),
  in p_forum_id bigint,
  inout p_forum_folder_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_user_id bigint;
  v_created_by_id bigint;
  v_forum_folder_name varchar(128);
  v_forum_id bigint;
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

  select created_by
  from forum_folders
  into v_created_by_id
  where forum_folder_id = p_forum_folder_id;

  if v_created_by_id != v_user_id then
    p_error_type := 'Unauthorized';
    return;
  end if;

  -- validate forum
  if p_forum_id is null then
    p_error_type := 'ForumIdNotDefined';
    return;
  end if;

  select forum_id
  from forums 
  into v_forum_id
  where forum_id = p_forum_id;

  if v_forum_id is null then
    p_error_type := 'ForumForFolderNotExists';
    return;
  end if;


  -- update forum_folder if needed
  if p_forum_folder_id is not null then
    update forum_folders 
    set 
      name = p_name,
      description = p_description
    where forum_folder_id = p_forum_folder_id;

    select name
    from forum_folders
    into v_forum_folder_name
    where forum_folder_id = p_forum_folder_id;

    if v_forum_folder_name != p_name then
      p_error_type := 'ForumFolderUpsertFailed';
      return;
    end if;
  end if;

  -- create forum folder if needed
  if p_forum_folder_id is null then
    insert into forum_folders(
      forum_id,
      name, 
      description,
      created_by
    ) values (
      p_forum_id,
      p_name,
      p_description,
      v_user_id
    )
    on conflict do nothing
    returning forum_folder_id
    into p_forum_folder_id;
  end if;

  if p_forum_folder_id is null then
    p_error_type := 'ForumFolderUpsertFailed';
    return;
  end if;

  p_error_type := 'NoError';

end; $$;