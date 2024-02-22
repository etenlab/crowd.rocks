create or replace procedure create_fake_graph_data(
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  word1 bigint;
  key1 bigint;
  value1 bigint;
  value2 bigint;
begin
  p_error_type := 'UnknownError';

  call node_create('Word', '"Bob"'::jsonb, word1, null);
  call node_create('Key', '"isNoun"'::jsonb, key1, null);
  call node_create('Value', 'true'::jsonb, value1, null);
  call node_create('Value', 'false'::jsonb, value2, null);

  p_error_type := 'NoError';

end; $$;