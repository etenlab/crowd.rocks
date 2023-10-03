create or replace procedure batch_question_item_upsert(
  in p_items varchar(64)[],
  inout p_question_item_ids bigint[],
  inout p_error_types varchar(32)[],
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_items_length int;

  v_temp_question_item_id bigint;
  v_temp_error_type varchar(32);
begin
  p_error_type := 'UnknownError';

  -- validate inputs
  v_items_length := array_length(p_items::text[], 1);

  p_question_item_ids := array[]::bigint[];
  p_error_types := array[]::varchar(32)[];

  for i in 1..v_items_length loop
    v_temp_question_item_id := null;
    v_temp_error_type := 'NoError';

    call question_item_upsert(
      p_items[i],
      v_temp_question_item_id,
      v_temp_error_type
    );

    p_question_item_ids := array_append(p_question_item_ids, v_temp_question_item_id);
    p_error_types := array_append(p_error_types, v_temp_error_type);
  end loop;

  p_error_type := 'NoError';

end; $$;