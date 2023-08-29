create or replace procedure post_create(
  in p_content text,
  in p_token varchar(512),
  in p_parent_table varchar(64),
  in p_forum_name varchar(128),
  in p_forum_folder_name varchar(128),
  in p_thread_name varchar(128),
  in p_parent_id bigint,
  inout p_post_id bigint,
  inout p_created_at timestamp,
  inout p_user_id bigint,
  inout p_version_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare 
  p_forum_id bigint;
  p_folder_id bigint;
  p_thread_id bigint;
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

  -- create forum entry if needed
  select forum_id 
  into p_forum_id
  from forums
  where name = p_forum_name;

  if p_forum_id is null then
    insert into forums(name, created_by)
    values (p_forum_name, p_user_id)
    returning forum_id
    into p_forum_id;
  end if;

  -- create folder entry if needed
  select forum_folder_id 
  into p_folder_id
  from forum_folders
  where name = p_forum_folder_name;

  if p_folder_id is null then
    insert into forum_folders(name, forum_id, created_by)
    values (p_forum_folder_name, p_forum_id, p_user_id)
    returning forum_folder_id 
    into p_folder_id;
  end if;

  -- create thread if needed
  select thread_id
  into p_thread_id
  from threads
  where name = p_thread_name;

  if p_thread_id is null then
    insert into threads(name, forum_folder_id, created_by)
    values (p_thread_name, p_folder_id, p_user_id)
    returning thread_id
    into p_thread_id;
  end if;

  -- create post entry
  insert into posts(parent_table, parent_id, thread_id, created_by)
  values (p_parent_table, p_parent_id, p_thread_id, p_user_id)
  returning post_id, created_at
  into p_post_id, p_created_at;

  if p_post_id is null then
    p_error_type := 'PostCreateFailed';
    return;
  end if;

  -- create version entry
  insert into versions(content, post_id)
  values (p_content, p_post_id)
  returning version_id
  into p_version_id;

  p_error_type := 'NoError';

end; $$;