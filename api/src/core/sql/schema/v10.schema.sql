create index idx__parent_table_parent_id__posts on posts (parent_table, parent_id);

alter table document_word_entries
add page bigint not null;

create index idx__document_id__document_word_entries on document_word_entries (document_id);
create index idx__wordlike_string_id__document_word_entries on document_word_entries (wordlike_string_id);
create index idx__parent_document_word_entry_id__document_word_entries on document_word_entries (parent_document_word_entry_id);
create index idx__page__document_word_entries on document_word_entries (page);
