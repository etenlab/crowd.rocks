-- introducing the new graph schema, built on layers

-- LAYER 1 --------------------------------------------------------------

create table g1_nodes (
  g1_node_id bigserial primary key,
  node_type varchar(32) not null,
  props jsonb
);

create table g1_relationships (
  g1_rel_id bigserial primary key,
  from_node bigint not null references g1_nodes(g1_node_id),
  to_node bigint not null references g1_nodes(g1_node_id),
  unique (from_node, to_node)
);

-- election types:
-- node-keys:    election points to node,      candidates point to keys
-- node-props:   election points to key,       candidates point to key-values
-- relationship: election points to from_node, candidates point to to_node

create table g1_elections (
  election_id bigserial primary key,
  g1_node_id bigint not null references g1_nodes(g1_node_id),
  election_type varchar(32) not null,
  unique (g1_node_id, election_type)
);

create table g1_candidates (
  candidate_id bigserial primary key,
  election_id bigint not null references g1_elections(election_id),
  g1_node_id bigint not null references g1_nodes(g1_node_id),
  unique (election_id, g1_node_id)
);

create table g1_votes (
  vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  candidate_id bigint not null references g1_candidates(candidate_id),
  vote bool,
  unique (user_id, candidate_id)
);

-- LAYER 2 --------------------------------------------------------------

--create table g2_nodes (
--  g2_node_id bigserial primary key,
--  g2_node_type varchar(32) not null,
--  props jsonb
--);

create materialized view g2_nodes AS
  select
      g1_node_id,
      node_type,
      props
  from g1_nodes;

refresh materialized view g2_nodes;

--create table g2_relationships (
--  g2_rel_id bigserial primary key,
--  from_node bigint not null references g2_nodes(g2_node_id),
--  to_node bigint not null references g2_nodes(g2_node_id),
--  g2_rel_type varchar(32) not null,
--  props jsonb,
--  unique (from_node, to_node, g2_rel_type)
--);

create materialized view g2_relationships AS
  select
      g1_rel_id,
      from_node,
      to_node
  from g1_relationships;

refresh materialized view g2_relationships;

-- LAYER 3 --------------------------------------------------------------

