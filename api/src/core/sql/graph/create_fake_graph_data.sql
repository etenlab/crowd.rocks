-- helper file. this function is not loaded into prod

create or replace procedure create_fake_graph_data(
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  user1 bigint;
  user2 bigint;
  user3 bigint;
  user4 bigint;

  -- for the sake of not having my brain explode we will be reusing 
  -- the variables below as the data is loaded. this means this whole 
  -- file is very procedural.

  votedId bigint; 

  entity bigint;
  keyElection bigint;

  key1 bigint;
  key1Candidate bigint; -- for key election
  key1ValueElection bigint; -- for value election

  key2 bigint;
  key2Candidate bigint; -- for key election
  key2ValueElection bigint; -- for value election

  value1 bigint;
  value1Candidate bigint; -- for value election

  value2 bigint;
  value2Candidate bigint; -- for value election

begin
  p_error_type := 'UnknownError';

  insert into users(email, password)
  values(substr(uuid_generate_v4()::text,1,15) || '@asdf.asdf', 'asdfasdf')
  on conflict do nothing
  returning user_id
  into user1;

  insert into users(email, password)
  values(substr(uuid_generate_v4()::text,1,15) || '@asdf.asdf', 'asdfasdf')
  on conflict do nothing
  returning user_id
  into user2;

  insert into users(email, password)
  values(substr(uuid_generate_v4()::text,1,15) || '@asdf.asdf', 'asdfasdf')
  on conflict do nothing
  returning user_id
  into user3;

  insert into users(email, password)
  values(substr(uuid_generate_v4()::text,1,15) || '@asdf.asdf', 'asdfasdf')
  on conflict do nothing
  returning user_id
  into user4;

  -- NODE 1
  
  -- a node and its key election
  call g1_entity_create('Word', '"Bob"'::jsonb, entity, p_error_type);
  call g1_election_create('NodeKey', entity, keyElection, p_error_type);

    -- KEY 1 FOR NODE ABOVE

    -- a key, its candidacy in the node's key election, and it's value election
    call g1_entity_create('Key', '"isNoun"'::jsonb, key1, p_error_type);
    call g1_candidate_create(keyElection,key1,key1Candidate,p_error_type);
    call g1_election_create('KeyValue', key1, key1ValueElection, p_error_type);

    -- a value for the key above and it's candidacy in the key's value election
    call g1_entity_create('Value', 'true'::jsonb, value1, p_error_type);
    call g1_candidate_create(key1ValueElection,value1,value1Candidate,p_error_type);

    -- a value for the key above and it's candidacy in the key's value election
    call g1_entity_create('Value', 'false'::jsonb, value2, p_error_type);
    call g1_candidate_create(key1ValueElection,value2,value2Candidate,p_error_type);

    -- votes for everything above
    call g1_vote_create(user1,key1Candidate,true,votedId,p_error_type);
    call g1_vote_create(user2,key1Candidate,true,votedId,p_error_type);
    call g1_vote_create(user3,key1Candidate,true,votedId,p_error_type);
    call g1_vote_create(user4,key1Candidate,false,votedId,p_error_type);

    call g1_vote_create(user1,value1Candidate,true,votedId,p_error_type);
    call g1_vote_create(user2,value1Candidate,true,votedId,p_error_type);
    call g1_vote_create(user3,value1Candidate,true,votedId,p_error_type);
    call g1_vote_create(user4,value1Candidate,false,votedId,p_error_type);

    call g1_vote_create(user1,value2Candidate,true,votedId,p_error_type);
    call g1_vote_create(user2,value2Candidate,true,votedId,p_error_type);
    call g1_vote_create(user3,value2Candidate,true,votedId,p_error_type);
    call g1_vote_create(user4,value2Candidate,false,votedId,p_error_type);

    -- RESET -- variables will now be reused for the next key and values

    -- KEY 2 FOR NODE ABOVE

    -- a key, its candidacy in the node's key election, and it's value election
    call g1_entity_create('Key', '"isVerb"'::jsonb, key1, p_error_type);
    call g1_candidate_create(keyElection,key1,key1Candidate,p_error_type);
    call g1_election_create('KeyValue', key1, key1ValueElection, p_error_type);

    -- a value for the key above and it's candidacy in the key's value election
    call g1_entity_create('Value', 'true'::jsonb, value1, p_error_type);
    call g1_candidate_create(key1ValueElection,value1,value1Candidate,p_error_type);

    -- a value for the key above and it's candidacy in the key's value election
    call g1_entity_create('Value', 'false'::jsonb, value2, p_error_type);
    call g1_candidate_create(key1ValueElection,value2,value2Candidate,p_error_type);

    -- votes for everything above
    call g1_vote_create(user1,key1Candidate,true,votedId,p_error_type);
    call g1_vote_create(user2,key1Candidate,true,votedId,p_error_type);
    call g1_vote_create(user3,key1Candidate,true,votedId,p_error_type);
    call g1_vote_create(user4,key1Candidate,false,votedId,p_error_type);

    call g1_vote_create(user1,value1Candidate,true,votedId,p_error_type);
    call g1_vote_create(user2,value1Candidate,true,votedId,p_error_type);
    call g1_vote_create(user3,value1Candidate,true,votedId,p_error_type);
    call g1_vote_create(user4,value1Candidate,false,votedId,p_error_type);

    call g1_vote_create(user1,value2Candidate,true,votedId,p_error_type);
    call g1_vote_create(user2,value2Candidate,true,votedId,p_error_type);
    call g1_vote_create(user3,value2Candidate,true,votedId,p_error_type);
    call g1_vote_create(user4,value2Candidate,false,votedId,p_error_type);

end; $$;
