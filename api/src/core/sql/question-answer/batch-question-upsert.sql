create or replace procedure batch_question_upsert(
  in p_parent_tables varchar(64)[],
  in p_parent_ids bigint[],
  in p_question_type_is_multiselects bool[],
  in p_questions text[],
  in p_question_items_array jsonb[],
  in p_token varchar(512),
  inout p_question_ids bigint[],
  inout p_error_types varchar(32)[],
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_parent_tables_length int;
  v_parent_ids_length int;
  v_question_type_is_multiselects_length int;
  v_questions_length int;
  v_question_items_array_length int;

  v_question_item_ids bigint[];
  v_temp_question_id bigint;
  v_temp_error_type varchar(32);
begin
  p_error_type := 'UnknownError';

   -- validate inputs
  v_parent_tables_length := array_length(p_parent_tables::text[], 1);
  v_parent_ids_length := array_length(p_parent_ids::text[], 1);
  v_question_type_is_multiselects_length := array_length(p_question_type_is_multiselects::text[], 1);
  v_questions_length := array_length(p_questions::text[], 1);
  v_question_items_array_length := array_length(p_question_items_array::text[], 1);

  if v_parent_tables_length != v_parent_ids_length or
    v_parent_tables_length != v_question_type_is_multiselects_length or
    v_parent_tables_length != v_questions_length or
    v_parent_tables_length != v_question_items_array_length
  then
    p_error_type := "InvalidInputs";
    return;
  end if;

  p_question_ids := array[]::bigint[];
  p_error_types := array[]::varchar(32)[];

  for i in 1..v_parent_tables_length loop
    v_temp_question_id := 0;
    v_temp_error_type := 'NoError';

    v_question_item_ids := array(
      select id::bigint
      from jsonb_populate_recordset(null::IdType, p_question_items_array[i])
    );

    call question_upsert(
      p_parent_tables[i],
      p_parent_ids[i],
      p_question_type_is_multiselects[i],
      p_questions[i],
      v_question_item_ids,
      p_token,
      v_temp_question_id,
      v_temp_error_type
    );

    p_question_ids := array_append(p_question_ids, v_temp_question_id);
    p_error_types := array_append(p_error_types, v_temp_error_type);
  end loop;

  p_error_type := 'NoError';

end; $$;