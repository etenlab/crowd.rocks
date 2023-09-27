create or replace procedure batch_document_word_entry_upsert(
  in p_document_ids bigint[],
  in p_wordlike_string_ids bigint[],
  in p_parent_wordlike_string_ids bigint[],
  in p_token varchar(512),
  inout p_document_word_entry_ids bigint[],
  inout p_error_types varchar(32)[],
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_document_ids_length int;
  v_wordlike_string_ids_length int;
  v_parent_wordlike_string_ids_length int;

  v_temp_document_word_entry_id bigint;
  v_temp_error_type varchar(32);
begin
  -- validate inputs
  v_document_ids_length := array_length(p_document_ids::bigint[], 1);
  v_wordlike_string_ids_length := array_length(p_wordlike_string_ids::bigint[], 1);
  v_parent_wordlike_string_ids_length := array_length(p_parent_wordlike_string_ids::bigint[], 1);

  if v_document_ids_length != v_wordlike_string_ids_length or
    v_document_ids_length != v_parent_wordlike_string_ids_length
  then
    p_error_type := 'InvalidInputs';
    return;
  end if;
  
  p_document_word_entry_ids := array[]::bigint[];
  p_error_types := array[]::varchar(32)[];

  for i in 1..v_document_ids_length loop
    v_temp_document_word_entry_id := 0;
    v_temp_error_type := 'NoError';

    call document_word_entry_upsert(
      p_document_ids[i],
      p_wordlike_string_ids[i],
      p_parent_wordlike_string_ids[i], 
      p_token,
      v_temp_document_word_entry_id,
      v_temp_error_type
    );

    p_document_word_entry_ids := array_append(p_document_word_entry_ids, v_temp_document_word_entry_id);
    p_error_types := array_append(p_error_types, v_temp_error_type);
  end loop;

  p_error_type := 'NoError';
end; $$;