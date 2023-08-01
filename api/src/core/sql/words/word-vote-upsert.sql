create or replace procedure word_vote_upsert(
  in p_word_id bigint,
  in p_vote bool,
  in p_token varchar(512),
  inout p_words_vote_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_user_id bigint;
  v_word_id bigint;
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
  if p_word_id is null then
    p_error_type := 'InvalidInputs';
    return;
  end if;

  -- check for word existance
  v_word_id := null;

  select word_id
  from words
  where word_id = p_word_id
  into v_word_id;

  if v_word_id is null then
    p_error_type := 'WordNotFound';
    return;
  end if;

  insert into words_votes(word_id, user_id, vote)
  values (p_word_id, v_user_id, p_vote)
  on conflict (word_id, user_id)
  do update set vote = EXCLUDED.vote
  returning words_vote_id
  into p_words_vote_id;

  if p_words_vote_id is null then
    select words_vote_id
    from words_votes
    where word_id = p_word_id
      and user_id = v_user_id
    into p_words_vote_id;
  end if;

  if p_words_vote_id is null then
    return;
  end if;
  
  p_error_type := 'NoError';

end; $$;