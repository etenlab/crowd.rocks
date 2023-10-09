import { hash } from 'argon2';
import { createToken } from 'src/common/utility';

export async function getTranslatorTokenByEmailAndUsername(
  email: string,
  username: string,
): Promise<{
  id: string;
  token: string;
}> {
  // // check if token for googlebot exists
  const tokenRes = await this.pg.pool.query(
    `select t.token, u.user_id
            from tokens t
            join users u
            on t.user_id = u.user_id
            where u.email=$1;`,
    [email],
  );
  let gid = tokenRes.rows[0]?.user_id;
  if (!gid) {
    const pash = await hash(this.config.CR_GOOGLE_BOT_PASSWORD);
    const token = createToken();
    const res = await this.pg.pool.query(
      `
        call authentication_register($1, $2, $3, $4, 0, '');
        `,
      [email, username, pash, token],
    );
    gid = res.rows[0].p_user_id;
  }
  let token = tokenRes.rows[0]?.token;
  if (!token) {
    token = createToken();
    await this.pg.pool.query(
      `
          insert into tokens(token, user_id) values($1, $2);
        `,
      [token, gid],
    );
  }
  return { id: gid, token };
}
