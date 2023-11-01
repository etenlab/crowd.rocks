-- mv_words_languages definition

DROP materialized view if exists mv_words_languages;
CREATE materialized view  mv_words_languages as
select
  w.word_id,
  w2.language_code as t_language_code,
  w2.dialect_code as t_dialect_code,
  w2.geo_code as t_geo_code,
  w2.word_id as t_word_id,
  null::numeric  as t_phrase_id
  from words w 
  join word_definitions wd  on w.word_id =wd.word_id 
  join word_to_word_translations wtwt on wtwt.from_word_definition_id = wd.word_definition_id
  join word_definitions wd2 on wd2.word_definition_id = wtwt.to_word_definition_id 
  join words w2 on w2.word_id = wd2.word_id
union all 
select
  w.word_id,
  w2.language_code as t_language_code,
  w2.dialect_code as t_dialect_code,
  w2.geo_code as t_geo_code,
  null::numeric  as t_word_id,
  p2.phrase_id as t_phrase_id
  from words w 
  join word_definitions wd  on w.word_id =wd.word_id
  join word_to_phrase_translations wtpt on wtpt.from_word_definition_id = wd.word_definition_id 
  join phrase_definitions pd on pd.phrase_definition_id = wtpt.to_phrase_definition_id
  join phrases p2 on pd.phrase_id = p2.phrase_id 
  join words w2 on w2.word_id = p2.words[1];

CREATE INDEX mv_words_languages_idx ON mv_words_languages USING btree (word_id, t_language_code, t_dialect_code, t_geo_code, t_word_id,t_phrase_id) nulls not DISTINCT;
CREATE INDEX mv_words_languages_full_language_code_idx ON mv_words_languages USING btree (t_language_code, t_dialect_code, t_geo_code);
CREATE INDEX mv_words_languages_language_code_idx ON mv_words_languages USING btree (t_language_code);
CREATE INDEX mv_words_languages_t_phrase_id_idx ON mv_words_languages USING btree (t_phrase_id);
CREATE INDEX mv_words_languages_t_word_id_idx ON mv_words_languages USING btree (t_word_id);

-- mv_phrases_languages definition

DROP materialized view  if exists mv_phrases_languages;

CREATE materialized view  mv_phrases_languages as 
select 
  p.phrase_id,
  w2.language_code as t_language_code,
  w2.dialect_code as t_dialect_code,
  w2.geo_code as t_geo_code,
  w2.word_id as t_word_id,
  null::numeric  as t_phrase_id
  from phrases p
  join phrase_definitions pd  on p.phrase_id = pd.phrase_id  
  join phrase_to_word_translations ptwt on ptwt.from_phrase_definition_id = pd.phrase_definition_id
  join word_definitions wd2 on wd2.word_definition_id = ptwt.to_word_definition_id 
  join words w2 on w2.word_id = wd2.word_id
union all 
select
  p.phrase_id,
  w2.language_code as t_language_code,
  w2.dialect_code as t_dialect_code,
  w2.geo_code as t_geo_code,
  null::numeric  as t_word_id,
  p2.phrase_id as t_phrase_id
  from phrases p
  join phrase_definitions pd2 on p.phrase_id = pd2.phrase_id
  join phrase_to_phrase_translations ptpt on ptpt.from_phrase_definition_id = pd2.phrase_definition_id  
  join phrase_definitions pd3 on pd3.phrase_definition_id = ptpt.to_phrase_definition_id
  join phrases p2 on pd3.phrase_id = p2.phrase_id 
  join words w2 on w2.word_id = p2.words[1];

CREATE INDEX mv_phrases_languages_idx ON mv_phrases_languages USING btree (phrase_id, t_language_code, t_dialect_code, t_geo_code, t_word_id,t_phrase_id) nulls not DISTINCT;
CREATE INDEX mv_phrases_languages_full_language_code_idx ON mv_phrases_languages USING btree (t_language_code, t_dialect_code, t_geo_code);
CREATE INDEX mv_phrases_languages_language_code_idx ON mv_phrases_languages USING btree (t_language_code);
CREATE INDEX mv_phrases_languages_t_phrase_id_idx ON mv_phrases_languages USING btree (t_phrase_id);
CREATE INDEX mv_phrases_languages_t_word_id_idx ON mv_phrases_languages USING btree (t_word_id);