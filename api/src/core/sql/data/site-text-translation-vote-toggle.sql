create or replace procedure site_text_translation_vote_toggle(
  in p_site_text_translation_id bigint,
  in p_vote boolean,
  in p_token varchar(512),
  inout p_site_text_translation_vote_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_user_id bigint;
  v_vote boolean;
  v_site_text_translation_id bigint;
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
  if p_site_text_translation_id is null or p_vote is null then
    p_error_type := 'InvalidInputs';
    return;
  end if;

  -- check for site_text_translation existance
  v_site_text_translation_id := null;

  select site_text_translation_id
  from site_text_translations
  where site_text_translation_id = p_site_text_translation_id
  into v_site_text_translation_id;

  if v_site_text_translation_id is null then
    p_error_type := 'SiteTextTranslationNotFound';
    return;
  end if;

  v_vote := null;

  select vote
  from site_text_translation_votes
  where site_text_translation_id = v_site_text_translation_id
    and user_id = v_user_id
  into v_vote;

  if v_vote is not null and v_vote = p_vote then
    p_vote := null;
  end if;

  insert into site_text_translation_votes(site_text_translation_id, user_id, vote)
  values (p_site_text_translation_id, v_user_id, p_vote)
  on conflict (site_text_translation_id, user_id)
  do update set vote = EXCLUDED.vote
  returning site_text_translation_vote_id
  into p_site_text_translation_vote_id;

  if p_site_text_translation_vote_id is null then
    select site_text_translation_vote_id
    from site_text_translation_votes
    where site_text_translation_id = p_site_text_translation_id
      and user_id = v_user_id
    into p_site_text_translation_vote_id;
  end if;

  if p_site_text_translation_vote_id is null then
    return;
  end if;
  
  p_error_type := 'NoError';

end; $$;