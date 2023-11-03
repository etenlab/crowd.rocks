-- public.v_map_words_and_phrases source
drop view if exists v_map_words_and_phrases;

CREATE OR REPLACE VIEW v_map_words_and_phrases as
SELECT DISTINCT ON ('word'::text, ow.word_id, original_map_id) 
	concat(ws.wordlike_string, owd.word_definition_id) AS cursor,
    'word'::text AS type,
    ow.word_id AS o_id,
    ws.wordlike_string AS o_like_string,
    owd.definition AS o_definition,
    owd.word_definition_id AS o_definition_id,
    owd.word_definition_id AS w_definition_id,
    ow.language_code AS o_language_code,
    ow.dialect_code AS o_dialect_code,
    ow.geo_code AS o_geo_code,
    omw.original_map_id,
    ow.created_by AS o_created_by,
    ow.created_at AS o_created_at
   FROM words ow
     JOIN wordlike_strings ws ON ow.wordlike_string_id = ws.wordlike_string_id
     JOIN word_definitions owd ON ow.word_id = owd.word_id
     JOIN original_map_words omw ON ow.word_id = omw.word_id
UNION ALL
 SELECT DISTINCT ON ('phrase'::text, oph.phrase_id, original_map_id) 
 	concat(oph.phraselike_string, ophd.phrase_definition_id) AS cursor,
    'phrase'::text AS type,
    oph.phrase_id AS o_id,
    oph.phraselike_string AS o_like_string,
    ophd.definition AS o_definition,
    ophd.phrase_definition_id AS o_definition_id,
    ophd.phrase_definition_id AS w_definition_id,
    ow.language_code AS o_language_code,
    ow.dialect_code AS o_dialect_code,
    ow.geo_code AS o_geo_code,
    omph.original_map_id,
    oph.created_by AS o_created_by,
    oph.created_at AS o_created_at
   FROM phrases oph
     JOIN phrase_definitions ophd ON oph.phrase_id = ophd.phrase_id
     JOIN original_map_phrases omph ON oph.phrase_id = omph.phrase_id
     JOIN words ow ON ow.word_id = oph.words[1];

---
ALTER TABLE public.original_maps_votes DROP CONSTRAINT if exists words_votes_map_id_fkey;
ALTER TABLE public.original_maps_votes DROP CONSTRAINT if exists original_map_votes_id_fkey;
ALTER TABLE public.original_maps_votes ADD CONSTRAINT original_map_votes_id_fkey FOREIGN KEY (map_id) REFERENCES public.original_maps(original_map_id) ON DELETE CASCADE;

ALTER TABLE public.translated_maps_votes DROP CONSTRAINT if exists words_votes_map_id_fkey;
ALTER TABLE public.translated_maps_votes DROP CONSTRAINT if exists translated_map_votes_fkey;
ALTER TABLE public.translated_maps_votes ADD CONSTRAINT translated_map_votes_fkey FOREIGN KEY (map_id) REFERENCES public.translated_maps(translated_map_id) ON DELETE CASCADE;
---
ALTER TABLE public.original_maps_votes DROP CONSTRAINT if exists words_votes_user_id_fkey;
ALTER TABLE public.original_maps_votes DROP CONSTRAINT if exists original_map_votes_user_id_fkey;
ALTER TABLE public.original_maps_votes ADD CONSTRAINT original_map_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE;

ALTER TABLE public.translated_maps_votes DROP CONSTRAINT if exists words_votes_user_id_fkey;
ALTER TABLE public.translated_maps_votes DROP CONSTRAINT if exists translated_map_votes_user_id_fkey;
ALTER TABLE public.translated_maps_votes ADD CONSTRAINT translated_map_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE;;

