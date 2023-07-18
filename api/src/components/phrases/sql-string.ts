import { ErrorType } from 'src/common/types';

export type GetPhraseObjByIdResultRow = {
  phrase: string;
  definition_id?: number;
  definition?: string;
  language_code: string;
  dialect_code?: string;
  geo_code?: string;
};

export function getPhraseObjById(id: number): [string, [number]] {
  return [
    `
      select 
        phrases.phraselike_string as phrase,
        phrase_definitions.phrase_definition_id as phrase_definition_id,
        phrase_definitions.definition as definition
      from phrases
      full outer join phrase_definitions
        on phrases.phrase_definition_id = phrase_definitions.phrase_definition_id
      where phrases.phrase_id = $1
    `,
    [id],
  ];
}

export type PhraseUpsertProcedureOutputRow = {
  p_phrase_id: number;
  p_error_type: ErrorType;
};

export function callPhraseUpsertProcedure({
  phraselike_string,
  wordIds,
  token,
}: {
  phraselike_string: string;
  wordIds: number[];
  token?: string;
}): [string, [string, number[], string | null]] {
  return [
    `
      call phrase_upsert($1, $2, $3, 0, '');
    `,
    [phraselike_string, wordIds, token],
  ];
}
 