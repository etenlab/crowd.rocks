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
drop index if exists idx__description__pericope_descriptions;
drop index if exists idx__pericope_id__pericope_descriptions;
CREATE INDEX idx__description__pericope_descriptions ON public.pericope_descriptions USING gin (description gin_trgm_ops);
CREATE INDEX idx__pericope_id__pericope_descriptions ON public.pericope_descriptions USING btree (pericope_id);

ALTER TABLE public.pericope_descriptions DROP CONSTRAINT if exists pericope_descriptions_created_by_fkey;
ALTER TABLE public.pericope_descriptions DROP CONSTRAINT if exists pericope_descriptions_pericope_id_fkey;

ALTER TABLE public.pericope_descriptions ADD CONSTRAINT pericope_descriptions_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(user_id);
ALTER TABLE public.pericope_descriptions ADD constraint pericope_descriptions_pericope_id_fkey FOREIGN KEY (pericope_id) REFERENCES public.pericopies(pericope_id);
--
drop table if exists pericope_description_translations;
CREATE table pericope_description_translations  (
	pericope_description_translation_id bigserial NOT null primary key,
	pericope_description_id int8 NOT NULL,
	translation text NOT NULL,
	language_code varchar(32) not null,
	dialect_code varchar(32),
	geo_code varchar(32),
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	created_by int8 NOT NULL,
	CONSTRAINT pericope_descriptions_tr_pericope_id_description_key UNIQUE (pericope_description_id, translation)
);

drop index if exists idx__description_translation__pericope_descriptions;
drop index if exists idx__pericope_description_id__pericope_descriptions;
CREATE INDEX idx__description_translation__pericope_descriptions ON pericope_description_translations USING gin (translation gin_trgm_ops);
CREATE INDEX idx__pericope_description_id__pericope_descriptions ON pericope_descriptions USING btree (pericope_description_id);

-- pericope_descriptions foreign keys

ALTER TABLE pericope_description_translations drop CONSTRAINT if exists pericope_description_translations_created_by_fkey;
ALTER TABLE pericope_description_translations drop CONSTRAINT if exists pericope_description_translations_pericope_id_fkey;
ALTER TABLE pericope_description_translations ADD CONSTRAINT pericope_description_translations_created_by_fkey FOREIGN KEY (created_by) REFERENCES users(user_id);
ALTER TABLE pericope_description_translations ADD CONSTRAINT pericope_description_translations_pericope_id_fkey FOREIGN KEY (pericope_description_id) REFERENCES pericope_descriptions(pericope_description_id);
