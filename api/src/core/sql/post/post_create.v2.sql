create or replace procedure post_create(
  in p_content text,
  in p_token varchar(512),
  in p_parent_table varchar(64),
  in p_parent_id bigint,
  inout p_post_id bigint,
  inout p_created_at timestamp,
  inout p_user_id bigint,
  inout p_version_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
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