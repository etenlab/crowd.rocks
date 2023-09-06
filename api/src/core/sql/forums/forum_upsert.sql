create or replace procedure forum_upsert(
  in p_name varchar(128),
  in p_token varchar(512),
  inout p_forum_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_user_id bigint;
  v_forum_name varchar(128);
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


  -- update forum if needed
  if p_forum_id is not null then
    update forums 
    set name = p_name
    where forum_id = p_forum_id;

    select name
    from forums
    into v_forum_name
    where forum_id = p_forum_id;

    if v_forum_name != p_name then
      p_error_type := 'ForumUpsertFailed';
      return;
    end if;
  end if;

  -- create word if needed
  if p_forum_id is null then
    insert into forums(
      name, 
      created_by
    ) values (
      p_name,
      v_user_id
    )
    on conflict do nothing
    returning forum_id
    into p_forum_id;
  end if;

  if p_forum_id is null then
    p_error_type := 'ForumUpsertFailed';
    return;
  end if;

  p_error_type := 'NoError';

end; $$;