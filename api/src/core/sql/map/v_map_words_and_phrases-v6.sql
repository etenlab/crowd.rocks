-- public.v_map_words_and_phrases source
drop view if exists v_map_words_and_phrases;
CREATE OR REPLACE VIEW public.v_map_words_and_phrases
AS SELECT distinct on (type, o_id) concat(ws.wordlike_string, owd.word_definition_id) AS cursor,
    'word'::text AS type,
    ow.word_id AS o_id,
	  ow.created_at AS o_created_at,
	  ow.created_by as o_created_by,
    ws.wordlike_string AS o_like_string,
    owd.definition AS o_definition,
    owd.word_definition_id AS o_definition_id,
    ow.language_code AS o_language_code,
    ow.dialect_code AS o_dialect_code,
    ow.geo_code AS o_geo_code,
    omw.original_map_id,
	  wtwt.word_to_word_translation_id as some_to_word_tr_id,
	  wtpt.word_to_phrase_translation_id as some_to_phrase_tr_id
   FROM words ow
     JOIN wordlike_strings ws ON ow.wordlike_string_id = ws.wordlike_string_id
     JOIN word_definitions owd ON ow.word_id = owd.word_id
     JOIN original_map_words omw ON ow.word_id = omw.word_id
     left join word_to_word_translations wtwt on owd.word_definition_id = wtwt.from_word_definition_id  
     left join word_to_phrase_translations wtpt on owd.word_definition_id = wtpt.from_word_definition_id          
UNION ALL
 SELECT DISTINCT on (type, o_id) concat(oph.phraselike_string, ophd.phrase_definition_id) AS cursor,
    'phrase'::text AS type,
    oph.phrase_id AS o_id,
    oph.created_at AS o_created_at,
	  oph.created_by as o_created_by,
    oph.phraselike_string AS o_like_string,
    ophd.definition AS o_definition,
    ophd.phrase_definition_id AS o_definition_id,
    ow.language_code AS o_language_code,
    ow.dialect_code AS o_dialect_code,
    ow.geo_code AS o_geo_code,
    omph.original_map_id,
	  ptwt.phrase_to_word_translation_id as some_to_word_tr_id,
	  ptpt.phrase_to_phrase_translation_id as some_to_phrase_tr_id

   FROM phrases oph
     JOIN phrase_definitions ophd ON oph.phrase_id = ophd.phrase_id
     JOIN original_map_phrases omph ON oph.phrase_id = omph.phrase_id
     JOIN words ow ON ow.word_id = oph.words[1]
     left join phrase_to_word_translations ptwt on ophd.phrase_definition_id = ptwt.from_phrase_definition_id  
     left join phrase_to_phrase_translations ptpt on ophd.phrase_definition_id = ptpt.from_phrase_definition_id 

