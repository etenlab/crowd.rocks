create or replace procedure mark_notification_as_read(
  in p_notification_id bigint,
  in p_token varchar(512),
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_user_id bigint;
  v_notification_user_id bigint;
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

  select user_id
  from notifications
  into v_notification_user_id
  where user_id = v_user_id;

  if v_notification_user_id is null then
    p_error_type := 'Unauthorized';
    return;
  end if; 

  -- create notification
  update notifications 
  set is_notified = true
  where notification_id = p_notification_id;

  p_error_type := 'NoError';

end; $$;