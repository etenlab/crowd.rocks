export type GetAdminTokenSQL = {
  token: string | null;
};

export function getAdminTokenSQL(): [string, []] {
  return [
    `
      select token from tokens where user_id = 1
    `,
    [],
  ];
}
