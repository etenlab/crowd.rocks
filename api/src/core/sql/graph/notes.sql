-- notes.sql

drop materialized view g2_relationships;
drop materialized view g2_nodes;
drop table g1_votes;
drop table g1_candidates;
drop table g1_elections;
drop table g1_relationships;
drop table g1_nodes;

select * from g1_nodes;
select * from g1_relationships;
select * from g1_elections;
select * from g1_candidates;
select * from g1_votes;

call node_create('Word', '1'::jsonb, null, null);
call node_create('Word', '"Hello"'::jsonb, null, null);
call node_create('Word', '{"a":2}'::jsonb, null, null);

call g1_relationship_create(1,2,null,null);
call g1_election_create('NodeType', 1, null, null);
call g1_candidate_create(1,2,null,null);
call g1_vote_create(1,1,true,null,null);

call node_create('Word', '"Bob"'::jsonb, null, null);
call node_create('Key', '"isNoun"'::jsonb, null, null);
call node_create('Value', 'true'::jsonb, null, null);
call node_create('Value', 'false'::jsonb, null, null);