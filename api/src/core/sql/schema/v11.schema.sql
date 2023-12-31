create table if not exists pericope_translations (
  pericope_translation_id bigserial primary key,
  pericope_id bigint not null references pericopies(pericope_id),
  translation varchar not null,
  description varchar not null,
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
drop index if exists idx__description__pericope_descriptions;
drop index if exists idx__pericope_id__pericope_descriptions;
CREATE INDEX idx__description__pericope_descriptions ON public.pericope_descriptions USING gin (description gin_trgm_ops);
CREATE INDEX idx__pericope_id__pericope_descriptions ON public.pericope_descriptions USING btree (pericope_id);

ALTER TABLE public.pericope_descriptions DROP CONSTRAINT if exists pericope_descriptions_created_by_fkey;
ALTER TABLE public.pericope_descriptions DROP CONSTRAINT if exists pericope_descriptions_pericope_id_fkey;

ALTER TABLE public.pericope_descriptions ADD CONSTRAINT pericope_descriptions_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(user_id);
ALTER TABLE public.pericope_descriptions ADD constraint pericope_descriptions_pericope_id_fkey FOREIGN KEY (pericope_id) REFERENCES public.pericopies(pericope_id);

drop table if exists pericope_description_translations;

drop index if exists idx__pericope_description_id__pericope_descriptions;
CREATE INDEX idx__pericope_description_id__pericope_descriptions ON pericope_descriptions USING btree (pericope_description_id);

drop index if exists idx__document_word_entry_id__document_word_entry_tags;
drop index if exists idx__document_word_entry_tag__document_word_entry_tags;
create index idx__document_word_entry_id__document_word_entry_tags on document_word_entry_tags (document_word_entry_id);
create index idx__document_word_entry_tag__document_word_entry_tags on document_word_entry_tags (document_word_entry_tag);

drop index if exists idx__word_range_id__word_range_tags;
drop index if exists idx__word_range_tag__word_range_tags;
create index idx__word_range_id__word_range_tags on word_range_tags (word_range_id);
create index idx__word_range_tag__word_range_tags on word_range_tags (word_range_tag);

alter table pericope_votes drop constraint pericope_votes_pericope_id_fkey;
alter table pericope_votes add constraint pericope_votes_pericope_id_fkey foreign key (pericope_id) references pericopies(pericope_id) on delete cascade;

ALTER TABLE public.pericope_translations add if not exists description varchar NULL;

DROP TABLE if exists public.pericope_description_translations;
ALTER TABLE pericope_translations_votes drop CONSTRAINT if exists pericope_translations_votes_user_id_pericope_id_key;
ALTER TABLE pericope_translations_votes ADD CONSTRAINT pericope_translations_votes_user_id_pericope_id_key UNIQUE (user_id, pericope_translation_id);

ALTER TABLE public.pericope_translations DROP CONSTRAINT pericope_translations_pericope_id_fkey;
ALTER TABLE public.pericope_translations ADD CONSTRAINT pericope_translations_pericope_id_fkey FOREIGN KEY (pericope_id) REFERENCES public.pericopies(pericope_id) ON DELETE CASCADE;
ALTER TABLE public.pericope_translations_votes DROP CONSTRAINT pericope_translations_votes_pericope_translation_id_fkey;
ALTER TABLE public.pericope_translations_votes ADD CONSTRAINT pericope_translations_votes_pericope_translation_id_fkey FOREIGN KEY (pericope_translation_id) REFERENCES public.pericope_translations(pericope_translation_id) ON DELETE CASCADE;
