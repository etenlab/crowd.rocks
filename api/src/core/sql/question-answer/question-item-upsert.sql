create or replace procedure question_item_upsert(
  in p_item varchar(64),
  inout p_question_item_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_question_item_id bigint;
begin
  p_error_type := 'UnknownError';

  -- check for question-item existence
  select question_item_id
  from question_items
  where item = p_item
  into v_question_item_id;

  -- create question item string if needed
  if v_question_item_id is null then
    insert into question_items (item)
    values (p_item)
    on conflict do nothing
    returning question_item_id
    into v_question_item_id;

    if v_question_item_id is null then
      select question_item_id
      from question_items
      where item = p_item
      into v_question_item_id;
    end if;
  end if;

  if v_question_item_id is null then
    p_error_type := 'QuestionItemInsertFailed';
    return;
  end if;

  p_error_type := 'NoError';

end; $$;