import { Injectable } from '@nestjs/common';
import { PostgresService } from '../../core/postgres.service';
import { GetOrigMapContentOutput, GetOrigMapsListOutput } from './types';

interface ISaveMapParams {
  mapFileName: string;
  fileBody: string;
  token: string;
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
  }: ISaveMapParams): Promise<ISaveMapRes> {
    let res;
    try {
      res = await this.pg.pool.query(
        `
          call original_map_create($1,$2,$3, null,null,null,null)
        `,
        [mapFileName, fileBody, token],
      );
      console.log(
        'sql stored proc message: ',
        JSON.stringify(res.rows[0].p_error_type),
      );
    } catch (error) {
      console.log(`MapRepository#saveMap error: ${error}`);
    }

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
}
