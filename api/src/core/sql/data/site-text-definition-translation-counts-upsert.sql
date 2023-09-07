create or replace procedure site_text_translation_count_upsert(
  in p_site_text_id bigint,
  in p_is_word_definition bool,
  in p_language_code varchar(32),
  in p_dialect_code varchar(32),
  in p_geo_code varchar(32),
  in p_count bigint,
  inout p_site_text_translation_count_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
begin
  p_error_type := 'UnknownError';

  -- validate inpus
  if p_site_text_id is null or p_language_code is null or p_is_word_definition is null then
    p_error_type := 'InvalidInputs';
    return;
  end if;

  -- check for already exists
  p_site_text_translation_count_id := null;

  select site_text_translation_count_id
  into p_site_text_translation_count_id
  from site_text_translation_counts
  where site_text_id = p_site_text_id
    and is_word_definition = p_is_word_definition
    and language_code = p_language_code
    and (dialect_code = p_dialect_code or (dialect_code is null and p_dialect_code is null))
    and (geo_code = p_geo_code or (geo_code is null and p_geo_code is null));

  if p_site_text_translation_count_id is not null then
    update site_text_translation_counts
    set
      site_text_id = p_site_text_id,
      is_word_definition = p_is_word_definition,
      language_code = p_language_code,
      dialect_code = p_dialect_code,
      geo_code = p_geo_code,
      count = p_count
    where site_text_translation_count_id = p_site_text_translation_count_id;
  else 
    insert into site_text_translation_counts(site_text_id, is_word_definition, language_code, dialect_code, geo_code, count)
    values (p_site_text_id, p_is_word_definition, p_language_code, p_dialect_code, p_geo_code, p_count)
    on conflict do nothing
    returning site_text_translation_count_id INTO p_site_text_translation_count_id;
  end if;
  
  p_error_type := 'NoError';

end; $$;