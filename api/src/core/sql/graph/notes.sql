-- notes.sql

drop table g2_relationships;
drop table g2_nodes;
drop table g1_votes;
drop table g1_entities;
drop type g1_entity_types;

select * from g1_entities;
select * from g1_votes;
select * from g2_nodes;
select * from g2_relationships;

call create_fake_graph_data(null);


call g2_node_create('Word', '{"isNoun":true, "isVerb": false}'::jsonb, null, null);
call g2_relationship_create('TO_WORD', 3, 4, '{"sequence": 42}'::jsonb, null, null);

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

insert into users(email, password) 
values(substr(uuid_generate_v4()::text,1,15) || '@asdf.asdf', 'asdfasdf');
