import { Injectable } from '@nestjs/common';
import { ReadStream } from 'fs';

import { PostgresService } from 'src/core/postgres.service';
import { MapFileOutput } from './types';

@Injectable()
export class MapsService {
  constructor(private pg: PostgresService) {}
  async createAndSaveMap(
    readStream: ReadStream,
    mapFileName: string,
    token: string,
  ): Promise<MapFileOutput> {
    let fileBody: string;
    for await (const chunk of readStream) {
      if (!fileBody) {
        fileBody = chunk;
      } else {
        fileBody += chunk;
      }
    }
    let res;

    try {
      //TODO: make some abstraction on DB procedures call with errors handling
      res = await this.pg.pool.query(
        `
          call original_map_create($1,$2,$3, null,null)
        `,
        [mapFileName, fileBody, token],
      );
      console.log(
        'sql stored proc message: ',
        JSON.stringify(res.rows[0].p_error_type),
      );
    } catch (error) {
      console.log(`Caught error ${error}`);
    }

    return {
      map_file_name: mapFileName,
      original_map_id: res.rows[0].p_original_map_id,
    };
  }
}
