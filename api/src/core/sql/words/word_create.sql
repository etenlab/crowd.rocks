create or replace procedure word_create(
  in p_content text,
  in p_parent_election bigint,
  in p_token varchar(512),
  in p_part_content_type varchar(64),
  inout p_post_id bigint,
  inout p_candidate bigint,
  inout p_rank int,
  inout p_tie bool,
  inout p_discussion_election bigint,
  inout p_created_at timestamp,
  inout p_user_id bigint,
  inout p_part_id bigint,
  inout p_version_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_parent_election bigint;
begin
  -- validate user
  select user_id
  into p_user_id
  from tokens
  where token = p_token;

  if p_user_id is null then
    p_error_type := 'Unauthorized';
    return;
  end if;

  -- check if parent election exists
  select election
  into v_parent_election
  from elections
  where election = p_parent_election;

  if v_parent_election is null then
    p_error_type := 'ParentElectionNotFound';
    return;
  end if;

  -- create candidate for new post
  call rav_add_candidate(v_parent_election, p_candidate, p_rank, p_tie, p_error_type);

  if p_error_type != 'NoError' then
    return;
  end if;

  -- create discussion election
  insert into elections
  values(DEFAULT)
  returning election
  into p_discussion_election;

  -- create post entry
  insert into posts(candidate, discussion_election, created_by)
  values (p_candidate, p_discussion_election, (p_user_id, 1))
  returning post_id, created_at
  into p_post_id, p_created_at;

  if p_post_id is null then
    p_error_type := 'PostCreateFailed';
    return;
  end if;

  insert into parts(post_id, position, content_type)
  values (p_post_id, 1, p_part_content_type)
  returning part_id
  into p_part_id;

  insert into versions(part_id, content)
  values (p_part_id, p_content)
  returning version_id
  into p_version_id;

  update parts
  set current_version_id = p_version_id
  where part_id = p_part_id;

  p_error_type := 'NoError';

end; $$;