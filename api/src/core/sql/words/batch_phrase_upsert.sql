create or replace procedure batch_phrase_upsert(
  in p_phraselike_strings text[],
  in p_words_array bigint[][],
  in p_token varchar(512),
  inout p_phrase_ids bigint[],
  inout p_error_types varchar(32)[],
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_phraselike_strings_length int;
  v_words_array_length int;

  v_temp_phrase_id bigint;
  v_temp_error_type varchar(32);
begin
   -- validate inputs
  v_phraselike_strings_length := array_length(p_phraselike_strings::text[], 1);
  v_words_array_length := array_length(p_words_array::bigint[][], 1);

  if v_phraselike_strings_length != v_words_array_length then
    p_error_type := "InvalidInputs";
  end if;

  p_phrase_ids := array[]::bigint[];
  p_error_types := array[]::varchar(32)[];

  for i in 1..v_phraselike_strings_length loop
    v_temp_phrase_id := 0;
    v_temp_error_type := 'NoError';

    call phrase_upsert(
      p_phraselike_strings[i],
      p_words_array[i],
      p_token,
      v_temp_phrase_id,
      v_temp_error_type
    );

    p_phrase_ids := array_append(p_phrase_ids, v_temp_phrase_id);
    p_error_types := array_append(p_error_types, v_temp_error_type);
  end loop;

  p_error_type := 'NoError';
end; $$;