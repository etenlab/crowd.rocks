create or replace procedure phrase_upsert(
  in p_start_word bigint,
  in p_token varchar(512),
  inout p_pericope_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_user_id bigint;
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

  if p_start_word is null then
    p_error_type := 'InvalidInputs';
    return;
  end if; 

  p_pericope_id := null;

  -- insert pericope
  insert into pericopies(start_word, created_by)
  values (p_start_word, v_user_id)
  on conflict do nothing
  returning pericope_id
  into p_pericope_id;

  if p_pericope_id is null then
    select pericope_id
    from pericopies
    where start_word = p_start_word
    into p_pericope_id;
  end if;

  if p_pericope_id is null then
    p_error_type := 'PericopeInsertFailed';
    return;
  end if;

  p_error_type := 'NoError';

end; $$;