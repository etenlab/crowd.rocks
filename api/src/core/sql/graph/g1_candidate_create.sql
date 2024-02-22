create or replace procedure g1_candidate_create(
  in p_election_id bigint,
  in p_g1_node_id bigint,
  inout p_candidate_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare

begin
  p_error_type := 'UnknownError';

  insert into g1_candidates(election_id, g1_node_id)
  values (p_election_id, p_g1_node_id)
  on conflict do nothing
  returning candidate_id 
  into p_candidate_id;

  if p_candidate_id is null then
    return;
  end if;

  p_error_type := 'NoError';

end; $$;