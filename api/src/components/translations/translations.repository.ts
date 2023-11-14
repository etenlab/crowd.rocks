import { Pool, PoolClient } from 'pg';
import {
  callPhraseToPhraseTranslationVoteSetProcedure,
  callPhraseToWordTranslationVoteSetProcedure,
  callWordToPhraseTranslationVoteSetProcedure,
  callWordToWordTranslationVoteSetProcedure,
  getPhraseToPhraseNotTranslatedById,
  getPhraseToWordNotTranslatedById,
  getStringsPhraseToPhraseTranslatedById,
  getStringsPhraseToWordTranslatedById,
  getStringsWordToPhraseTranslatedById,
  getStringsWordToWordTranslatedById,
  getWordToPhraseNotTranslatedById,
  getWordToWordNotTranslatedById,
  TranslatedStringRow,
  TranslationRow,
} from './sql-string';

export async function getTranslatedStringsById(
  from_language: string,
  to_language: string,
  translated_by_id: string,
  pg: PoolClient | Pool,
) {
  const translatedStrs: { text: string; type: 'definition' | 'text' }[] = [];
  const trW2WRes = await pg.query<TranslatedStringRow>(
    ...getStringsWordToWordTranslatedById(
      from_language,
      to_language,
      translated_by_id,
    ),
  );

  for (let i = 0; i < trW2WRes.rowCount; i++) {
    const { string, definition } = trW2WRes.rows[i];
    if (translatedStrs.indexOf({ text: string, type: 'text' }) < 0) {
      translatedStrs.push({ text: string, type: 'text' });
    }
    if (translatedStrs.indexOf({ text: definition, type: 'definition' }) < 0) {
      translatedStrs.push({ text: definition, type: 'definition' });
    }
  }

  const trW2PRes = await pg.query<TranslatedStringRow>(
    ...getStringsWordToPhraseTranslatedById(
      from_language,
      to_language,
      translated_by_id,
    ),
  );
  for (let i = 0; i < trW2PRes.rowCount; i++) {
    const { string, definition } = trW2PRes.rows[i];
    if (translatedStrs.indexOf({ text: string, type: 'text' }) < 0) {
      translatedStrs.push({ text: string, type: 'text' });
    }
    if (translatedStrs.indexOf({ text: definition, type: 'definition' }) < 0) {
      translatedStrs.push({ text: definition, type: 'definition' });
    }
  }

  const trP2PRes = await pg.query<TranslatedStringRow>(
    ...getStringsPhraseToPhraseTranslatedById(
      from_language,
      to_language,
      translated_by_id,
    ),
  );
  for (let i = 0; i < trP2PRes.rowCount; i++) {
    const { string, definition } = trP2PRes.rows[i];
    if (translatedStrs.indexOf({ text: string, type: 'text' }) < 0) {
      translatedStrs.push({ text: string, type: 'text' });
    }
    if (translatedStrs.indexOf({ text: definition, type: 'definition' }) < 0) {
      translatedStrs.push({ text: definition, type: 'definition' });
    }
  }

  const trP2WRes = await pg.query<TranslatedStringRow>(
    ...getStringsPhraseToWordTranslatedById(
      from_language,
      to_language,
      translated_by_id,
    ),
  );
  for (let i = 0; i < trP2WRes.rowCount; i++) {
    const { string, definition } = trP2WRes.rows[i];
    if (translatedStrs.indexOf({ text: string, type: 'text' }) < 0) {
      translatedStrs.push({ text: string, type: 'text' });
    }
    if (translatedStrs.indexOf({ text: definition, type: 'definition' }) < 0) {
      translatedStrs.push({ text: definition, type: 'definition' });
    }
  }
  return translatedStrs;
}

export async function getTranslationsNotByUser(
  notById: string,
  pgClient: PoolClient | Pool,
  to_language_code: string,
  from_language_code: string,
) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const translations: {
    fromText: string;
    fromDef: string;
    toText: string;
    toDef: string;
    translationId: string;
    createdBy: string;
  }[] = [];

  // word to word
  const w2wRes = await pgClient.query<TranslationRow>(
    ...getWordToWordNotTranslatedById(
      from_language_code,
      to_language_code,
      notById,
    ),
  );

  for (let i = 0; i < w2wRes.rowCount; i++) {
    const { translation_id, created_by, from_def, from_text, to_def, to_text } =
      w2wRes.rows[i];

    translations.push({
      fromText: from_text,
      fromDef: from_def,
      toText: to_text,
      toDef: to_def,
      translationId: translation_id,
      createdBy: created_by,
    });
  }

  // word to phrase
  const w2pRes = await pgClient.query<TranslationRow>(
    ...getWordToPhraseNotTranslatedById(
      from_language_code,
      to_language_code,
      notById,
    ),
  );
  for (let i = 0; i < w2pRes.rowCount; i++) {
    const { translation_id, created_by, from_def, from_text, to_def, to_text } =
      w2pRes.rows[i];

    translations.push({
      fromText: from_text,
      fromDef: from_def,
      toText: to_text,
      toDef: to_def,
      translationId: translation_id,
      createdBy: created_by,
    });
  }

  // phrase to phrase
  const p2pRes = await pgClient.query<TranslationRow>(
    ...getPhraseToPhraseNotTranslatedById(
      from_language_code,
      to_language_code,
      notById,
    ),
  );
  for (let i = 0; i < p2pRes.rowCount; i++) {
    const { translation_id, created_by, from_def, from_text, to_def, to_text } =
      p2pRes.rows[i];

    translations.push({
      fromText: from_text,
      fromDef: from_def,
      toText: to_text,
      toDef: to_def,
      translationId: translation_id,
      createdBy: created_by,
    });
  }

  // phrase to word
  const p2wRes = await pgClient.query<TranslationRow>(
    ...getPhraseToWordNotTranslatedById(
      from_language_code,
      to_language_code,
      notById,
    ),
  );
  for (let i = 0; i < p2wRes.rowCount; i++) {
    const { translation_id, created_by, from_def, from_text, to_def, to_text } =
      p2wRes.rows[i];

    translations.push({
      fromText: from_text,
      fromDef: from_def,
      toText: to_text,
      toDef: to_def,
      translationId: translation_id,
      createdBy: created_by,
    });
  }
  return translations;
}

export async function setTranslationsVotes(
  fromTypeIsWord: boolean,
  toTypeIsWord: boolean,
  translationIds: number[],
  token: string,
  vote: boolean | null,
  pgClient: PoolClient | Pool,
) {
  // console.log(`fromTypeIsWord: ${fromTypeIsWord}`);
  // console.log(`toTypeIsWord: ${toTypeIsWord}`);
  if (translationIds && translationIds.length > 0) {
    if (fromTypeIsWord) {
      if (toTypeIsWord) {
        // call word to word procedure
        console.log('-------------');
        console.log('calling w2w');
        console.log(translationIds);
        // console.log(
        //   ...callWordToWordTranslationVoteSetProcedure({
        //     translationIds,
        //     token,
        //     vote,
        //   }),
        // );
        await pgClient.query(
          ...callWordToWordTranslationVoteSetProcedure({
            translationIds,
            token,
            vote,
          }),
        );
      } else {
        // call word to phrase reset procedure
        console.log('-------------');
        console.log('calling w2p');
        console.log(translationIds);
        // console.log(
        //   ...callWordToPhraseTranslationVoteSetProcedure({
        //     translationIds,
        //     token,
        //     vote,
        //   }),
        // );
        await pgClient.query(
          ...callWordToPhraseTranslationVoteSetProcedure({
            translationIds,
            token,
            vote,
          }),
        );
      }
    } else {
      if (toTypeIsWord) {
        // phrase to word reset procedure
        console.log('-------------');
        console.log('calling p2w');
        console.log(translationIds);
        // console.log(
        //   ...callPhraseToWordTranslationVoteSetProcedure({
        //     translationIds,
        //     token,
        //     vote,
        //   }),
        // );
        await pgClient.query(
          ...callPhraseToWordTranslationVoteSetProcedure({
            translationIds,
            token,
            vote,
          }),
        );
      } else {
        // phrase to phrase reset
        console.log('-------------');
        console.log('calling p2p');
        console.log(translationIds);
        // console.log(
        //   ...callPhraseToPhraseTranslationVoteSetProcedure({
        //     translationIds,
        //     token,
        //     vote,
        //   }),
        // );
        await pgClient.query(
          ...callPhraseToPhraseTranslationVoteSetProcedure({
            translationIds,
            token,
            vote,
          }),
        );
      }
    }
  }
}
