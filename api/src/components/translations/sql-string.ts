import { ErrorType } from 'src/common/types';

export type TranslatedStringRow = {
  id: string;
  string: string;
  definition: string;
};

export function getStringsPhraseToWordTranslatedById(
  from_language: string,
  to_language: string,
  created_by: string,
): [string, [string, string, string]] {
  return [
    `
    select distinct from_phrase.phraselike_string as string, 
    from_phrase.phrase_id as id, 
    from_phrase_def.definition
    from words from_word
join phrases from_phrase
    on from_word.word_id = any(from_phrase.words)
join phrase_definitions from_phrase_def
    on from_phrase.phrase_id = from_phrase_def.phrase_id
join phrase_to_word_translations p2w
    on from_phrase_def.phrase_definition_id = p2w.from_phrase_definition_id
join word_definitions to_word_defs
    on to_word_defs.word_definition_id = p2w.to_word_definition_id
join words to_word
    on to_word_defs.word_id = to_word.word_id
join wordlike_strings to_wls
    on to_wls.wordlike_string_id = to_word.wordlike_string_id
where from_word.language_code = $1 and to_word.language_code = $2
    and p2w.created_by = $3;
    `,
    [from_language, to_language, created_by],
  ];
}

export function getStringsPhraseToPhraseTranslatedById(
  from_language: string,
  to_language: string,
  created_by: string,
): [string, [string, string, string]] {
  return [
    `
    select distinct from_phrase.phraselike_string as string, 
      from_phrase.phrase_id as id,
      from_phrase_def.definition
from words from_word
join phrases from_phrase
    on from_word.word_id = any(from_phrase.words)
join phrase_definitions from_phrase_def
    on from_phrase.phrase_id = from_phrase_def.phrase_id
join phrase_to_phrase_translations p2p
    on from_phrase_def.phrase_definition_id = p2p.from_phrase_definition_id
join phrase_definitions to_phrase_defs
    on to_phrase_defs.phrase_definition_id = p2p.to_phrase_definition_id
join phrases to_phrase
    on to_phrase_defs.phrase_id = to_phrase.phrase_id
join words to_word
    on to_word.word_id = any(to_phrase.words)
where from_word.language_code = $1 and to_word.language_code = $2
    and p2p.created_by = $3;
    `,
    [from_language, to_language, created_by],
  ];
}

export function getStringsWordToWordTranslatedById(
  from_language: string,
  to_language: string,
  created_by: string,
): [string, [string, string, string]] {
  return [
    `
    select from_word.word_id as id, 
           wls.wordlike_string as string,
           from_word_defs.definition 
    from wordlike_strings wls
join words from_word
    on wls.wordlike_string_id=from_word.wordlike_string_id
join word_definitions from_word_defs
    on from_word.word_id = from_word_defs.word_id
join word_to_word_translations w2w
    on from_word_defs.word_definition_id = w2w.from_word_definition_id
join word_definitions to_word_defs
    on to_word_defs.word_definition_id = w2w.to_word_definition_id
join words to_word
    on to_word_defs.word_id = to_word.word_id
where from_word.language_code = $1 and to_word.language_code = $2
    and w2w.created_by = $3;
    `,
    [from_language, to_language, created_by],
  ];
}

export type TranslationRow = {
  translation_id: string;
  created_by: string;
  from_text: string;
  from_def: string;
  to_text: string;
  to_def: string;
};

export function getWordToWordNotTranslatedById(
  from_language: string,
  to_language: string,
  not_created_by: string,
): [string, [string, string, string]] {
  return [
    `
    select  w2w.created_by as created_by, 
		w2w.word_to_word_translation_id as translation_id, 
		from_wls.wordlike_string as from_text,
		from_word_defs.definition as from_def, 
		to_wls.wordlike_string as to_text,
		to_word_defs.definition as to_def
		from wordlike_strings from_wls
	join words from_words
		on from_wls.wordlike_string_id = from_words.wordlike_string_id
	join word_definitions from_word_defs
		on from_word_defs.word_id = from_words.word_id
	join word_to_word_translations w2w 
		on from_word_defs.word_definition_id = w2w.from_word_definition_id
	join word_definitions to_word_defs
		on w2w.to_word_definition_id = to_word_defs.word_definition_id
	join words to_words
		on to_word_defs.word_id = to_words.word_id
	join wordlike_strings to_wls
		on to_words.wordlike_string_id = to_wls.wordlike_string_id
	where 
		from_words.language_code = $1 and to_words.language_code=$2 and w2w.created_by != $3;
    `,
    [from_language, to_language, not_created_by],
  ];
}

export function getWordToPhraseNotTranslatedById(
  from_language: string,
  to_language: string,
  not_created_by: string,
): [string, [string, string, string]] {
  return [
    `
 select  w2p.created_by as created_by, 
		w2p.word_to_phrase_translation_id as translation_id, 
		from_wls.wordlike_string as from_text,
		from_word_defs.definition as from_def, 
		to_phrase.phraselike_string as to_text,
		to_phrase_defs.definition as to_def
	from wordlike_strings from_wls
	join words from_words
		on from_wls.wordlike_string_id = from_words.wordlike_string_id
	join word_definitions from_word_defs
		on from_word_defs.word_id = from_words.word_id
	join word_to_phrase_translations w2p
		on from_word_defs.word_definition_id = w2p.from_word_definition_id
	join phrase_definitions to_phrase_defs
		on w2p.to_phrase_definition_id = to_phrase_defs.phrase_definition_id
	join phrases to_phrase
		on to_phrase_defs.phrase_id = to_phrase.phrase_id
	join words to_words
		on to_words.word_id = any(to_phrase.words)
	where 
		from_words.language_code = $1 and to_words.language_code=$2 and w2p.created_by != $3;
    `,
    [from_language, to_language, not_created_by],
  ];
}

export function getPhraseToPhraseNotTranslatedById(
  from_language: string,
  to_language: string,
  not_created_by: string,
): [string, [string, string, string]] {
  return [
    `
select distinct p2p.created_by as created_by, 
		p2p.phrase_to_phrase_translation_id as translation_id, 
		from_phrase.phraselike_string as from_text,
		from_phrase_def.definition as from_def, 
		to_phrase.phraselike_string as to_text,
		to_phrase_defs.definition as to_def
	from words from_word
join phrases from_phrase
    on from_word.word_id = any(from_phrase.words)
join phrase_definitions from_phrase_def
    on from_phrase.phrase_id = from_phrase_def.phrase_id
left join phrase_to_phrase_translations p2p
    on from_phrase_def.phrase_definition_id = p2p.from_phrase_definition_id
join phrase_definitions to_phrase_defs
    on to_phrase_defs.phrase_definition_id = p2p.to_phrase_definition_id
join phrases to_phrase
    on to_phrase_defs.phrase_id = to_phrase.phrase_id
join words to_word
    on to_word.word_id = any(to_phrase.words)
where from_word.language_code = $1 and to_word.language_code = $2 and p2p.created_by != $3;
    `,
    [from_language, to_language, not_created_by],
  ];
}

export function getPhraseToWordNotTranslatedById(
  from_language: string,
  to_language: string,
  not_created_by: string,
): [string, [string, string, string]] {
  return [
    `
select p2w.created_by as created_by, 
		p2w.phrase_to_word_translation_id as translation_id, 
		from_phrase.phraselike_string as from_text,
		from_phrase_def.definition as from_def, 
		to_wls.wordlike_string as to_text,
		to_word_defs.definition as to_def
from words from_word
join phrases from_phrase
    on from_word.word_id = any(from_phrase.words)
join phrase_definitions from_phrase_def
    on from_phrase.phrase_id = from_phrase_def.phrase_id
join phrase_to_word_translations p2w
    on from_phrase_def.phrase_definition_id = p2w.from_phrase_definition_id
join word_definitions to_word_defs
    on to_word_defs.word_definition_id = p2w.to_word_definition_id
join words to_word
    on to_word_defs.word_id = to_word.word_id
join wordlike_strings to_wls
    on to_wls.wordlike_string_id = to_word.wordlike_string_id
where from_word.language_code = $1 and to_word.language_code = $2 and p2w.created_by != $3;
    `,
    [from_language, to_language, not_created_by],
  ];
}

export function getStringsWordToPhraseTranslatedById(
  from_language: string,
  to_language: string,
  created_by: string,
): [string, [string, string, string]] {
  return [
    `
    select wls.wordlike_string as string, 
    from_word.word_id as id,
    from_word_defs.definition
    from wordlike_strings wls
join words from_word
    on wls.wordlike_string_id = from_word.wordlike_string_id
join word_definitions from_word_defs
    on from_word.word_id = from_word_defs.word_id
join word_to_phrase_translations w2p
    on from_word_defs.word_definition_id = w2p.from_word_definition_id
join phrase_definitions to_phrase_defs
    on to_phrase_defs.phrase_definition_id = w2p.to_phrase_definition_id
join phrases to_phrase
    on to_phrase_defs.phrase_id = to_phrase.phrase_id
join words to_phrase_words
    on to_phrase_words.word_id = any(to_phrase.words)
where from_word.language_code = $1 and to_phrase_words.language_code = $2
    and w2p.created_by = $3;

    `,
    [from_language, to_language, created_by],
  ];
}

export function getTotalWordCountByLanguage(
  languageCode: string,
): [string, [string]] {
  return [
    `
    select count(wordlike_string) from words w 
      join wordlike_strings wls 
      on w.wordlike_string_id = wls.wordlike_string_id
      where w.language_code = $1;
    `,
    [languageCode],
  ];
}

export function getTotalPhraseCountByLanguage(
  languageCode: string,
): [string, [string]] {
  return [
    `
    select count(distinct p.phraselike_string) from phrases p
      join words w on w.word_id = any(p.words)
      where w.language_code = $1;
    `,
    [languageCode],
  ];
}

export function getTotalPhraseToWordCount(
  fromLanguageCode: string,
  toLanguageCode: string,
  translated_by: string[],
): [string, [string, string, string[]]] {
  return [
    `
    select count (distinct from_phrase.phraselike_string) from words from_word
join phrases from_phrase
    on from_word.word_id = any(from_phrase.words)
join phrase_definitions from_phrase_def
    on from_phrase.phrase_id = from_phrase_def.phrase_id
join phrase_to_word_translations p2w
    on from_phrase_def.phrase_definition_id = p2w.from_phrase_definition_id
join word_definitions to_word_defs
    on to_word_defs.word_definition_id = p2w.to_word_definition_id
join words to_word
    on to_word_defs.word_id = to_word.word_id
join wordlike_strings to_wls
    on to_wls.wordlike_string_id = to_word.wordlike_string_id
where from_word.language_code = $1 and to_word.language_code = $2
    and p2w.created_by = ANY($3);
    `,
    [fromLanguageCode, toLanguageCode, translated_by],
  ];
}

export function getTotalPhraseToPhraseCount(
  fromLanguageCode: string,
  toLanguageCode: string,
  translated_by: string[],
): [string, [string, string, string[]]] {
  return [
    `
    select count(distinct from_phrase.phraselike_string) from words from_word
join phrases from_phrase
    on from_word.word_id = any(from_phrase.words)
join phrase_definitions from_phrase_def
    on from_phrase.phrase_id = from_phrase_def.phrase_id
join phrase_to_phrase_translations p2p
    on from_phrase_def.phrase_definition_id = p2p.from_phrase_definition_id
join phrase_definitions to_phrase_defs
    on to_phrase_defs.phrase_definition_id = p2p.to_phrase_definition_id
join phrases to_phrase
    on to_phrase_defs.phrase_id = to_phrase.phrase_id
join words to_word
    on to_word.word_id = any(to_phrase.words)
where from_word.language_code = $1 and to_word.language_code = $2
    and p2p.created_by = ANY($3);
    `,
    [fromLanguageCode, toLanguageCode, translated_by],
  ];
}

export function getTotalWordToWordCount(
  fromLanguageCode: string,
  toLanguageCode: string,
  translated_by: string[],
): [string, [string, string, string[]]] {
  return [
    `
    select count(from_word.word_id) from words from_word
join word_definitions from_word_defs
    on from_word.word_id = from_word_defs.word_id
join word_to_word_translations w2w
    on from_word_defs.word_definition_id = w2w.from_word_definition_id
join word_definitions to_word_defs
    on to_word_defs.word_definition_id = w2w.to_word_definition_id
join words to_word
    on to_word_defs.word_id = to_word.word_id
where from_word.language_code = $1 and to_word.language_code = $2
    and w2w.created_by = ANY($3);
    `,
    [fromLanguageCode, toLanguageCode, translated_by],
  ];
}

export function getTotalWordToPhraseCount(
  fromLanguageCode: string,
  toLanguageCode: string,
  translated_by: string[],
): [string, [string, string, string[]]] {
  return [
    `
    select count(distinct from_word.word_id) from words from_word
join word_definitions from_word_defs
    on from_word.word_id = from_word_defs.word_id
join word_to_phrase_translations w2p
    on from_word_defs.word_definition_id = w2p.from_word_definition_id
join phrase_definitions to_phrase_defs
    on to_phrase_defs.phrase_definition_id = w2p.to_phrase_definition_id
join phrases to_phrase
    on to_phrase_defs.phrase_id = to_phrase.phrase_id
join words to_phrase_words
    on to_phrase_words.word_id = any(to_phrase.words)
where from_word.language_code = $1 and to_phrase_words.language_code = $2
    and w2p.created_by = ANY($3);
    `,
    [fromLanguageCode, toLanguageCode, translated_by],
  ];
}

export type GetWordToWordTranslationObjectByIdRow = {
  word_to_word_translation_id: string;
  from_word_definition_id: string;
  to_word_definition_id: string;
};

export function getWordToWordTranslationObjByIds(
  ids: number[],
): [string, [number[]]] {
  return [
    `
      select 
        word_to_word_translation_id,
        from_word_definition_id,
        to_word_definition_id
      from word_to_word_translations
      where word_to_word_translation_id = any($1);
    `,
    [ids],
  ];
}

export type WordToWordTranslationUpsertProcedureOutputRow = {
  p_word_to_word_translation_id: string;
  p_error_type: ErrorType;
};

export function callWordToWordTranslationUpsertProcedure({
  fromWordDefinitionId,
  toWordDefinitionId,
  token,
}: {
  fromWordDefinitionId: number;
  toWordDefinitionId: number;
  token: string;
}): [string, [number, number, string]] {
  return [
    `
      call word_to_word_translation_upsert($1, $2, $3, 0, '');
    `,
    [fromWordDefinitionId, toWordDefinitionId, token],
  ];
}

export type WordToWordTranslationUpsertsProcedureOutput = {
  p_word_to_word_translation_ids: string[];
  p_error_types: ErrorType[];
  p_error_type: ErrorType;
};

export function callWordToWordTranslationUpsertsProcedure({
  fromWordDefinitionIds,
  toWordDefinitionIds,
  token,
}: {
  fromWordDefinitionIds: number[];
  toWordDefinitionIds: number[];
  token: string;
}): [string, [number[], number[], string]] {
  return [
    `
      call batch_word_to_word_translation_upsert($1::bigint[], $2::bigint[], $3, null, null, '');
    `,
    [fromWordDefinitionIds, toWordDefinitionIds, token],
  ];
}

export type WordToWordTranslationVoteSetProcedureOutput = {
  p_word_to_word_translation_vote_ids: string[];
  p_error_types: ErrorType[];
  p_error_type: ErrorType;
};

export function callWordToWordTranslationVoteSetProcedure({
  translationIds,
  token,
  vote,
}: {
  translationIds: number[];
  token: string;
  vote: boolean | null;
}): [string, [number[], string, boolean | null]] {
  return [
    `
      call batch_word_to_word_translation_vote_set($1::bigint[], $2, $3, null, null, '');
    `,
    [translationIds, token, vote],
  ];
}

export type WordToPhraseTranslationVoteSetProcedureOutput = {
  p_word_to_phrase_translation_vote_ids: string[];
  p_error_types: ErrorType[];
  p_error_type: ErrorType;
};

export function callWordToPhraseTranslationVoteSetProcedure({
  translationIds,
  token,
  vote,
}: {
  translationIds: number[];
  token: string;
  vote: boolean | null;
}): [string, [number[], string, boolean | null]] {
  return [
    `
      call batch_word_to_phrase_translation_vote_set($1::bigint[], $2, $3, null, null, '');
    `,
    [translationIds, token, vote],
  ];
}

export type PhraseToPhraseTranslationVoteSetProcedureOutput = {
  p_phrase_to_phrase_translation_vote_ids: string[];
  p_error_types: ErrorType[];
  p_error_type: ErrorType;
};

export function callPhraseToPhraseTranslationVoteSetProcedure({
  translationIds,
  token,
  vote,
}: {
  translationIds: number[];
  token: string;
  vote: boolean | null;
}): [string, [number[], string, boolean | null]] {
  return [
    `
      call batch_phrase_to_phrase_translation_vote_set($1::bigint[], $2, $3, null, null, '');
    `,
    [translationIds, token, vote],
  ];
}

export type PhraseToWordTranslationVoteSetProcedureOutput = {
  p_phrase_to_word_translation_vote_ids: string[];
  p_error_types: ErrorType[];
  p_error_type: ErrorType;
};

export function callPhraseToWordTranslationVoteSetProcedure({
  translationIds,
  token,
  vote,
}: {
  translationIds: number[];
  token: string;
  vote: boolean | null;
}): [string, [number[], string, boolean | null]] {
  return [
    `
      call batch_phrase_to_word_translation_vote_set($1::bigint[], $2, $3, null, null, '');
    `,
    [translationIds, token, vote],
  ];
}

export type GetWordToPhraseTranslationObjectByIdRow = {
  word_to_phrase_translation_id: string;
  from_word_definition_id: string;
  to_phrase_definition_id: string;
};

export function getWordToPhraseTranslationObjByIds(
  ids: number[],
): [string, [number[]]] {
  return [
    `
      select 
        word_to_phrase_translation_id,
        from_word_definition_id,
        to_phrase_definition_id
      from word_to_phrase_translations
      where word_to_phrase_translation_id = any($1)
    `,
    [ids],
  ];
}

export type WordToPhraseTranslationUpsertProcedureOutputRow = {
  p_word_to_phrase_translation_id: string;
  p_error_type: ErrorType;
};

export function callWordToPhraseTranslationUpsertProcedure({
  fromWordDefinitionId,
  toPhraseDefinitionId,
  token,
}: {
  fromWordDefinitionId: number;
  toPhraseDefinitionId: number;
  token: string;
}): [string, [number, number, string]] {
  return [
    `
      call word_to_phrase_translation_upsert($1, $2, $3, 0, '');
    `,
    [fromWordDefinitionId, toPhraseDefinitionId, token],
  ];
}

export type WordToPhraseTranslationUpsertsProcedureOutput = {
  p_word_to_phrase_translation_ids: string[];
  p_error_types: ErrorType[];
  p_error_type: ErrorType;
};

export function callWordToPhraseTranslationUpsertsProcedure({
  fromWordDefinitionIds,
  toPhraseDefinitionIds,
  token,
}: {
  fromWordDefinitionIds: number[];
  toPhraseDefinitionIds: number[];
  token: string;
}): [string, [number[], number[], string]] {
  return [
    `
      call batch_word_to_phrase_translation_upsert($1::bigint[], $2::bigint[], $3, null, null, '');
    `,
    [fromWordDefinitionIds, toPhraseDefinitionIds, token],
  ];
}

export type GetPhraseToWordTranslationObjectByIdRow = {
  phrase_to_word_translation_id: string;
  from_phrase_definition_id: string;
  to_word_definition_id: string;
};

export function getPhraseToWordTranslationObjByIds(
  ids: number[],
): [string, [number[]]] {
  return [
    `
      select 
        phrase_to_word_translation_id,
        from_phrase_definition_id,
        to_word_definition_id
      from phrase_to_word_translations
      where phrase_to_word_translation_id = any($1)
    `,
    [ids],
  ];
}

export type PhraseToWordTranslationUpsertProcedureOutputRow = {
  p_phrase_to_word_translation_id: string;
  p_error_type: ErrorType;
};

export function callPhraseToWordTranslationUpsertProcedure({
  fromPhraseDefinitionId,
  toWordDefinitionId,
  token,
}: {
  fromPhraseDefinitionId: number;
  toWordDefinitionId: number;
  token: string;
}): [string, [number, number, string]] {
  return [
    `
      call phrase_to_word_translation_upsert($1, $2, $3, 0, '');
    `,
    [fromPhraseDefinitionId, toWordDefinitionId, token],
  ];
}

export type PhraseToWordTranslationUpsertsProcedureOutput = {
  p_phrase_to_word_translation_ids: string[];
  p_error_types: ErrorType[];
  p_error_type: ErrorType;
};

export function callPhraseToWordTranslationUpsertsProcedure({
  fromPhraseDefinitionIds,
  toWordDefinitionIds,
  token,
}: {
  fromPhraseDefinitionIds: number[];
  toWordDefinitionIds: number[];
  token: string;
}): [string, [number[], number[], string]] {
  return [
    `
      call batch_phrase_to_word_translation_upsert($1::bigint[], $2::bigint[], $3, null, null, '');
    `,
    [fromPhraseDefinitionIds, toWordDefinitionIds, token],
  ];
}

export type GetPhraseToPhraseTranslationObjectByIdRow = {
  phrase_to_phrase_translation_id: string;
  from_phrase_definition_id: string;
  to_phrase_definition_id: string;
};

export function getPhraseToPhraseTranslationObjByIds(
  ids: number[],
): [string, [number[]]] {
  return [
    `
      select 
        phrase_to_phrase_translation_id,
        from_phrase_definition_id,
        to_phrase_definition_id
      from phrase_to_phrase_translations
      where phrase_to_phrase_translation_id = any($1);
    `,
    [ids],
  ];
}

export type PhraseToPhraseTranslationUpsertProcedureOutputRow = {
  p_phrase_to_phrase_translation_id: string;
  p_error_type: ErrorType;
};

export function callPhraseToPhraseTranslationUpsertProcedure({
  fromPhraseDefinitionId,
  toPhraseDefinitionId,
  token,
}: {
  fromPhraseDefinitionId: number;
  toPhraseDefinitionId: number;
  token: string;
}): [string, [number, number, string]] {
  return [
    `
      call phrase_to_phrase_translation_upsert($1, $2, $3, 0, '');
    `,
    [fromPhraseDefinitionId, toPhraseDefinitionId, token],
  ];
}

export type PhraseToPhraseTranslationUpsertsProcedureOutput = {
  p_phrase_to_phrase_translation_ids: string[];
  p_error_types: ErrorType[];
  p_error_type: ErrorType;
};

export function callPhraseToPhraseTranslationUpsertsProcedure({
  fromPhraseDefinitionIds,
  toPhraseDefinitionIds,
  token,
}: {
  fromPhraseDefinitionIds: number[];
  toPhraseDefinitionIds: number[];
  token: string;
}): [string, [number[], number[], string]] {
  return [
    `
      call batch_phrase_to_phrase_translation_upsert($1::bigint[], $2::bigint[], $3, null, null, '');
    `,
    [fromPhraseDefinitionIds, toPhraseDefinitionIds, token],
  ];
}

export type GetWordToWordTranslationVoteStatus = {
  word_to_word_translation_id: string;
  upvotes: number;
  downvotes: number;
};

export function getWordToWordTranslationVoteStatusFromIds(
  word_to_word_translation_ids: number[],
): [string, [number[]]] {
  return [
    `
      select 
        v.word_to_word_translation_id as word_to_word_translation_id, 
        count(
          case when v.vote = true then 1 else null end
        ) as upvotes, 
        count(
          case when v.vote = false then 1 else null end
        ) as downvotes 
      from 
        word_to_word_translations_votes AS v 
      where 
        v.word_to_word_translation_id = any($1)
      group BY 
        v.word_to_word_translation_id 
      order by 
        count(
          case when v.vote = true then 1 when v.vote = false then 0 else null end
        ) desc;
    `,
    [word_to_word_translation_ids],
  ];
}

export type GetWordToPhraseTranslationVoteStatus = {
  word_to_phrase_translation_id: string;
  upvotes: number;
  downvotes: number;
};

export function getWordToPhraseTranslationVoteStatusFromIds(
  word_to_phrase_translation_ids: number[],
): [string, [number[]]] {
  return [
    `
      select 
        v.word_to_phrase_translation_id as word_to_phrase_translation_id, 
        count(
          case when v.vote = true then 1 else null end
        ) as upvotes, 
        count(
          case when v.vote = false then 1 else null end
        ) as downvotes 
      from 
        word_to_phrase_translations_votes AS v 
      where 
        v.word_to_phrase_translation_id = any($1)
      group BY 
        v.word_to_phrase_translation_id 
      order by 
        count(
          case when v.vote = true then 1 when v.vote = false then 0 else null end
        ) desc;
    `,
    [word_to_phrase_translation_ids],
  ];
}

export type ToggleWordToPhraseTranslationVoteStatus = {
  p_word_to_phrase_translations_vote_id: string;
  p_error_type: ErrorType;
};

export function toggleWordToPhraseTranslationVoteStatus({
  word_to_phrase_translation_id,
  vote,
  token,
}: {
  word_to_phrase_translation_id: number;
  vote: boolean;
  token: string;
}): [string, [number, boolean, string]] {
  return [
    `
      call word_to_phrase_translation_vote_toggle($1, $2, $3, 0, '');
    `,
    [word_to_phrase_translation_id, vote, token],
  ];
}

export type GetPhraseToWordTranslationVoteStatus = {
  phrase_to_word_translation_id: string;
  upvotes: number;
  downvotes: number;
};

export function getPhraseToWordTranslationVoteStatusFromIds(
  phrase_to_word_translation_ids: number[],
): [string, [number[]]] {
  return [
    `
      select 
        v.phrase_to_word_translation_id as phrase_to_word_translation_id, 
        count(
          case when v.vote = true then 1 else null end
        ) as upvotes, 
        count(
          case when v.vote = false then 1 else null end
        ) as downvotes 
      from 
        phrase_to_word_translations_votes AS v 
      where 
        v.phrase_to_word_translation_id = any($1)
      group BY 
        v.phrase_to_word_translation_id 
      order by 
        count(
          case when v.vote = true then 1 when v.vote = false then 0 else null end
        ) desc;
    `,
    [phrase_to_word_translation_ids],
  ];
}

export type TogglePhraseToWordTranslationVoteStatus = {
  p_phrase_to_word_translations_vote_id: string;
  p_error_type: ErrorType;
};

export function togglePhraseToWordTranslationVoteStatus({
  phrase_to_word_translation_id,
  vote,
  token,
}: {
  phrase_to_word_translation_id: number;
  vote: boolean;
  token: string;
}): [string, [number, boolean, string]] {
  return [
    `
      call phrase_to_word_translation_vote_toggle($1, $2, $3, 0, '');
    `,
    [phrase_to_word_translation_id, vote, token],
  ];
}

export type GetPhraseToPhraseTranslationVoteStatus = {
  phrase_to_phrase_translation_id: string;
  upvotes: number;
  downvotes: number;
};

export function getPhraseToPhraseTranslationVoteStatusFromIds(
  ids: number[],
): [string, [number[]]] {
  return [
    `
      select 
        v.phrase_to_phrase_translation_id as phrase_to_phrase_translation_id, 
        count(
          case when v.vote = true then 1 else null end
        ) as upvotes, 
        count(
          case when v.vote = false then 1 else null end
        ) as downvotes 
      from 
        phrase_to_phrase_translations_votes AS v 
      where 
        v.phrase_to_phrase_translation_id = any($1)
      group BY 
        v.phrase_to_phrase_translation_id 
      order by 
        count(
          case when v.vote = true then 1 when v.vote = false then 0 else null end
        ) desc;
    `,
    [ids],
  ];
}

export type TogglePhraseToPhraseTranslationVoteStatus = {
  p_phrase_to_phrase_translations_vote_id: string;
  p_error_type: ErrorType;
};

export function togglePhraseToPhraseTranslationVoteStatus({
  phrase_to_phrase_translation_id,
  vote,
  token,
}: {
  phrase_to_phrase_translation_id: number;
  vote: boolean;
  token: string;
}): [string, [number, boolean, string]] {
  return [
    `
      call phrase_to_phrase_translation_vote_toggle($1, $2, $3, 0, '');
    `,
    [phrase_to_phrase_translation_id, vote, token],
  ];
}

export type GetWordToWordTranslationListByFromWordDefinitionId = {
  word_to_word_translation_id: string;
  from_word_definition_id: string;
  to_word_definition_id: string;
  created_at: string;
};

export function getWordToWordTranslationListByFromWordDefinitionIds({
  from_word_definition_ids,
  language_code,
  dialect_code,
  geo_code,
}: {
  from_word_definition_ids: number[];
  language_code: string;
  dialect_code: string | null;
  geo_code: string | null;
}): [
  string,
  (
    | [number[], string, string, string]
    | [number[], string, string]
    | [number[], string]
  ),
] {
  let wherePlsStr = '';
  let returnArr:
    | [number[], string, string, string]
    | [number[], string, string]
    | [number[], string] = [from_word_definition_ids, language_code];

  if (dialect_code && geo_code) {
    wherePlsStr = `
      and words.dialect_code = $3
      and words.geo_code = $4
    `;
    returnArr = [...returnArr, dialect_code, geo_code];
  } else if (dialect_code && !geo_code) {
    wherePlsStr = `
      and words.dialect_code = $3
    `;
    returnArr = [...returnArr, dialect_code];
  } else if (!dialect_code && geo_code) {
    wherePlsStr = `
      and words.geo_code = $3
    `;
    returnArr = [...returnArr, geo_code];
  } else if (!dialect_code && !geo_code) {
    wherePlsStr = ``;
    returnArr = [...returnArr];
  }

  return [
    `
      select distinct 
        wtwts.word_to_word_translation_id,
        wtwts.from_word_definition_id,
        wtwts.to_word_definition_id,
        wtwts.created_at
      from word_to_word_translations as wtwts
      join (
        select word_definitions.word_definition_id
        from word_definitions
        join (
          select words.word_id
          from words
          where words.language_code = $2
            ${wherePlsStr}
        ) as ws
        on ws.word_id = word_definitions.word_id
      ) as wds
      on wds.word_definition_id = wtwts.to_word_definition_id
      where wtwts.from_word_definition_id = any($1);
    `,
    returnArr,
  ];
}

export type GetWordToPhraseTranslationListByFromWordDefinitionId = {
  word_to_phrase_translation_id: string;
  from_word_definition_id: string;
  to_phrase_definition_id: string;
  created_at: string;
};

export function getWordToPhraseTranslationListByFromWordDefinitionIds({
  from_word_definition_ids,
  language_code,
  dialect_code,
  geo_code,
}: {
  from_word_definition_ids: number[];
  language_code: string;
  dialect_code: string | null;
  geo_code: string | null;
}): [
  string,
  (
    | [number[], string, string, string]
    | [number[], string, string]
    | [number[], string]
  ),
] {
  let wherePlsStr = '';
  let returnArr:
    | [number[], string, string, string]
    | [number[], string, string]
    | [number[], string] = [from_word_definition_ids, language_code];

  if (dialect_code && geo_code) {
    wherePlsStr = `
      and words.dialect_code = $3
      and words.geo_code = $4
    `;
    returnArr = [...returnArr, dialect_code, geo_code];
  } else if (dialect_code && !geo_code) {
    wherePlsStr = `
      and words.dialect_code = $3
    `;
    returnArr = [...returnArr, dialect_code];
  } else if (!dialect_code && geo_code) {
    wherePlsStr = `
      and words.geo_code = $3
    `;
    returnArr = [...returnArr, geo_code];
  } else if (!dialect_code && !geo_code) {
    wherePlsStr = ``;
    returnArr = [...returnArr];
  }

  return [
    `
      select distinct 
        wtpts.word_to_phrase_translation_id,
        wtpts.from_word_definition_id,
        wtpts.to_phrase_definition_id,
        wtpts.created_at
      from word_to_phrase_translations as wtpts
      join (
        select phrase_definitions.phrase_definition_id
        from phrase_definitions
        join (
          select phrases.phrase_id
          from phrases
          join words
          on words.word_id = any(phrases.words)
          where words.language_code = $2
            ${wherePlsStr}
        ) as ps
        on ps.phrase_id = phrase_definitions.phrase_id
      ) as pds
      on pds.phrase_definition_id = wtpts.to_phrase_definition_id
      where wtpts.from_word_definition_id = any($1)
    `,
    returnArr,
  ];
}

export type GetPhraseToWordTranslationListByFromPhraseDefinitionId = {
  phrase_to_word_translation_id: string;
  from_phrase_definition_id: string;
  to_word_definition_id: string;
  created_at: string;
};

export function getPhraseToWordTranslationListByFromPhraseDefinitionIds({
  from_phrase_definition_ids,
  language_code,
  dialect_code,
  geo_code,
}: {
  from_phrase_definition_ids: number[];
  language_code: string;
  dialect_code: string | null;
  geo_code: string | null;
}): [
  string,
  (
    | [number[], string, string, string]
    | [number[], string, string]
    | [number[], string]
  ),
] {
  let wherePlsStr = '';
  let returnArr:
    | [number[], string, string, string]
    | [number[], string, string]
    | [number[], string] = [from_phrase_definition_ids, language_code];

  if (dialect_code && geo_code) {
    wherePlsStr = `
      and words.dialect_code = $3
      and words.geo_code = $4
    `;
    returnArr = [...returnArr, dialect_code, geo_code];
  } else if (dialect_code && !geo_code) {
    wherePlsStr = `
      and words.dialect_code = $3
    `;
    returnArr = [...returnArr, dialect_code];
  } else if (!dialect_code && geo_code) {
    wherePlsStr = `
      and words.geo_code = $3
    `;
    returnArr = [...returnArr, geo_code];
  } else if (!dialect_code && !geo_code) {
    wherePlsStr = ``;
    returnArr = [...returnArr];
  }

  return [
    `
      select distinct 
        ptwts.phrase_to_word_translation_id,
        ptwts.from_phrase_definition_id,
        ptwts.to_word_definition_id,
        ptwts.created_at
      from phrase_to_word_translations as ptwts
      join (
        select word_definitions.word_definition_id
        from word_definitions
        join (
          select words.word_id
          from words
          where words.language_code = $2
            ${wherePlsStr}
        ) as ws
        on ws.word_id = word_definitions.word_id
      ) as wds
      on wds.word_definition_id = ptwts.to_word_definition_id
      where ptwts.from_phrase_definition_id = any($1)
    `,
    returnArr,
  ];
}

export type GetPhraseToPhraseTranslationListByFromPhraseDefinitionId = {
  phrase_to_phrase_translation_id: string;
  from_phrase_definition_id: string;
  to_phrase_definition_id: string;
  created_at: string;
};

export function getPhraseToPhraseTranslationListByFromPhraseDefinitionIds({
  from_phrase_definition_ids,
  language_code,
  dialect_code,
  geo_code,
}: {
  from_phrase_definition_ids: number[];
  language_code: string;
  dialect_code: string | null;
  geo_code: string | null;
}): [
  string,
  (
    | [number[], string, string, string]
    | [number[], string, string]
    | [number[], string]
  ),
] {
  let wherePlsStr = '';
  let returnArr:
    | [number[], string, string, string]
    | [number[], string, string]
    | [number[], string] = [from_phrase_definition_ids, language_code];

  if (dialect_code && geo_code) {
    wherePlsStr = `
      and words.dialect_code = $3
      and words.geo_code = $4
    `;
    returnArr = [...returnArr, dialect_code, geo_code];
  } else if (dialect_code && !geo_code) {
    wherePlsStr = `
      and words.dialect_code = $3
    `;
    returnArr = [...returnArr, dialect_code];
  } else if (!dialect_code && geo_code) {
    wherePlsStr = `
      and words.geo_code = $3
    `;
    returnArr = [...returnArr, geo_code];
  } else if (!dialect_code && !geo_code) {
    wherePlsStr = ``;
    returnArr = [...returnArr];
  }

  return [
    `
      select distinct 
        ptpts.phrase_to_phrase_translation_id,
        ptpts.from_phrase_definition_id,
        ptpts.to_phrase_definition_id,
        ptpts.created_at
      from phrase_to_phrase_translations as ptpts
      join (
        select phrase_definitions.phrase_definition_id
        from phrase_definitions
        join (
          select phrases.phrase_id
          from phrases
          join words
          on words.word_id = any(phrases.words)
          where words.language_code = $2
            ${wherePlsStr}
        ) as ps
        on ps.phrase_id = phrase_definitions.phrase_id
      ) as pds
      on pds.phrase_definition_id = ptpts.to_phrase_definition_id
      where ptpts.from_phrase_definition_id = any($1)
    `,
    returnArr,
  ];
}

export function getTranslationLangSqlStr(
  translation_id: number,
  from_definition_type_is_word: boolean,
  to_definition_type_is_word: boolean,
): [string, [number]] {
  if (from_definition_type_is_word && to_definition_type_is_word) {
    return [
      `
        select w.language_code, w.dialect_code, w.geo_code 
        from word_to_word_translations wtwt
        left join word_definitions wd on wtwt.to_word_definition_id=wd.word_definition_id 
        left join words w on wd.word_id =w.word_id 
        where wtwt.word_to_word_translation_id = $1
        `,
      [translation_id],
    ];
  } else if (from_definition_type_is_word && !to_definition_type_is_word) {
    return [
      `
        select w.language_code, w.dialect_code, w.geo_code 
        from word_to_phrase_translations wtpt
        left join phrase_definitions pd on wtpt.to_phrase_definition_id = pd.phrase_definition_id 
        left join phrases p on pd.phrase_id =p.phrase_id  
        left join words w on w.word_id = p.words[1]
        where wtpt.word_to_phrase_translation_id = $1
      `,
      [translation_id],
    ];
  } else if (!from_definition_type_is_word && to_definition_type_is_word) {
    return [
      `
        select
          w.language_code,
          w.dialect_code,
          w.geo_code
        from
          phrase_to_word_translations ptwt 
        left join word_definitions wd on
          ptwt.to_word_definition_id = wd.word_definition_id
        left join words w on
          wd.word_id = w.word_id
        where
          ptwt.phrase_to_word_translation_id = $1
      `,
      [translation_id],
    ];
  }
  return [
    `
      select
        w.language_code,
        w.dialect_code,
        w.geo_code
      from
        phrase_to_phrase_translations ptpt
      left join phrase_definitions pd on
        ptpt.to_phrase_definition_id = pd.phrase_definition_id
      left join phrases p on
        pd.phrase_id = p.phrase_id
      left join words w on
        w.word_id = p.words[1]
      where
        ptpt.phrase_to_phrase_translation_id = $1
      `,
    [translation_id],
  ];
}

export type GetTranslationIdByFromToDefinitionsIdsSqlStrOutput = {
  translation_id: string;
};

export function getTranslationIdByFromToDefinitionsIdsSqlStr(
  from_definition_id: number,
  from_definition_type_is_word: boolean,
  to_definition_id: number,
  to_definition_type_is_word: boolean,
): [string, [number, number]] {
  if (from_definition_type_is_word && to_definition_type_is_word) {
    return [
      `
        select word_to_word_translation_id as translation_id
        from word_to_word_translations wxwx
        where wxwx.from_word_definition_id= $1
        and wxwx.to_word_definition_id= $2
        `,
      [from_definition_id, to_definition_id],
    ];
  } else if (from_definition_type_is_word && !to_definition_type_is_word) {
    return [
      `
        select word_to_phrase_translation_id as translation_id
        from word_to_phrase_translations wxwx
        where wxwx.from_word_definition_id= $1
        and wxwx.to_phrase_definition_id= $2
      `,
      [from_definition_id, to_definition_id],
    ];
  } else if (!from_definition_type_is_word && to_definition_type_is_word) {
    return [
      `
        select phrase_to_word_translation_id as translation_id
        from phrase_to_word_translations wxwx
        where wxwx.from_phrase_definition_id= $1
        and wxwx.to_word_definition_id= $2
      `,
      [from_definition_id, to_definition_id],
    ];
  }
  return [
    `
        select phrase_to_phrase_translation_id as translation_id
        from phrase_to_phrase_translations wxwx
        where wxwx.from_phrase_definition_id= $1
        and wxwx.to_phrase_definition_id= $2
      `,
    [from_definition_id, to_definition_id],
  ];
}
