import { Injectable, Logger } from '@nestjs/common';
import { PoolClient } from 'pg';
import { ErrorType, GenericOutput } from '../../common/types';
import { PostgresService } from '../../core/postgres.service';
import { LanguageInput } from 'src/components/common/types';
import {
  GetOrigMapPhrasesOutput,
  GetOrigMapsListOutput,
  GetOrigMapWordsOutput,
  MapDetailsOutput,
  MapPhraseWithTranslations,
  MapPhraseAsTranslation,
  MapWordWithTranslations,
  MapWordAsTranslation,
  OriginalMapPhraseInput,
  OriginalMapWordInput,
  MapWordsAndPhrasesConnection,
  GetOrigMapWordsAndPhrasesInput,
  MapWordsAndPhrasesEdge,
  MapWordOrPhrase,
  MapWordsAndPhrasesCountOutput,
  OrigMapWordsAndPhrasesOutput,
} from './types';
import { putLangCodesToFileName } from '../../common/utility';
import { GroupedFilterSymbols } from '../../../../utils/dist';
import { UserService } from '../user/user.service';
import { create } from 'domain';
import { User } from '../user/types';

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
  t_language_code: string;
  t_dialect_code?: string;
  t_geo_code?: string;
  dbPoolClient: PoolClient | null;
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

interface ILangsRestrictions {
  o_language_code?: string;
  o_dialect_code?: string;
  o_geo_code?: string;
  t_language_code?: string;
  t_dialect_code?: string;
  t_geo_code?: string;
}

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
    dbPoolClient,
    language_code,
    dialect_code,
    geo_code,
  }: ISaveMapParams): Promise<ISaveMapRes> {
    const previewFileIdN = Number(previewFileId);
    const content_file_idN = Number(content_file_id);
    if (isNaN(previewFileIdN) || isNaN(content_file_idN)) {
      throw new Error(ErrorType.ProvidedIdIsMalformed);
    }
    const poolClient = dbPoolClient
      ? dbPoolClient // use given pool client
      : this.pg.pool; //some `random` client from pool will be used

    const res = await poolClient.query(
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
  }

  /**
   * dbPoolClient is optional. If providerd, then it will be used to run query (useful for SQL transactions)
   * if not - then new client will be get from pg.pool
   */
  async saveTranslatedMapTrn({
    original_map_id,
    content_file_id,
    dbPoolClient,
    token,
    t_language_code,
    t_dialect_code,
    t_geo_code,
    translated_percent,
  }: ISaveTranslatedMapParams): Promise<ISaveTranslatedMapRes | null> {
    const poolClient = dbPoolClient
      ? dbPoolClient // use given pool client
      : this.pg.pool; //some `random` client from pool will be used

    const userQ = await poolClient.query(
      `select user_id from tokens where token = $1`,
      [token],
    );
    const userId = userQ.rows[0].user_id;
    if (!userId) throw new Error('not Authorized');

    const params = [
      original_map_id,
      content_file_id,
      userId,
      t_language_code,
      translated_percent,
    ];
    params.push(t_dialect_code ? t_dialect_code : null);
    params.push(t_geo_code ? t_geo_code : null);
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
    const res = await poolClient.query(sqlStr, params);

    return {
      map_id: res.rows[0].translated_map_id,
      created_at: res.rows[0].created_at,
      created_by: res.rows[0].created_by,
    };
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

  /**
   * Note that orginal language params restrict whole selection on language that pass this params
   * instead target language params restrict only left join words.
   */
  async getOrigMapWords(
    original_map_id: string,
    {
      o_language_code,
      o_dialect_code,
      o_geo_code,
      t_language_code,
      t_dialect_code,
      t_geo_code,
    }: ILangsRestrictions,
  ): Promise<GetOrigMapWordsOutput> {
    const params: string[] = [];
    let tLanguageRestrictionClause = '';
    if (t_language_code) {
      params.push(t_language_code);
      tLanguageRestrictionClause += ` and tw.language_code =  $${params.length} `;
    }
    if (t_dialect_code) {
      params.push(t_dialect_code);
      tLanguageRestrictionClause += ` and tw.dialect_code =  $${params.length} `;
    }
    if (t_geo_code) {
      params.push(t_geo_code);
      tLanguageRestrictionClause += ` and tw.geo_code =  $${params.length} `;
    }

    // note that 'disctinct' because of same word can be at several original maps.
    // For now, we don't care in which map the word is present, so don't select omw.original_map_id.
    // But without 'distinct' clause this query will return row for each combination word-original map
    // but we don't want it yet.

    // search for word to word translations and its votes note that 'disctinct' because of same phrase can be at several original maps.

    let wtwt_sqlStr = `
      select distinct
        w.word_id,
        ws.wordlike_string as word,
        owd.definition as o_definition,
        owd.word_definition_id as o_definition_id,
        w.language_code as o_language_code,
        w.dialect_code as o_dialect_code,
        w.geo_code as o_geo_code,
        wtwt.word_to_word_translation_id,
        twd.definition as t_definition,
        twd.word_definition_id as t_definition_id,
        tws.wordlike_string as t_wordlike_string,
        tw.language_code as t_language_code,
        tw.dialect_code as t_dialect_code,
        tw.geo_code as t_geo_code,
        tw.word_id as t_word_id,
        up.up_votes_count,
        down.down_votes_count,
        tw.created_at as t_created_at,
	      tw.created_by as t_user_id,
	      tu.is_bot as t_is_bot,
	      ta.avatar as t_avatar,
	      ta.url as t_avatar_url,
        w.created_by as o_user_id,
	      ou.is_bot as o_is_bot,
	      oa.avatar as o_avatar,
	      oa.url as o_avatar_url
      from
        words w
      left join wordlike_strings ws on
        w.wordlike_string_id = ws.wordlike_string_id
      left join
      	word_definitions owd on w.word_id= owd.word_id
      inner join
      	original_map_words omw on w.word_id = omw.word_id
      left join
      	word_to_word_translations wtwt on wtwt.from_word_definition_id=owd.word_definition_id
      left join
      	word_definitions twd on wtwt.to_word_definition_id = twd.word_definition_id
      left join
      	words tw on twd.word_id = tw.word_id ${tLanguageRestrictionClause}
      left join
      	wordlike_strings tws on tw.wordlike_string_id = tws.wordlike_string_id      
      left join v_word_to_word_translations_upvotes_count up on wtwt.word_to_word_translation_id = up.word_to_word_translation_id
      left join v_word_to_word_translations_downvotes_count down on wtwt.word_to_word_translation_id = down.word_to_word_translation_id
      join users tu
      	on tu.user_id = tw.created_by
      join avatars ta
      	on tu.user_id = ta.user_id
      join users ou
        on ou.user_id = w.created_by
      join avatars oa
        on ou.user_id = oa.user_id
      where true
    `;

    // search for word to phrase translations and its votes note that 'disctinct' because of same phrase can be at several original maps.
    let wtwp_sqlStr = `
      select distinct
        w.word_id,
        ws.wordlike_string as word,
        owd.definition as o_definition,
        owd.word_definition_id as o_definition_id,
        w.language_code as o_language_code,
        w.dialect_code as o_dialect_code,
        w.geo_code as o_geo_code,
        wtpt.word_to_phrase_translation_id,
        tphd.definition as t_definition,
        tphd.phrase_definition_id as t_definition_id,
        tph.phraselike_string as t_phraselike_string,
        tph.phrase_id as t_phrase_id,
        tw.language_code as t_language_code,
        tw.dialect_code as t_dialect_code,
        tw.geo_code as t_geo_code,
        tw.word_id as t_word_id,
        up.up_votes_count,
        down.down_votes_count,
        w.created_at as o_created_at,
	      w.created_by as o_user_id,
	      ou.is_bot as o_is_bot,
	      oa.avatar as o_avatar,
	      oa.url as o_avatar_url,
		    tph.created_at as t_created_at,
	      tph.created_by as t_user_id,
	      tu.is_bot as t_is_bot,
	      ta.avatar as t_avatar,
	      ta.url as t_avatar_url
      from
        words w
      left join wordlike_strings ws on
        w.wordlike_string_id = ws.wordlike_string_id
      left join 
      	word_definitions owd on w.word_id= owd.word_id
      inner join 
      	original_map_words omw on w.word_id = omw.word_id
      left join 
      	word_to_phrase_translations wtpt on wtpt.from_word_definition_id=owd.word_definition_id
      left join
      	phrase_definitions tphd on wtpt.to_phrase_definition_id = tphd.phrase_definition_id
      left join 
      	phrases tph on tphd.phrase_id  = tph.phrase_id
      left join v_word_to_phrase_translations_upvotes_count up on wtpt.word_to_phrase_translation_id = up.word_to_phrase_translation_id
      left join v_word_to_phrase_translations_downvotes_count down on wtpt.word_to_phrase_translation_id = down.word_to_phrase_translation_id
      left join words tw on tw.word_id = tph.words[1] ${tLanguageRestrictionClause}
      join users ou
      	on ou.user_id = w.created_by
      join avatars oa
      	on ou.user_id = oa.user_id
	    join users tu
	  	  on tu.user_id = tph.created_by
	    join avatars ta
	      on tu.user_id = ta.user_id
      where true
    `;

    if (original_map_id) {
      params.push(original_map_id);
      wtwt_sqlStr += ` and omw.original_map_id = $${params.length}`;
      wtwp_sqlStr += ` and omw.original_map_id = $${params.length}`;
    }
    if (o_language_code) {
      params.push(o_language_code);
      wtwt_sqlStr += ` and w.language_code = $${params.length}`;
      wtwp_sqlStr += ` and w.language_code = $${params.length}`;
    }
    if (o_dialect_code) {
      params.push(o_dialect_code);
      wtwt_sqlStr += ` and w.dialect_code = $${params.length}`;
      wtwp_sqlStr += ` and w.dialect_code = $${params.length}`;
    }
    if (o_geo_code) {
      params.push(o_geo_code);
      wtwt_sqlStr += ` and w.geo_code = $${params.length}`;
      wtwp_sqlStr += ` and w.geo_code = $${params.length}`;
    }

    const resQ_wtwt = await this.pg.pool.query(wtwt_sqlStr, params);
    const resQ_wtpt = await this.pg.pool.query(wtwp_sqlStr, params);
    const words: MapWordWithTranslations[] = [];

    resQ_wtwt.rows.forEach((r) => {
      const currTranslation: MapWordAsTranslation = {
        word_id: r.t_word_id,
        word: r.t_wordlike_string,
        definition: r.t_definition,
        definition_id: r.t_definition_id,
        language_code: r.t_language_code,
        dialect_code: r.t_dialect_code,
        geo_code: r.t_geo_code,
        up_votes: r.up_votes_count || 0,
        down_votes: r.down_votes_count || 0,
        translation_id: r.word_to_word_translation_id,
        created_at: r.t_created_at,
        created_by_user: {
          user_id: r.t_user_id,
          avatar: r.t_avatar,
          avatar_url: r.t_avatar_url,
          is_bot: r.t_is_bot,
        },
      };

      const existingWordIdx = words.findIndex(
        (w) => w.word_id === r.word_id && w.definition_id === r.o_definition_id,
      );

      if (existingWordIdx >= 0) {
        currTranslation.language_code &&
          words[existingWordIdx]!.translations!.push(currTranslation);
      } else {
        words.push({
          word_id: r.word_id,
          word: r.word,
          language_code: r.o_language_code,
          dialect_code: r.o_dialect_code,
          geo_code: r.o_geo_code,
          definition: r.o_definition,
          definition_id: r.o_definition_id,
          translations: currTranslation.language_code ? [currTranslation] : [],
          created_at: r.o_created_at,
          created_by_user: {
            user_id: r.o_user_id,
            avatar: r.o_avatar,
            avatar_url: r.o_avatar_url,
            is_bot: r.o_is_bot,
          },
        });
      }
    });

    resQ_wtpt.rows.forEach((r) => {
      const currTranslation: MapPhraseAsTranslation = {
        phrase_id: r.t_phrase_id,
        phrase: r.t_phraselike_string,
        definition: r.t_definition,
        definition_id: r.t_definition_id,
        language_code: r.t_language_code,
        dialect_code: r.t_dialect_code,
        geo_code: r.t_geo_code,
        up_votes: r.up_votes_count || 0,
        down_votes: r.down_votes_count || 0,
        translation_id: r.word_to_phrase_translation_id,
        created_at: r.t_created_at,
        created_by_user: {
          user_id: r.t_user_id,
          avatar: r.t_avatar,
          avatar_url: r.t_avatar_url,
          is_bot: r.t_is_bot,
        },
      };

      const existingWordIdx = words.findIndex(
        (w) => w.word_id === r.word_id && w.definition_id === r.o_definition_id,
      );

      if (existingWordIdx >= 0) {
        currTranslation.language_code &&
          words[existingWordIdx]!.translations!.push(currTranslation);
      } else {
        words.push({
          word_id: r.word_id,
          word: r.word,
          language_code: r.o_language_code,
          dialect_code: r.o_dialect_code,
          geo_code: r.o_geo_code,
          definition: r.o_definition,
          definition_id: r.o_definition_id,
          translations: currTranslation.language_code ? [currTranslation] : [],
          created_at: r.created_at,
          created_by_user: {
            user_id: r.o_user_id,
            avatar: r.avatar,
            avatar_url: r.avatar_url,
            is_bot: r.is_bot,
          },
        });
      }
    });

    return {
      origMapWords: words,
    };
  }

  async getOrigMapPhrases(
    original_map_id: string,
    {
      o_language_code,
      o_dialect_code,
      o_geo_code,
      t_language_code,
      t_dialect_code,
      t_geo_code,
    }: ILangsRestrictions,
  ): Promise<GetOrigMapPhrasesOutput> {
    const params: string[] = [];
    let tLanguageRestrictionClause = '';
    if (t_language_code) {
      params.push(t_language_code);
      tLanguageRestrictionClause += ` and tw.language_code =  $${params.length} `;
    }
    if (t_dialect_code) {
      params.push(t_dialect_code);
      tLanguageRestrictionClause += ` and tw.dialect_code =  $${params.length} `;
    }
    if (t_geo_code) {
      params.push(t_geo_code);
      tLanguageRestrictionClause += ` and tw.geo_code =  $${params.length} `;
    }

    // search for phrase to phrase translations and its votes note that 'disctinct' because of same phrase can be at several original maps.
    let ptpt_sqlStr = ` 
      select distinct
        oph.phrase_id,
        oph.phraselike_string as phrase,
        ophd.definition as o_definition,
        ophd.phrase_definition_id  as o_definition_id,
        ow.language_code as o_language_code,
        ow.dialect_code as o_dialect_code,
        ow.geo_code as o_geo_code,
        tw.language_code as t_language_code,
        tw.dialect_code as t_dialect_code,
        tw.geo_code as t_geo_code,
        ptpt.to_phrase_definition_id,
        ptpt.phrase_to_phrase_translation_id,
        tphd.phrase_id as t_phrase_id,
        tphd.definition as t_definition,
        tphd.phrase_definition_id as t_definition_id,
        tph.phraselike_string as t_phraselike_string,
        up.up_votes_count,
        down.down_votes_count,
        oph.created_at as o_created_at,
	      oph.created_by as o_user_id,
	      ou.is_bot as o_is_bot,
	      oa.avatar as o_avatar,
	      oa.url as o_avatar_url,
		    tph.created_at as t_created_at,
	      tph.created_by as t_user_id,
	      tu.is_bot as t_is_bot,
	      ta.avatar as t_avatar,
	      ta.url as t_avatar_url
      from
        phrases oph
      left join 
      	phrase_definitions ophd on oph.phrase_id= ophd.phrase_id
      inner join 
      	original_map_phrases omph on oph.phrase_id = omph.phrase_id
      left join 
      	phrase_to_phrase_translations ptpt on ptpt.from_phrase_definition_id = ophd.phrase_definition_id
      left join
      	phrase_definitions tphd  on ptpt.to_phrase_definition_id  = tphd.phrase_definition_id 
      left join 
      	phrases tph on tphd.phrase_id  = tph.phrase_id
      left join v_phrase_to_phrase_translations_upvotes_count up on ptpt.phrase_to_phrase_translation_id = up.phrase_to_phrase_translation_id
      left join v_phrase_to_phrase_translations_downvotes_count down on ptpt.phrase_to_phrase_translation_id = down.phrase_to_phrase_translation_id
      left join words ow on ow.word_id = oph.words[1]
      left join words tw on tw.word_id = tph.words[1] ${tLanguageRestrictionClause}
      join users ou
      	on ou.user_id = oph.created_by
      join avatars oa
      	on ou.user_id = oa.user_id
	    join users tu
      	on tu.user_id = tph.created_by
      join avatars ta
      	on tu.user_id = ta.user_id
      where true

    `;

    // search for phrase to word translations and its votes note that 'disctinct' because of same phrase can be at several original maps.
    let ptwt_sqlStr = ` 
      select distinct
        oph.phrase_id,
        oph.phraselike_string as phrase,
        ophd.definition as o_definition,
        ophd.phrase_definition_id  as o_definition_id,
        ow.language_code as o_language_code,
        ow.dialect_code as o_dialect_code,
        ow.geo_code as o_geo_code,
        tw.language_code as t_language_code,
        tw.dialect_code as t_dialect_code,
        tw.geo_code as t_geo_code,
        ptwt.to_word_definition_id,
        ptwt.phrase_to_word_translation_id,
        twd.word_id as t_word_id,
        twd.definition as t_definition,
        twd.word_definition_id as t_definition_id,
        tws.wordlike_string as t_wordlike_string,
        up.up_votes_count,
        down.down_votes_count,
        oph.created_at as o_created_at,
        oph.created_by as o_user_id,
        ou.is_bot as o_is_bot,
        oa.avatar as o_avatar,
        oa.url as o_avatar_url,
        tw.created_at as t_created_at,
        tw.created_by as t_user_id,
        tu.is_bot as t_is_bot,
        ta.avatar as t_avatar,
        ta.url as t_avatar_url
      from
        phrases oph
      left join 
      	phrase_definitions ophd on oph.phrase_id= ophd.phrase_id
      inner join 
      	original_map_phrases omph on oph.phrase_id = omph.phrase_id
      left join 
      	phrase_to_word_translations ptwt on ptwt.from_phrase_definition_id = ophd.phrase_definition_id
      left join
      	word_definitions twd  on ptwt.to_word_definition_id  = twd.word_definition_id 
      left join 
      	words tw on twd.word_id  = tw.word_id ${tLanguageRestrictionClause}
      left join 
      	wordlike_strings tws on tw.wordlike_string_id = tws.wordlike_string_id
      left join v_phrase_to_word_translations_upvotes_count up on ptwt.phrase_to_word_translation_id = up.phrase_to_word_translation_id
      left join v_phrase_to_word_translations_downvotes_count down on ptwt.phrase_to_word_translation_id = down.phrase_to_word_translation_id
      left join words ow on ow.word_id = oph.words[1]
      join users ou
      	on ou.user_id = oph.created_by
      join avatars oa
      	on ou.user_id = oa.user_id
	    join users tu
      	on tu.user_id = tw.created_by
      join avatars ta
      	on tu.user_id = ta.user_id
      where true 
    `;

    if (original_map_id) {
      params.push(original_map_id);
      ptpt_sqlStr += ` and omph.original_map_id = $${params.length}`;
      ptwt_sqlStr += ` and omph.original_map_id = $${params.length}`;
    }
    if (o_language_code) {
      params.push(o_language_code);
      ptpt_sqlStr += ` and ow.language_code = $${params.length}`;
      ptwt_sqlStr += ` and ow.language_code = $${params.length}`;
    }
    if (o_dialect_code) {
      params.push(o_dialect_code);
      ptpt_sqlStr += ` and ow.dialect_code = $${params.length}`;
      ptwt_sqlStr += ` and ow.dialect_code = $${params.length}`;
    }
    if (o_geo_code) {
      params.push(o_geo_code);
      ptpt_sqlStr += ` and ow.geo_code = $${params.length}`;
      ptwt_sqlStr += ` and ow.geo_code = $${params.length}`;
    }

    const resQptpt = await this.pg.pool.query(ptpt_sqlStr, params);
    const resQptwt = await this.pg.pool.query(ptwt_sqlStr, params);
    const phrases: Array<MapPhraseWithTranslations> = [];

    resQptpt.rows.forEach((r) => {
      const currTranslation: MapPhraseAsTranslation = {
        phrase_id: r.t_phrase_id,
        phrase: r.t_phraselike_string,
        definition: r.t_definition,
        definition_id: r.t_definition_id,
        language_code: r.t_language_code,
        dialect_code: r.t_dialect_code,
        geo_code: r.t_geo_code,
        up_votes: r.up_votes_count || 0,
        down_votes: r.down_votes_count || 0,
        translation_id: r.phrase_to_phrase_translation_id,
        created_at: r.t_created_at,
        created_by_user: {
          user_id: r.t_user_id,
          avatar: r.t_avatar,
          avatar_url: r.t_avatar_url,
          is_bot: r.t_is_bot,
        },
      };
      const existingPhraseIdx = phrases.findIndex(
        (ph) =>
          ph.phrase_id === r.phrase_id &&
          ph.definition_id === r.o_definition_id,
      );
      if (existingPhraseIdx >= 0) {
        currTranslation.language_code &&
          phrases[existingPhraseIdx]!.translations!.push(currTranslation);
      } else {
        phrases.push({
          phrase_id: r.phrase_id,
          phrase: r.phrase,
          language_code: r.o_language_code,
          dialect_code: r.o_dialect_code,
          geo_code: r.o_geo_code,
          definition: r.o_definition,
          definition_id: r.o_definition_id,
          translations: currTranslation.language_code ? [currTranslation] : [],
          created_at: r.o_created_at,
          created_by_user: {
            user_id: r.o_user_id,
            avatar: r.o_avatar,
            avatar_url: r.o_avatar_url,
            is_bot: r.o_is_bot,
          },
        });
      }
    });

    resQptwt.rows.forEach((r) => {
      const currTranslation: MapWordAsTranslation = {
        word_id: r.t_word_id,
        word: r.t_wordlike_string,
        definition: r.t_definition,
        definition_id: r.t_definition_id,
        language_code: r.t_language_code,
        dialect_code: r.t_dialect_code,
        geo_code: r.t_geo_code,
        up_votes: r.up_votes_count || 0,
        down_votes: r.down_votes_count || 0,
        translation_id: r.phrase_to_word_translation_id,
        created_at: r.t_created_at,
        created_by_user: {
          user_id: r.t_created_by,
          avatar: r.t_avatar,
          avatar_url: r.t_avatar_url,
          is_bot: r.t_is_bot,
        },
      };
      const existingPhraseIdx = phrases.findIndex(
        (ph) =>
          ph.phrase_id === r.phrase_id &&
          ph.definition_id === r.o_definition_id,
      );
      if (existingPhraseIdx >= 0) {
        currTranslation.language_code &&
          phrases[existingPhraseIdx]!.translations!.push(currTranslation);
      } else {
        phrases.push({
          phrase_id: r.phrase_id,
          phrase: r.phrase,
          language_code: r.o_language_code,
          dialect_code: r.o_dialect_code,
          geo_code: r.o_geo_code,
          definition: r.o_definition,
          definition_id: r.o_definition_id,
          translations: currTranslation.language_code ? [currTranslation] : [],
          created_at: r.o_created_at,
          created_by_user: {
            user_id: r.o_created_by,
            avatar: r.o_avatar,
            avatar_url: r.o_avatar_url,
            is_bot: r.o_is_bot,
          },
        });
      }
    });

    return {
      origMapPhrases: phrases,
    };
  }

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
      select distinct 
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

  async getOrigMapWordsAndPhrasesPaginated(
    dbPoolClient: PoolClient,
    input: GetOrigMapWordsAndPhrasesInput,
    offset,
    limit,
  ): Promise<OrigMapWordsAndPhrasesOutput> {
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

    if (offset) {
      filterParams.push(offset);
      languagesFiltersRestrictionClause += ` offset $${filterParams.length} `;
    }
    if (limit) {
      filterParams.push(limit);
      languagesFiltersRestrictionClause += ` limit $${filterParams.length}`;
    }

    const sqlStr = `
      select distinct 
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
      
    `;

    const resQ = await dbPoolClient.query(sqlStr, filterParams);

    if (!(resQ.rows.length > 0)) {
      return {
        error: ErrorType.PaginationError,
        mapWordsOrPhrases: null,
      };
    }

    const mapWordsOrPhrases: MapWordOrPhrase[] = await Promise.all(
      resQ.rows.map(async (r) => {
        const createdBy = (
          await this.userService.read({
            user_id: r.o_created_by,
          })
        ).user;
        return {
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
      }),
    );
    return {
      error: ErrorType.NoError,
      mapWordsOrPhrases,
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

  async deleteAllOriginalMapWordsTrn(dbPoolClient: PoolClient): Promise<void> {
    const sqlStr = `
      delete
      from
        original_map_words
    `;
    await dbPoolClient.query(sqlStr);
  }

  async deleteAllOriginalMapPhrasesTrn(
    dbPoolClient: PoolClient,
  ): Promise<void> {
    const sqlStr = `
      delete
      from
        original_map_phrases
    `;
    await dbPoolClient.query(sqlStr);
  }

  async deleteAllTranslatedMapsTrn(dbPoolClient: PoolClient): Promise<void> {
    const sqlStr = `
      delete
      from
        translated_maps
    `;
    await dbPoolClient.query(sqlStr);
  }
}
