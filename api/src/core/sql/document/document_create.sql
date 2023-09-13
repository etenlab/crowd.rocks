create
or replace procedure document_create(

  in p_file_id bigint,
  in p_token varchar(512),
  in p_language_code varchar(32),
  in p_dialect_code varchar(32),
  in p_geo_code varchar(32),
  inout p_document_id bigint,
  inout p_created_at varchar(32),
  inout p_created_by varchar(32),
  inout p_error_type varchar(32)
)

language plpgsql as $$ 

declare v_user_id bigint;

v_current_document_id bigint;

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

-- create document
insert into
  documents(
    file_id,
    language_code,
    dialect_code,
    geo_code,
    created_by
  )
values
  (
    p_file_id,
    p_language_code,
    p_dialect_code,
    p_geo_code,
    v_user_id
  ) 
returning 
  document_id 
into 
  p_document_id;

if p_document_id is null then p_error_type := 'MapInsertFailed';

return;

end if;

p_error_type := 'NoError';

end;

$$;