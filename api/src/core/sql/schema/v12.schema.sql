-- introducing the new graph schema, built on layers

-- LAYER 1 --------------------------------------------------------------

create type g1_entity_types as enum (
  'Node',
  'Relationship',
  'Key',
  'Value'
);

create table g2_node_types (
  g2_node_type varchar(32) primary key
);

insert into  g2_node_types (g2_node_type)
values 
  ('Word'),
  ('Person'),
  ('Book'),
  ('Document'),
  ('Chapter'),
  ('Verse')
;

create table g2_relationship_types (
  g2_rel_type varchar(32) primary key
);

insert into  g2_relationship_types (g2_rel_type)
values 
  ('NEXT_WORD'),
  ('NEXT_VERSE'),
  ('NEXT_CHAPTER'),
  ('NEXT_BOOK'),
  ('TO_VERSE_START'),
  ('TO_CHAPTER_START'),
  ('TO_BOOK_START')
;

-- nodes will have a g2 node type
-- relationships will have a g2 rel type, from, and to
-- keys will have a from reference to their parent entity
-- values will have a from reference to their parent entity

create table g1_entities (
  g1_entity_id bigserial primary key,
  active bool not null default true,
  valid bool not null default true,
  g1_entity_type g1_entity_types not null,
  from_entity bigint references g1_entities(g1_entity_id), -- for rels, keys, and values
  to_entity bigint references g1_entities(g1_entity_id), -- for rels
  g2_node_type varchar(32) references g2_node_types(g2_node_type), -- for nodes 
  g2_rel_type varchar(32) references g2_relationship_types(g2_rel_type), -- for rels
  props jsonb
);

create table g1_votes (
  g1_vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  g1_entity_id bigint not null references g1_entities(g1_entity_id),
  vote bool,
  unique (user_id, g1_entity_id)
);

-- the user table already exists but if someone wanted to copy/paste
-- this file for stand-alone work then here is a temp user table:
-- create table users (
--   user_id bigserial primary key,
--   email varchar(255) unique not null,
--   password varchar(128) not null,
--   created_at timestamp not null default CURRENT_TIMESTAMP
-- );

-- LAYER 2 --------------------------------------------------------------

create table g2_nodes (
 g1_entity_id bigint primary key,
 active bool default true,
 valid bool default true,
 g2_node_type varchar(32) not null references g2_node_types(g2_node_type),
 props jsonb
);

create table g2_relationships (
 g1_entity_id bigint primary key,
 from_node bigint not null references g2_nodes(g1_entity_id),
 to_node bigint not null references g2_nodes(g1_entity_id),
 active bool default true,
 valid bool default true,
 g2_rel_type varchar(32) not null references g2_relationship_types(g2_rel_type),
 props jsonb,
 unique (from_node, to_node, g2_rel_type)
);

-- LAYER 3 --------------------------------------------------------------

