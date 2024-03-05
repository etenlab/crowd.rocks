-- introducing the new graph schema, built on layers

-- LAYER 1 --------------------------------------------------------------

create type g1_entity_types as enum (
  'Node',
  'Relationship',
  'Key',
  'Value'
);

-- nodes will have a g2 node type
-- relationships will have a g2 rel type, from, and to
-- keys will have a from reference to their parent entity and props
-- values will have a from reference to their parent entity and props

create table g1_entities (
  entity_id bigserial primary key,
  active bool not null default true,
  valid bool not null default true,
  entity_type g1_entity_types not null,
  from_entity bigint references g1_entities(entity_id), -- for rels, keys, and values
  to_entity bigint references g1_entities(entity_id), -- for rels
  node_type varchar(32), -- for nodes 
  rel_type varchar(32), -- for rels
  -- when entity type is node/rel/key, the votes are sums of all true and false votes
  -- when entity type is value, the votes are only the sum of the true votes
  votes int not null default 0, 
  props jsonb -- for keys and values
);

create table g1_votes (
  g1_vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  entity_id bigint not null references g1_entities(entity_id),
  vote bool,
  unique (user_id, entity_id)
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
 entity_id bigint primary key,
 active bool default true,
 valid bool default true,
 node_type varchar(32) not null,
 props jsonb default '{}'
);

create table g2_relationships (
 entity_id bigint primary key,
 from_node bigint not null references g2_nodes(entity_id),
 to_node bigint not null references g2_nodes(entity_id),
 active bool default true,
 valid bool default true,
 rel_type varchar(32) not null,
 props jsonb,
 unique (from_node, to_node, rel_type)
);

-- LAYER 3 --------------------------------------------------------------

