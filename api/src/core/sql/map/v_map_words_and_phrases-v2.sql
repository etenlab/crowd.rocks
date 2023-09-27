drop view if exists v_map_words_and_phrases;
create view v_map_words_and_phrases as
       select distinct
        concat(ws.wordlike_string, owd.word_definition_id) as cursor,
        'word' as type,
        ow.word_id as o_id,
        ws.wordlike_string as o_like_string,
        owd.definition as o_definition,
        owd.word_definition_id as o_definition_id,
        ow.language_code as o_language_code,
        ow.dialect_code as o_dialect_code,
        ow.geo_code as o_geo_code
      from
        words ow
      left join wordlike_strings ws on
        ow.wordlike_string_id = ws.wordlike_string_id
      left join
      	word_definitions owd on ow.word_id= owd.word_id
      inner join
      	original_map_words omw on ow.word_id = omw.word_id
union all      	
      select distinct
        concat(oph.phraselike_string, ophd.phrase_definition_id) as cursor,
        'phrase' as type,
        oph.phrase_id as o_id,
        oph.phraselike_string as o_like_string,
        ophd.definition as o_definition,
        ophd.phrase_definition_id  as o_definition_id,
        ow.language_code as o_language_code,
        ow.dialect_code as o_dialect_code,
        ow.geo_code as o_geo_code
      from
        phrases oph
      left join 
      	phrase_definitions ophd on oph.phrase_id= ophd.phrase_id
      inner join 
      	original_map_phrases omph on oph.phrase_id = omph.phrase_id
      left join words ow on ow.word_id = oph.words[1]      	