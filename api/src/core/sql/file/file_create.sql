create
or replace procedure file_create(
  in p_file_name varchar(64),
  in p_file_size bigint,
  in p_file_type varchar(16),
  in p_file_url varchar(128),
  in p_file_hash varchar(255),
  in p_token varchar(512),
  inout p_file_id bigint,
  inout p_created_at varchar(32),
  inout p_created_by varchar(32),
  inout p_error_type varchar(32)
) 
language plpgsql as $$ 

declare v_user_id bigint;

v_current_file_id bigint;

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


-- create file
insert into
  files(
    file_name,
    file_size,
    created_by,
    file_type,
    file_url,
    file_hash
  )
values
  (
    p_file_name,
    p_file_size,
    v_user_id,
    p_file_type,
    p_file_url,
    p_file_hash
  ) on conflict do nothing
returning 
  file_id, created_by, created_at 
into 
  p_file_id, p_created_by, p_created_at;

p_error_type := 'NoError';

if p_file_id is null then
 select file_id 
   from files into p_file_id
 where file_id=p_file_id;
end if;

if p_file_id is null then 
 p_error_type := 'FileSaveFailed';
 return;
end if;

end;

$$;