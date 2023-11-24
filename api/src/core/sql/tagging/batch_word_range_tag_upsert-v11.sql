create or replace procedure batch_word_range_tag_upsert(
  in p_word_range_ids bigint[],
  in p_word_range_tags jsonb[],
  in p_token varchar(512),
  inout p_word_range_tag_ids bigint[],
  inout p_error_types varchar(32)[],
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_word_range_ids_length int;
  v_word_range_tags_length int;

  v_temp_word_range_tag_id bigint;
  v_temp_error_type varchar(32);
begin
   -- validate inputs
  v_word_range_ids_length := array_length(p_word_range_ids::bigint[], 1);
  v_word_range_tags_length := array_length(p_word_range_tags::bigint[], 1);

  if v_word_range_ids_length != v_word_range_tags_length then
    p_error_type := "InvalidInputs";
    return;
  end if;
  
  p_word_range_tag_ids := array[]::bigint[];
  p_error_types := array[]::varchar(32)[];

  if v_word_range_ids_length = 0 then
    p_error_type := "NoError";
    return;
  end if;

  for i in 1..v_word_range_ids_length loop
    v_temp_word_range_tag_id := null;
    v_temp_error_type := 'NoError';

    call word_range_tag_upsert(
      p_word_range_ids[i],
      p_word_range_tags[i],
      p_token,
      v_temp_word_range_tag_id,
      v_temp_error_type
    );

    p_word_range_tag_ids := array_append(p_word_range_tag_ids, v_temp_word_range_tag_id);
    p_error_types := array_append(p_error_types, v_temp_error_type);
  end loop;

  p_error_type := 'NoError';
end; $$;