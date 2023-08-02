import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { ErrorType, GenericOutput } from '../../common/types';
import { PostgresService } from '../../core/postgres.service';
import { LanguageInput } from 'src/components/common/types';
import { WordTranslations, WordWithVotes } from '../words/types';
import {
  GetOrigMapContentOutput,
  GetOrigMapsListOutput,
  GetOrigMapWordsOutput,
  GetTranslatedMapContentOutput,
  MapFileOutput,
  OriginalMapWordInput,
} from './types';

interface ISaveMapParams {
  mapFileName: string;
  fileBody: string;
  token: string;
  language_code: string;
  dialect_code?: string;
  geo_code?: string;
  dbPoolClient?: PoolClient;
}
export interface ISaveTranslatedMapParams {
  original_map_id: string;
  fileBody: string;
  token: string;
  t_language_code: string;
  t_dialect_code?: string;
  t_geo_code?: string;
  dbPoolClient?: PoolClient;
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
  constructor(private pg: PostgresService) {}

  /**
   * dbPoolClient is optional. If providerd, then it will be used to run query (useful for SQL transactions)
   * if not - then new client will be get from pg.pool
   */
  async saveOriginalMap({
    mapFileName,
    fileBody,
    token,
    dbPoolClient,
    language_code,
    dialect_code,
    geo_code,
  }: ISaveMapParams): Promise<ISaveMapRes> {
    const poolClient = dbPoolClient
      ? dbPoolClient // use given pool client
      : this.pg.pool; //some `random` client from pool will be used

    const res = await poolClient.query(
      `
          call original_map_create($1,$2,$3,$4,$5,$6, null,null,null,null)
        `,
      [mapFileName, fileBody, token, language_code, dialect_code, geo_code],
    );

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
  async saveTranslatedMap({
    original_map_id,
    fileBody,
    dbPoolClient,
    token,
    t_language_code,
    t_dialect_code,
    t_geo_code,
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

    const params = [original_map_id, fileBody, userId, t_language_code];
    params.push(t_dialect_code ? t_dialect_code : null);
    params.push(t_geo_code ? t_geo_code : null);
    const sqlStr = `
      insert into
        translated_maps(
          original_map_id,
          content,
          created_by,
          language_code,
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
          $6
        )
        on conflict(original_map_id, language_code, dialect_code, geo_code) do update
          set content = EXCLUDED.content
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
    const params = [];
    let languageClause = '';
    if (lang?.language_code) {
      params.push(lang?.language_code);
      languageClause += ` and where language_code = $${params.length}`;
    }
    if (lang?.dialect_code) {
      params.push(lang?.dialect_code);
      languageClause += ` and where dialect_code = $${params.length}`;
    }
    if (lang?.geo_code) {
      params.push(lang?.geo_code);
      languageClause += ` and where geo_code = $${params.length}`;
    }
    const sqlStr = `
        select
          original_map_id,
          map_file_name,
          created_at,
          created_by,
          language_code ,
          dialect_code ,
          geo_code
        from
          original_maps
        where true
        ${languageClause}
      `;
    const resQ = await this.pg.pool.query(sqlStr, []);

    const origMapList = resQ.rows.map<MapFileOutput>(
      ({
        original_map_id,
        map_file_name,
        created_at,
        created_by,
        language_code,
        dialect_code,
        geo_code,
      }) => ({
        original_map_id,
        map_file_name,
        created_at,
        created_by,
        is_original: true,
        language: { language_code, dialect_code, geo_code },
      }),
    );

    return { origMapList };
  }

  async getTranslatedMaps(
    lang?: LanguageInput,
  ): Promise<GetOrigMapsListOutput> {
    const params = [];
    let languageClause = '';
    if (lang?.language_code) {
      params.push(lang?.language_code);
      languageClause += ` and where language_code = $${params.length}`;
    }
    if (lang?.dialect_code) {
      params.push(lang?.dialect_code);
      languageClause += ` and where dialect_code = $${params.length}`;
    }
    if (lang?.geo_code) {
      params.push(lang?.geo_code);
      languageClause += ` and where geo_code = $${params.length}`;
    }
    const sqlStr = `
      select
        tm.translated_map_id,
        tm.original_map_id,
        om.map_file_name,
        tm.created_at,
        tm.created_by,
        tm.language_code ,
        tm.dialect_code ,
        tm.geo_code
      from
        translated_maps tm
      left join original_maps om
        on tm.original_map_id = om.original_map_id
      where
        true
        ${languageClause}
    `;
    const resQ = await this.pg.pool.query(sqlStr, []);

    const origMapList = resQ.rows.map<MapFileOutput>(
      ({
        translated_map_id,
        original_map_id,
        map_file_name,
        created_at,
        created_by,
        language_code,
        dialect_code,
        geo_code,
      }) => ({
        translated_map_id,
        original_map_id,
        map_file_name,
        created_at,
        created_by,
        is_original: false,
        language: { language_code, dialect_code, geo_code },
      }),
    );

    return { origMapList };
  }

  async getOrigMapContent(id: string): Promise<GetOrigMapContentOutput> {
    const resQ = await this.pg.pool.query(
      `
        select content, map_file_name, created_at, created_by, language_code,	dialect_code,	geo_code
        from original_maps where original_map_id = $1
      `,
      [id],
    );

    return {
      original_map_id: String(id),
      map_file_name: resQ.rows[0].map_file_name,
      created_at: resQ.rows[0].created_at,
      created_by: resQ.rows[0].created_by,
      content: resQ.rows[0].content,
      is_original: true,
      language: {
        language_code: resQ.rows[0].language_code,
        dialect_code: resQ.rows[0].dialect_code,
        geo_code: resQ.rows[0].geo_code,
      },
    };
  }

  async getTranslatedMapContent(
    id: string,
  ): Promise<GetTranslatedMapContentOutput> {
    const resQ = await this.pg.pool.query(
      `
      select
        tm.translated_map_id,
        tm.original_map_id,
        om.map_file_name,
        tm.created_at,
        tm.created_by,
        tm.language_code ,
        tm.dialect_code ,
        tm.geo_code,
        tm.content
      from
        translated_maps tm
      left join original_maps om
        on tm.original_map_id = om.original_map_id
      where
        translated_map_id = $1
      `,
      [id],
    );

    return {
      original_map_id: String(id),
      map_file_name: resQ.rows[0].map_file_name,
      created_at: resQ.rows[0].created_at,
      created_by: resQ.rows[0].created_by,
      content: resQ.rows[0].content,
      is_original: true,
      language: {
        language_code: resQ.rows[0].language_code,
        dialect_code: resQ.rows[0].dialect_code,
        geo_code: resQ.rows[0].geo_code,
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
    const params = [];
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

    let sqlStr = `
      select distinct
        w.word_id,
        ws.wordlike_string as word,
        owd.definition as o_definition,
        owd.word_definition_id as o_definition_id,
        w.language_code as o_language_code,
        w.dialect_code as o_dialect_code,
        w.geo_code as o_geo_code,
        wtwt.to_word_definition_id,
        wtwt.word_to_word_translation_id,
        twd.definition as t_definition,
        twd.word_definition_id as t_definition_id,
        tws.wordlike_string as t_wordlike_string,
        tw.language_code as t_language_code,
        tw.dialect_code as t_dialect_code,
        tw.geo_code as t_geo_code,
        tw.word_id as t_word_id,
        up.up_votes_count,
        down.down_votes_count
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
      where true
    `;

    if (original_map_id) {
      params.push(original_map_id);
      sqlStr += ` and omw.original_map_id = $${params.length}`;
    }
    if (o_language_code) {
      params.push(o_language_code);
      sqlStr += ` and w.language_code = $${params.length}`;
    }
    if (o_dialect_code) {
      params.push(o_dialect_code);
      sqlStr += ` and w.dialect_code = $${params.length}`;
    }
    if (o_geo_code) {
      params.push(o_geo_code);
      sqlStr += ` and w.geo_code = $${params.length}`;
    }

    const resQ = await this.pg.pool.query(sqlStr, params);

    const words: WordTranslations[] = resQ.rows.reduce(
      (words: WordTranslations[], r) => {
        const currTranslation: WordWithVotes = {
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
        };

        const existingWordIdx = words.findIndex(
          (w) =>
            w.word_id === r.word_id && w.definition_id === r.o_definition_id,
        );

        if (existingWordIdx >= 0) {
          currTranslation.word_id &&
            words[existingWordIdx].translations.push(currTranslation);
        } else {
          words.push({
            word_id: r.word_id,
            word: r.word,
            language_code: r.o_language_code,
            dialect_code: r.o_dialect_code,
            geo_code: r.o_geo_code,
            definition: r.o_definition,
            definition_id: r.o_definition_id,
            translations: currTranslation.word_id ? [currTranslation] : [],
          });
        }

        return words;
      },
      [] as WordTranslations[],
    );

    return {
      origMapWords: words,
    };
  }

  async getOrigMapIdsByWordDefinition(
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
}
