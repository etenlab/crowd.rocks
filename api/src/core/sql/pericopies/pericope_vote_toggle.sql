create or replace procedure pericope_vote_toggle(
  in p_pericope_id bigint,
  in p_vote boolean,
  in p_token varchar(512),
  inout p_pericope_vote_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_user_id bigint;
  v_vote boolean;
  v_pericope_id bigint;
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
  if p_pericope_id is null or p_vote is null then
    p_error_type := 'InvalidInputs';
    return;
  end if;

  -- check for pericope existance
  v_pericope_id := null;

  select p_pericope_id
  from pericopies
  where pericope_id = p_pericope_id
  into v_pericope_id;

  if v_pericope_id is null then
    p_error_type := 'PericopeNotFound';
    return;
  end if;

  v_vote := null;

  select vote
  from pericope_votes
  where pericope_id = p_pericope_id
    and user_id = v_user_id
  into v_vote;

  if v_vote is not null and v_vote = p_vote then
    p_vote := null;
  end if;

  insert into pericope_votes(pericope_id, user_id, vote)
  values (p_pericope_id, v_user_id, p_vote)
  on conflict (pericope_id, user_id)
  do update set vote = EXCLUDED.vote
  returning pericope_vote_id
  into p_pericope_vote_id;

  if p_pericope_vote_id is null then
    select pericope_vote_id
    from pericope_votes
    where pericope_id = p_pericope_id
      and user_id = v_user_id
    into p_pericope_vote_id;
  end if;

  if p_pericope_vote_id is null then
    p_error_type := 'PericopeVoteToggleFailed';
    return;
  end if;
  
  p_error_type := 'NoError';

end; $$;