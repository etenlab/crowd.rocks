import { PoolClient, Pool } from 'pg';
import { TLangCodes } from './types';
const N_PLACEHOLDER = '-n-Qh_Q1A-';

export function createToken(length = 64): string {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function getBearer(req: any): string | undefined {
  const headers = req?.req?.rawHeaders as Array<string>;
  if (!headers) {
    return undefined;
  }
  const Bearer = headers
    .find((value) => value.includes('Bearer'))
    ?.replace('Bearer', '')
    .trim();
  if (Bearer) return Bearer;
  const bearer = headers
    .find((value) => value.includes('bearer'))
    ?.replace('bearer', '')
    .trim();
  if (bearer) return bearer;
}

export function validateEmail(email: string): boolean {
  if (email.includes('@') && email.includes('.')) {
    return true;
  }
  return false;
}

export function justBearerHeader(bearer: string): any {
  return {
    req: {
      rawHeaders: [`Bearer ${bearer}`],
    },
  };
}

export function get_avatar_image_url(object_key: string | null): string | null {
  if (object_key) {
    return `https://[TODO]-public.s3.us-east-2.amazonaws.com/${object_key}`;
  }
  return null;
}

export function calc_vote_weight(upvotes: number, downvotes: number): number {
  return upvotes * 2 - downvotes;
}

export const putLangCodesToFileName = (
  file_name: string,
  langCodes: TLangCodes,
): string => {
  if (!langCodes.language_code) {
    throw new Error(`language_code insn't provided!`);
  }
  const nameParts = file_name.split('.');
  const suffixes = nameParts.slice(1);
  let fname = nameParts[0];
  if (langCodes.language_code) {
    fname += `.${langCodes.language_code}`;
  }
  if (langCodes.dialect_code) {
    fname += `-${langCodes.dialect_code}`;
  }
  if (langCodes.geo_code) {
    fname += `-${langCodes.geo_code}`;
  }
  fname += '.' + suffixes.join('.');
  return fname;
};

export function pgClientOrPool({
  client,
  pool,
}: {
  client: PoolClient | null;
  pool: Pool;
}): PoolClient | Pool {
  if (client) {
    return client;
  } else {
    return pool;
  }
}

export async function getPgClient({
  client,
  pool,
}: {
  client: PoolClient | null;
  pool: Pool;
}): Promise<{
  client: PoolClient;
  rollbackTransaction: () => void;
  beginTransaction: () => void;
  commitTransaction: () => void;
}> {
  if (client) {
    return {
      client,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      rollbackTransaction: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      beginTransaction: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      commitTransaction: () => {},
    };
  }

  const pgClient = await pool.connect();

  const rollbackTransaction = async () => {
    await pgClient.query('ROLLBACK');
    pgClient.release();
  };

  const beginTransaction = async () => {
    await pgClient.query('BEGIN');
  };

  const commitTransaction = async () => {
    await pgClient.query('COMMIT');
    pgClient.release();
  };

  return {
    client: pgClient,
    rollbackTransaction,
    beginTransaction,
    commitTransaction,
  };
}

export function substituteN<T extends string | Array<string>>(inStr: T): T {
  if (Array.isArray(inStr)) {
    return inStr.map((chunk) => chunk.replaceAll('\n', N_PLACEHOLDER)) as T;
  } else {
    return inStr.replaceAll('\n', N_PLACEHOLDER) as T;
  }
}
export function unSubstituteN<T extends string | Array<string>>(inStr: T): T {
  if (Array.isArray(inStr)) {
    return inStr.map((chunk) => chunk.replaceAll(N_PLACEHOLDER, '\n')) as T;
  } else {
    return inStr.replaceAll(N_PLACEHOLDER, '\n') as T;
  }
}

export function compareObject(
  obj1: object | undefined | null,
  obj2: object | undefined | null,
) {
  if (!obj1 === !obj2) {
    return true;
  }

  if (!obj1) {
    return false;
  }

  if (!obj2) {
    return false;
  }

  const key1 = Object.keys(obj1).sort();
  const key2 = Object.keys(obj2).sort();

  if (key1.length !== key2.length) {
    return false;
  }

  for (let i = 0; i < key1.length; i++) {
    if (key1[i] !== key2[i]) {
      return false;
    }

    if (obj1[key1[i]] !== obj2[key2[i]]) {
      return false;
    }
  }

  return true;
}
