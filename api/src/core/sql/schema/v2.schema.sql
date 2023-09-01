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

