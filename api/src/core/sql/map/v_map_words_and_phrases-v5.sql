-- public.v_map_words_and_phrases source

CREATE OR REPLACE VIEW public.v_map_words_and_phrases
AS SELECT DISTINCT concat(ws.wordlike_string, owd.word_definition_id) AS cursor,
    'word'::text AS type,
    ow.word_id AS o_id,
    ws.wordlike_string AS o_like_string,
    owd.definition AS o_definition,
    owd.word_definition_id AS o_definition_id,
    ow.language_code AS o_language_code,
    ow.dialect_code AS o_dialect_code,
    ow.geo_code AS o_geo_code,
    omw.original_map_id,
    ow.created_by as user_id,
	  u.is_bot,
    a.avatar,
	  a.url as avatar_url
   FROM words ow
     LEFT JOIN wordlike_strings ws ON ow.wordlike_string_id = ws.wordlike_string_id
     LEFT JOIN word_definitions owd ON ow.word_id = owd.word_id
     JOIN original_map_words omw ON ow.word_id = omw.word_id
     JOIN users u ON u.user_id = ow.created_by
     JOIN avatars a ON u.user_id = a.user_id
UNION ALL
 SELECT DISTINCT concat(oph.phraselike_string, ophd.phrase_definition_id) AS cursor,
    'phrase'::text AS type,
    oph.phrase_id AS o_id,
    oph.phraselike_string AS o_like_string,
    ophd.definition AS o_definition,
    ophd.phrase_definition_id AS o_definition_id,
    ow.language_code AS o_language_code,
    ow.dialect_code AS o_dialect_code,
    ow.geo_code AS o_geo_code,
    omph.original_map_id,
    oph.created_by as user_id,
	  u.is_bot,
    a.avatar,
	  a.url as avatar_url
   FROM phrases oph
     LEFT JOIN phrase_definitions ophd ON oph.phrase_id = ophd.phrase_id
     JOIN original_map_phrases omph ON oph.phrase_id = omph.phrase_id
     LEFT JOIN words ow ON ow.word_id = oph.words[1]
     JOIN users u ON u.user_id = ow.created_by
     JOIN avatars a ON u.user_id = a.user_id;