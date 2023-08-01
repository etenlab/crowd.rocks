create or replace procedure word_definition_vote_upsert(
  in p_word_definition_id bigint,
  in p_vote bool,
  in p_token varchar(512),
  inout p_word_definitions_vote_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_user_id bigint;
  v_word_definition_id bigint;
begin
  p_error_type := 'UnknownError';

  -- validate user
  select user_id
  into v_user_id
  from tokens
  where token = p_token;

  if v_user_id is null then
    p_error_type := 'Unauthorized';
    return;
  end if;

  -- validate inpus
  if p_word_definition_id is null then
    p_error_type := 'InvalidInputs';
    return;
  end if;

  -- check for word_definition existance
  v_word_definition_id := null;

  select word_definition_id
  from word_definitions
  where word_definition_id = p_word_definition_id
  into v_word_definition_id;

  if v_word_definition_id is null then
    p_error_type := 'WordDefinitionNotFound';
    return;
  end if;

  insert into word_definitions_votes(word_definition_id, user_id, vote)
  values (p_word_definition_id, v_user_id, p_vote)
  on conflict (word_definition_id, user_id)
  do update set vote = EXCLUDED.vote
  returning word_definitions_vote_id
  into p_word_definitions_vote_id;

  if p_word_definitions_vote_id is null then
    select word_definitions_vote_id
    from word_definitions_votes
    where word_definition_id = p_word_definition_id
      and user_id = v_user_id
    into p_word_definitions_vote_id;
  end if;

  if p_word_definitions_vote_id is null then
    return;
  end if;
  
  p_error_type := 'NoError';

end; $$;