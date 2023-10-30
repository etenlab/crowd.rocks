create or replace procedure batch_word_to_word_translation_upsert(
  in p_from_word_definition_ids bigint[],
  in p_to_word_definition_ids bigint[],
  in p_token varchar(512),
  inout p_word_to_word_translation_ids bigint[],
  inout p_error_types varchar(32)[],
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_from_word_definition_ids_length int;
  v_to_word_definition_ids_length int;

  v_temp_word_to_word_translation_id bigint;
  v_temp_error_type varchar(32);
begin
  -- validate inputs
  v_from_word_definition_ids_length := array_length(
    p_from_word_definition_ids::bigint[], 1
  );
  v_to_word_definition_ids_length := array_length(
    p_to_word_definition_ids::bigint[], 1
  );

  if v_from_word_definition_ids_length != v_to_word_definition_ids_length then
    p_error_type := "InvalidInputs";
    return;
  end if;

  p_word_to_word_translation_ids := array[]::bigint[];
  p_error_types := array[]::varchar(32)[];

  for i in 1..v_from_word_definition_ids_length loop
    v_temp_word_to_word_translation_id := 0;
    v_temp_error_type := 'NoError';

    call word_to_word_translation_upsert(
      p_from_word_definition_ids[i],
      p_to_word_definition_ids[i],
      p_token,
      v_temp_word_to_word_translation_id,
      v_temp_error_type,
      false
    );

    p_word_to_word_translation_ids := array_append(
      p_word_to_word_translation_ids, 
      v_temp_word_to_word_translation_id
    );
    p_error_types := array_append(p_error_types, v_temp_error_type);
  end loop;

  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_words_languages;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_phrases_languages;  

  p_error_type := 'NoError';
end; $$;