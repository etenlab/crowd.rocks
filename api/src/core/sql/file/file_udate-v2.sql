drop PROCEDURE if exists file_update;
CREATE OR REPLACE PROCEDURE file_update(
IN p_file_id bigint, 
IN p_file_name character varying, 
IN p_file_size bigint, 
IN p_file_type character varying, 
IN p_file_url character varying, 
IN p_file_hash character varying, 
IN p_token character varying, 
INOUT p_created_at character varying, 
INOUT p_created_by character varying, 
INOUT p_error_type character varying)

 LANGUAGE plpgsql
AS $procedure$ 

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


-- update file
update files
set 
    file_name = p_file_name,
    file_size = p_file_size,
    created_by = v_user_id,
    file_type = p_file_type,
    file_url = p_file_url,
    file_hash = p_file_hash
 
  where files.file_id = p_file_id
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

$procedure$
;
