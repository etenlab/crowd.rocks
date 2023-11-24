create or replace procedure word_range_tag_vote_toggle(
  in p_word_range_tag_id bigint,
  in p_vote boolean,
  in p_token varchar(512),
  inout p_words_vote_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_user_id bigint;
  v_vote boolean;
  v_word_range_tag_id bigint;
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
  if p_word_range_tag_id is null or p_vote is null then
    p_error_type := 'InvalidInputs';
    return;
  end if;

  -- check for word range tag existance
  v_word_range_tag_id := null;

  select word_range_tag_id
  from word_range_tags
  where word_range_tag_id = p_word_range_tag_id
  into v_word_range_tag_id;

  if v_word_range_tag_id is null then
    p_error_type := 'WordRangeTagNotFound';
    return;
  end if;

  v_vote := null;

  select vote
  from word_range_tags_votes
  where word_range_tag_id = p_word_range_tag_id
    and user_id = v_user_id
  into v_vote;

  if v_vote is not null and v_vote = p_vote then
    p_vote := null;
  end if;

  insert into word_range_tags_votes(word_range_tag_id, user_id, vote)
  values (p_word_range_tag_id, v_user_id, p_vote)
  on conflict (word_range_tag_id, user_id)
  do update set vote = EXCLUDED.vote
  returning word_range_tags_vote_id
  into p_word_range_tags_vote_id;

  if p_word_range_tags_vote_id is null then
    select word_range_tags_vote_id
    from word_range_tags_votes
    where word_range_tag_id = p_word_range_tag_id
      and user_id = v_user_id
    into p_word_range_tags_vote_id;
  end if;

  if p_word_range_tags_vote_id is null then
    return;
  end if;
  
  p_error_type := 'NoError';

end; $$;