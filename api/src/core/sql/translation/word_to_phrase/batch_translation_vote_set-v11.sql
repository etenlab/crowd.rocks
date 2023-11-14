create or replace procedure batch_word_to_phrase_translation_vote_set(
  in p_word_to_phrase_translation_ids bigint[],
  in p_token varchar(512),
  in p_vote boolean,
  inout p_translation_vote_ids bigint[],
  inout p_error_types varchar(32)[],
  inout p_error_type varchar(32),
  in p_user_id bigint default -1
)
language plpgsql
as $$
declare
  v_word_to_phrase_translation_ids_length int;

  v_temp_word_to_phrase_translation_vote_id bigint;
  v_temp_error_type varchar(32);
begin
  -- validate inputs

  v_word_to_phrase_translation_ids_length := array_length(
    p_word_to_phrase_translation_ids::bigint[], 1
  );

  p_translation_vote_ids := array[]::bigint[];
  p_error_types := array[]::varchar(32)[];

  for i in 1..v_word_to_phrase_translation_ids_length loop
    v_temp_word_to_phrase_translation_vote_id := 0;
    v_temp_error_type := 'NoError';

    call word_to_phrase_translation_vote_set(
      p_word_to_phrase_translation_ids[i],
      p_token,
      p_vote,
      v_temp_word_to_phrase_translation_vote_id,
      v_temp_error_type,
      p_user_id
    );

    p_translation_vote_ids := array_append(
      p_translation_vote_ids, 
      v_temp_word_to_phrase_translation_vote_id
    );
    p_error_types := array_append(p_error_types, v_temp_error_type);
  end loop;

  p_error_type := 'NoError';
end; $$;