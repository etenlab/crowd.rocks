-- notes.sql

drop table g1_votes;
drop table g1_candidates;
drop table g1_elections;
drop table g1_entities;
drop table g2_relationships;
drop table g2_nodes;



select * from g1_entities;
select * from g1_elections;
select * from g1_candidates;
select * from g1_votes;

call g1_entity_create('Word', '1'::jsonb, null, null);
call g1_entity_create('Word', '"Hello"'::jsonb, null, null);
call g1_entity_create('Word', '{"a":2}'::jsonb, null, null);

call g1_election_create('NodeType', 1, null, null);
call g1_candidate_create(1,2,null,null);
call g1_vote_create(1,1,true,null,null);

call g1_entity_create('Word', '"Bob"'::jsonb, null, null);
call g1_entity_create('Key', '"isNoun"'::jsonb, null, null);
call g1_entity_create('Value', 'true'::jsonb, null, null);
call g1_entity_create('Value', 'false'::jsonb, null, null);

  CREATE MATERIALIZED VIEW g2_nodes_view AS
    SELECT
        g1_node_id,
        node_type,
		props
    FROM g1_nodes;
	
  refresh materialized view g2_nodes_view
  
select * from g2_nodes_view
drop materialized view g2_nodes_view

