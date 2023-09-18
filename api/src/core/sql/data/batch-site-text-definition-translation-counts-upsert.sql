create or replace procedure batch_site_text_translation_count_upsert(
  in p_site_text_ids bigint[],
  in p_is_word_definitions bool[],
  in p_language_codes varchar(32)[],
  in p_dialect_codes varchar(32)[],
  in p_geo_codes varchar(32)[],
  in p_counts bigint[],
  inout p_site_text_translation_count_ids bigint[],
  inout p_error_types varchar(32)[],
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_site_text_ids_length int;
  v_is_word_definitions_length int;
  v_language_codes_length int;
  v_dialect_codes_length int;
  v_geo_codes_length int;
  v_counts_length int;

  v_temp_site_text_translation_count_id bigint;
  v_temp_error_type varchar(32);
begin
  -- validate inputs
  v_site_text_ids_length := array_length(
    p_site_text_ids::bigint[], 1
  );
  v_is_word_definitions_length := array_length(
    p_is_word_definitions::bool[], 1
  );
  v_language_codes_length := array_length(
    p_language_codes::varchar(32)[], 1
  );
  v_dialect_codes_length := array_length(
    p_dialect_codes::varchar(32)[], 1
  );
  v_geo_codes_length := array_length(
    p_geo_codes::varchar(32)[], 1
  );
  v_counts_length := array_length(
    p_counts::bigint[], 1
  );

  if v_site_text_ids_length != v_is_word_definitions_length or
    v_site_text_ids_length != v_language_codes_length or
    v_site_text_ids_length != v_dialect_codes_length or
    v_site_text_ids_length != v_geo_codes_length or
    v_site_text_ids_length != v_counts_length
  then
    p_error_type := "InvalidInputs";
    return;
  end if;

  p_site_text_translation_count_ids := array[]::bigint[];
  p_error_types := array[]::varchar(32)[];

  for i in 1..v_site_text_ids_length loop
    v_temp_site_text_translation_count_id := 0;
    v_temp_error_type := 'NoError';

    call site_text_translation_count_upsert(
      p_site_text_ids[i],
      p_is_word_definitions[i],
      p_language_codes[i],
      p_dialect_codes[i],
      p_geo_codes[i],
      p_counts[i],
      v_temp_site_text_translation_count_id,
      v_temp_error_type
    );

    p_site_text_translation_count_ids := array_append(p_site_text_translation_count_ids, v_temp_site_text_translation_count_id);
    p_error_types := array_append(p_error_types, v_temp_error_type);
  end loop;

  p_error_type := 'NoError';
end; $$;