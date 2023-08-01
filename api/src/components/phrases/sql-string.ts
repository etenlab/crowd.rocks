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

export type GetPhraseVoteObjectById = {
  phrase_vote_id: number;
  phrase_id: number;
  user_id: number;
  vote: boolean;
  last_updated_at: string;
};

export function getPhraseVoteObjById(id: number): [string, [number]] {
  return [
    `
      select 
        phrase_vote_id,
        phrase_id,
        user_id,
        vote,
        last_updated_at
      from phrase_votes
      where phrase_vote_id = $1
    `,
    [id],
  ];
}

export type PhraseVoteUpsertProcedureOutputRow = {
  p_phrase_vote_id: number;
  p_error_type: ErrorType;
};

export function callPhraseVoteUpsertProcedure({
  phrase_id,
  vote,
  token,
}: {
  phrase_id: number;
  vote: boolean;
  token: string;
}): [string, [number, boolean, string]] {
  return [
    `
      call phrase_vote_upsert($1, $2, $3, 0, '');
    `,
    [phrase_id, vote, token],
  ];
}

export type GetPhraseVoteStatus = {
  phrase_id: number;
  upvotes: number;
  downvotes: number;
};

export function getPhraseVoteStatus(phrase_id: number): [string, [number]] {
  return [
    `
      select 
        v.phrase_id as phrase_id, 
        count(
          case when v.vote = true then 1 else null end
        ) as upvotes, 
        count(
          case when v.vote = false then 1 else null end
        ) as downvotes 
      from 
        phrase_votes AS v 
      where 
        v.phrase_id = $1
      group BY 
        v.phrase_id 
      order by 
        count(
          case when v.vote = true then 1 when v.vote = false then 0 else null end
        ) desc;
    `,
    [phrase_id],
  ];
}

export type TogglePhraseVoteStatus = {
  p_phrase_vote_id: number;
  p_error_type: ErrorType;
};

export function togglePhraseVoteStatus({
  phrase_id,
  vote,
  token,
}: {
  phrase_id: number;
  vote: boolean;
  token: string;
}): [string, [number, boolean, string]] {
  return [
    `
      call phrase_vote_toggle($1, $2, $3, 0, '');
    `,
    [phrase_id, vote, token],
  ];
}
