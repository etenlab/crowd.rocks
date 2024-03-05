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

call g2_node_create('Word', null, null, null);
call g1_key_create(1, '{"key5":"asdf"}'::jsonb, null, null);
call g1_key_create(1, 'key7', null, null, null);


call g2_node_create('Word', '{"isNoun":true, "isVerb": false}'::jsonb, null, null);
call g2_relationship_create('TO_WORD', 3, 4, '{"sequence": 42}'::jsonb, null, null);

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

insert into users(email, password) 
values(substr(uuid_generate_v4()::text,1,15) || '@asdf.asdf', 'asdfasdf');

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