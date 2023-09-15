create or replace procedure post_create(
  in p_content text,
  in p_token varchar(512),
  in p_parent_table varchar(64),
  in p_parent_id bigint,
  in p_file_id bigint,
  inout p_post_id bigint,
  inout p_created_at timestamp,
  inout p_user_id bigint,
  inout p_version_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare v_file_id bigint;
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

  -- validate file
  if p_file_id is not null then
    select file_id
    from files into v_file_id
    where file_id = p_file_id;
    if v_file_id is null then
     p_error_type := 'FileNotExists';
     return;
    end if;
  end if;


  -- create post entry
  insert into posts(parent_table, parent_id, created_by)
  values (p_parent_table, p_parent_id, p_user_id)
  returning post_id, created_at
  into p_post_id, p_created_at;

  if p_post_id is null then
    p_error_type := 'PostCreateFailed';
    return;
  end if;

  -- create version entry
  insert into versions(content, post_id, file_id)
  values (p_content, p_post_id, p_file_id)
  returning version_id
  into p_version_id;

  p_error_type := 'NoError';

end; $$;