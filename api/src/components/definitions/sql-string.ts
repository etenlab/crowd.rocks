import { ErrorType } from 'src/common/types';

export type GetWordDefinitionObjectById = {
  word_definition_id?: number;
  word_id: number;
  definition: string;
};

export function getWordDefinitionObjById(id: number): [string, [number]] {
  return [
    `
      select 
        word_definition_id,
        word_id,
        definition
      from word_definitions
      where word_definitions.word_definition_id = $1
    `,
    [id],
  ];
}

export type WordDefinitionUpsertProcedureOutputRow = {
  p_word_definition_id: number;
  p_error_type: ErrorType;
};

export function callWordDefinitionUpsertProcedure({
  word_id,
  definition,
  token,
}: {
  word_id: number;
  definition: string;
  token: string;
}): [string, [number, string, string | null]] {
  return [
    `
      call word_definition_upsert($1, $2, $3, 0, '');
    `,
    [word_id, definition, token],
  ];
}

export type GetPhraseDefinitionObjectById = {
  phrase_definition_id?: number;
  phrase_id: number;
  definition: string;
};

export function getPhraseDefinitionObjById(id: number): [string, [number]] {
  return [
    `
      select 
        phrase_definition_id,
        phrase_id,
        definition
      from phrase_definitions
      where phrase_definitions.phrase_definition_id = $1
    `,
    [id],
  ];
}

export type PhraseDefinitionUpsertProcedureOutputRow = {
  p_phrase_definition_id: number;
  p_error_type: ErrorType;
};

export function callPhraseDefinitionUpsertProcedure({
  phrase_id,
  definition,
  token,
}: {
  phrase_id: number;
  definition: string;
  token: string;
}): [string, [number, string, string | null]] {
  return [
    `
      call phrase_definition_upsert($1, $2, $3, 0, '');
    `,
    [phrase_id, definition, token],
  ];
}
