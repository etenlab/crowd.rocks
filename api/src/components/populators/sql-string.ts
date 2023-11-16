export function callBatchRegisterBotProcedure({
  tokens,
  emails,
  usernames,
  passwords,
}: {
  tokens: string[];
  emails: string[];
  usernames: string[];
  passwords: string[];
}): [string, [string[], string[], string[], string[]]] {
  return [
    `
        call batch_register_bot($1, $2, $3, $4, null, null, '');
      `,
    [tokens, emails, usernames, passwords],
  ];
}

export function callTranslationVoteSetProcedureByTableName({
  baseTableName,
  translationIds,
  token,
  vote,
  userId,
}: {
  baseTableName: string;
  translationIds: number[];
  token: string;
  vote: boolean | null;
  userId: number;
}): [string, [number[], string, boolean | null, number]] {
  return [
    `
        call batch_${baseTableName}_vote_set($1::bigint[], $2, $3, null, null, '', $4);
      `,
    [translationIds, token, vote, userId],
  ];
}
