create or replace procedure batch_pericope_upsert(
  in p_start_words bigint[],
  in p_token varchar(512),
  inout p_pericope_ids bigint[],
  inout p_error_types varchar(32)[],
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_start_words_length int;

  v_temp_pericope_id bigint;
  v_temp_error_type varchar(32);
begin
   -- validate inputs
  v_start_words_length := array_length(p_start_words::bigint[], 1);

  if v_start_words_length = 0 then
    p_error_type := "NoError";
    return;
  end if;

  p_pericope_ids := array[]::bigint[];
  p_error_types := array[]::varchar(32)[];

  for i in 1..v_start_words_length loop
    v_temp_pericope_id := null;
    v_temp_error_type := 'NoError';

    call pericope_upsert(
      p_start_words[i],
      p_token,
      v_temp_pericope_id,
      v_temp_error_type
    );

    p_pericope_ids := array_append(p_pericope_ids, v_temp_pericope_id);
    p_error_types := array_append(p_error_types, v_temp_error_type);
  end loop;

  p_error_type := 'NoError';
end; $$;