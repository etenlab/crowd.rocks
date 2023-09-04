create table flags(
  flag_id bigserial primary key,
  parent_table varchar(64) not null,
  parent_id bigint not null,
  name varchar(64) not null,
  created_at timestamp not null default CURRENT_TIMESTAMP,
  created_by bigint not null references users(user_id)
);

ALTER TABLE public.files ALTER COLUMN file_name TYPE varchar(128) USING file_name::varchar;
ALTER TABLE public.files ALTER COLUMN file_url TYPE varchar(255) USING file_url::varchar;

ALTER TABLE public.translated_maps DROP CONSTRAINT translated_maps_preview_file_id_fkey;
ALTER TABLE public.translated_maps DROP COLUMN preview_file_id;

-- change fkeys to cascade to enable cascade drop related date when original map is deleted:
ALTER TABLE public.original_map_words DROP CONSTRAINT original_map_words_original_map_id_fkey;
ALTER TABLE public.original_map_words ADD CONSTRAINT original_map_words_original_map_id_fkey FOREIGN KEY (original_map_id) REFERENCES public.original_maps(original_map_id) ON DELETE CASCADE;
ALTER TABLE public.original_map_words DROP CONSTRAINT original_map_words_word_id_fkey;
ALTER TABLE public.original_map_words ADD CONSTRAINT original_map_words_word_id_fkey FOREIGN KEY (word_id) REFERENCES public.words(word_id) ON DELETE CASCADE;

ALTER TABLE public.original_map_phrases DROP CONSTRAINT original_map_phrases_original_map_id_fkey;
ALTER TABLE public.original_map_phrases ADD CONSTRAINT original_map_phrases_original_map_id_fkey FOREIGN KEY (original_map_id) REFERENCES public.original_maps(original_map_id) ON DELETE CASCADE;
ALTER TABLE public.original_map_phrases DROP CONSTRAINT original_map_phrases_phrase_id_fkey;
ALTER TABLE public.original_map_phrases ADD CONSTRAINT original_map_phrases_phrase_id_fkey FOREIGN KEY (phrase_id) REFERENCES public.phrases(phrase_id) ON DELETE CASCADE;

ALTER TABLE public.translated_maps DROP CONSTRAINT translated_maps_original_map_id_fkey;
ALTER TABLE public.translated_maps ADD CONSTRAINT translated_maps_original_map_id_fkey FOREIGN KEY (original_map_id) REFERENCES public.original_maps(original_map_id) ON DELETE CASCADE;