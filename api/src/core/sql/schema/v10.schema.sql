create index idx__parent_table_parent_id__posts on posts (parent_table, parent_id);

alter table document_word_entries
add page bigint not null default 1;

create index idx__page__document_word_entries on document_word_entries (page);
