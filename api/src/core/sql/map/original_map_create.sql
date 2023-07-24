create
or replace procedure original_map_create(
  in p_map_file_name varchar(64),
  in p_map_content text,
  in p_token varchar(512),
  inout p_original_map_id bigint,
  inout p_creater_at varchar(32),
  inout p_created_by varchar(32),
  inout p_error_type varchar(32)
) 
language plpgsql as $$ 

declare v_user_id bigint;

v_current_map_id bigint;

begin p_error_type := 'UnknownError';

-- validate user
select
user_id
from
  tokens into v_user_id
where
  token = p_token;
if v_user_id is null then p_error_type := 'Unauthorized';
return;
end if;

-- check for map existence
select
  original_map_id
from
  original_maps
where
  map_file_name = p_map_file_name into v_current_map_id;

-- create wordlike string if needed
if v_current_map_id is not null then p_error_type := 'MapFilenameAlreadyExists';

return;

end if;

-- create map
insert into
  original_maps(
    map_file_name,
    content,
    created_by
  )
values
  (
    p_map_file_name,
    p_map_content,
    v_user_id
  ) on conflict do nothing 
returning 
  original_map_id, created_by, created_at 
into 
  p_original_map_id, p_created_by, p_creater_at;

if p_original_map_id is null then p_error_type := 'MapInsertFailed';

return;

end if;

p_error_type := 'NoError';

end;

$$;