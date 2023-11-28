-- final.schema.sql
-- this is a helper file that isn't used in the app. it's not called by any code. it only exists to help developers understand the table schema without looking through the v1.schema.sql file and all the change scripts. this is the "final" schema that exists after the v1.schema.sql file and all change files are run. when your new features needs a schema change, first update the database-version-control.service.ts file with your modification statements, then update this file so its easy to see what the final schema looks like.


create schema if not exists "public";

set search_path to "public";
-- GENERAL ------------------------------------------------------------

create or replace function random_between(low int ,high int)
   returns int AS
$$
begin
   return floor(random()* (high-low + 1) + low);
END;
$$ language 'plpgsql' STRICT;

create extension pg_trgm;

-- VERSION CONTROL ---------------------------------------------------

-- reference table
create table database_version_control (
  id bigserial primary key,
  version bigint not null,
  completed timestamp default current_timestamp
);

-- USERS ---------------------------------------------------------

create table users (
  user_id bigserial primary key,
  active BOOL not null default TRUE,
  email varchar(255) unique not null,
  is_email_verified bool not null default false,
  is_bot bool not null default false,
  password varchar(128) not null,
  created_at timestamp not null default CURRENT_TIMESTAMP
);

create table avatars(
  user_id bigint not null references users(user_id),
  avatar varchar(64) not null,
  url varchar(128),
  created_at timestamp not null default CURRENT_TIMESTAMP,
  primary key (user_id, avatar)
);

create table avatars_history(
  avatar_history_id bigserial primary key,
  user_id bigint not null references users(user_id),
  avatar varchar(64) not null,
  url varchar(128),
  created_at timestamp not null,
  changed_at timestamp not null default CURRENT_TIMESTAMP
);

create type token_type as enum (
  'Accept',
  'Reject'
);

create table tokens (
  token varchar(512) primary key,
  user_id bigint references users(user_id),
  created_at timestamp not null default CURRENT_TIMESTAMP
);

-- EMAIL --------------------------------------------------------------

create table email_tokens(
  token varchar(64) primary key,
  user_id bigint not null references users(user_id),
  type token_type not null,
  created_at timestamp not null default CURRENT_TIMESTAMP
);

create table reset_tokens(
  token varchar(64) primary key,
  user_id bigint not null references users(user_id),
  created_at timestamp not null default CURRENT_TIMESTAMP
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
  created_at timestamp not null default CURRENT_TIMESTAMP
);

create index on emails_sent (message_id);

create table emails_blocked (
  email varchar(255) primary key,
  created_at timestamp not null default CURRENT_TIMESTAMP
);

-- NOTIFICATIONS --------------------------------------------------------------

create table notifications (
  notification_id bigserial primary key,
  user_id bigint not null references users(user_id),
  is_notified bool not null default false,
  text text,
  created_at timestamp not null default CURRENT_TIMESTAMP
);

create index on notifications (user_id, is_notified);

-- AUTHZ & GROUPS ---------------------------------------------------------

create table site_admins(
  user_id bigint not null references users(user_id),
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);

create table groups(
  group_id bigserial primary key,
  parent_group_id bigint references groups(group_id),
  name varchar(512),
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);

create table group_memberships(
  group_id bigint not null references groups(group_id),
  user_id bigint not null references users(user_id),
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);

create table group_admins(
  group_id bigint not null references groups(group_id),
  user_id bigint not null references users(user_id),
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);

create table project_managers(
  group_id bigint not null references groups(group_id),
  user_id bigint not null references users(user_id),
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);

-- LEGAL --------------------------------------------------------------

create table license_options (
  license_title varchar(128) primary key,
  url varchar(128)
);

-- FLAGGING --------------------------------------------------------------

create table flags(
  flag_id bigserial primary key,
  parent_table varchar(64) not null,
  parent_id bigint not null,
  name varchar(64) not null,
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id),
  unique (parent_table, parent_id, name)
);

-- FORUMS --------------------------------------------------------------

create table forums(
  forum_id bigserial primary key,
  name varchar(128) not null,
  description text,
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id),
  unique (name)
);
create index idx__name_gin__forums on forums using gin(name gin_trgm_ops);

create table forum_folders (
  forum_folder_id bigserial primary key,
  forum_id bigint not null references forums(forum_id) on delete cascade,
  name varchar(128) not null,
  description text,
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id),
  unique (forum_id, name)
);
create index idx__name_gin__forum_folders on forum_folders using gin(name gin_trgm_ops);
create index idx__forum_id__forum_folders on forum_folders (forum_id);

create table threads (
  thread_id bigserial primary key,
  forum_folder_id bigint not null references forum_folders(forum_folder_id) on delete cascade,
  name varchar(128) not null,
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id),
  unique (forum_folder_id, name)
);
create index idx__name_gin__threads on threads using gin(name gin_trgm_ops);
create index idx__forum_folder_id__threads on threads (forum_folder_id);

-- DISCUSSION --------------------------------------------------------------

create table posts(
  post_id bigserial primary key,
  parent_table varchar(64) not null,
  parent_id bigint not null,
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);
create index idx__parent_table_parent_id__posts on posts (parent_table, parent_id);

create table versions(
  version_id bigserial primary key,
  post_id bigint not null references posts(post_id) on delete cascade,
  created_at timestamp not null default CURRENT_TIMESTAMP,
  license_title varchar(128) references license_options(license_title),
  file_id bigint references files(file_id),
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
  last_updated_at timestamp not null default CURRENT_TIMESTAMP,
  unique (user_id, post_id)
);

-- WORDS -------------------------------------------------------------

create table wordlike_strings (
  wordlike_string_id bigserial primary key,
  wordlike_string varchar unique not null,
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);
create index idx__wordlike_string_gin__wordlike_strings on wordlike_strings using gin(wordlike_string gin_trgm_ops);

create table words(
  word_id bigserial primary key,
  wordlike_string_id bigint not null references wordlike_strings(wordlike_string_id),
  language_code varchar(32) not null,
  dialect_code varchar(32),
  geo_code varchar(32),
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id),
  unique nulls not distinct (wordlike_string_id, language_code, dialect_code, geo_code)
);
create index idx__wordlike_string_id__words on words (wordlike_string_id);
create index idx__language_codes__words on words (language_code, dialect_code, geo_code);

create table word_definitions(
  word_definition_id bigserial primary key,
  word_id bigint not null references words(word_id),
  definition text not null,
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id),
  unique (word_id, definition)
);
create index idx__word_id__word_definitions on word_definitions (word_id);
create index idx__definition__word_definitions on word_definitions (definition);
create index idx__definition_gin__word_definitions on word_definitions using gin(definition gin_trgm_ops);

-- tags
create table word_definition_tags (
  word_definition_tag_id bigserial primary key,
  word_definition_id bigint not null references words(word_id),
  word_definition_tag jsonb not null,
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);

create table word_tags (
  word_tag_id bigserial primary key,
  word_id bigint not null references words(word_id),
  word_tag jsonb not null,
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);

-- voting
create table word_definitions_votes(
  word_definitions_vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  word_definition_id bigint not null references word_definitions(word_definition_id),
  vote bool,
  last_updated_at timestamp not null default CURRENT_TIMESTAMP,
  unique (user_id, word_definition_id)
);
create index idx__word_definition_id__word_definitions_votes on word_definitions_votes (word_definition_id);

create table words_votes(
  words_vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  word_id bigint not null references words(word_id),
  vote bool,
  last_updated_at timestamp not null default CURRENT_TIMESTAMP,
  unique (user_id, word_id)
);
create index idx__word_id__words_votes on words_votes (word_id);

create table word_definition_tags_votes(
  word_definition_tags_vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  word_definition_tag_id bigint not null references word_definition_tags(word_definition_tag_id),
  vote bool,
  last_updated_at timestamp not null default CURRENT_TIMESTAMP,
  unique (user_id, word_definition_tag_id)
);

create table word_tags_votes(
  word_tags_vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  word_tag_Id bigint not null references word_tags(word_tag_id),
  vote bool,
  last_updated_at timestamp not null default CURRENT_TIMESTAMP,
  unique (user_id, word_tag_id)
);

-- PHRASES -------------------------------------------------------------

create table phrases(
  phrase_id bigserial primary key,
  words bigint[] not null, -- references words(word_id)
  phraselike_string text not null,
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id),
  unique (phraselike_string, words)
);
create index idx__words__phrases on phrases using gin (words);
create index idx__phraselike_string__phrases on phrases using gin (phraselike_string gin_trgm_ops);

create table phrase_definitions(
  phrase_definition_id bigserial primary key,
  phrase_id bigint not null references phrases(phrase_id),
  definition text not null,
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id),
  unique (phrase_id, definition)
);
create index idx__phrase_id__phrase_definitions on phrase_definitions (phrase_id);
create index idx__definition__phrase_definitions on phrase_definitions using gin (definition gin_trgm_ops);


-- tags
create table phrase_definition_tags (
  phrase_definition_tag_id bigserial primary key,
  phrase_definition_id bigint not null references phrases(phrase_id),
  phrase_definition_tag jsonb not null,
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);

create table phrase_tags (
  phrase_tag_id bigserial primary key,
  phrase_id bigint not null references phrases(phrase_id),
  phrase_tag jsonb not null,
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);

-- voting
create table phrase_definitions_votes(
  phrase_definitions_vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  phrase_definition_id bigint not null references phrase_definitions(phrase_definition_id),
  vote bool,
  last_updated_at timestamp not null default CURRENT_TIMESTAMP,
  unique (user_id, phrase_definition_id)
);
create index idx__phrase_definition_id__phrase_definitions_votes on phrase_definitions_votes (phrase_definition_id);

create table phrase_votes(
  phrase_vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  phrase_id bigint not null references phrases(phrase_id),
  vote bool,
  last_updated_at timestamp not null default CURRENT_TIMESTAMP,
  unique (user_id, phrase_id)
);
create index idx__phrase_id__phrase_votes on phrase_votes (phrase_id);

create table phrase_definition_tags_votes(
  phrase_definition_tags_vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  phrase_definition_tag_id bigint not null references phrase_definition_tags(phrase_definition_tag_id),
  vote bool,
  last_updated_at timestamp not null default CURRENT_TIMESTAMP,
  unique (user_id, phrase_definition_tag_id)
);

create table phrase_tags_votes(
  phrase_tags_vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  phrase_tag_Id bigint not null references phrase_tags(phrase_tag_id),
  vote bool,
  last_updated_at timestamp not null default CURRENT_TIMESTAMP,
  unique (user_id, phrase_tag_id)
);

-- TRANSLATION ---------------------------------------

create table word_to_word_translations(
  word_to_word_translation_id bigserial primary key,
  from_word_definition_id bigint not null references word_definitions(word_definition_id),
  to_word_definition_id bigint not null references word_definitions(word_definition_id),
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id),
  unique (from_word_definition_id, to_word_definition_id)
);
create index idx__from_word_definition_id__word_to_word_translations on word_to_word_translations (from_word_definition_id);
create index idx__to_word_definition_id__word_to_word_translations on word_to_word_translations (to_word_definition_id);

create table word_to_phrase_translations(
  word_to_phrase_translation_id bigserial primary key,
  from_word_definition_id bigint not null references word_definitions(word_definition_id),
  to_phrase_definition_id bigint not null references phrase_definitions(phrase_definition_id),
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id),
  unique (from_word_definition_id, to_phrase_definition_id)
);
create index idx__from_word_definition_id__word_to_phrase_translations on word_to_phrase_translations (from_word_definition_id);
create index idx__to_phrase_definition_id__word_to_phrase_translations on word_to_phrase_translations (to_phrase_definition_id);

create table phrase_to_word_translations(
  phrase_to_word_translation_id bigserial primary key,
  from_phrase_definition_id bigint not null references phrase_definitions(phrase_definition_id),
  to_word_definition_id bigint not null references word_definitions(word_definition_id),
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id),
  unique (from_phrase_definition_id, to_word_definition_id)
);
create index idx__from_phrase_definition_id__phrase_to_word_translations on phrase_to_word_translations (from_phrase_definition_id);
create index idx__to_word_definition_id__phrase_to_word_translations on phrase_to_word_translations (to_word_definition_id);

create table phrase_to_phrase_translations(
  phrase_to_phrase_translation_id bigserial primary key,
  from_phrase_definition_id bigint not null references phrase_definitions(phrase_definition_id),
  to_phrase_definition_id bigint not null references phrase_definitions(phrase_definition_id),
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id),
  unique (from_phrase_definition_id, to_phrase_definition_id)
);
create index idx__from_phrase_definition_id__phrase_to_phrase_translations on phrase_to_phrase_translations (from_phrase_definition_id);
create index idx__to_phrase_definition_id__phrase_to_phrase_translations on phrase_to_phrase_translations (to_phrase_definition_id);

-- votes
create table word_to_word_translations_votes(
  word_to_word_translations_vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  word_to_word_translation_id bigint not null references word_to_word_translations(word_to_word_translation_id),
  vote bool,
  last_updated_at timestamp not null default CURRENT_TIMESTAMP,
  unique (user_id, word_to_word_translation_id)
);
create index idx__word_to_word_translation_id__word_to_word_translations_votes on word_to_word_translations_votes (word_to_word_translation_id);

create table word_to_phrase_translations_votes(
  word_to_phrase_translations_vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  word_to_phrase_translation_id bigint not null references word_to_phrase_translations(word_to_phrase_translation_id),
  vote bool,
  last_updated_at timestamp not null default CURRENT_TIMESTAMP,
  unique (user_id, word_to_phrase_translation_id)
);
create index idx__word_to_phrase_translation_id__phrase_to_word_translations_votes on word_to_phrase_translations_votes (word_to_phrase_translation_id);

create table phrase_to_word_translations_votes(
  phrase_to_word_translations_vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  phrase_to_word_translation_id bigint not null references phrase_to_word_translations(phrase_to_word_translation_id),
  vote bool,
  last_updated_at timestamp not null default CURRENT_TIMESTAMP,
  unique (user_id, phrase_to_word_translation_id)
);
create index idx__phrase_to_word_translation_id__phrase_to_word_translations_votes on phrase_to_word_translations_votes (phrase_to_word_translation_id);

create table phrase_to_phrase_translations_votes(
  phrase_to_phrase_translations_vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  phrase_to_phrase_translation_id bigint not null references phrase_to_phrase_translations(phrase_to_phrase_translation_id),
  vote bool,
  last_updated_at timestamp not null default CURRENT_TIMESTAMP,
  unique (user_id, phrase_to_phrase_translation_id)
);
create index idx__phrase_to_phrase_translation_id__phrase_to_phrase_translations_votes on phrase_to_phrase_translations_votes (phrase_to_phrase_translation_id);

-- FILES -------------------------------------------------------------

create table files (
  file_id bigserial primary key, 
  file_name varchar(64) not null, 
  file_size bigint not null, 
  file_type varchar(16) not null, 
  file_url varchar(128) not null,
  file_hash varchar(255) not null,
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);
create index idx__file_name__files on files (file_name);
create index idx__file_url__files on files (file_url);
create index idx__file_hash__files on files (file_hash);


-- DOCUMENTS -------------------------------------------------------------

create table documents(
  document_id bigserial primary key,
  file_id bigint not null references files(file_id),
  language_code varchar(32) not null,
  dialect_code varchar(32),
  geo_code varchar(32),
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id),
  unique (file_id, language_code, dialect_code, geo_code)
);
create index idx__file_id__documents on documents (file_id);
create index idx__language_codes__documents on documents (language_code, dialect_code, geo_code);

create table document_word_entries(
  document_word_entry_id bigserial primary key,
  document_id bigint not null references documents(document_id),
  wordlike_string_id bigint not null references wordlike_strings(wordlike_string_id),
  page bigint not null,
  parent_document_word_entry_id bigint references document_word_entries(document_word_entry_id),
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);
create index idx__document_id__document_word_entries on document_word_entries (document_id);
create index idx__wordlike_string_id__document_word_entries on document_word_entries (wordlike_string_id);
create index idx__parent_document_word_entry_id__document_word_entries on document_word_entries (parent_document_word_entry_id);
create index idx__page__document_word_entries on document_word_entries (page);


create table word_ranges (
  word_range_id bigserial primary key,
  begin_word bigint not null references document_word_entries(document_word_entry_id),
  end_word bigint not null references document_word_entries(document_word_entry_id),
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);
create index idx__begin_word__word_ranges on word_ranges (begin_word);
create index idx__end_word__word_ranges on word_ranges (end_word);
create index idx__created_by__word_ranges on word_ranges (created_by);

create table pericopies(
  pericope_id bigserial primary key,
  start_word bigint not null references document_word_entries(document_word_entry_id),
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id),
  unique (start_word)
);

create table pericope_votes(
  pericope_vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  pericope_id bigint not null references pericopies(pericope_id),
  vote bool,
  last_updated_at timestamp not null default CURRENT_TIMESTAMP,
  unique (user_id, pericope_id)
);

-- tags
create table document_tags (
  document_tag_id bigserial primary key,
  document_id bigint not null references documents(document_id),
  document_tag jsonb not null,
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);

create table document_word_entry_tags (
  document_word_entry_tag_id bigserial primary key,
  document_word_entry_id bigint not null references document_word_entries(document_word_entry_id),
  document_word_entry_tag jsonb not null,
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);
create index idx__document_word_entry_id__document_word_entry_tags on document_word_entry_tags (document_word_entry_id);
create index idx__document_word_entry_tag__document_word_entry_tags on document_word_entry_tags (document_word_entry_tag);

create table word_range_tags (
  word_range_tag_id bigserial primary key,
  word_range_id bigint not null references word_ranges(word_range_id),
  word_range_tag jsonb not null,
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);
create index idx__word_range_id__word_range_tags on word_range_tags (word_range_id);
create index idx__word_range_tag__word_range_tags on word_range_tags (word_range_tag);

-- voting
create table document_tags_votes(
  document_tags_vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  document_tag_id bigint not null references document_tags(document_tag_id),
  vote bool,
  last_updated_at timestamp not null default CURRENT_TIMESTAMP,
  unique (user_id, document_tag_id)
);

create table document_word_entry_tags_votes(
  document_word_entry_tags_vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  document_word_entry_tag_id bigint not null references document_word_entry_tags(document_word_entry_tag_id),
  vote bool,
  last_updated_at timestamp not null default CURRENT_TIMESTAMP,
  unique (user_id, document_word_entry_tag_id)
);

create table word_ranges_votes(
  word_ranges_vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  word_range_id bigint not null references word_ranges(word_range_id),
  vote bool,
  last_updated_at timestamp not null default CURRENT_TIMESTAMP,
  unique (user_id, word_range_id)
);

create table word_range_tags_votes(
  word_range_tags_vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  word_range_tag_id bigint not null references word_range_tags(word_range_tag_id),
  vote bool,
  last_updated_at timestamp not null default CURRENT_TIMESTAMP,
  unique (user_id, word_range_tag_id)
);

-- SITE TEXT -------------------------------------------------------------

create table site_text_word_definitions (
  site_text_id bigserial primary key,
  word_definition_id bigint not null references word_definitions(word_definition_id),
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id),
  unique (word_definition_id)
);

create table site_text_phrase_definitions (
  site_text_id bigserial primary key,
  phrase_definition_id bigint not null references phrase_definitions(phrase_definition_id),
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id),
  unique (phrase_definition_id)
);

create table site_text_translation_counts(
  site_text_translation_count_id bigserial primary key,
  site_text_id bigint not null,
  is_word_definition bool not null,
  language_code varchar(32) not null,
  dialect_code varchar(32),
  geo_code varchar(32),
  count bigint not null default 0,
  unique (site_text_id, is_word_definition, language_code, dialect_code, geo_code)
);

-- MAPS -------------------------------------------------------------

create table original_maps(
  original_map_id bigserial primary key,
  map_file_name varchar(256) unique not null,
  language_code varchar(32) not null,
  dialect_code varchar(32),
  geo_code varchar(32),
  preview_file_id bigint references files(file_id),
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id),
  content text not null
);
create index idx__map_file_name__original_maps on original_maps (map_file_name);
create index idx__language_codes__original_maps on original_maps (language_code, dialect_code, geo_code);
create index idx__preview_file_id__original_maps on original_maps (preview_file_id);

create table original_map_words(
  original_map_word_id bigserial primary key,
  original_map_id bigint not null references original_maps(original_map_id),
  word_id bigint not null references words(word_id),
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  unique (word_id, original_map_id)
);
create index idx__original_map_id__original_map_words on original_map_words (original_map_id);
create index idx__word_id__original_map_words on original_map_words (word_id);

create table original_map_phrases(
  original_map_phrase_id bigserial primary key,
  original_map_id bigint not null references original_maps(original_map_id),
  phrase_id bigint not null references phrases(phrase_id),
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  unique (phrase_id, original_map_id)
);
create index idx__original_map_id__original_map_phrases on original_map_phrases (original_map_id);
create index idx__phrase_id__original_map_phrases on original_map_phrases (phrase_id);

create table translated_maps(
  translated_map_id bigserial primary key,
  original_map_id bigint not null references original_maps(original_map_id),
  preview_file_id bigint references files(file_id),
  language_code varchar(32) not null,
  dialect_code varchar(32),
  geo_code varchar(32),
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id),
  content text not null,
  to_retranslate boolean,
  is_retranslating_now boolean,
  unique nulls not distinct (original_map_id, language_code, dialect_code, geo_code)
);
create index idx__original_map_id__translated_maps on translated_maps (original_map_id);
create index idx__preview_file_id__translated_maps on translated_maps (preview_file_id);
create index idx__language_codes__translated_maps on translated_maps (language_code, dialect_code, geo_code);

create table question_items (
  question_item_id bigserial primary key,
  item text not null,
  created_at timestamp not null default CURRENT_TIMESTAMP,
  unique (item)
);

create table questions (
  question_id bigserial primary key,
  parent_table varchar(64) not null,
  parent_id bigint not null,
  question_type_is_multiselect bool not null,
  question text not null,
  question_items bigint[] not null, -- references question_items(question_item_id)
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id),
  unique (parent_table, parent_id, question_type_is_multiselect, question, created_by)
);

create table answers (
  answer_id bigserial primary key,
  question_id bigint not null references questions(question_id),
  answer text,
  question_items bigint[] not null, -- references question_items(question_item_id)
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id),
  unique (question_id, created_by)
);


-- mv_words_languages definition

DROP materialized view if exists mv_words_languages;
CREATE materialized view  mv_words_languages as
select
  w.word_id,
  wtwt.word_to_word_translation_id as translation_id,
  w2.language_code as t_language_code,
  w2.dialect_code as t_dialect_code,
  w2.geo_code as t_geo_code,
  w2.word_id as t_word_id,
  null::numeric  as t_phrase_id
  from words w 
  join word_definitions wd  on w.word_id =wd.word_id 
  join word_to_word_translations wtwt on wtwt.from_word_definition_id = wd.word_definition_id
  join word_definitions wd2 on wd2.word_definition_id = wtwt.to_word_definition_id 
  join words w2 on w2.word_id = wd2.word_id
union all 
select
  w.word_id,
  wtpt.word_to_phrase_translation_id as translation_id,
  w2.language_code as t_language_code,
  w2.dialect_code as t_dialect_code,
  w2.geo_code as t_geo_code,
  null::numeric  as t_word_id,
  p2.phrase_id as t_phrase_id
  from words w 
  join word_definitions wd  on w.word_id =wd.word_id
  join word_to_phrase_translations wtpt on wtpt.from_word_definition_id = wd.word_definition_id 
  join phrase_definitions pd on pd.phrase_definition_id = wtpt.to_phrase_definition_id
  join phrases p2 on pd.phrase_id = p2.phrase_id 
  join words w2 on w2.word_id = p2.words[1];

CREATE unique INDEX mv_words_languages_unq_idx ON mv_words_languages USING btree (word_id, t_language_code, t_dialect_code, t_geo_code, t_word_id,t_phrase_id) nulls not DISTINCT;
CREATE INDEX mv_words_languages_word_id_idx ON mv_words_languages USING btree (word_id);
CREATE INDEX mv_words_languages_full_language_code_idx ON mv_words_languages USING btree (t_language_code, t_dialect_code, t_geo_code);
CREATE INDEX mv_words_languages_language_code_idx ON mv_words_languages USING btree (t_language_code);
CREATE INDEX mv_words_languages_t_phrase_id_idx ON mv_words_languages USING btree (t_phrase_id);
CREATE INDEX mv_words_languages_t_word_id_idx ON mv_words_languages USING btree (t_word_id);

-- mv_phrases_languages definition

DROP materialized view  if exists mv_phrases_languages;

CREATE materialized view  mv_phrases_languages as 
select 
  p.phrase_id,
  ptwt.phrase_to_word_translation_id as translation_id,
  w2.language_code as t_language_code,
  w2.dialect_code as t_dialect_code,
  w2.geo_code as t_geo_code,
  w2.word_id as t_word_id,
  null::numeric  as t_phrase_id
  from phrases p
  join phrase_definitions pd  on p.phrase_id = pd.phrase_id  
  join phrase_to_word_translations ptwt on ptwt.from_phrase_definition_id = pd.phrase_definition_id
  join word_definitions wd2 on wd2.word_definition_id = ptwt.to_word_definition_id 
  join words w2 on w2.word_id = wd2.word_id
union all 
select
  p.phrase_id,
  ptpt.phrase_to_phrase_translation_id as translation_id,  
  w2.language_code as t_language_code,
  w2.dialect_code as t_dialect_code,
  w2.geo_code as t_geo_code,
  null::numeric  as t_word_id,
  p2.phrase_id as t_phrase_id
  from phrases p
  join phrase_definitions pd2 on p.phrase_id = pd2.phrase_id
  join phrase_to_phrase_translations ptpt on ptpt.from_phrase_definition_id = pd2.phrase_definition_id  
  join phrase_definitions pd3 on pd3.phrase_definition_id = ptpt.to_phrase_definition_id
  join phrases p2 on pd3.phrase_id = p2.phrase_id 
  join words w2 on w2.word_id = p2.words[1];

CREATE unique INDEX mv_phrases_languages_unq_idx ON mv_phrases_languages USING btree (phrase_id, t_language_code, t_dialect_code, t_geo_code, t_word_id,t_phrase_id) nulls not DISTINCT;
CREATE INDEX mv_phrases_languages_phrase_id_idx ON mv_phrases_languages USING btree (phrase_id);
CREATE INDEX mv_phrases_languages_full_language_code_idx ON mv_phrases_languages USING btree (t_language_code, t_dialect_code, t_geo_code);
CREATE INDEX mv_phrases_languages_language_code_idx ON mv_phrases_languages USING btree (t_language_code);
CREATE INDEX mv_phrases_languages_t_phrase_id_idx ON mv_phrases_languages USING btree (t_phrase_id);
CREATE INDEX mv_phrases_languages_t_word_id_idx ON mv_phrases_languages USING btree (t_word_id);

-- public.original_maps_votes definition
CREATE TABLE public.original_maps_votes (
	maps_vote_id bigserial NOT NULL,
	user_id int8 NOT NULL,
	map_id int8 NOT NULL,
	vote bool NULL,
	last_updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT original_maps_votes_pkey PRIMARY KEY (maps_vote_id),
	CONSTRAINT original_maps_votes_user_id_word_id_key UNIQUE (user_id, map_id)
);
CREATE INDEX idx__map_id__original_maps_votes ON public.original_maps_votes USING btree (map_id);
ALTER TABLE public.original_maps_votes ADD CONSTRAINT original_map_votes_id_fkey FOREIGN KEY (map_id) REFERENCES public.original_maps(original_map_id) ON DELETE CASCADE;
ALTER TABLE public.original_maps_votes ADD CONSTRAINT original_map_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;

-- public.translated_maps_votes definition
CREATE TABLE public.translated_maps_votes (
	maps_vote_id bigserial NOT NULL,
	user_id int8 NOT NULL,
	map_id int8 NOT NULL,
	vote bool NULL,
	last_updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT translated_maps_votes_pkey PRIMARY KEY (maps_vote_id),
	CONSTRAINT translated_maps_votes_user_id_word_id_key UNIQUE (user_id, map_id)
);
CREATE INDEX idx__map_id__translated_maps_votes ON public.translated_maps_votes USING btree (map_id);
ALTER TABLE public.translated_maps_votes ADD CONSTRAINT translated_map_votes_fkey FOREIGN KEY (map_id) REFERENCES public.translated_maps(translated_map_id) ON DELETE CASCADE;
ALTER TABLE public.translated_maps_votes ADD CONSTRAINT translated_map_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;

--
create table if not exists pericope_translations (
  pericope_translation_id bigserial primary key,
  pericope_id bigint not null references pericopies(pericope_id),
  translation varchar not null,
  language_code varchar(32) not null,
  dialect_code varchar(32),
  geo_code varchar(32),
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);
--
create table if not exists pericope_translations_votes(
  pericope_translations_vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  pericope_translation_id bigint not null references pericope_translations(pericope_translation_id),
  vote bool,
  last_updated_at timestamp not null default CURRENT_TIMESTAMP
);
--
CREATE table if not exists public.pericope_descriptions  (
	pericope_description_id bigserial NOT null primary key,
	pericope_id int8 NOT NULL,
	description text NOT NULL,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	created_by int8 NOT NULL,
	CONSTRAINT pericope_descriptions_pericope_id_description_key UNIQUE (pericope_id, description)
);
CREATE INDEX idx__description__pericope_descriptions ON public.pericope_descriptions USING gin (description gin_trgm_ops);
CREATE INDEX idx__pericope_id__pericope_descriptions ON public.pericope_descriptions USING btree (pericope_id);

ALTER TABLE public.pericope_descriptions ADD CONSTRAINT pericope_descriptions_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(user_id);
ALTER TABLE public.pericope_descriptions ADD CONSTRAINT pericope_descriptions_pericope_id_fkey FOREIGN KEY (pericope_id) REFERENCES public.pericopies(pericope_id);
--

CREATE table if not exists pericope_description_translations  (
	pericope_description_translation_id bigserial NOT null primary key,
	pericope_description_id int8 NOT NULL,
	translation text NOT NULL,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	created_by int8 NOT NULL,
	CONSTRAINT pericope_descriptions_tr_pericope_id_description_key UNIQUE (pericope_description_id, translation)
);
CREATE INDEX idx__description_translation__pericope_descriptions ON pericope_description_translations USING gin (translation gin_trgm_ops);
CREATE INDEX idx__pericope_description_id__pericope_descriptions ON pericope_descriptions USING btree (pericope_description_id);

-- pericope_descriptions foreign keys

ALTER TABLE pericope_description_translations ADD CONSTRAINT pericope_description_translations_created_by_fkey FOREIGN KEY (created_by) REFERENCES users(user_id);
ALTER TABLE pericope_description_translations ADD CONSTRAINT pericope_description_translations_pericope_id_fkey FOREIGN KEY (pericope_description_id) REFERENCES pericope_descriptions(pericope_description_id);
