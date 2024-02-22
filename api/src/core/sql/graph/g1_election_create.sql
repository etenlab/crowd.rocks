create or replace procedure g1_election_create(
  in p_g1_election_type varchar(32),
  in p_g1_entity_id bigint,
  inout p_g1_election_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare

begin
  p_error_type := 'UnknownError';

  if p_g1_election_type is null then
    p_error_type := 'InvalidG1ElectionType';
    return;
  end if;

  insert into g1_elections(g1_election_type, g1_entity_id)
  values (p_g1_election_type, p_g1_entity_id)
  on conflict do nothing
  returning g1_election_id 
  into p_g1_election_id;

  if p_g1_election_id is null then
    return;
  end if;

  p_error_type := 'NoError';

end; $$;