alter table forums
add description text;
alter table forums
add constraint uq__name__forums unique (name);

create index idx__name_gin__forums on forums using gin(name gin_trgm_ops);

alter table forum_folders 
drop constraint forum_folders_forum_id_fkey;

alter table forum_folders 
add constraint forum_folders_forum_id_fkey foreign key (forum_id) references forums(forum_id) on delete cascade;

alter table forum_folders
add description text;

alter table forum_folders
add constraint uq__name_forum_id__forum_folders unique (name, forum_id);

create index idx__name_gin__forum_folders on forum_folders using gin(name gin_trgm_ops);
create index idx__forum_id__forum_folders on forum_folders (forum_id);

alter table threads 
drop constraint threads_forum_folder_id_fkey;

alter table threads 
add constraint threads_forum_folder_id_fkey foreign key (forum_folder_id) references forum_folders(forum_folder_id) on delete cascade;

alter table threads
add constraint uq__name_forum_folder_id__forum_folders unique (name, forum_folder_id);

create index idx__name_gin__threads on threads using gin(name gin_trgm_ops);
create index idx__forum_folder_id__threads on threads (forum_folder_id);

alter table versions 
drop constraint versions_post_id_fkey;

alter table versions 
add constraint versions_post_id_fkey foreign key (post_id) references posts(post_id) on delete cascade;
