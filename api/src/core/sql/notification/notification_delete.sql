create or replace procedure notification_delete(
  in p_token varchar(512),
  inout p_notification_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_notification_id bigint;
  v_user_id bigint;
  v_notification_user_id bigint;
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

  -- user can only delete own notifications
  select user_id
  from notifications
  into v_notification_user_id
  where user_id = v_user_id and notification_id = p_notification_id;

  if v_notification_user_id is null then
    p_error_type := 'Unauthorized';
    return;
  end if;


  -- delete row
  delete from notifications
  where notification_id = p_notification_id;

  select notification_id 
  from notifications
  into v_notification_id
  where notification_id = p_notification_id;

  if v_notification_id is not null then
    p_error_type := 'NotificationDeleteFailed';
    return;
  end if;

  p_error_type := 'NoError';

end; $$;