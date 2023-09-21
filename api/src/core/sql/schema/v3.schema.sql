create table question_items {
  question_item_id bigserial primary key,
  item text not null,
  created_at timestamp not null default CURRENT_TIMESTAMP,
  unique (item)
}

create table questions {
  question_id bigserial primary key,
  parent_table varchar(64) not null,
  parent_id bigint not null,
  question_type_is_multiselect bool not null,
  question text not null,
  question_items bigint[] not null, -- references question_items(question_item_id)
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id),
  unique (parent_table, parent_id, question_type_is_multiselect, question)
}

create table answers {
  answer_id bigserial primary key,
  question_id bigint not null references questions(question_id),
  answer text,
  question_items bigint[] not null, -- references question_items(question_item_id)
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id),
  unique (question_id, answer, created_by)
}