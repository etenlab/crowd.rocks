create or replace procedure batch_wordlike_string_upsert(
  in p_wordlike_strings varchar(64)[],
  in p_token varchar(512),
  inout p_wordlike_string_ids bigint[],
  inout p_error_types varchar(32)[],
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_wordlike_strings_length int;

  v_temp_wordlike_string_id bigint;
  v_temp_error_type varchar(32);
begin
  -- validate inputs
  v_wordlike_strings_length := array_length(p_wordlike_strings::text[], 1);
  
  p_wordlike_string_ids := array[]::bigint[];
  p_error_types := array[]::varchar(32)[];

  for i in 1..v_wordlike_strings_length loop
    v_temp_wordlike_string_id := 0;
    v_temp_error_type := 'NoError';

    call wordlike_string_upsert(
      p_wordlike_strings[i],
      p_token,
      v_temp_wordlike_string_id,
      v_temp_error_type
    );

    p_wordlike_string_ids := array_append(p_wordlike_string_ids, v_temp_wordlike_string_id);
    p_error_types := array_append(p_error_types, v_temp_error_type);
  end loop;

  p_error_type := 'NoError';
end; $$;