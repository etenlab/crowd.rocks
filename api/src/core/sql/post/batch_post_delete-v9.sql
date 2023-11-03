create or replace procedure batch_post_delete(
  in p_token varchar(512),
  inout p_post_ids bigint[],
  inout p_error_types varchar(32)[],
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_post_ids_length int;
  
  v_post_ids bigint[];
  v_temp_error_type varchar(32);
begin
   -- validate inputs
  v_post_ids_length := array_length(p_post_ids::bigint[], 1);

  p_error_types := array[]::varchar(32)[];

  for i in 1..v_post_ids_length loop
    v_temp_error_type := 'NoError';

    call post_delete(
      p_token,
      p_post_ids[i],
      v_temp_error_type
    );

    p_error_types := array_append(p_error_types, v_temp_error_type);
  end loop;

  p_error_type := 'NoError';
end; $$;