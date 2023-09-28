create or replace procedure answer_upsert(
  in p_question_id bigint,
  in p_answer text,
  in p_question_items bigint[],
  in p_token varchar(512),
  inout p_answer_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_user_id bigint;
  v_answer_id bigint;
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
  if p_question_id is null or p_answer is null or p_question_items is null then
    p_error_type := 'InvalidInputs';
    return;
  end if;

  insert into answers (question_id, answer, question_items, created_by)
  values (p_question_id, p_answer, p_question_items, v_user_id)
  on conflict do nothing
  returning answer_id
  into v_answer_id;

  if v_answer_id is null then
    select answer_id
    from answers
    where question_id = p_parent_table
      and answer = p_parent_id
      and created_by = v_user_id
    into v_answer_id;
  end if;

  if v_answer_id is null then
    p_error_type := 'AnswerInsertFailed';
    return;
  end if;

  p_error_type := 'NoError';

end; $$;