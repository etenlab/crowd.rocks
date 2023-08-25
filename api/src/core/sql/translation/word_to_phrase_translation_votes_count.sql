DROP VIEW if exists v_word_to_phrase_translations_upvotes_count;
DROP VIEW if exists v_word_to_phrase_translations_downvotes_count;

-- public.v_word_to_phrase_translations_upvotes_count source

CREATE OR REPLACE VIEW public.v_word_to_phrase_translations_upvotes_count
AS SELECT wtpt.word_to_phrase_translation_id,
    count(v.user_id) AS up_votes_count
   FROM word_to_phrase_translations wtpt
     LEFT JOIN word_to_phrase_translations_votes v ON wtpt.word_to_phrase_translation_id = v.word_to_phrase_translation_id
  WHERE v.vote = true
  GROUP BY wtpt.word_to_phrase_translation_id;


-- public.v_word_to_phrase_translations_downvotes_count source

CREATE OR REPLACE VIEW public.v_word_to_phrase_translations_downvotes_count
AS SELECT wtpt.word_to_phrase_translation_id,
    count(v.user_id) AS down_votes_count
   FROM word_to_phrase_translations wtpt
     LEFT JOIN word_to_phrase_translations_votes v ON wtpt.word_to_phrase_translation_id = v.word_to_phrase_translation_id
  WHERE v.vote = false
  GROUP BY wtpt.word_to_phrase_translation_id;