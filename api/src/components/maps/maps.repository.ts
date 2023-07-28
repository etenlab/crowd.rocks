import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { ErrorType, GenericOutput } from '../../common/types';
import { PostgresService } from '../../core/postgres.service';
import { WordTranslations } from '../words/types';
import {
  GetOrigMapContentOutput,
  GetOrigMapsListOutput,
  GetOrigMapWordsOutput,
  OriginalMapWordInput,
} from './types';

interface ISaveMapParams {
  mapFileName: string;
  fileBody: string;
  token: string;
  dbPoolClient?: PoolClient;
}

interface ISaveMapRes {
  map_file_name: string;
  original_map_id: string;
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
  }: ISaveMapParams): Promise<ISaveMapRes> {
    const poolClient = dbPoolClient
      ? dbPoolClient // use given pool client
      : this.pg.pool; //some `random` client from pool will be used

    const res = await poolClient.query(
      `
          call original_map_create($1,$2,$3, null,null,null,null)
        `,
      [mapFileName, fileBody, token],
    );
    console.log(
      'sql stored proc message: ',
      JSON.stringify(res.rows[0].p_error_type),
    );

    return {
      map_file_name: mapFileName,
      original_map_id: res.rows[0].p_original_map_id,
      created_at: res.rows[0].p_created_at,
      created_by: res.rows[0].p_created_by,
    };
  }

  async getOrigMaps(): Promise<GetOrigMapsListOutput> {
    const resQ = await this.pg.pool.query(
      `
        select original_map_id, map_file_name, created_at, created_by from original_maps
      `,
      [],
    );

    const origMapList = resQ.rows.map(
      ({ original_map_id, map_file_name, created_at, created_by }) => ({
        original_map_id,
        map_file_name,
        created_at,
        created_by,
      }),
    );

    return { origMapList };
  }

  async getOrigMapContent(id: string): Promise<GetOrigMapContentOutput> {
    const resQ = await this.pg.pool.query(
      `
        select content, map_file_name, created_at, created_by from original_maps where original_map_id = $1
      `,
      [id],
    );

    return {
      original_map_id: String(id),
      map_file_name: resQ.rows[0].map_file_name,
      created_at: resQ.rows[0].created_at,
      created_by: resQ.rows[0].created_by,
      content: resQ.rows[0].content,
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

    let sqlStr = `
      select
        w.word_id,
        ws.wordlike_string as word,
        owd.definition as o_definition,
        owd.word_definition_id as o_definition_id,
        w.language_code as o_language_code,
        w.dialect_code as o_dialect_code,
        w.geo_code as o_geo_code,
        wtwt.to_word_definition_id,
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
        const currTranslation = {
          word_id: r.t_word_id,
          word: r.t_wordlike_string,
          definition: r.t_definition,
          definition_id: r.t_definition_id,
          language_code: r.t_language_code,
          dialect_code: r.t_dialect_code,
          geo_code: r.t_geo_code,
          up_votes: r.up_votes_count || 0,
          down_votes: r.down_votes_count || 0,
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
}
