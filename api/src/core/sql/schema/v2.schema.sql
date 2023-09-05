create table flags(
  flag_id bigserial primary key,
  parent_table varchar(64) not null,
  parent_id bigint not null,
  name varchar(64) not null,
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);

alter table documents
add constraint uc_unique_document
unique (file_id, language_code, dialect_code, geo_code);

create extension pg_trgm;

create index idx__wordlike_string_gin__wordlike_strings on wordlike_strings using gin(wordlike_string gin_trgm_ops);

create index idx__wordlike_string_id__words on words (wordlike_string_id);
create index idx__language_code__words on words (language_code);
create index idx__dialect_code__words on words (dialect_code);
create index idx__geo_code__words on words (geo_code);

create index idx__word_id__word_definitions on word_definitions (word_id);
create index idx__definition__word_definitions on word_definitions (definition);
create index idx__definition_gin__word_definitions on word_definitions using gin(definition gin_trgm_ops);

create index idx__word_definition_id__word_definitions_votes on word_definitions_votes (word_definition_id);

create index idx__word_id__words_votes on words_votes (word_id);

create index idx__words__phrases on phrases using gin (words);
create index idx__phraselike_string__phrases on phrases using gin (phraselike_string gin_trgm_ops);

create index idx__phrase_id__phrase_definitions on phrase_definitions (phrase_id);
create index idx__definition__phrase_definitions on phrase_definitions using gin (definition gin_trgm_ops);

create index idx__phrase_definition_id__phrase_definitions_votes on phrase_definitions_votes (phrase_definition_id);

create index idx__phrase_id__phrase_votes on phrase_votes (phrase_id);

create index idx__from_word_definition_id__word_to_word_translations on word_to_word_translations (from_word_definition_id);
create index idx__to_word_definition_id__word_to_word_translations on word_to_word_translations (to_word_definition_id);

create index idx__from_word_definition_id__word_to_phrase_translations on word_to_phrase_translations (from_word_definition_id);
create index idx__to_phrase_definition_id__word_to_phrase_translations on word_to_phrase_translations (to_phrase_definition_id);

create index idx__from_phrase_definition_id__phrase_to_word_translations on phrase_to_word_translations (from_phrase_definition_id);
create index idx__to_word_definition_id__phrase_to_word_translations on phrase_to_word_translations (to_word_definition_id);

create index idx__from_phrase_definition_id__phrase_to_phrase_translations on phrase_to_phrase_translations (from_phrase_definition_id);
create index idx__to_phrase_definition_id__phrase_to_phrase_translations on phrase_to_phrase_translations (to_phrase_definition_id);

create index idx__word_to_word_translation_id__word_to_word_translations_votes on word_to_word_translations_votes (word_to_word_translation_id);

create index idx__word_to_phrase_translation_id__phrase_to_word_translations_votes on word_to_phrase_translations_votes (word_to_phrase_translation_id);

create index idx__phrase_to_word_translation_id__phrase_to_word_translations_votes on phrase_to_word_translations_votes (phrase_to_word_translation_id);

create index idx__phrase_to_phrase_translation_id__phrase_to_phrase_translations_votes on phrase_to_phrase_translations_votes (phrase_to_phrase_translation_id);

create index idx__file_name__files on files (file_name);
create index idx__file_url__files on files (file_url);
create index idx__file_hash__files on files (file_hash);

create index idx__file_id__documents on documents (file_id);
create index idx__language_code__documents on documents (language_code);
create index idx__dialect_code__documents on documents (dialect_code);
create index idx__geo_code__documents on documents (geo_code);

create index idx__translation_id__site_text_translation_votes on site_text_translation_votes (translation_id);

create index idx__map_file_name__original_maps on original_maps (map_file_name);
create index idx__language_code__original_maps on original_maps (language_code);
create index idx__dialect_code__original_maps on original_maps (dialect_code);
create index idx__geo_code__original_maps on original_maps (geo_code);
create index idx__preview_file_id__original_maps on original_maps (preview_file_id);

create index idx__original_map_id__original_map_words on original_map_words (original_map_id);
create index idx__word_id__original_map_words on original_map_words (word_id);

create index idx__original_map_id__original_map_phrases on original_map_phrases (original_map_id);
create index idx__phrase_id__original_map_phrases on original_map_phrases (phrase_id);

create index idx__original_map_id__translated_maps on translated_maps (original_map_id);
create index idx__preview_file_id__translated_maps on translated_maps (preview_file_id);
create index idx__language_code__translated_maps on translated_maps (language_code);
create index idx__dialect_code__translated_maps on translated_maps (dialect_code);
create index idx__geo_code__translated_maps on translated_maps (geo_code);
