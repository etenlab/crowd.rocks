create or replace procedure batch_word_upsert(
  in p_wordlike_strings varchar(64)[],
  in p_language_codes varchar(32)[],
  in p_dialect_codes varchar(32)[],
  in p_geo_codes varchar(32)[],
  in p_token varchar(512),
  inout p_word_ids bigint[],
  inout p_error_types varchar(32)[],
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_wordlike_strings_length int;
  v_language_codes_length int;
  v_dialect_codes_length int;
  v_p_geo_codes_length int;

  v_temp_word_id bigint;
  v_temp_error_type varchar(32);
begin
  -- validate inputs
  v_wordlike_strings_length := array_length(p_wordlike_strings::text[], 1);
  v_language_codes_length := array_length(p_language_codes::text[], 1);
  v_dialect_codes_length := array_length(p_dialect_codes::text[], 1);
  v_p_geo_codes_length := array_length(p_geo_codes::text[], 1);

  if v_wordlike_strings_length != v_language_codes_length or
    v_wordlike_strings_length != v_dialect_codes_length or
    v_wordlike_strings_length != v_p_geo_codes_length
  then
    p_error_type := "InvalidInputs";
    return;
  end if;
  
  p_word_ids := array[]::bigint[];
  p_error_types := array[]::varchar(32)[];

  for i in 1..v_wordlike_strings_length loop
    v_temp_word_id := 0;
    v_temp_error_type := 'NoError';

    call word_upsert(
      p_wordlike_strings[i],
      p_language_codes[i],
      p_dialect_codes[i], 
      p_geo_codes[i],
      p_token,
      v_temp_word_id,
      v_temp_error_type
    );

    p_word_ids := array_append(p_word_ids, v_temp_word_id);
    p_error_types := array_append(p_error_types, v_temp_error_type);
  end loop;

  p_error_type := 'NoError';
end; $$;