create or replace procedure thread_upsert(
  in p_name varchar(128),
  in p_token varchar(512),
  in p_forum_folder_id bigint,
  inout p_thread_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_user_id bigint;
  v_thread_name varchar(128);
  v_forum_folder_id bigint;
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

  -- validate forum_folder
  if p_forum_folder_id is null then
    p_error_type := 'FolderIdNotDefined';
    return;
  end if;

  select forum_folder_id
  from forum_folders 
  into v_forum_folder_id
  where forum_folder_id = p_forum_folder_id;

  if v_forum_folder_id is null then
    p_error_type := 'FolderForThreadNotExists';
    return;
  end if;


  -- update thread if needed
  if p_thread_id is not null then
    update threads 
    set name = p_name
    where thread_id = p_thread_id;

    select name
    from threads
    into v_thread_name
    where thread_id = p_thread_id;

    if v_thread_name != p_name then
      p_error_type := 'ThreadUpsertFailed';
      return;
    end if;
  end if;

  -- create thread if needed
  if p_thread_id is null then
    insert into threads(
      forum_folder_id,
      name, 
      created_by
    ) values (
      p_forum_folder_id,
      p_name,
      v_user_id
    )
    on conflict do nothing
    returning thread_id
    into p_thread_id;
  end if;

  if p_thread_id is null then
    p_error_type := 'ThreadUpsertFailed';
    return;
  end if;

  p_error_type := 'NoError';

end; $$;