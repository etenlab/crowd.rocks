-- notes.sql

----------------------------------
drop table g2_relationships;  	--
drop table g2_nodes;          	--
drop table g1_votes;			--
drop table g1_entities;			--	
drop type g1_entity_types;		--
----------------------------------

select * from g1_entities order by entity_id asc;
select * from g1_votes order by g1_vote_id asc;
select * from g2_nodes order by entity_id asc;
select * from g2_relationships order by entity_id asc;

select entity_id, entity_type, from_entity, votes, props from g1_entities order by entity_id asc;

call create_fake_graph_data(null);

call g2_node_create('Word', null, null, null);
call g1_key_create(1, 'key1', null, null, null);
call g1_value_create(2, '"value1"'::jsonb, null, null);
call g1_value_create(2, '"value2"'::jsonb, null, null);

call g1_key_create(1, 'key2', '"value1"', null, null);
call g1_value_create(3, '"value4"', null, null);

call g1_vote_create(1, 1, true, null, null);
call g1_vote_create(2, 1, true, null, null);

call g1_vote_create(2, 2, true, null, null);
call g1_vote_create(1, 1, false, null, null);

call g1_vote_create(1, 3, true, null, null);
call g1_vote_create(2, 3, true, null, null);
call g1_vote_create(3, 3, false, null, null);

call g1_vote_create(1, 4, true, null, null);
call g1_vote_create(2, 4, true, null, null);
call g1_vote_create(3, 4, false, null, null);


call g2_node_create('Word', '{"isNoun":true, "isVerb": false}'::jsonb, null, null);
call g2_relationship_create('TO_WORD', 1, 2, '{"sequence": 42}'::jsonb, null, null);
call g2_relationship_create('NEXT_WORD', 1, 7, null, null, null);


CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

insert into users(email, password) 
values(substr(uuid_generate_v4()::text,1,15) || '@asdf.asdf', 'asdfasdf');


update g2_nodes
set props = ('{"'|| 'key8' || '":null}')::jsonb || props
where entity_id = 1;
			 
			 
update g2_nodes
set props = jsonb_set('{}', string_to_array('key1', ','), '"asdf"')
where entity_id = 1;

update g2_nodes
set props = jsonb_set(props, string_to_array('key2', ','), '"asdf"')
where entity_id = 1;

select entity_id, props
from g2_nodes
where entity_id = 1

update g2_nodes
set props = jsonb_concat(('{"'|| 'key8' || '":null}')::jsonb, props)
where entity_id = 1;

select 'Node' = ANY('{"Node", "Relationship", "Key"}')

SELECT EXISTS (
        SELECT 1
        FROM pg_enum e
        JOIN pg_type t ON e.enumtypid = t.oid
        WHERE t.typname = 'g1_entity_types'
        AND e.enumlabel = 'Node'
)
