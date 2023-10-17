import { hash } from 'argon2';
import { createToken } from 'src/common/utility';
import { PostgresService } from 'src/core/postgres.service';

import { PoolClient } from 'pg';
import { ErrorType } from 'src/common/types';
import { LanguageInput } from '../common/types';
import { PhrasesService } from '../phrases/phrases.service';
import { WordsService } from '../words/words.service';
import { TranslateAllWordsAndPhrasesByBotOutput } from './types';

export function validateTranslateByBotInput(
  from_language: LanguageInput,
  to_language: LanguageInput,
): TranslateAllWordsAndPhrasesByBotOutput | undefined {
  if (
    from_language.language_code === to_language.language_code &&
    (from_language.dialect_code || null) ===
      (to_language.dialect_code || null) &&
    (from_language.geo_code || null) === (to_language.geo_code || null)
  ) {
    return {
      error: ErrorType.UnknownError,
      result: null,
    };
  }
  return;
}

export async function getLangConnectionsObjectMapAndTexts(
  from_language: LanguageInput,
  pgClient: PoolClient | null,
  wordsService: WordsService,
  phrasesService: PhrasesService,
) {
  const originalTextsObjMap = new Map<string, { text: string; id: number }>();
  let uniqueId = 0;

  const wordsConnection = await wordsService.getWordsByLanguage(
    from_language,
    null,
    null,
    pgClient,
  );

  if (wordsConnection.error === ErrorType.NoError) {
    for (const edge of wordsConnection.edges) {
      const { node } = edge;

      if (originalTextsObjMap.get(node.word) === undefined) {
        originalTextsObjMap.set(node.word, {
          text: node.word,
          id: uniqueId++,
        });
      }

      for (const definition of node.definitions) {
        if (originalTextsObjMap.get(definition.definition) === undefined) {
          originalTextsObjMap.set(definition.definition, {
            text: definition.definition,
            id: uniqueId++,
          });
        }
      }
    }
  }
  const phrasesConnection = await phrasesService.getPhrasesByLanguage(
    from_language,
    null,
    null,
    pgClient,
  );

  if (phrasesConnection.error === ErrorType.NoError) {
    for (const edge of phrasesConnection.edges) {
      const { node } = edge;

      if (originalTextsObjMap.get(node.phrase) === undefined) {
        originalTextsObjMap.set(node.phrase, {
          text: node.phrase,
          id: uniqueId++,
        });
      }

      for (const definition of node.definitions) {
        if (originalTextsObjMap.get(definition.definition) === undefined) {
          originalTextsObjMap.set(definition.definition, {
            text: definition.definition,
            id: uniqueId++,
          });
        }
      }
    }
  }

  const originalObj: { id: number; text: string }[] = [];

  for (const obj of originalTextsObjMap.values()) {
    originalObj.push(obj);
  }

  const originalTexts = originalObj
    .sort((a, b) => a.id - b.id)
    .map((obj) => obj.text);

  return {
    strings: originalTexts,
    originalTextsObjMap,
    wordsConnection,
    phrasesConnection,
  };
}

export function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export async function getTranslatorTokenByEmailAndUsername(
  email: string,
  username: string,
  password: string,
  pg: PostgresService,
): Promise<{
  id: string;
  token: string;
}> {
  // // check if token for googlebot exists
  const tokenRes = await pg.pool.query(
    `select t.token, u.user_id
            from tokens t
            join users u
            on t.user_id = u.user_id
            where u.email=$1;`,
    [email],
  );
  let gid = tokenRes.rows[0]?.user_id;
  if (!gid) {
    const pash = await hash(password);
    const token = createToken();
    const res = await pg.pool.query(
      `
        call authentication_register_bot($1, $2, $3, $4, 0, '');
        `,
      [email, username, pash, token],
    );
    gid = res.rows[0].p_user_id;
  }
  let token = tokenRes.rows[0]?.token;
  if (!token) {
    token = createToken();
    await pg.pool.query(
      `
          insert into tokens(token, user_id) values($1, $2);
        `,
      [token, gid],
    );
  }
  return { id: gid, token };
}
