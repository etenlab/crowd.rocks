create or replace function calc_translation_cnt_from_definition_id(definition_id bigint, from_type_is_word bool, p_language_code varchar(32), p_dialect_code varchar(32) default null, p_geo_code varchar(32) default null) 
returns bigint as $$
declare
  v_w2w_cnt bigint;
  v_w2p_cnt bigint;
  v_p2w_cnt bigint;
  v_p2p_cnt bigint;
begin
  if from_type_is_word is true then
    select count(*) into v_w2w_cnt
    from (
      select *
      from word_to_word_translations
      where from_word_definition_id = definition_id
    ) as w2wtrs
    join (
      select word_definitions.word_definition_id
      from (
        select word_id
        from words
        where words.language_code = p_language_code
	        and (words.dialect_code = p_dialect_code or (words.dialect_code is null and p_dialect_code is null))
	    	and (words.geo_code = p_geo_code or (words.geo_code is null and p_geo_code is null))
      ) as ws
      join word_definitions 
      on word_definitions.word_id = ws.word_id
    ) as wds
    on w2wtrs.to_word_definition_id = wds.word_definition_id;    
  
    select count(*) into v_w2p_cnt
    from (
      select * 
      from word_to_phrase_translations
      where from_word_definition_id = definition_id
    ) as w2ptrs
    join (
      select phrase_definitions.phrase_definition_id
      from (
        select phrase_id
        from (
          select word_id
          from words
          where words.language_code = p_language_code
          	and (words.dialect_code = p_dialect_code or (words.dialect_code is null and p_dialect_code is null))
	    	and (words.geo_code = p_geo_code or (words.geo_code is null and p_geo_code is null))
        ) as ws
        join phrases
        on ws.word_id = any(phrases.words)
      ) as ps
      join phrase_definitions
      on phrase_definitions.phrase_id = ps.phrase_id
    ) as pds
    on w2ptrs.to_phrase_definition_id = pds.phrase_definition_id;
	
   	return v_w2w_cnt + v_w2p_cnt;
  end if;
 
  if from_type_is_word is false then
    select count(*) into v_p2w_cnt
    from (
      select *
      from phrase_to_word_translations
      where from_phrase_definition_id = definition_id
    ) as p2wtrs
    join (
      select word_definitions.word_definition_id
      from (
        select word_id
        from words
        where words.language_code = p_language_code
        	and (words.dialect_code = p_dialect_code or (words.dialect_code is null and p_dialect_code is null))
	    	and (words.geo_code = p_geo_code or (words.geo_code is null and p_geo_code is null))
      ) as ws
      join word_definitions 
      on word_definitions.word_id = ws.word_id
    ) as wds
    on p2wtrs.to_word_definition_id = wds.word_definition_id;  

    select count(*) into v_p2p_cnt
    from (
      select * 
      from phrase_to_phrase_translations
      where from_phrase_definition_id = definition_id
    ) as p2ptrs
    join (
      select phrase_definitions.phrase_definition_id
      from (
        select phrase_id
        from (
          select word_id
          from words
          where words.language_code = p_language_code
            and (words.dialect_code = p_dialect_code or (words.dialect_code is null and p_dialect_code is null))
	    	and (words.geo_code = p_geo_code or (words.geo_code is null and p_geo_code is null))
        ) as ws
        join phrases
        on ws.word_id = any(phrases.words)
      ) as ps
      join phrase_definitions
      on phrase_definitions.phrase_id = ps.phrase_id
    ) as pds
    on p2ptrs.to_phrase_definition_id = pds.phrase_definition_id;

    return v_p2w_cnt + v_p2p_cnt;
  end if;
end
$$
language plpgsql immutable;

create or replace function update_site_text_translation_counts() returns trigger as $update_site_text_translation_counts$
declare
  p_from_type_is_word bool;
  p_to_type_is_word bool;

  v_word_definition_id bigint;
  v_site_text_ids bigint[];
  v_site_text_id bigint;
  v_translation_cnt bigint;
  v_language_code text;
  v_dialect_code text;
  v_geo_code text;

  v_site_text_translation_count_id bigint;
begin
  if tg_table_name = 'word_to_word_translations' then
    p_from_type_is_word := true;
    p_to_type_is_word := true;
  elsif tg_table_name = 'word_to_phrase_translations' then
    p_from_type_is_word := true;
    p_to_type_is_word := false;
  elsif tg_table_name = 'phrase_to_word_translations' then
    p_from_type_is_word := false;
    p_to_type_is_word := true;
  elsif tg_table_name = 'phrase_to_phrase_translations' then
    p_from_type_is_word := false;
    p_to_type_is_word := false;
  else
    return new;
  end if;

  if p_to_type_is_word is true then 
    select 
      language_code,
      dialect_code,
      geo_code
    into
      v_language_code,
      v_dialect_code,
      v_geo_code
    from (
      select word_id
      from word_definitions
      where word_definition_id = new.to_word_definition_id
    ) as wds
    join words
    on words.word_id = wds.word_id;
  else 
    select 
      language_code,
      dialect_code,
      geo_code
    into
      v_language_code,
      v_dialect_code,
      v_geo_code
    from (
      select ps.words
      from (
        select phrase_id
        from phrase_definitions
        where phrase_definition_id = new.to_phrase_definition_id
      ) as pds
      join phrases as ps
      on ps.phrase_id = pds.phrase_id
    ) as temp_table
    join words
    on words.word_id = any(temp_table.words);
  end if;

  if p_from_type_is_word is true then
    select array(
      select site_text_id
        from site_text_word_definitions
        where word_definition_id = new.from_word_definition_id
    )
    into v_site_text_ids;
	
    if array_length(v_site_text_ids::bigint[], 0) != 1 then
      return new;
    end if;

    v_site_text_id := v_site_text_ids[1];

    
    -- v_translation_cnt := calc_translation_cnt_from_definition_id(
    --   new.from_word_definition_id, 
    --   true,
    --   v_language_code,
    --   v_dialect_code,
    --   v_geo_code
    -- ) + 1;
    v_translation_cnt := 1;
  else 
    select array(
      select site_text_id
        from site_text_phrase_definitions
        where phrase_definition_id = new.from_phrase_definition_id
    )
    into v_site_text_ids;
	
    if array_length(v_site_text_ids::bigint[], 0) != 1 then
      return new;
    end if;

    v_site_text_id := v_site_text_ids[1];

    -- v_translation_cnt := calc_translation_cnt_from_definition_id(
    --   new.from_phrase_definition_id, 
    --   false,
    --   v_language_code,
    --   v_dialect_code,
    --   v_geo_code
    -- ) + 1;

    v_translation_cnt := 1;
  end if;

  if v_site_text_id is null then
    return new;
  end if; 

  v_site_text_translation_count_id := null;

  select site_text_translation_count_id
  into v_site_text_translation_count_id
  from site_text_translation_counts
  where site_text_id = v_site_text_id
    and is_word_definition = p_from_type_is_word
    and language_code = v_language_code
    and (dialect_code = v_dialect_code or (dialect_code is null and v_dialect_code is null))
    and (geo_code = v_geo_code or (geo_code is null and v_geo_code is null));

  if v_site_text_translation_count_id is not null then
    update site_text_translation_counts
    set
      site_text_id = v_site_text_id,
      is_word_definition = p_from_type_is_word,
      language_code = v_language_code,
      dialect_code = v_dialect_code,
      geo_code = v_geo_code,
      count = v_translation_cnt
    where site_text_id = v_site_text_id
      and is_word_definition = p_from_type_is_word
      and language_code = v_language_code
      and (dialect_code = v_dialect_code or (dialect_code is null and v_dialect_code is null))
      and (geo_code = v_geo_code or (geo_code is null and v_geo_code is null));
  else 
    insert into site_text_translation_counts(site_text_id, is_word_definition, language_code, dialect_code, geo_code, count)
    values (v_site_text_id, p_from_type_is_word, v_language_code, v_dialect_code, v_geo_code, v_translation_cnt)
    on conflict do nothing;
  end if;

  return new;
end;
$update_site_text_translation_counts$ language plpgsql;

create trigger update_site_text_translation_counts after insert on word_to_word_translations
  for each row execute function update_site_text_translation_counts();

create trigger update_site_text_translation_counts after insert on word_to_phrase_translations
  for each row execute function update_site_text_translation_counts();

create trigger update_site_text_translation_counts after insert on phrase_to_word_translations
  for each row execute function update_site_text_translation_counts();

create trigger update_site_text_translation_counts after insert on phrase_to_phrase_translations
  for each row execute function update_site_text_translation_counts();
