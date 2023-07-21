import { ErrorType } from 'src/common/types';

export type GetPhraseObjByIdResultRow = {
  phrase: string;
};

export function getPhraseObjById(id: number): [string, [number]] {
  return [
    `
      select 
        phrases.phraselike_string as phrase
      from phrases
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
  token: string;
}): [string, [string, number[], string]] {
  return [
    `
      call phrase_upsert($1, $2, $3, 0, '');
    `,
    [phraselike_string, wordIds, token],
  ];
}
