create or replace procedure g1_election_create(
  in p_election_type varchar(32),
  in p_g1_node_id bigint,
  inout p_election_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare

begin
  p_error_type := 'UnknownError';

  if p_election_type is null then
    p_error_type := 'InvalidElectionType';
    return;
  end if;

  insert into g1_elections(election_type, g1_node_id)
  values (p_election_type, p_g1_node_id)
  on conflict do nothing
  returning election_id 
  into p_election_id;

  if p_election_id is null then
    return;
  end if;

  p_error_type := 'NoError';

end; $$;