drop procedure if exists word_range_upsert;
create or replace procedure word_range_upsert(
  in p_begin_word bigint,
  in p_end_word bigint,
  in p_token varchar(512),
  inout p_word_range_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_user_id bigint;
  v_current_word_range_id bigint;

  v_document_word_entry_id bigint;
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

  -- validate inpus
  if p_begin_word is null or p_end_word is null then
    p_error_type := 'InvalidInputs';
    return;
  end if;

  -- check for document word entry existence
  v_document_word_entry_id := null;

  select document_word_entry_id
  from document_word_entries
  where document_word_entry_id = p_begin_word
  into v_document_word_entry_id;

  if v_document_word_entry_id is null then
    p_error_type := 'DocumentWordEntryNotFound';
  end if;

  v_document_word_entry_id := null;

  select document_word_entry_id
  from document_word_entries
  where document_word_entry_id = p_end_word
  into v_document_word_entry_id;

  if v_document_word_entry_id is null then
    p_error_type := 'DocumentWordEntryNotFound';
  end if;

  p_word_range_id := null;

  -- check for word range existence
  select word_range_id
  from word_ranges
  where begin_word = p_begin_word
    and end_word = p_end_word
  into p_word_range_id;

  -- create word_range if needed
  if p_word_range_id is null then
    insert into word_ranges (begin_word, end_word, created_by)
    values (p_begin_word, p_end_word, v_user_id)
    on conflict do nothing
    returning word_range_id
    into p_word_range_id;

    if p_word_range_id is null then
      select word_range_id
      from word_ranges
      where begin_word = p_begin_word
        and end_word = p_end_word
      into p_word_range_id;
    end if;
  end if;

  if p_word_range_id is null then
    p_error_type := 'WordRangeInsertFailed';
    return;
  end if;

  p_error_type := 'NoError';

end; $$;