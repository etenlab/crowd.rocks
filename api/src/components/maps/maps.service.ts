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
    console.log(`mapFileName: `, mapFileName);
    console.log(`readStream:`, readStream);
    console.log(`token:`, token);

    let fileBody: string;

    readStream.on('data', (cunk) => {
      fileBody += cunk;
    });

    readStream.on('end', () => {
      console.log(`mapFileName:`, mapFileName, `fileBody: `, fileBody);
    });

    return {
      map_file_name: 'asdf',
      original_map_id: 'asdf',
    };
  }
}
