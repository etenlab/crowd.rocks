create or replace procedure batch_answer_upsert(
  in p_question_ids bigint[],
  in p_answers text[],
  in p_question_items_array jsonb[],
  in p_token varchar(512),
  inout p_answer_ids bigint[],
  inout p_error_types varchar(32)[],
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_questions_ids_length int;
  v_answers_length int;
  v_question_items_array_length int;

  v_question_item_ids bigint[];
  v_temp_answer_id bigint;
  v_temp_error_type varchar(32);
begin
  p_error_type := 'UnknownError';

   -- validate inputs
  v_questions_ids_length := array_length(p_question_ids::text[], 1);
  v_answers_length := array_length(p_answers::text[], 1);
  v_question_items_array_length := array_length(p_question_items_array::text[], 1);

  if v_questions_ids_length != v_answers_length or
    v_questions_ids_length != v_question_items_array_length
  then
    p_error_type := "InvalidInputs";
    return;
  end if;

  p_answer_ids := array[]::bigint[];
  p_error_types := array[]::varchar(32)[];

  for i in 1..v_questions_ids_length loop
    v_temp_answer_id := 0;
    v_temp_error_type := 'NoError';

    v_question_item_ids := array(
      select id::bigint
      from jsonb_populate_recordset(null::IdType, p_question_items_array[i])
    );

    call answer_upsert(
      p_question_ids[i],
      p_answers[i],
      v_question_item_ids,
      p_token,
      v_temp_answer_id,
      v_temp_error_type
    );

    p_answer_ids := array_append(p_answer_ids, v_temp_answer_id);
    p_error_types := array_append(p_error_types, v_temp_error_type);
  end loop;

  p_error_type := 'NoError';

end; $$;