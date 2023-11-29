create or replace procedure pericope_translation_insert(
  in p_token  varchar(512),
  in p_pericope_id  bigint,
  in p_translation  varchar,
  in p_description_tr  varchar,
  in p_language_code  varchar(32),
  in p_dialect_code  varchar(32),
  in p_geo_code  varchar(32),
  inout p_pericope_translation_id bigint,
  inout p_pericope_description_tr_id bigint,
  inout p_error_type varchar(32),
  inout p_created_by bigint
)
language plpgsql
as $$
declare
  v_pericope_description_id bigint;
begin
  p_error_type := 'UnknownError';

  -- validate user
  select user_id
  from tokens
  into p_created_by
  where token = p_token;

  if p_created_by is null then
    p_error_type := 'Unauthorized';
    return;
  end if;

   -- validate inputs
  if p_translation is null 
  or p_description_tr is null 
  or p_pericope_id is null
  or p_language_code is null
  then
    p_error_type := "PericopeTranslationInsertFailed";
    return;
  end if;

  select pd.pericope_description_id  from pericope_descriptions pd 
  where pd.pericope_id = p_pericope_id
  into v_pericope_description_id;

  if v_pericope_description_id is null then
    INSERT INTO pericope_descriptions (pericope_id, description, created_by)
    VALUES (p_pericope_id, '', p_created_by)
    RETURNING pericope_descriptions.pericope_description_id
    INTO v_pericope_description_id;
  end if;

  INSERT INTO pericope_translations (
    pericope_id, translation, language_code, dialect_code, geo_code, created_by)
    VALUES (
    p_pericope_id, p_translation, p_language_code, p_dialect_code, p_geo_code, p_created_by)
    RETURNING pericope_translations.pericope_translation_id
    INTO p_pericope_translation_id;

  INSERT INTO pericope_description_translations (
    pericope_description_id, translation, language_code, dialect_code, geo_code, created_by)
	  VALUES (v_pericope_description_id, p_description_tr, p_language_code, p_dialect_code, p_geo_code, p_created_by)
    RETURNING pericope_description_translations.pericope_description_translation_id
    INTO p_pericope_description_tr_id;
  p_error_type := 'NoError';

end; $$;