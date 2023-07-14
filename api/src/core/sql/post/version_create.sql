CREATE OR REPLACE PROCEDURE post_version_create(
  in p_token varchar(64),
  IN p_part_id bigint,
  IN p_content text,
  in p_license_title int,
  inout p_new_version_id bigint,
  inout p_new_created_at varchar(32),
  INOUT p_error_type VARCHAR(32)
)
LANGUAGE PLPGSQL
AS $$
DECLARE
  v_user_id bigint;
  v_post_id bigint;
  v_post_creator bigint;
BEGIN
  -- ensure user is logged in
  select user_id
  into v_user_id
  from tokens
  where token = p_token;

  if v_user_id is null then
    p_error_type := 'TokenInvalid';
    return;
  end if;

  -- get post id
  select post_id
  from parts
  into v_post_id
  where part_id = p_part_id;

  if v_post_id is null then
    p_error_type := 'PostNotFound';
    return;
  end if;

  -- ensure user is author of this post
  select (created_by).i
  into v_post_creator
  from posts
  where post_id = v_post_id;

  if v_post_creator is null then
    p_error_type := 'Unauthorized';
    return;
  end if;

  if v_post_creator != v_user_id then
    p_error_type := 'Unauthorized';
    return;
  end if;

  insert into versions(part_id, content, license_title)
  values (p_part_id, p_content, p_license_title)
  returning version_id, created_at
  into p_new_version_id, p_new_created_at;

  if p_new_version_id is null or p_new_created_at is null then
    p_error_type := 'UnknownError';
    return;
  end if;

  update parts
  set current_version_id = p_new_version_id
  where part_id = p_part_id;

  p_error_type := 'NoError';

END; $$;