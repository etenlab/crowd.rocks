export function callBatchRegisterBotProcedure({
  token,
  emails,
  usernames,
  passwords,
}: {
  token: string;
  emails: string[];
  usernames: string[];
  passwords: string[];
}): [string, [string, string[], string[], string[]]] {
  return [
    `
        call batch_register_bot($1, $2, $3, $4, null, null, null);
      `,
    [token, emails, usernames, passwords],
  ];
}

export function callTranslationVoteSetProcedureByTableName({
  baseTableName,
  translationIds,
  token,
  vote,
}: {
  baseTableName: string;
  translationIds: number[];
  token: string;
  vote: boolean | null;
}): [string, [number[], string, boolean | null]] {
  return [
    `
        call batch_${baseTableName}_vote_set($1::bigint[], $2, $3, null, null, '');
      `,
    [translationIds, token, vote],
  ];
}
