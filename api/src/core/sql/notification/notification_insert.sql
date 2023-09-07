create or replace procedure notification_insert(
  in p_user_id bigint,
  in p_text text,
  in p_token varchar(512),
  inout p_notification_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_user_id bigint;
  v_created_by_id bigint;
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

  -- create notification
  insert into notifications(
    user_id, 
    text
  ) values (
    p_user_id,
    p_text
  )
  on conflict do nothing
  returning notification_id
  into p_notification_id;

  if p_notification_id is null then
    p_error_type := 'NotificationInsertFailed';
    return;
  end if;

  p_error_type := 'NoError';

end; $$;