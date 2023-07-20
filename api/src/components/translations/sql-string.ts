import { ErrorType } from 'src/common/types';

export type GetWordToWordTranslationObjectByIdRow = {
  word_to_word_translation_id: number;
  from_word_definition_id: number;
  to_word_definition_id: number;
};

export function getWordToWordTranslationObjById(
  id: number,
): [string, [number]] {
  return [
    `
      select 
        word_to_word_translation_id,
        from_word_definition_id,
        to_word_definition_id
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
  fromWordDefinitionId,
  toWordDefinitionId,
  token,
}: {
  fromWordDefinitionId: number;
  toWordDefinitionId: number;
  token?: string;
}): [string, [number, number, string | null]] {
  return [
    `
      call word_to_word_translation_upsert($1, $2, $3, 0, '');
    `,
    [fromWordDefinitionId, toWordDefinitionId, token],
  ];
}

export type GetWordToPhraseTranslationObjectByIdRow = {
  word_to_phrase_translation_id: number;
  from_word_definition_id: number;
  to_phrase_definition_id: number;
};

export function getWordToPhraseTranslationObjById(
  id: number,
): [string, [number]] {
  return [
    `
      select 
        word_to_phrase_translation_id,
        from_word_definition_id,
        to_phrase_definition_id
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
  fromWordDefinitionId,
  toPhraseDefinitionId,
  token,
}: {
  fromWordDefinitionId: number;
  toPhraseDefinitionId: number;
  token?: string;
}): [string, [number, number, string | null]] {
  return [
    `
      call word_to_phrase_translation_upsert($1, $2, $3, 0, '');
    `,
    [fromWordDefinitionId, toPhraseDefinitionId, token],
  ];
}

export type GetPhraseToPhraseTranslationObjectByIdRow = {
  phrase_to_phrase_translation_id: number;
  from_phrase_definition_id: number;
  to_phrase_definition_id: number;
};

export function getPhraseToPhraseTranslationObjById(
  id: number,
): [string, [number]] {
  return [
    `
      select 
        phrase_to_phrase_translation_id,
        from_phrase_definition_id,
        to_phrase_definition_id
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
  fromPhraseDefinitionId,
  toPhraseDefinitionId,
  token,
}: {
  fromPhraseDefinitionId: number;
  toPhraseDefinitionId: number;
  token?: string;
}): [string, [number, number, string | null]] {
  return [
    `
      call phrase_to_phrase_translation_upsert($1, $2, $3, 0, '');
    `,
    [fromPhraseDefinitionId, toPhraseDefinitionId, token],
  ];
}
