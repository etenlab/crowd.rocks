import { ErrorType } from 'src/common/types';

export type GetWordToWordTranslationObjectByIdRow = {
  word_to_word_translation_id: number;
  from_word: number;
  to_word: number;
};

export function getWordToWordTranslationObjById(
  id: number,
): [string, [number]] {
  return [
    `
      select 
        word_to_word_translation_id,
        from_word,
        to_word
      from word_to_word_translations
      where word_to_word_translation_id = $1
    `,
    [id],
  ];
}

export type WordToWordTranslationUpsertProcedureOutputRow = {
  p_word_to_word_translation_id: number;
  p_error_type: ErrorType;
};

export function callWordToWordTranslationUpsertProcedure({
  fromWord,
  toWord,
  token,
}: {
  fromWord: number;
  toWord: number;
  token?: string;
}): [string, [number, number, string | null]] {
  return [
    `
      call word_to_word_translation_upsert($1, $2, $3, 0, '');
    `,
    [fromWord, toWord, token],
  ];
}

export type GetWordToPhraseTranslationObjectByIdRow = {
  word_to_phrase_translation_id: number;
  from_word: number;
  to_phrase: number;
};

export function getWordToPhraseTranslationObjById(
  id: number,
): [string, [number]] {
  return [
    `
      select 
        word_to_phrase_translation_id,
        from_word,
        to_phrase
      from word_to_phrase_translations
      where word_to_phrase_translation_id = $1
    `,
    [id],
  ];
}

export type WordToPhraseTranslationUpsertProcedureOutputRow = {
  p_word_to_phrase_translation_id: number;
  p_error_type: ErrorType;
};

export function callWordToPhraseTranslationUpsertProcedure({
  fromWord,
  toPhrase,
  token,
}: {
  fromWord: number;
  toPhrase: number;
  token?: string;
}): [string, [number, number, string | null]] {
  return [
    `
      call word_to_phrase_translation_upsert($1, $2, $3, 0, '');
    `,
    [fromWord, toPhrase, token],
  ];
}

export type GetPhraseToPhraseTranslationObjectByIdRow = {
  phrase_to_phrase_translation_id: number;
  from_phrase: number;
  to_phrase: number;
};

export function getPhraseToPhraseTranslationObjById(
  id: number,
): [string, [number]] {
  return [
    `
      select 
        phrase_to_phrase_translation_id,
        from_phrase,
        to_phrase
      from phrase_to_phrase_translations
      where phrase_to_phrase_translation_id = $1
    `,
    [id],
  ];
}

export type PhraseToPhraseTranslationUpsertProcedureOutputRow = {
  p_phrase_to_phrase_translation_id: number;
  p_error_type: ErrorType;
};

export function callPhraseToPhraseTranslationUpsertProcedure({
  fromPhrase,
  toPhrase,
  token,
}: {
  fromPhrase: number;
  toPhrase: number;
  token?: string;
}): [string, [number, number, string | null]] {
  return [
    `
      call phrase_to_phrase_translation_upsert($1, $2, $3, 0, '');
    `,
    [fromPhrase, toPhrase, token],
  ];
}
