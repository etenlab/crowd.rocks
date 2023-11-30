drop procedure if exists pericope_upsert(
  in p_start_word bigint,
  in p_token varchar(512),
  inout p_pericope_id bigint,
  inout p_error_type varchar(32)
);

create or replace procedure pericope_upsert(
  in p_start_word bigint,
  in p_token varchar(512),
  inout p_pericope_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_user_id bigint;
  v_document_created_by bigint;
  v_document_id bigint;
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

  -- check for start_word existence
  select document_id
  from document_word_entries
  where document_word_entry_id = p_start_word
  into v_document_id;
 
  if v_document_id is null then
    p_error_type := v_document_id;
    return;
  end if;

  select created_by
  from documents
  where document_id = v_document_id
  into v_document_created_by;

  if v_document_created_by is null or v_document_created_by != v_user_id then
    p_error_type := 'Unauthorized';
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