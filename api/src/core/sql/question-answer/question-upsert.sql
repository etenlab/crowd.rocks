create or replace procedure question_upsert(
  in p_parent_table varchar(64),
  in p_parent_id bigint,
  in p_question_type_is_multiselect bool,
  in p_question text,
  in p_question_items bigint[],
  in p_token varchar(512),
  inout p_question_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_user_id bigint;
  v_question_id bigint;
begin
  p_error_type := 'UnknownError';

  -- validate user
  select user_id
  from tokens
  into v_user_id
  where token = p_token;

  if v_user_id is null then
    p_error_type := 'Unauthorized';
    return;
  end if;

  -- validate for inputs
  if p_parent_table is null or p_parent_id is null or p_question_type_is_multiselect is null or p_question is null or p_question_items is null then
    p_error_type := 'InvalidInputs';
    return;
  end if;

  insert into questions (parent_table, parent_id, question_type_is_multiselect, question, question_items, created_by)
  values (p_parent_table, p_parent_id, p_question_type_is_multiselect, p_question, p_question_items, v_user_id)
  on conflict do nothing
  returning question_id
  into v_question_id;

  if v_question_id is null then
    select question_id
    from questions
    where parent_table = p_parent_table
      and parent_id = p_parent_id
      and question_type_is_multiselect = p_question_type_is_multiselect
      and question = p_question
      and created_by = v_user_id
    into v_question_id;
  end if;

  if v_question_id is null then
    p_error_type := 'QuestionInsertFailed';
    return;
  end if;

  p_error_type := 'NoError';

end; $$;