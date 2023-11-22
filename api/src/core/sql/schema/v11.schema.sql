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

create table if not exists pericope_translations_votes(
  pericope_translations_vote_id bigserial primary key,
  user_id bigint not null references users(user_id),
  pericope_translation_id bigint not null references pericope_translations(pericope_translation_id),
  vote bool,
  last_updated_at timestamp not null default CURRENT_TIMESTAMP
);