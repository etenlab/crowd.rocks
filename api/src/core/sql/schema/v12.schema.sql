-- introducing the new graph schema, built on layers

-- LAYER 1 --------------------------------------------------------------

create table g1_entities (
  g1_entity_id bigserial primary key,
  g1_entity_type varchar(32) not null,
  props jsonb
);

-- election types:
-- node-keys:    election points to node,      candidates point to keys
-- node-props:   election points to key,       candidates point to key-values
-- relationship: election points to from_node, candidates point to to_node

create table g1_elections (
  g1_election_id bigserial primary key,
  g1_entity_id bigint not null references g1_entities(g1_entity_id),
  g1_election_type varchar(32) not null,
  unique (g1_entity_id, g1_election_type)
);

create table g1_candidates (
  g1_candidate_id bigserial primary key,
  g1_election_id bigint not null references g1_elections(g1_election_id),
  g1_entity_id bigint not null references g1_entities(g1_entity_id),
  unique (g1_election_id, g1_entity_id)
);

create table g1_votes (
  g1_vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  g1_candidate_id bigint not null references g1_candidates(g1_candidate_id),
  vote bool,
  unique (user_id, g1_candidate_id)
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

-- this is the schema we need to produce from the g1 layer:
--create table g2_nodes (
--  g2_node_id bigserial primary key,
--  g2_node_type varchar(32) not null,
--  props jsonb
--);

--create table g2_relationships (
--  g2_rel_id bigserial primary key,
--  from_node bigint not null references g2_nodes(g2_node_id),
--  to_node bigint not null references g2_nodes(g2_node_id),
--  g2_rel_type varchar(32) not null,
--  props jsonb,
--  unique (from_node, to_node, g2_rel_type)
--);

-- here are the materialized views that need to have the shape above

create materialized view g2_nodes AS
  -- todo
  select
      g1_entity_id,
      g1_entity_type,
      props
  from g1_entities;

refresh materialized view g2_nodes;

create materialized view g2_relationships AS
  -- todo
  select
      g1_entity_id,
      g1_entity_type,
      props
  from g1_entities;

refresh materialized view g2_relationships;

-- LAYER 3 --------------------------------------------------------------

