DROP VIEW if exists v_phrase_to_word_translations_upvotes_count;
DROP VIEW if exists v_phrase_to_word_translations_downvotes_count;

-- public.v_phrase_to_word_translations_upvotes_count source

CREATE OR REPLACE VIEW public.v_phrase_to_word_translations_upvotes_count
AS SELECT ptwt.phrase_to_word_translation_id,
    count(v.user_id) AS up_votes_count
   FROM phrase_to_word_translations ptwt
     LEFT JOIN phrase_to_word_translations_votes v ON ptwt.phrase_to_word_translation_id = v.phrase_to_word_translation_id
  WHERE v.vote = true
  GROUP BY ptwt.phrase_to_word_translation_id;


 -- public.v_phrase_to_phrase_translations_downvotes_count source

CREATE OR REPLACE VIEW public.v_phrase_to_word_translations_downvotes_count
AS SELECT ptwt.phrase_to_word_translation_id,
    count(v.user_id) AS down_votes_count
   FROM phrase_to_word_translations ptwt
     LEFT JOIN phrase_to_word_translations_votes v ON ptwt.phrase_to_word_translation_id = v.phrase_to_word_translation_id
  WHERE v.vote = false
  GROUP BY ptwt.phrase_to_word_translation_id;
