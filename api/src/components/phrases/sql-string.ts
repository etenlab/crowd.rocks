import { ErrorType } from 'src/common/types';

export type GetPhraseObjByIdResultRow = {
  phrase: string;
  definition_id?: string;
  definition?: string;
  language_code: string;
  dialect_code?: string;
  geo_code?: string;
};

export function getPhraseObjById(id: string): [string, [string]] {
  return [
    `
      select 
        phraselike_strings.phraselike_string as phrase,
        phrase_definitions.phrase_definition_id as phrase_definition_id,
        phrase_definitions.definition as definition,
        language_code,
        dialect_code, 
        geo_code
      from phrases
      inner join phraselike_strings
        on phraselike_strings.phraselike_string_id = phrases.phraselike_string_id
      full outer join phrase_definitions
        on phrases.phrase_definition_id = phrase_definitions.phrase_definition_id
      where phrases.phrase_id = $1
    `,
    [id],
  ];
}

export type PhraseUpsertProcedureOutputRow = {
  p_phrase_id: string;
  p_error_type: ErrorType;
};

export function callPhraseUpsertProcedure({
  phraselike_string,
  language_code,
  dialect_code,
  geo_code,
  token,
}: {
  phraselike_string: string;
  language_code: string;
  dialect_code?: string;
  geo_code?: string;
  token?: string;
}): [
  string,
  [
    string[],
    string,
    string | undefined,
    string | undefined,
    string | undefined,
  ],
] {
  const wordlike_strings = phraselike_string.split(' ');

  return [
    `
      call phrase_upsert($1, $2, $3, $4, $5, 0, '');
    `,
    [wordlike_strings, language_code, dialect_code, geo_code, token],
  ];
}
