create or replace procedure flag_upsert(
  in p_parent_table varchar(64),
  in p_parent_id bigint,
  in p_name varchar(64),
  in p_token varchar(512),
  inout p_flag_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_user_id bigint;
  v_flag_id bigint;
begin
  p_error_type := 'UnknownError';

  -- validate user
  select user_id
  into v_user_id
  from tokens
  where token = p_token;

  if v_user_id is null then
    p_error_type := 'Unauthorized';
    return;
  end if;

  -- validate inpus
  if p_parent_table is null or p_parent_id is null or p_name is null then
    p_error_type := 'InvalidInputs';
    return;
  end if;

  insert into flags(parent_table, parent_id, name, created_by)
  values (p_parent_table, p_parent_id, p_name, v_user_id)
  on conflict do nothing
  returning flag_id
  into p_flag_id;

  if p_flag_id is null then
    select flag_id
    from flags
    where parent_table = p_parent_table
      and parent_id = p_parent_id
      and name = p_name
      and created_by = v_user_id;
    into p_flag_id;
  end if;
  
  p_error_type := 'NoError';

end; $$;