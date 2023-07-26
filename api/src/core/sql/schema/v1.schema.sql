-- schema.sql
create schema IF NOT EXISTS "public";

SET search_path TO "public";
-- GENERAL ------------------------------------------------------------

CREATE OR REPLACE FUNCTION random_between(low INT ,high INT)
   RETURNS INT AS
$$
BEGIN
   RETURN floor(random()* (high-low + 1) + low);
END;
$$ language 'plpgsql' STRICT;

-- VERSION CONTROL ---------------------------------------------------

-- reference table
create table database_version_control (
  id bigserial primary key,
  version bigint not null,
  completed timestamp default current_timestamp
);

-- USERS ---------------------------------------------------------

CREATE TABLE users (
  user_id bigserial PRIMARY KEY,
  active BOOL NOT NULL DEFAULT TRUE,
  email VARCHAR(255) UNIQUE NOT NULL,
  is_email_verified bool not null default false,
  password VARCHAR(128) NOT NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

create table avatars(
  user_id bigint not null references users(user_id),
  avatar varchar(64) not null,
  url varchar(128),
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  primary key (user_id, avatar)
);

create table avatars_history(
  avatar_history_id bigserial primary key,
  user_id bigint not null references users(user_id),
  avatar varchar(64) not null,
  url varchar(128),
  created_at timestamp NOT NULL,
  changed_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

create type token_type as enum (
  'Accept',
  'Reject'
);

CREATE TABLE tokens (
  token VARCHAR(512) PRIMARY KEY,
  user_id bigint references users(user_id),
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- EMAIL --------------------------------------------------------------

create table email_tokens(
  token varchar(64) primary key,
  user_id bigint not null references users(user_id),
  type token_type not null,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

create table reset_tokens(
  token varchar(64) primary key,
  user_id bigint not null references users(user_id),
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

create type email_sent_type as enum (
  'Register',
  'PasswordReset'
);

create type email_response_type as enum (
  'Bounce',
  'Complaint',
  'Delivery'
);

create table emails_sent (
  email_sent_id bigserial primary key,
  email varchar(255) not null,
  message_id varchar(64) not null,
  type email_sent_type not null,
  response email_response_type,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

create index on emails_sent (message_id);

create table emails_blocked (
  email varchar(255) primary key,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- NOTIFICATIONS --------------------------------------------------------------

create table notifications (
  notification_id bigserial primary key,
  user_id bigint not null references users(user_id),
  is_notified bool not null default false,
  text text,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

create index on notifications (user_id, is_notified);

-- AUTHZ & GROUPS ---------------------------------------------------------

create table site_admins(
  user_id bigint not null references users(user_id),
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);

create table groups(
  group_id bigserial primary key,
  parent_group_id bigint references groups(group_id),
  name varchar(512),
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);

create table group_memberships(
  group_id bigint not null references groups(group_id),
  user_id bigint not null references users(user_id),
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);

create table group_admins(
  group_id bigint not null references groups(group_id),
  user_id bigint not null references users(user_id),
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);

create table project_managers(
  group_id bigint not null references groups(group_id),
  user_id bigint not null references users(user_id),
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);

-- LEGAL --------------------------------------------------------------

create table license_options (
  license_title varchar(128) primary key,
  url varchar(128)
);

-- FORUMS --------------------------------------------------------------

create table forums(
  forum_id bigserial primary key,
  name varchar(128) not null,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);

create table forum_folders (
  forum_folder_id bigserial primary key,
  forum_id bigint not null references forums(forum_id),
  name varchar(128) not null,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);

create table threads (
  thread_id bigserial primary key,
  forum_folder_id bigint not null references forum_folders(forum_folder_id),
  name varchar(128) not null,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);

-- DISCUSSION --------------------------------------------------------------

create table posts(
  post_id bigserial primary key,
  parent_table varchar(64) not null,
  parent_id bigint not null,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);

create table versions(
  version_id bigserial primary key,
  post_id bigint not null references posts(post_id),
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  license_title varchar(128) references license_options(license_title),
  content text not null
);

create index on versions using hash (content);
create index on versions (post_id);

-- voting
create table posts_votes(
  posts_vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  post_id bigint not null references posts(post_id),
  vote bool,
  last_updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  unique (user_id, post_id)
);

-- WORDS -------------------------------------------------------------

create table wordlike_strings (
  wordlike_string_id bigserial primary key,
  wordlike_string varchar(64) unique not null,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);

create table words(
  word_id bigserial primary key,
  wordlike_string_id bigint not null references wordlike_strings(wordlike_string_id),
  language_code varchar(32) not null,
  dialect_code varchar(32),
  geo_code varchar(32),
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id),
  unique nulls not distinct (wordlike_string_id, language_code, dialect_code, geo_code)
);

create table word_definitions(
  word_definition_id bigserial primary key,
  word_id bigint not null references words(word_id),
  definition text not null,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);

-- tags
create table word_definition_tags (
  word_definition_tag_id bigserial primary key,
  word_definition_id bigint not null references words(word_id),
  word_definition_tag jsonb not null,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);

create table word_tags (
  word_tag_id bigserial primary key,
  word_id bigint not null references words(word_id),
  word_tag jsonb not null,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);

-- voting
create table word_definitions_votes(
  word_definitions_vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  word_definition_id bigint not null references word_definitions(word_definition_id),
  vote bool,
  last_updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  unique (user_id, word_definition_id)
);

create table words_votes(
  words_vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  word_id bigint not null references words(word_id),
  vote bool,
  last_updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  unique (user_id, word_id)
);

create table word_definition_tags_votes(
  word_definition_tags_vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  word_definition_tag_id bigint not null references word_definition_tags(word_definition_tag_id),
  vote bool,
  last_updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  unique (user_id, word_definition_tag_id)
);

create table word_tags_votes(
  word_tags_vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  word_tag_Id bigint not null references word_tags(word_tag_id),
  vote bool,
  last_updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  unique (user_id, word_tag_id)
);

-- PHRASES -------------------------------------------------------------

create table phrases(
  phrase_id bigserial primary key,
  words bigint[] not null, -- references words(word_id)
  phraselike_string text not null,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);

create table phrase_definitions(
  phrase_definition_id bigserial primary key,
  phrase_id bigint not null references phrases(phrase_id),
  definition text not null,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)  
);

-- tags
create table phrase_definition_tags (
  phrase_definition_tag_id bigserial primary key,
  phrase_definition_id bigint not null references phrases(phrase_id),
  phrase_definition_tag jsonb not null,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);

create table phrase_tags (
  phrase_tag_id bigserial primary key,
  phrase_id bigint not null references phrases(phrase_id),
  phrase_tag jsonb not null,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);

-- voting
create table phrase_definitions_votes(
  phrase_definitions_vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  phrase_definition_id bigint not null references phrase_definitions(phrase_definition_id),
  vote bool,
  last_updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  unique (user_id, phrase_definition_id)
);

create table phrase_votes(
  phrase_vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  phrase_id bigint not null references phrases(phrase_id),
  vote bool,
  last_updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  unique (user_id, phrase_id)
);

create table phrase_definition_tags_votes(
  phrase_definition_tags_vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  phrase_definition_tag_id bigint not null references phrase_definition_tags(phrase_definition_tag_id),
  vote bool,
  last_updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  unique (user_id, phrase_definition_tag_id)
);

create table phrase_tags_votes(
  phrase_tags_vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  phrase_tag_Id bigint not null references phrase_tags(phrase_tag_id),
  vote bool,
  last_updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  unique (user_id, phrase_tag_id)
);

-- TRANSLATION ---------------------------------------

create table word_to_word_translations(
  word_to_word_translation_id bigserial primary key,
  from_word_definition_id bigint not null references word_definitions(word_definition_id),
  to_word_definition_id bigint not null references word_definitions(word_definition_id),
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id),
  unique (from_word_definition_id, to_word_definition_id)
);

create table word_to_phrase_translations(
  word_to_phrase_translation_id bigserial primary key,
  from_word_definition_id bigint not null references word_definitions(word_definition_id),
  to_phrase_definition_id bigint not null references phrase_definitions(phrase_definition_id),
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id),
  unique (from_word_definition_id, to_phrase_definition_id)
);

create table phrase_to_word_translations(
  phrase_to_word_translation_id bigserial primary key,
  from_phrase_definition_id bigint not null references phrase_definitions(phrase_definition_id),
  to_word_definition_id bigint not null references word_definitions(word_definition_id),
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id),
  unique (from_phrase_definition_id, to_word_definition_id)
);

create table phrase_to_phrase_translations(
  phrase_to_phrase_translation_id bigserial primary key,
  from_phrase_definition_id bigint not null references phrase_definitions(phrase_definition_id),
  to_phrase_definition_id bigint not null references phrase_definitions(phrase_definition_id),
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id),
  unique (from_phrase_definition_id, to_phrase_definition_id)
);

-- votes
create table word_to_word_translations_votes(
  word_to_word_translations_vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  word_to_word_translation_id bigint not null references word_to_word_translations(word_to_word_translation_id),
  vote bool,
  last_updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  unique (user_id, word_to_word_translation_id)
);

create table word_to_phrase_translations_votes(
  word_to_phrase_translations_vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  word_to_phrase_translation_id bigint not null references word_to_phrase_translations(word_to_phrase_translation_id),
  vote bool,
  last_updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  unique (user_id, word_to_phrase_translation_id)
);

create table phrase_to_word_translations_votes(
  phrase_to_word_translations_vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  phrase_to_word_translation_id bigint not null references phrase_to_word_translations(phrase_to_word_translation_id),
  vote bool,
  last_updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  unique (user_id, phrase_to_word_translation_id)
);

create table phrase_to_phrase_translations_votes(
  phrase_to_phrase_translations_vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  phrase_to_phrase_translation_id bigint not null references phrase_to_phrase_translations(phrase_to_phrase_translation_id),
  vote bool,
  last_updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  unique (user_id, phrase_to_phrase_translation_id)
);

-- DOCUMENTS -------------------------------------------------------------

create table documents(
  document_id bigserial primary key,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);

create table document_word_entries(
  document_word_entry_id bigserial primary key,
  document_id bigint not null references documents(document_id),
  wordlike_string_id bigint not null references wordlike_strings(wordlike_string_id),
  parent_wordlike_string_id bigint references wordlike_strings(wordlike_string_id),
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);

create table word_ranges (
  word_range_id bigserial primary key,
  begin_word bigint not null references document_word_entries(document_word_entry_id),
  end_word bigint not null references document_word_entries(document_word_entry_id),
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);

-- tags
create table document_tags (
  document_tag_id bigserial primary key,
  document_id bigint not null references documents(document_id),
  document_tag jsonb not null,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);

create table document_word_entry_tags (
  document_word_entry_tag_id bigserial primary key,
  document_word_entry_id bigint not null references document_word_entries(document_word_entry_id),
  document_word_entry_tag jsonb not null,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);

create table word_range_tags (
  word_range_tag_id bigserial primary key,
  word_range_id bigint not null references word_ranges(word_range_id),
  word_range_tag jsonb not null,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);

-- voting
create table document_tags_votes(
  document_tags_vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  document_tag_id bigint not null references document_tags(document_tag_id),
  vote bool,
  last_updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  unique (user_id, document_tag_id)
);

create table document_word_entry_tags_votes(
  document_word_entry_tags_vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  document_word_entry_tag_id bigint not null references document_word_entry_tags(document_word_entry_tag_id),
  vote bool,
  last_updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  unique (user_id, document_word_entry_tag_id)
);

create table word_ranges_votes(
  word_ranges_vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  word_range_id bigint not null references word_ranges(word_range_id),
  vote bool,
  last_updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  unique (user_id, word_range_id)
);

create table word_range_tags_votes(
  word_range_tags_vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  word_range_tag_id bigint not null references word_range_tags(word_range_tag_id),
  vote bool,
  last_updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  unique (user_id, word_range_tag_id)
);

-- SITE TEXT -------------------------------------------------------------

create table site_text_word_definitions (
  site_text_id bigserial primary key,
  word_definition_id bigint not null references word_definitions(word_definition_id),
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id),
  unique (word_definition_id)
);

create table site_text_phrase_definitions (
  site_text_id bigserial primary key,
  phrase_definition_id bigint not null references phrase_definitions(phrase_definition_id),
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id),
  unique (phrase_definition_id)
);

create table site_text_translations(
  site_text_translation_id bigserial primary key,
  from_definition_id bigint not null,
  to_definition_id bigint not null,
  from_type_is_word bool not null, -- true = word, false = phrase
  to_type_is_word bool not null, -- true = word, false = phrase
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id),
  unique (from_definition_id, to_definition_id, from_type_is_word, to_type_is_word)
);

create table site_text_translation_votes(
  site_text_translation_vote_id bigserial primary key,
  site_text_translation_id bigint not null references site_text_translations(site_text_translation_id),
  user_id bigint not null references users(user_id),
  vote bool,
  last_updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  unique (user_id, site_text_translation_id)
);

-- MAPS -------------------------------------------------------------

create table original_maps(
  original_map_id bigserial primary key,
  map_file_name varchar(256) unique not null,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id),
  content text not null
);

create table original_map_words(
  original_map_word_id bigserial primary key,
  original_map_id bigint not null references original_maps(original_map_id),
  word_id bigint not null references words(word_id),
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE public.original_map_words ADD CONSTRAINT original_map_word_unq UNIQUE (word_id,original_map_id);

create table translated_maps(
  translated_map_id bigserial primary key,
  original_map_id bigint not null references original_maps(original_map_id),
  language_code varchar(32) not null,
  dialect_code varchar(32),
  geo_code varchar(32),
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id),
  content text not null
);