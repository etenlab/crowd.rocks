create or replace procedure phrase_definition_vote_upsert(
  in p_phrase_definition_id bigint,
  in p_vote bool,
  in p_token varchar(512),
  inout p_phrase_definitions_vote_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_user_id bigint;
  v_phrase_definition_id bigint;
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
  if p_phrase_definition_id is null then
    p_error_type := 'InvalidInputs';
    return;
  end if;

  -- check for word_definition existance
  v_phrase_definition_id := null;

  select phrase_definition_id
  from phrase_definitions
  where phrase_definition_id = p_phrase_definition_id
  into v_phrase_definition_id;

  if v_phrase_definition_id is null then
    p_error_type := 'PhraseDefinitionNotFound';
    return;
  end if;

  insert into phrase_definitions_votes(phrase_definition_id, user_id, vote)
  values (p_phrase_definition_id, v_user_id, p_vote)
  on conflict (phrase_definition_id, user_id)
  do update set vote = EXCLUDED.vote
  returning phrase_definitions_vote_id
  into p_phrase_definitions_vote_id;

  if p_phrase_definitions_vote_id is null then
    select phrase_definitions_vote_id
    from phrase_definitions_votes
    where phrase_definition_id = p_phrase_definition_id
      and user_id = v_user_id
    into p_phrase_definitions_vote_id;
  end if;

  if p_phrase_definitions_vote_id is null then
    return;
  end if;
  
  p_error_type := 'NoError';

end; $$;