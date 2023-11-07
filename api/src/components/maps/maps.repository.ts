import { Injectable, Logger } from '@nestjs/common';
import { PoolClient } from 'pg';
import { ErrorType, GenericOutput } from '../../common/types';
import { PostgresService } from '../../core/postgres.service';
import { LanguageInput } from 'src/components/common/types';
import {
  GetOrigMapsListOutput,
  MapDetailsOutput,
  OriginalMapPhraseInput,
  OriginalMapWordInput,
  MapWordsAndPhrasesConnection,
  GetOrigMapWordsAndPhrasesInput,
  MapWordsAndPhrasesEdge,
  MapWordOrPhrase,
  MapWordsAndPhrasesCountOutput,
} from './types';
import { putLangCodesToFileName } from '../../common/utility';
import { GroupedFilterSymbols } from '../../../../utils/dist';
import { UserService } from '../user/user.service';

interface ISaveMapParams {
  mapFileName: string;
  content_file_id: string;
  previewFileId: string;
  token: string;
  language_code: string;
  dialect_code?: string;
  geo_code?: string;
  dbPoolClient: PoolClient | null;
}
export interface ISaveTranslatedMapParams {
  original_map_id: string;
  content_file_id: string;
  token: string;
  toLang: LanguageInput;
  // dbPoolClient: PoolClient | null;
  translated_percent: number;
}

interface ISaveMapRes {
  map_file_name: string;
  map_id: string;
  created_at: string;
  created_by: string;
}
interface ISaveTranslatedMapRes {
  map_id: string;
  created_at: string;
  created_by: string;
}

export type MapTrOfWordOrPhrase = {
  t_like_string: string;
  translation_id: string;
  translation_type: string;
  up_votes: number;
  down_votes: number;
};
export type MapTrWordsPhrases = Array<{
  o_id: string;
  o_type: string;
  o_like_string: string;
  translations: Array<MapTrOfWordOrPhrase>;
}>;

@Injectable()
export class MapsRepository {
  constructor(private pg: PostgresService, private userService: UserService) {}

  /**
   * dbPoolClient is optional. If providerd, then it will be used to run query (useful for SQL transactions)
   * if not - then new client will be get from pg.pool
   */
  async saveOriginalMapTrn({
    mapFileName,
    content_file_id,
    previewFileId,
    token,
    dbPoolClient: dbPoolClientIn,
    language_code,
    dialect_code,
    geo_code,
  }: ISaveMapParams): Promise<ISaveMapRes> {
    const previewFileIdN = Number(previewFileId);
    const content_file_idN = Number(content_file_id);
    if (isNaN(previewFileIdN) || isNaN(content_file_idN)) {
      throw new Error(ErrorType.ProvidedIdIsMalformed);
    }
    let isDbConnectionCreated = false;
    let dbPoolClient: PoolClient;
    if (!dbPoolClientIn) {
      dbPoolClient = await this.pg.pool.connect();
      isDbConnectionCreated = true;
    } else {
      dbPoolClient = dbPoolClientIn;
    }

    try {
      const res = await dbPoolClient.query(
        `
          call original_map_create($1,$2,$3,$4,$5,$6,$7, null,null,null,null)
        `,
        [
          mapFileName,
          content_file_idN,
          previewFileIdN,
          token,
          language_code,
          dialect_code,
          geo_code,
        ],
      );

      if (!res.rows[0].p_map_id) {
        throw new Error(res.rows[0].p_error_type);
      }

      return {
        map_file_name: mapFileName,
        map_id: res.rows[0].p_map_id,
        created_at: res.rows[0].p_created_at,
        created_by: res.rows[0].p_created_by,
      };
    } catch (error) {
      Logger.error(
        `mapsReposigory#saveOriginalMapTrn: ` + JSON.stringify(error),
      );
      throw error;
    } finally {
      if (isDbConnectionCreated) {
        dbPoolClient.release();
      }
    }
  }

  /**
   * dbPoolClient is optional. If providerd, then it will be used to run query (useful for SQL transactions)
   * if not - then new client will be get from pg.pool
   */
  async saveTranslatedMap({
    original_map_id,
    content_file_id,
    // dbPoolClient: dbPoolClientIn,
    token,
    toLang,
    translated_percent,
  }: ISaveTranslatedMapParams): Promise<ISaveTranslatedMapRes | null> {
    try {
      const userQ = await this.pg.pool.query(
        `select user_id from tokens where token = $1`,
        [token],
      );
      const userId = userQ.rows[0].user_id;
      if (!userId) throw new Error('not Authorized');

      const params = [
        original_map_id,
        content_file_id,
        userId,
        toLang.language_code,
        translated_percent,
      ];
      params.push(toLang.dialect_code ? toLang.dialect_code : null);
      params.push(toLang.geo_code ? toLang.geo_code : null);
      const sqlStr = `
      insert into
        translated_maps(
          original_map_id,
          content_file_id,
          created_by,
          language_code,
          translated_percent,
          dialect_code,
          geo_code
        )
        values
        (
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          $7
        )
        on conflict(original_map_id, language_code, dialect_code, geo_code) do update
          set content_file_id = EXCLUDED.content_file_id,
          translated_percent = EXCLUDED.translated_percent
        returning 
          translated_map_id, created_by, created_at
      `;
      const res = await this.pg.pool.query(sqlStr, params);

      return {
        map_id: res.rows[0].translated_map_id,
        created_at: res.rows[0].created_at,
        created_by: res.rows[0].created_by,
      };
    } catch (error) {
      Logger.error(
        `mapsReposigory#saveTranslatedMap: ` + JSON.stringify(error),
      );
      throw error;
    }
  }

  async getOrigMaps(lang?: LanguageInput): Promise<GetOrigMapsListOutput> {
    const params: string[] = [];
    let languageClause = '';
    if (lang?.language_code) {
      params.push(lang?.language_code);
      languageClause += ` and language_code = $${params.length}`;
    }
    if (lang?.dialect_code) {
      params.push(lang?.dialect_code);
      languageClause += ` and dialect_code = $${params.length}`;
    }
    if (lang?.geo_code) {
      params.push(lang?.geo_code);
      languageClause += ` and geo_code = $${params.length}`;
    }
    if (lang?.filter && lang?.filter.length > 0) {
      params.push(lang.filter);
      languageClause += ` and lower(om.map_file_name) like concat('%', LOWER($${params.length}),'%')`;
    }
    const sqlStr = `
        select
          om.original_map_id,
          map_file_name,
          om.created_at,
          om.created_by,
          om.language_code,
          om.dialect_code,
          om.geo_code,
          f.file_id as preview_file_id,
          f.file_url as preview_file_url,
          f2.file_id as content_file_id,
          f2.file_url as content_file_url
        from
          original_maps om
        left join files f on
          om.preview_file_id = f.file_id
        left join files f2 on
          om.content_file_id = f2.file_id
        where true
        ${languageClause}
      `;
    const resQ = await this.pg.pool.query(sqlStr, params);

    const mapList = resQ.rows.map<MapDetailsOutput>(
      ({
        original_map_id,
        map_file_name,
        created_at,
        created_by,
        language_code,
        dialect_code,
        geo_code,
        preview_file_id,
        preview_file_url,
        content_file_id,
        content_file_url,
      }) => ({
        error: ErrorType.NoError,
        mapDetails: {
          original_map_id,
          map_file_name,
          map_file_name_with_langs: putLangCodesToFileName(map_file_name, {
            language_code,
            dialect_code,
            geo_code,
          }),
          created_at,
          created_by,
          is_original: true,
          language: { language_code, dialect_code, geo_code },
          preview_file_id,
          preview_file_url,
          content_file_id,
          content_file_url,
        },
      }),
    );

    return { mapList };
  }

  async getTranslatedMaps({
    lang,
    originalMapId,
  }: {
    lang?: LanguageInput | undefined;
    originalMapId?: number | undefined;
  }): Promise<GetOrigMapsListOutput> {
    const params: string[] = [];
    let languageClause = '';
    if (lang?.language_code) {
      params.push(lang?.language_code);
      languageClause += ` and tm.language_code = $${params.length}`;
    }
    if (lang?.dialect_code) {
      params.push(lang?.dialect_code);
      languageClause += ` and tm.dialect_code = $${params.length}`;
    }
    if (lang?.geo_code) {
      params.push(lang?.geo_code);
      languageClause += ` and tm.geo_code = $${params.length}`;
    }

    if (originalMapId) {
      params.push(String(originalMapId));
      languageClause += ` and tm.original_map_id = $${params.length}`;
    }

    if (lang?.filter && lang?.filter.length > 0) {
      params.push(lang.filter);
      languageClause += ` and lower(om.map_file_name) like concat('%', LOWER($${params.length}),'%')`;
    }

    const sqlStr = `
      select
        tm.translated_map_id,
        tm.original_map_id,
        om.map_file_name,
        tm.created_at,
        tm.created_by,
        tm.language_code,
        tm.dialect_code,
        tm.geo_code,
        tm.translated_percent,
        f.file_url as preview_file_url,
        f.file_id as preview_file_id,
        f2.file_url as content_file_url,
        f2.file_id as content_file_id
      from
        translated_maps tm
      left join original_maps om
        on tm.original_map_id = om.original_map_id
      left join files f on
        om.preview_file_id = f.file_id
      left join files f2 on
        tm.content_file_id = f2.file_id
      where
        true
        ${languageClause}
    `;
    const resQ = await this.pg.pool.query(sqlStr, params);

    const mapList = resQ.rows.map<MapDetailsOutput>(
      ({
        translated_map_id,
        original_map_id,
        map_file_name,
        created_at,
        created_by,
        language_code,
        dialect_code,
        geo_code,
        preview_file_url,
        preview_file_id,
        content_file_url,
        content_file_id,
        translated_percent,
      }) => ({
        error: ErrorType.NoError,
        mapDetails: {
          translated_map_id,
          original_map_id,
          map_file_name,
          map_file_name_with_langs: putLangCodesToFileName(map_file_name, {
            language_code,
            dialect_code,
            geo_code,
          }),
          created_at,
          created_by,
          is_original: false,
          language: { language_code, dialect_code, geo_code },
          preview_file_url,
          preview_file_id,
          content_file_url,
          content_file_id,
          translated_percent,
        },
      }),
    );

    return { mapList };
  }

  async getOrigMapInfo(id: string): Promise<MapDetailsOutput> {
    const params = [id];
    const sqlStr = `
        select
          om.original_map_id,
          om.map_file_name,
          om.created_at,
          om.created_by,
          om.language_code,
          om.dialect_code,
          om.geo_code,
          f.file_id as preview_file_id,
          f.file_url as preview_file_url,
          f2.file_id as content_file_id,
          f2.file_url as content_file_url
        from
          original_maps om
        left join files f on
          om.preview_file_id = f.file_id
        left join files f2 on
          om.content_file_id = f2.file_id
        where original_map_id = $1
      `;

    const resQ = await this.pg.pool.query(sqlStr, params);

    const origMapList = resQ.rows.map<MapDetailsOutput>(
      ({
        original_map_id,
        map_file_name,
        created_at,
        created_by,
        language_code,
        dialect_code,
        geo_code,
        preview_file_id,
        preview_file_url,
        content_file_id,
        content_file_url,
      }) => ({
        error: ErrorType.NoError,
        mapDetails: {
          original_map_id,
          map_file_name,
          map_file_name_with_langs: putLangCodesToFileName(map_file_name, {
            language_code,
            dialect_code,
            geo_code,
          }),
          created_at,
          created_by,
          is_original: true,
          language: { language_code, dialect_code, geo_code },
          preview_file_id,
          preview_file_url,
          content_file_id,
          content_file_url,
        },
      }),
    );

    return { ...origMapList[0] };
  }

  async getOrigMapWithContentUrl(id: string): Promise<MapDetailsOutput> {
    const resQ = await this.pg.pool.query(
      `
        select 
          om.original_map_id,
          om.map_file_name, 
          om.created_at, 
          om.created_by, 
          om.language_code,	
          om.dialect_code,	
          om.geo_code,
          om.preview_file_id,
          om.content_file_id,
          f.file_url as preview_file_url,
          f2.file_url as content_file_url
        from original_maps om 
        left join files f on
          om.preview_file_id = f.file_id
        left join files f2 on
          om.content_file_id = f2.file_id
        where original_map_id = $1
      `,
      [id],
    );

    const {
      original_map_id,
      map_file_name,
      created_at,
      created_by,
      language_code,
      dialect_code,
      geo_code,
      preview_file_url,
      content_file_url,
      preview_file_id,
      content_file_id,
    } = resQ.rows[0];

    return {
      error: ErrorType.NoError,
      mapDetails: {
        original_map_id,
        map_file_name,
        map_file_name_with_langs: putLangCodesToFileName(map_file_name, {
          language_code,
          dialect_code,
          geo_code,
        }),
        created_at,
        created_by,
        is_original: true,
        language: { language_code, dialect_code, geo_code },
        preview_file_url,
        content_file_url,
        preview_file_id,
        content_file_id,
      },
    };
  }

  async getTranslatedMapWithContentUrl(id: string): Promise<MapDetailsOutput> {
    const resQ = await this.pg.pool.query(
      `
      select
        tm.translated_map_id,
        tm.original_map_id,
        om.map_file_name,
        tm.created_at,
        tm.created_by,
        tm.language_code,
        tm.dialect_code,
        tm.geo_code,
        tm.translated_percent,
        f.file_url as preview_file_url,
        f.file_id as preview_file_id,
        f2.file_url as content_file_url,
        f2.file_id as content_file_id
      from
        translated_maps tm
      left join original_maps om
        on tm.original_map_id = om.original_map_id
      left join files f on
        om.preview_file_id = f.file_id
      left join files f2 on
        tm.content_file_id = f2.file_id
      where
        translated_map_id = $1
      `,
      [id],
    );

    if (!(resQ.rows.length > 0)) {
      return {
        error: ErrorType.MapNotFound,
        mapDetails: null,
      };
    }

    const {
      original_map_id,
      translated_map_id,
      map_file_name,
      created_at,
      created_by,
      language_code,
      dialect_code,
      geo_code,
      translated_percent,
      preview_file_url,
      preview_file_id,
      content_file_url,
      content_file_id,
    } = resQ.rows[0];

    return {
      error: ErrorType.NoError,
      mapDetails: {
        original_map_id,
        translated_map_id,
        map_file_name,
        created_at,
        created_by,
        is_original: false,
        language: { language_code, dialect_code, geo_code },
        map_file_name_with_langs: putLangCodesToFileName(map_file_name, {
          language_code,
          dialect_code,
          geo_code,
        }),
        translated_percent,
        preview_file_url,
        preview_file_id,
        content_file_url,
        content_file_id,
      },
    };
  }

  async saveOriginalMapWordInTrn(
    { word_id, original_map_id }: OriginalMapWordInput,
    dbPoolClient: PoolClient,
  ): Promise<{ original_map_word_id: string | null } & GenericOutput> {
    const resQ = await dbPoolClient.query(
      `
        insert into original_map_words(word_id , original_map_id )  values($1, $2) 
        on conflict (word_id, original_map_id) do update set word_id = excluded.word_id 
        returning original_map_word_id  
      `,
      [word_id, original_map_id],
    );

    return {
      original_map_word_id: resQ.rows[0].original_map_word_id,
      error: ErrorType.NoError,
    };
  }

  async saveOriginalMapPhraseInTrn(
    { phrase_id, original_map_id }: OriginalMapPhraseInput,
    dbPoolClient: PoolClient,
  ): Promise<{ original_map_phrase_id: string | null } & GenericOutput> {
    const resQ = await dbPoolClient.query(
      `
        insert into original_map_phrases(phrase_id , original_map_id )  values($1, $2) 
        on conflict (phrase_id, original_map_id) do update set phrase_id = excluded.phrase_id 
        returning original_map_phrase_id  
      `,
      [phrase_id, original_map_id],
    );

    return {
      original_map_phrase_id: resQ.rows[0].original_map_word_id,
      error: ErrorType.NoError,
    };
  }

  async getVotesOnTranslation(
    translation: MapTrOfWordOrPhrase,
  ): Promise<{ up_votes; down_votes }> {
    let prefix = '';
    const params: string[] = [];
    switch (translation.translation_type) {
      case 'wtwt':
        prefix = 'word_to_word';
        break;
      case 'wtpt':
        prefix = 'word_to_phrase';
        break;
      case 'ptpt':
        prefix = 'phrase_to_phrase';
        break;
      case 'ptwt':
        prefix = 'phrase_to_word';
        break;
      default:
        throw new Error(ErrorType.MapTranslationError);
    }

    let sqlStr = `
          select 
            up_votes.up_count as up_votes, 
            down_votes.down_count as down_votes 
          from ${prefix}_translations wxwx 
          left join (
              SELECT count(v.user_id) as up_count, v.${prefix}_translation_id as up_translation_id
              FROM ${prefix}_translations_votes v 
              where v.vote = true
              GROUP BY v.${prefix}_translation_id
          ) as up_votes on wxwx.${prefix}_translation_id  = up_votes.up_translation_id
          left join (
              SELECT count(v.user_id) as down_count, v.${prefix}_translation_id as d_translation_id
              FROM ${prefix}_translations_votes v 
              where v.vote = false
              GROUP BY v.${prefix}_translation_id
          ) as down_votes on wxwx.${prefix}_translation_id  = down_votes.d_translation_id
          where true
        `;

    params.push(translation.translation_id);
    sqlStr += `and wxwx.${prefix}_translation_id = $${params.length}`;

    const resQ = await this.pg.pool.query(sqlStr, params);
    if (resQ.rows.length > 1) {
      throw new Error(ErrorType.MapTranslationError);
    }

    return {
      up_votes: resQ.rows[0].up_votes || 0,
      down_votes: resQ.rows[0].down_votes || 0,
    };
  }

  /**
   * Use to get simple not-paginated information about words and phrases for maps translation
   */
  async getOrigMapTrWordsPhrases(
    original_map_id: string,
    { language_code, dialect_code, geo_code }: LanguageInput,
  ): Promise<MapTrWordsPhrases> {
    if (!language_code) {
      Logger.error(`t_language_code must be specified.`);
    }
    const params: string[] = [];
    let languageRestrictionClause = '';

    params.push(language_code);
    languageRestrictionClause += ` and mxl.t_language_code =  $${params.length} `;

    if (dialect_code) {
      params.push(dialect_code);
      languageRestrictionClause += ` and mxl.t_dialect_code =  $${params.length} `;
    }
    if (geo_code) {
      params.push(geo_code);
      languageRestrictionClause += ` and mxl.t_geo_code =  $${params.length} `;
    }

    params.push(original_map_id);
    const mapRestrictionClause = ` and omx.original_map_id = $${params.length}`;

    // note that 'disctinct' because of same word can be at several original maps.
    const w_tr_sqlStr = `
     select distinct on (o_w.word_id, t_w.word_id, t_p.phrase_id) 
        o_w.word_id as o_id,
        'word'::VARCHAR(6) as o_type,
        o_ws.wordlike_string as o_like_string,
        mxl.translation_id,
        CASE 
           WHEN mxl.t_word_id is not null THEN 'wtwt'
           when mxl.t_phrase_id is not null then 'wtpt'
           ELSE null
	       END AS translation_type,
	    coalesce(ws.wordlike_string, t_p.phraselike_string) as t_like_string
      from original_map_words omx
      join words o_w on o_w.word_id = omx.word_id 
      join wordlike_strings o_ws on o_w.wordlike_string_id = o_ws.wordlike_string_id
      left join mv_words_languages mxl on omx.word_id = mxl.word_id ${languageRestrictionClause}
      left join phrases t_p on mxl.t_phrase_id = t_p.phrase_id
      left join words t_w on mxl.t_word_id = t_w.word_id
      left join wordlike_strings ws on t_w.wordlike_string_id = ws.wordlike_string_id 
      where true
      ${mapRestrictionClause}
    `;

    const p_tr_sqlStr = `
     select distinct on (o_p.phrase_id, t_w.word_id, t_p.phrase_id) 
        o_p.phrase_id as o_id,
        'phrase'::VARCHAR(6) as o_type,
        o_p.phraselike_string  as o_like_string,
        mxl.translation_id,
        CASE 
           WHEN mxl.t_word_id is not null THEN 'ptwt'
           when mxl.t_phrase_id is not null then 'ptpt'
           ELSE null
	       END AS translation_type,
        t_w.word_id,
	    coalesce(ws.wordlike_string, t_p.phraselike_string) as t_like_string
      from original_map_phrases omx
      join phrases o_p on o_p.phrase_id  = omx.phrase_id 
      left join mv_phrases_languages mxl on omx.phrase_id = mxl.phrase_id ${languageRestrictionClause}
      left join phrases t_p on mxl.t_phrase_id = t_p.phrase_id
      left join words t_w on mxl.t_word_id = t_w.word_id
      left join wordlike_strings ws on t_w.wordlike_string_id = ws.wordlike_string_id 
      where true 
      ${mapRestrictionClause}
    `;

    const resQ_w_tr_promise = this.pg.pool.query(w_tr_sqlStr, params);
    const resQ_p_tr_promise = this.pg.pool.query(p_tr_sqlStr, params);
    const [w, p] = await Promise.all([resQ_w_tr_promise, resQ_p_tr_promise]);

    const wordsAndPhrases_rows = [...w.rows, ...p.rows];
    const wordsAndPhrases: MapTrWordsPhrases = [];

    for (const wordphrase_tr_row of wordsAndPhrases_rows) {
      const existingIndex = wordsAndPhrases.findIndex(
        (wp) => wp.o_like_string === wordphrase_tr_row.o_like_string,
      );
      if (existingIndex >= 0) {
        if (!(wordphrase_tr_row.t_like_string?.length > 0)) {
          //translation is nullish - do nething
          continue;
        }
        wordsAndPhrases[existingIndex].translations.push({
          t_like_string: wordphrase_tr_row.t_like_string,
          translation_type: wordphrase_tr_row.translation_type,
          translation_id: wordphrase_tr_row.translation_id,
          up_votes: 0, //calc later only for multiple translations
          down_votes: 0, //calc later only for multiple translations
        });
      } else {
        if (!(wordphrase_tr_row.t_like_string?.length > 0)) {
          //translation is nullish - create empty array
          wordsAndPhrases.push({
            o_id: wordphrase_tr_row.o_id,
            o_type: wordphrase_tr_row.o_type,
            o_like_string: wordphrase_tr_row.o_like_string,
            translations: [],
          });
          continue;
        }
        wordsAndPhrases.push({
          o_id: wordphrase_tr_row.o_id,
          o_type: wordphrase_tr_row.o_type,
          o_like_string: wordphrase_tr_row.o_like_string,
          translations: [
            {
              t_like_string: wordphrase_tr_row.t_like_string,
              translation_type: wordphrase_tr_row.translation_type,
              translation_id: wordphrase_tr_row.translation_id,
              up_votes: 0, //calc later only for multiple translations
              down_votes: 0, //calc later only for multiple translations
            },
          ],
        });
      }
    }

    for (const wp of wordsAndPhrases) {
      if (wp.translations.length > 1) {
        for (const translation of wp.translations) {
          const { up_votes, down_votes } = await this.getVotesOnTranslation(
            translation,
          );
          translation.up_votes = up_votes;
          translation.down_votes = down_votes;
        }
      }
    }

    return wordsAndPhrases;
  }

  /**
   * Use to get extended and paginated information about words and phrases for UI
   */
  async getOrigMapWordsAndPhrases(
    dbPoolClient: PoolClient,
    {
      input,
      first,
      after,
    }: {
      input: GetOrigMapWordsAndPhrasesInput;
      first?: number | null;
      after?: string | null;
    },
  ): Promise<MapWordsAndPhrasesConnection> {
    if (input.onlyTranslatedTo && input.onlyNotTranslatedTo) {
      const msg = `mapsRepository#getOrigMapWordsAndPhrases: must be set only one of (onlyTranslatedToTo, onlyNotTranslatedToTo) ${JSON.stringify(
        input,
      )}`;
      Logger.error(msg);
      throw new Error(msg);
    }

    const filterParams: string[] = [];
    let languagesFiltersRestrictionClause = '';
    let pickDataClause = '';
    if (input.lang.language_code) {
      filterParams.push(input.lang.language_code);
      languagesFiltersRestrictionClause += ` and o_language_code =  $${filterParams.length} `;
    }
    if (input.lang.dialect_code) {
      filterParams.push(input.lang.dialect_code);
      languagesFiltersRestrictionClause += ` and o_dialect_code =  $${filterParams.length} `;
    }
    if (input.lang.geo_code) {
      filterParams.push(input.lang.geo_code);
      languagesFiltersRestrictionClause += ` and o_geo_code =  $${filterParams.length} `;
    }
    if (input.filter && input.filter.length > 0) {
      filterParams.push(input.filter);
      languagesFiltersRestrictionClause += ` and LOWER(o_like_string) like concat('%', LOWER($${filterParams.length}),'%')`;
    }
    if (input.quickFilter && input.quickFilter.length > 0) {
      switch (input.quickFilter) {
        case GroupedFilterSymbols.Digits:
          languagesFiltersRestrictionClause += ` and substring(o_like_string from 1 for 1) SIMILAR TO '(0|1|2|3|4|5|6|7|8|9)'`;
          break;

        case GroupedFilterSymbols.SpecialCharacters:
          const s = ` and substring(o_like_string from 1 for 1) SIMILAR TO '(\`|\\!|\\@|\\%|\\^|\\&|\\*|\\(|\\)|\\-|\\+)'`;
          languagesFiltersRestrictionClause += s;
          break;

        default:
          filterParams.push(input.quickFilter);
          languagesFiltersRestrictionClause += ` and LOWER(o_like_string) like concat(LOWER($${filterParams.length}),'%')`;
          break;
      }
    }
    if (input.original_map_id) {
      filterParams.push(input.original_map_id);
      languagesFiltersRestrictionClause += ` and original_map_id = $${filterParams.length} `;
    }

    if (input.onlyTranslatedTo) {
      filterParams.push(input.onlyTranslatedTo.language_code);
      languagesFiltersRestrictionClause += `
        and(
          (
            type='word' and o_id in (
              select word_id from mv_words_languages where t_language_code = $${filterParams.length}
            )
          )
          or (
            type='phrase' and o_id in (
              select phrase_id from mv_phrases_languages where t_language_code = $${filterParams.length}
            )
          )
        )
      `;
    }

    if (input.onlyNotTranslatedTo) {
      filterParams.push(input.onlyNotTranslatedTo.language_code);
      languagesFiltersRestrictionClause += `
        and(
          (
            type='word' and o_id not in (
              select word_id from mv_words_languages where t_language_code = $${filterParams.length}
            )
          )
          or (
            type='phrase' and o_id not in (
              select phrase_id from mv_phrases_languages where t_language_code = $${filterParams.length}
            )
          )
        )
      `;
    }

    const langAndPickParams: string[] = [...filterParams];
    if (after) {
      langAndPickParams.push(String(after));
      pickDataClause += ` and cursor > $${langAndPickParams.length} `;
    }
    pickDataClause += ` order by cursor ${
      input.isSortDescending ? 'DESC' : 'ASC'
    }`;
    if (first) {
      langAndPickParams.push(String(first));
      pickDataClause += ` limit $${langAndPickParams.length} `;
    }

    const sqlStr = `
      select distinct on ("cursor")
        cursor,
        type,
        o_id,
        o_like_string,
        o_definition,
        o_definition_id,
        o_language_code,
        o_dialect_code,
        o_geo_code,
        o_created_at,
        o_created_by
        from v_map_words_and_phrases
      where true
      ${languagesFiltersRestrictionClause}
      ${pickDataClause}
    `;
    console.log('mapsRepository#getOrigMapWordsAndPhrases sqlStr:', sqlStr);
    const resQ = await dbPoolClient.query(sqlStr, langAndPickParams);

    if (!(resQ.rows.length > 0)) {
      console.log('no data');
      return {
        edges: [],
        pageInfo: {
          startCursor: null,
          endCursor: null,
          hasPreviousPage: false,
          hasNextPage: false,
        },
        error: ErrorType.NoError,
      };
    }

    // just to know if there pages after the current selection
    const sqlAfter = `
      select count(*) as count_after
      from v_map_words_and_phrases
      where true
      ${languagesFiltersRestrictionClause}
      and cursor>${dbPoolClient.escapeLiteral(resQ.rows.at(-1).cursor)}
    `;
    console.log('mapsRepository#getOrigMapWordsAndPhrases sqlAfter:', sqlAfter);
    const resCheckAfter = await dbPoolClient.query(sqlAfter, filterParams);

    // just to know if there pages before the current selection
    const sqlBefore = `
      select count(*) as count_before
      from v_map_words_and_phrases
      where true
      ${languagesFiltersRestrictionClause}
      and cursor<${dbPoolClient.escapeLiteral(resQ.rows[0].cursor)}
    `;
    console.log(
      'mapsRepository#getOrigMapWordsAndPhrases sqlBefore:',
      sqlBefore,
    );
    console.log(
      'mapsRepository#getOrigMapWordsAndPhrases langAndPickParams:',
      JSON.stringify(langAndPickParams),
    );

    const resCheckBefore = await dbPoolClient.query(sqlBefore, filterParams);

    const edges: MapWordsAndPhrasesEdge[] = await Promise.all(
      resQ.rows.map(async (r) => {
        const createdBy = (
          await this.userService.read({
            user_id: r.o_created_by,
          })
        ).user;
        const node: MapWordOrPhrase = {
          id: r.cursor,
          type: r.type,
          o_id: r.o_id,
          o_like_string: r.o_like_string,
          o_definition: r.o_definition,
          o_definition_id: r.o_definition_id,
          o_language_code: r.o_language_code,
          o_dialect_code: r.o_dialect_code,
          o_geo_code: r.o_geo_code,
          o_created_at: r.o_created_at,
          o_created_by_user: {
            user_id: createdBy!.user_id,
            avatar: createdBy!.avatar,
            avatar_url: createdBy!.avatar_url,
            is_bot: createdBy!.is_bot,
          },
        };
        return {
          cursor: r.cursor,
          node,
        };
      }),
    );

    const pageInfo = {
      startCursor: resQ.rows[0].cursor,
      endCursor: resQ.rows.at(-1).cursor,
      hasNextPage:
        resCheckAfter.rows[0].count_after &&
        resCheckAfter.rows[0].count_after > 0,
      hasPreviousPage:
        resCheckBefore.rows[0].count_before &&
        resCheckBefore.rows[0].count_before > 0,
    };

    return {
      edges,
      pageInfo,
      error: ErrorType.NoError,
    };
  }

  async getOrigMapWordsAndPhrasesCount(
    dbPoolClient: PoolClient,
    input: GetOrigMapWordsAndPhrasesInput,
  ): Promise<MapWordsAndPhrasesCountOutput> {
    const filterParams: string[] = [];
    let languagesFiltersRestrictionClause = '';
    if (input.lang.language_code) {
      filterParams.push(input.lang.language_code);
      languagesFiltersRestrictionClause += ` and o_language_code =  $${filterParams.length} `;
    }
    if (input.lang.dialect_code) {
      filterParams.push(input.lang.dialect_code);
      languagesFiltersRestrictionClause += ` and o_dialect_code =  $${filterParams.length} `;
    }
    if (input.lang.geo_code) {
      filterParams.push(input.lang.geo_code);
      languagesFiltersRestrictionClause += ` and o_geo_code =  $${filterParams.length} `;
    }
    if (input.filter && input.filter.length > 0) {
      filterParams.push(input.filter);
      languagesFiltersRestrictionClause += ` and LOWER(o_like_string) like concat('%', LOWER($${filterParams.length}),'%')`;
    }
    if (input.original_map_id) {
      filterParams.push(input.original_map_id);
      languagesFiltersRestrictionClause += ` and original_map_id = $${filterParams.length} `;
    }

    const sqlStr = `
      select count(distinct "cursor") count
        from v_map_words_and_phrases
      where true
      ${languagesFiltersRestrictionClause}
    `;

    const resQ = await dbPoolClient.query(sqlStr, filterParams);

    if (!(resQ.rows.length > 0)) {
      return {
        error: ErrorType.PaginationError,
        count: null,
      };
    }
    return {
      error: ErrorType.NoError,
      count: resQ.rows[0].count,
    };
  }

  async getOrigMapsIdsByWordDefinition(
    wordDefinitionId: string,
  ): Promise<string[]> {
    const params = [wordDefinitionId];
    const sqlStr = `
      select distinct 
        om.original_map_id
      from
        original_maps om
      left join original_map_words omw on
        om.original_map_id = omw.original_map_id
      left join words w on
        omw.word_id = w.word_id 
      left join word_definitions wd on w.word_id = wd.word_id 
      where wd.word_definition_id  = $1
    `;
    const resQ = await this.pg.pool.query(sqlStr, params);
    return resQ.rows.map((row) => row.original_map_id);
  }

  async getOrigMapsIdsByPhraseDefinition(
    phraseDefinitionId: string,
  ): Promise<string[]> {
    const params = [phraseDefinitionId];
    const sqlStr = `
      select distinct
        om.original_map_id
      from
        original_maps om
      left join original_map_phrases omph on
        om.original_map_id = omph.original_map_id
      left join phrases ph on
        omph.phrase_id = ph.phrase_id
      left join phrase_definitions phd on ph.phrase_id = phd.phrase_id
      where phd.phrase_definition_id  = $1
    `;
    const resQ = await this.pg.pool.query(sqlStr, params);
    return resQ.rows.map((row) => row.original_map_id);
  }

  async getOrigMapsIdsByTranslationData({
    translation_id,
    from_definition_type_is_word,
    to_definition_type_is_word,
  }: {
    translation_id: string;
    from_definition_type_is_word: boolean;
    to_definition_type_is_word: boolean;
  }): Promise<string[]> {
    const params: string[] = [translation_id];
    let conditions = '';

    if (from_definition_type_is_word && to_definition_type_is_word) {
      conditions = ' and wtwt.word_to_word_translation_id = $1';
    } else if (from_definition_type_is_word && !to_definition_type_is_word) {
      conditions = ' and wtpt.word_to_phrase_translation_id = $1';
    } else if (!from_definition_type_is_word && to_definition_type_is_word) {
      conditions = ' and ptwt.phrase_to_word_translation_id = $1';
    } else {
      conditions = ' and ptpt.phrase_to_phrase_translation_id = $1';
    }

    const sqlStr = `
      select distinct 
        om.original_map_id
      from
        original_maps om
-- phrases       
      left join original_map_phrases omph on
        om.original_map_id = omph.original_map_id
      left join phrases oph on
        omph.phrase_id = oph.phrase_id 
      left join phrase_definitions ophd on 
      	oph.phrase_id = ophd.phrase_id
      left join phrase_to_phrase_translations ptpt on
        ophd.phrase_definition_id = ptpt.from_phrase_definition_id
      left join phrase_to_word_translations ptwt on
        ophd.phrase_definition_id = ptwt.from_phrase_definition_id
-- words
      left join original_map_words omw on
        om.original_map_id = omw.original_map_id
      left join words ow on
        omw.word_id = ow.word_id  
      left join word_definitions owd on 
      	ow.word_id = owd.word_id
      left join word_to_phrase_translations wtpt on
        owd.word_definition_id = wtpt.from_word_definition_id
      left join word_to_word_translations wtwt on
        owd.word_definition_id = wtwt.from_word_definition_id
      where true
      ${conditions}
    `;
    const resQ = await this.pg.pool.query(sqlStr, params);
    return resQ.rows.map((row) => row.original_map_id);
  }

  async upsertTranslatedMapWord(
    translated_map_id,
    original_word_id,
    translated_word_id,
  ): Promise<string> {
    const params = [translated_map_id, original_word_id, translated_word_id];
    const sqlStr = `
      insert into translated_map_words(translated_map_id, original_word_id, translated_word_id)
      values($1, $2, $3)
      on conflict (translated_map_id, original_word_id) do update set original_word_id = excluded.original_word_id
      on conflict (translated_word_id, original_word_id) do update set original_word_id = excluded.original_word_id
      returning translated_map_word_id
    `;

    const resQ = await this.pg.pool.query(sqlStr, params);
    return resQ.rows[0].translated_map_word_id;
  }

  async deleteTranslatedMap(mapId: string) {
    const params = [mapId];
    const sqlStr = `
      delete
      from
        translated_maps
      where
        translated_map_id = $1
      returning translated_map_id
    `;
    const resQ = await this.pg.pool.query(sqlStr, params);
    if (resQ.rows.length > 1) {
      Logger.error(
        `Something wrong, deleted several translated maps instead of single one` +
          JSON.stringify(resQ.rows),
      );
      throw new Error(ErrorType.MapDeletionError);
    }
    if (!resQ.rows || resQ.rows.length < 1) {
      throw new Error(ErrorType.MapNotFound);
    }
    return resQ.rows[0].translated_map_id;
  }

  async deleteOriginalMap(mapId: string) {
    const params = [mapId];
    const sqlStr = `
      delete
      from
        public.original_maps
      where
        original_map_id = $1
      returning original_map_id
    `;
    const resQ = await this.pg.pool.query(sqlStr, params);
    if (resQ.rows.length > 1) {
      Logger.error(
        `Something wrong, deleted several original maps instead of single one:` +
          JSON.stringify(resQ.rows),
      );
      throw new Error(ErrorType.MapDeletionError);
    }
    if (!resQ.rows || resQ.rows.length < 1) {
      throw new Error(ErrorType.MapNotFound);
    }
    return resQ.rows[0].original_map_id;
  }

  async deleteAllOriginalMapWordsTrn(): Promise<void> {
    const dbPoolClient = await this.pg.pool.connect();
    try {
      const sqlStr = `
      delete
      from
        original_map_words
    `;
      await dbPoolClient.query(sqlStr);
    } catch (error) {
      Logger.error(
        `MapsRepository#deleteAllOriginalMapWordsTrn: ` + JSON.stringify(error),
      );
      throw error;
    } finally {
      await dbPoolClient.release();
    }
  }

  async deleteAllOriginalMapPhrasesTrn(): Promise<void> {
    const dbPoolClient = await this.pg.pool.connect();
    try {
      const sqlStr = `
      delete
      from
        original_map_phrases
    `;
      await dbPoolClient.query(sqlStr);
    } catch (error) {
      Logger.error(
        `MapsRepository#deleteAllOriginalMapWordsTrn: ` + JSON.stringify(error),
      );
      throw error;
    } finally {
      await dbPoolClient.release();
    }
  }

  async deleteAllTranslatedMapsTrn(): Promise<void> {
    const dbPoolClient = await this.pg.pool.connect();
    try {
      const sqlStr = `
      delete
      from
        translated_maps
    `;
      await dbPoolClient.query(sqlStr);
    } catch (error) {
      Logger.error(
        `MapsRepository#deleteAllOriginalMapWordsTrn: ` + JSON.stringify(error),
      );
      throw error;
    } finally {
      await dbPoolClient.release();
    }
  }

  async getPossibleMapLanguages(mapId: string): Promise<LanguageInput[]> {
    const params = [mapId];
    const sqlStr = `
      select t_language_code from mv_words_languages mwl
        join original_map_words omw on omw.word_id = mwl.word_id
        where omw.original_map_id = $${params.length} 
      union
        select t_language_code from mv_phrases_languages mpl
        join original_map_phrases omp on omp.phrase_id = mpl.phrase_id
        where omp.original_map_id = $${params.length}
    `;
    const resQ = await this.pg.pool.query(sqlStr, params);
    const langs = resQ.rows.map(
      (row) =>
        ({
          language_code: row.t_language_code,
          dialect_code: row.t_dialect_code,
          geo_code: row.t_geo_code,
        } as LanguageInput),
    );
    return langs;
  }
}
