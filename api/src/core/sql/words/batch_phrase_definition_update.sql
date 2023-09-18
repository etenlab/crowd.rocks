create or replace procedure batch_phrase_definition_update(
  in p_phrase_definition_ids bigint[],
  in p_definitions text[],
  in p_token varchar(512),
  inout p_error_types varchar(32)[],
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_phrase_definition_ids_length int;
  v_definitions_length int;

  v_temp_error_type varchar(32);
begin
  -- validate inputs
  v_phrase_definition_ids_length := array_length(
    p_phrase_definition_ids::bitint[], 1
  );
  v_definitions_length := array_length(p_definitions::text[], 1);

  if v_phrase_definition_ids_length != v_definitions_length then
    p_error_type := "InvalidInputs";
    return;
  end if;

  p_error_types := array[]::varchar(32)[];

  for i in 1..v_phrase_definition_ids_length loop
    v_temp_error_type := 'NoError';

    call phrase_definition_update(
      p_phrase_definition_ids[i],
      p_definitions[i],
      p_token,
      v_temp_error_type
    );

    p_error_types := array_append(p_error_types, v_temp_error_type);
  end loop;

  p_error_type := 'NoError';
end; $$;