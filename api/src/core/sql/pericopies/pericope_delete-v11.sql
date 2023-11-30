drop procedure if exists pericope_delete(
  in p_pericope_id bigint,
  in p_token varchar(512),
  inout p_error_type varchar(32)
);

create or replace procedure pericope_delete(
  in p_pericope_id bigint,
  in p_token varchar(512),
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_user_id bigint;
  v_document_created_by bigint;
  v_document_id bigint;
  v_pericope_id bigint;
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

  if p_pericope_id is null then
    p_error_type := 'InvalidInputs';
    return;
  end if; 

  -- check for pericope existence
  select pericope_id
  from pericopies
  where pericope_id = p_pericope_id
    and created_by = v_user_id
  into v_pericope_id;

  if v_pericope_id is null then
    p_error_type := 'PericopeNotFound';
    return;
  end if;

  delete
  from pericopies
  where pericope_id = p_pericope_id;

  p_error_type := 'NoError';

end; $$;