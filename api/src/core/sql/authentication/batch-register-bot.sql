create or replace procedure batch_register_bot(
  in p_tokens varchar(512)[],
  in p_emails varchar(255)[],
  in p_avatars varchar(64)[],
  in p_passwords varchar(128)[],
  inout p_user_ids bigint[],
  inout p_error_types varchar(32)[],
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_emails_length int;
  v_avatars_length int;
  v_passwords_length int;
  v_tokens_length int;

  v_temp_user_id bigint;
  v_temp_error_type varchar(32);
begin
  -- validate inputs
  v_emails_length := array_length(p_emails::text[], 1);
  v_avatars_length := array_length(p_avatars::text[], 1);
  v_passwords_length := array_length(p_passwords::text[], 1);
  v_tokens_length := array_length(p_tokens::text[], 1);

  if v_emails_length != v_avatars_length and v_emails_length != v_passwords_length and v_emails_length != v_tokens_length then
    p_error_type := "InvalidInputs";
    return;
  end if;

  p_user_ids := array[]::bigint[];
  p_error_types := array[]::varchar(32)[];

  for i in 1..v_emails_length loop
    v_temp_user_id := 0;
    v_temp_error_type := 'NoError';

    call authentication_register_bot(
      p_emails[i],
      p_avatars[i],
      p_passwords[i],
      p_tokens[i],
      v_temp_user_id,
      v_temp_error_type
    );

    p_user_ids := array_append(
      p_user_ids, 
      v_temp_user_id
    );
    p_error_types := array_append(p_error_types, v_temp_error_type);
  end loop;

  p_error_type := 'NoError';

end; $$;