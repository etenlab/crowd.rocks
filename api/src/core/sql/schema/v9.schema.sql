alter table forums
add description text;
alter table forums
add constraint uq__name__forums unique (name);

create index idx__name_gin__forums on forums using gin(name gin_trgm_ops);

alter table forum_folders
add description text;
alter table forum_folders
add constraint uq__name_forum_id__forum_folders unique (name, forum_id);

create index idx__name_gin__forum_folders on forum_folders using gin(name gin_trgm_ops);
create index idx__forum_id__forum_folders on forum_folders (forum_id);

alter table threads
add constraint uq__name_forum_folder_id__forum_folders unique (name, forum_folder_id);

create index idx__name_gin__threads on threads using gin(name gin_trgm_ops);
create index idx__forum_folder_id__threads on threads (forum_folder_id);