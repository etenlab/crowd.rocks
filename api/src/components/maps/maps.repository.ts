import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { ErrorType, GenericOutput } from '../../common/types';
import { PostgresService } from '../../core/postgres.service';
import {
  GetOrigMapContentOutput,
  GetOrigMapsListOutput,
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

@Injectable()
export class MapsRepository {
  constructor(private pg: PostgresService) {}

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
}
