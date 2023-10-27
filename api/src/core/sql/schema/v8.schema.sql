-- public.words_languages definition

DROP TABLE if exists public.words_languages;
CREATE TABLE public.words_languages (
	word_id int8 NOT NULL,
	t_language_code varchar(10) NOT NULL,
	t_geo_code varchar(5) NULL,
	t_dialect_code varchar(10) NULL,
	t_word_id int8 NULL,
	t_phrase_id int8 NULL,
	CONSTRAINT words_languages_o_word_id_fk FOREIGN KEY (word_id) REFERENCES public.words(word_id) ON DELETE cascade,
	CONSTRAINT words_languages_t_word_id_fk FOREIGN KEY (t_word_id) REFERENCES public.words(word_id) ON DELETE cascade,
	CONSTRAINT words_languages_t_phrase_id_fk FOREIGN KEY (t_phrase_id) REFERENCES public.phrases(phrase_id) ON DELETE CASCADE
);
CREATE INDEX words_languages_full_language_code_idx ON public.words_languages USING btree (t_dialect_code, t_geo_code, t_language_code);
CREATE INDEX words_languages_language_code_idx ON public.words_languages USING btree (t_language_code);
CREATE INDEX words_languages_t_phrase_id_idx ON public.words_languages USING btree (t_phrase_id);
CREATE INDEX words_languages_t_word_id_idx ON public.words_languages USING btree (t_word_id);
CREATE UNIQUE INDEX words_languages_word_id_idx ON public.words_languages USING btree (word_id, t_dialect_code, t_geo_code, t_language_code, t_word_id, t_phrase_id) NULLS NOT DISTINCT;

insert into words_languages (word_id, t_language_code, t_dialect_code, t_geo_code, t_word_id, t_phrase_id)
(select distinct 
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
select distinct
  w.word_id,
  w3.language_code as t_language_code,
  w3.dialect_code as t_dialect_code,
  w3.geo_code as t_geo_code,
  null::numeric  as t_word_id,
  p2.phrase_id as t_phrase_id
  from words w 
  join word_definitions wd  on w.word_id =wd.word_id
  join word_to_phrase_translations wtpt on wtpt.from_word_definition_id = wd.word_definition_id 
  join phrase_definitions pd on pd.phrase_definition_id = wtpt.to_phrase_definition_id
  join phrases p2 on pd.phrase_id = p2.phrase_id 
  join words w3 on w3.word_id = p2.words[1])
order by (word_id);

-- public.phrases_languages definition

DROP TABLE if exists public.phrases_languages;

CREATE TABLE public.phrases_languages (
	phrase_id int8 NOT NULL,
	t_language_code varchar(10) NOT NULL,
	t_geo_code varchar(5) NULL,
	t_dialect_code varchar(10) NULL,
	t_word_id int8 NULL,
	t_phrase_id int8 NULL,
	CONSTRAINT phrases_languages_o_phrase_id_fk FOREIGN KEY (phrase_id) REFERENCES public.phrases(phrase_id) ON DELETE cascade,
	CONSTRAINT phrases_languages_t_word_id_fk FOREIGN KEY (t_word_id) REFERENCES public.words(word_id) ON DELETE cascade,
	CONSTRAINT phrases_languages_t_phrase_id_fk FOREIGN KEY (t_phrase_id) REFERENCES public.phrases(phrase_id) ON DELETE CASCADE
);
CREATE INDEX phrases_languages_dialect_code_idx ON public.phrases_languages USING btree (t_dialect_code, t_geo_code, t_language_code);
CREATE INDEX phrases_languages_language_code_idx ON public.phrases_languages USING btree (t_language_code);
CREATE INDEX phrases_languages_t_phrase_id_idx ON public.phrases_languages USING btree (t_phrase_id);
CREATE INDEX phrases_languages_t_word_id_idx ON public.phrases_languages USING btree (t_word_id);
CREATE UNIQUE INDEX phrases_languages_word_id_idx ON public.phrases_languages USING btree (phrase_id, t_dialect_code, t_geo_code, t_language_code, t_word_id, t_phrase_id) NULLS NOT DISTINCT;

--
insert into phrases_languages (phrase_id, t_language_code, t_dialect_code, t_geo_code, t_word_id, t_phrase_id)
(select distinct 
  p.phrase_id,
  w.language_code as t_language_code,
  w.dialect_code as t_dialect_code,
  w.geo_code as t_geo_code,
  w.word_id as t_word_id,
  null::numeric  as t_phrase_id
  from phrases p
  join phrase_definitions pd  on p.phrase_id = pd.phrase_id  
  join phrase_to_word_translations ptwt on ptwt.from_phrase_definition_id = pd.phrase_definition_id
  join word_definitions wd2 on wd2.word_definition_id = ptwt.to_word_definition_id 
  join words w on w.word_id = wd2.word_id
union all 
select distinct
  p.phrase_id,
  w2.language_code as t_language_code,
  w2.dialect_code as t_dialect_code,
  w2.geo_code as t_geo_code,
  null::numeric  as t_word_id,
  p.phrase_id as t_phrase_id
  from phrases p
  join phrase_definitions pd2 on p.phrase_id = pd2.phrase_id
  join phrase_to_phrase_translations ptpt on ptpt.from_phrase_definition_id = pd2.phrase_definition_id  
  join phrase_definitions pd3 on pd3.phrase_definition_id = ptpt.to_phrase_definition_id
  join phrases p2 on pd3.phrase_id = p2.phrase_id 
  join words w2 on w2.word_id = p2.words[1])
order by (phrase_id);

-- drop old view
 
drop view if exists v_map_words_and_phrases_with_tr_info;
