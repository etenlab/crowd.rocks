create or replace procedure site_text_language_upsert(
  in p_language_code varchar(32),
  in p_dialect_code varchar(32),
  in p_geo_code varchar(32),
  inout p_site_text_language_id bigint,
  inout p_error_type varchar(32)
)
language plpgsql
as $$
declare
  v_site_text_language_id bigint;
begin
  p_error_type := 'UnknownError';

  -- validate inpus
  if p_language_code is null then
    p_error_type := 'InvalidInputs';
    return;
  end if;

  insert into site_text_languages(language_code, dialect_code, geo_code)
  values (p_language_code, p_dialect_code, p_geo_code)
  on conflict do nothing
  returning site_text_language_id
  into p_site_text_language_id;

  if p_site_text_language_id is null then
    select site_text_language_id
    from site_text_languages
    where language_code = p_language_code
      and dialect_code = p_dialect_code
      and geo_code = p_geo_code
    into p_site_text_language_id;
  end if;

  if p_site_text_language_id is null then
    return;
  end if;
  
  p_error_type := 'NoError';

end; $$;