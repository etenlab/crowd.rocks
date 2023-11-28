create or replace procedure word_range_tag_upsert(
  in p_word_range_id bigint,
  in p_word_range_tag jsonb,
  in p_token varchar(512),
  inout p_word_range_tag_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_user_id bigint;
  v_current_word_range_id bigint;
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

  if p_word_range_id is null or p_word_range_tag is null then
    p_error_type := 'InvalidInputs';
    return;
  end if;

  v_current_word_range_id := null;

  -- check for word range existence
  select word_range_id
  from word_ranges
  where word_range_id = p_word_range_id
  into v_current_word_range_id;

  if v_current_word_range_id is null then
    p_error_type := 'WordRangeNotExists';
    return;
  end if;

  -- check for word range tag existence
  select word_range_tag_id
  from word_range_tags
  where word_range_id = p_word_range_id
    and word_range_tag = p_word_range_tag
  into p_word_range_tag_id;

  -- create word_range tag if needed
  if p_word_range_tag_id is null then
    insert into word_range_tags(
      word_range_id, 
      word_range_tag,
      created_by
    ) values (
      p_word_range_id,
      p_word_range_tag,
      v_user_id
    )
    on conflict do nothing
    returning word_range_tag_id
    into p_word_range_tag_id;
  end if;

  if p_word_range_tag_id is null then
    p_error_type := 'WordRangeTagInsertFailed';
    return;
  end if;

  p_error_type := 'NoError';

end; $$;