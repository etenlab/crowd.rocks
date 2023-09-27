create or replace procedure authentication_register(
  in p_email varchar(255),
  in p_avatar varchar(64),
  in p_password varchar(128),
  in p_token text,
  inout p_user_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_email varchar(255);
  v_avatar varchar(64);
  v_token varchar(512);
begin
  select user_id
  from users
  into p_user_id
  where email = p_email;

  if found then
    p_error_type := 'EmailUnavailable';
    return;
  end if;

  insert into users(email, password)
  values (p_email, p_password)
  returning user_id
  into p_user_id;

  insert into tokens(user_id, token)
  values (p_user_id, p_token);

  insert into avatars(user_id, avatar)
  values (p_user_id, p_avatar);

  p_error_type := 'NoError';

end; $$;