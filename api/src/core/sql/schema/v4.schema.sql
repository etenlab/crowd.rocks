create index idx__begin_word__word_ranges on word_ranges (begin_word);
create index idx__end_word__word_ranges on word_ranges (end_word);
create index idx__created_by__word_ranges on word_ranges (created_by);

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

alter table document_word_entries
rename column parent_wordlike_string_id to parent_document_word_entry_id;

alter table document_word_entries
drop constraint document_word_entries_parent_wordlike_string_id_fkey, 
add constraint document_word_entries_parent_document_word_entry_id_fkey 
	foreign key (parent_document_word_entry_id) 
	references document_word_entries(document_word_entry_id);

create index idx__document_id__document_word_entries on document_word_entries (document_id);
create index idx__wordlike_string_id__document_word_entries on document_word_entries (wordlike_string_id);
create index idx__parent_document_word_entry_id__document_word_entries on document_word_entries (parent_document_word_entry_id);
create index idx__created_by__document_word_entries on document_word_entries (created_by);
