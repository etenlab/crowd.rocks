create or replace procedure phrase_vote_toggle(
  in p_phrase_id bigint,
  in p_vote boolean,
  in p_token varchar(512),
  inout p_phrase_vote_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_user_id bigint;
  v_vote boolean;
  v_phrase_id bigint;
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
  if p_phrase_id is null or p_vote is null then
    p_error_type := 'InvalidInputs';
    return;
  end if;

  -- check for phrase existance
  v_phrase_id := null;

  select phrase_id
  from phrases
  where phrase_id = p_phrase_id
  into v_phrase_id;

  if v_phrase_id is null then
    p_error_type := 'PhraseNotFound';
    return;
  end if;

  v_vote := null;

  select vote
  from phrase_votes
  where phrase_id = p_phrase_id
    and user_id = v_user_id
  into v_vote;

  if v_vote is not null and v_vote = p_vote then
    p_vote := null;
  end if;

  insert into phrase_votes(phrase_id, user_id, vote)
  values (p_phrase_id, v_user_id, p_vote)
  on conflict (phrase_id, user_id)
  do update set vote = EXCLUDED.vote
  returning phrase_vote_id
  into p_phrase_vote_id;

  if p_phrase_vote_id is null then
    select phrase_vote_id
    from phrase_votes
    where phrase_id = p_phrase_id
      and user_id = v_user_id
    into p_phrase_vote_id;
  end if;

  if p_phrase_vote_id is null then
    return;
  end if;
  
  p_error_type := 'NoError';

end; $$;