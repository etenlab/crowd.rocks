alter table document_word_entries
add page bigint not null default 1;

create index idx__page__document_word_entries on document_word_entries (page);
create index if not exists idx__parent_table_parent_id__posts on posts (parent_table, parent_id);
alter table translated_maps add column if not exists to_retranslate boolean ;
alter table translated_maps add column if not exists is_retranslating_now boolean;
