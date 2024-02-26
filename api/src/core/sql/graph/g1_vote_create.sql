create or replace procedure g1_vote_create(
  in p_user_id bigint,
  in p_entity_id bigint,
  in p_vote bool,
  inout p_g1_vote_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare

begin
  p_error_type := 'UnknownError';

  insert into g1_votes(user_id, entity_id, vote)
  values (p_user_id, p_entity_id, p_vote)
  on conflict (user_id, entity_id) do update set vote = excluded.vote
  returning g1_vote_id 
  into p_g1_vote_id;

  if p_g1_vote_id is null then
    return;
  end if;

  p_error_type := 'NoError';

end; $$;