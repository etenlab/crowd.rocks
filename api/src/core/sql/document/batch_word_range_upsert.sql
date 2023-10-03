create or replace procedure batch_word_range_upsert(
  in p_begin_words bigint[],
  in p_end_words bigint[],
  in p_token varchar(512),
  inout p_word_range_ids bigint[],
  inout p_error_types varchar(32)[],
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_begin_words_length int;
  v_end_words_length int;

  v_temp_word_range_id bigint;
  v_temp_error_type varchar(32);
begin
  -- validate inputs
  v_begin_words_length := array_length(p_begin_words::bigint[], 1);
  v_end_words_length := array_length(p_end_words::bigint[], 1);

  if v_begin_words_length != v_end_words_length then
    p_error_type := 'InvalidInputs';
    return;
  end if;
  
  p_word_range_ids := array[]::bigint[];
  p_error_types := array[]::varchar(32)[];

  for i in 1..v_begin_words_length loop
    v_temp_word_range_id := null;
    v_temp_error_type := 'NoError';

    call word_range_upsert(
      p_begin_words[i],
      p_end_words[i],
      p_token,
      v_temp_word_range_id,
      v_temp_error_type
    );

    p_word_range_ids := array_append(p_word_range_ids, v_temp_word_range_id);
    p_error_types := array_append(p_error_types, v_temp_error_type);
  end loop;

  p_error_type := 'NoError';
end; $$;