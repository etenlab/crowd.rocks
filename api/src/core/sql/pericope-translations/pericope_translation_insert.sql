drop procedure if exists pericope_translation_insert;
create or replace procedure pericope_translation_insert(
  in p_token  varchar(512),
  in p_pericope_id  bigint,
  in p_translation  varchar,
  in p_description_tr  varchar,
  in p_language_code  varchar(32),
  in p_dialect_code  varchar(32),
  in p_geo_code  varchar(32),
  inout p_pericope_translation_id bigint,
  inout p_error_type varchar(32),
  inout p_user_id bigint,
  inout p_avatar varchar,
  inout p_avatar_url varchar,
  inout p_is_bot boolean,
  inout p_created_at varchar
)
language plpgsql
as $$
begin
  p_error_type := 'UnknownError';

  -- validate user
  select user_id
  from tokens
  into p_user_id
  where token = p_token;

  if p_user_id is null then
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

  INSERT INTO pericope_translations (
    pericope_id, translation, description, language_code, dialect_code, geo_code, created_by)
    VALUES (
    p_pericope_id, p_translation, p_description_tr, p_language_code, p_dialect_code, p_geo_code, p_user_id)
    RETURNING pericope_translations.pericope_translation_id, pericope_translations.created_at
    INTO p_pericope_translation_id, p_created_at;

  select u.is_bot, a.avatar, a.url 
  into p_is_bot, p_avatar, p_avatar_url
  from users u 
  left join avatars a on u.user_id = a.user_id
  where u.user_id = p_user_id;

  p_error_type := 'NoError';

end; $$;