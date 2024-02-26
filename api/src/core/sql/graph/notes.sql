-- notes.sql

drop table g2_relationships;
drop table g2_nodes;
drop table g2_node_types;
drop table g2_relationship_types;
drop table g1_votes;
drop table g1_candidates;
drop table g1_elections;
drop table g1_election_types;
drop table g1_entities;
drop table g1_entity_types;

select * from g1_entities;
select * from g1_elections;
select * from g1_candidates;
select * from g1_votes;
select * from g2_nodes;
select * from g2_relationships;

call create_fake_graph_data(null);

refresh materialized view g2_nodes;
refresh materialized view g2_relationships;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

insert into users(email, password) 
values(substr(uuid_generate_v4()::text,1,15) || '@asdf.asdf', 'asdfasdf');
