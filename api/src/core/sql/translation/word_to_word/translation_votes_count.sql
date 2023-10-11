DROP VIEW if exists v_word_to_word_translations_totalvotes_count;
DROP VIEW if exists v_word_to_word_translations_upvotes_count;
DROP VIEW if exists v_word_to_word_translations_downvotes_count;

-- upvotes view

create view v_word_to_word_translations_upvotes_count as 
select
	wtwt.word_to_word_translation_id,
	count(v.user_id) as up_votes_count
from
	word_to_word_translations wtwt 
left join word_to_word_translations_votes v on
	wtwt.word_to_word_translation_id = v.word_to_word_translation_id
where
	vote = true
group by
	wtwt.word_to_word_translation_id;

-- downvotes view

create view v_word_to_word_translations_downvotes_count as 
select
	wtwt.word_to_word_translation_id,
	count(v.user_id) as down_votes_count
from
	word_to_word_translations wtwt
left join word_to_word_translations_votes v on
	wtwt.word_to_word_translation_id = v.word_to_word_translation_id
where
	vote = false
group by
	wtwt.word_to_word_translation_id;

-- totalvotes view

-- create view v_word_to_word_translations_totalvotes_count as 
-- 	select 
-- 		wtwt.word_to_word_translation_id,
-- 		uw.up_votes_count, 
-- 		dw.down_votes_count,
-- 		coalesce(uw.up_votes_count, 0) - coalesce(dw.down_votes_count, 0) as Total
-- 	from
-- 		word_to_word_translations wtwt
-- 	left join v_word_to_word_translations_upvotes_count uw on
-- 		wtwt.word_to_word_translation_id = uw.word_to_word_translation_id
-- 	left join v_word_to_word_translations_downvotes_count dw on
-- 		wtwt.word_to_word_translation_id = dw.word_to_word_translation_id;

	