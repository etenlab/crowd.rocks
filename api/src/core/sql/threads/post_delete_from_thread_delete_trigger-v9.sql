create or replace function delete_post_from_thread_deletion() returns trigger as $delete_post_from_thread_deletion$
declare
  v_post_ids bigint[];
  v_table_name text;
  v_table_id bigint;

  v_post_ids_length bigint;
  v_temp_post_id bigint;
begin
  if old.thread_id is not null then
    v_table_id := old.thread_id;
    v_table_name := 'threads';

    select array(
      select post_id
      from posts
      where parent_table = v_table_name
        and parent_id = v_table_id
    )
    into v_post_ids;

    v_post_ids_length := array_length(v_post_ids::bigint[], 1);
    
    if v_post_ids_length is not null and v_post_ids_length = 0 then
      return old;
    end if;

    for i in 1..v_post_ids_length loop
      v_temp_post_id := null;

      delete from posts
      where post_id = v_post_ids[i];

      select post_id 
      from posts
      into v_temp_post_id
      where post_id = v_post_ids[i];

      if v_temp_post_id is not null then
        raise exception 'Failed at deleting posts';
      end if;
    end loop;

  end if;

  return old;
end;
$delete_post_from_thread_deletion$ language plpgsql;

create trigger delete_post_from_thread_deletion before delete on threads
  for each row execute function delete_post_from_thread_deletion();
