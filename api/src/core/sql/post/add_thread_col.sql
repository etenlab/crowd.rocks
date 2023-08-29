ALTER TABLE posts ADD COLUMN thread_id bigint not null references threads(thread_id);
