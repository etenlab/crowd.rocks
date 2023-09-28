create or replace procedure document_word_entry_upsert(
  in p_document_id bigint,
  in p_wordlike_string_id bigint,
  in p_parent_wordlike_string_id bigint,
  in p_token varchar(512),
  inout p_document_word_entry_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_user_id bigint;
  v_current_document_word_entry_id bigint;
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
  if p_document_id is null or p_wordlike_string_id is null or p_parent_wordlike_string_id is null then
    p_error_type := 'InvalidInputs';
    return;
  end if;

  -- check for document word entry existence
  select document_word_entry_id
  from document_word_entries
  where document_id = p_document_id
    and wordlike_string_id = p_wordlike_string_id
    and parent_wordlike_string_id = p_parent_wordlike_string_id
  into v_current_document_word_entry_id;

  -- create document word entry if needed
  if v_current_document_word_entry_id is null then
    insert into document_word_entries (document_id, wordlike_string_id, parent_wordlike_string_id, created_by)
    values (p_document_id, p_wordlike_string_id, p_parent_wordlike_string_id, v_user_id)
    on conflict do nothing
    returning document_word_entry_id
    into v_current_document_word_entry_id;

    if v_current_document_word_entry_id is null then
      select document_word_entry_id
      from document_word_entries
      where document_id = p_document_id
        and wordlike_string_id = p_wordlike_string_id
        and parent_wordlike_string_id = p_parent_wordlike_string_id
      into v_current_document_word_entry_id;
    end if;
  end if;

  if v_current_document_word_entry_id is null then
    p_error_type := 'DocumentWordEntryInsertFailed';
    return;
  end if;

  p_error_type := 'NoError';

end; $$;