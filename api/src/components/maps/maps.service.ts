import { Injectable } from '@nestjs/common';
import { ReadStream } from 'fs';

import { PostgresService } from 'src/core/postgres.service';

@Injectable()
export class MapsService {
  constructor(private pg: PostgresService) {}
  async createAndSaveMap(
    readStream: ReadStream,
    mapFileName: string,
  ): Promise<MapMetadata> {
    console.log(`mapFileName: `, mapFileName);
    console.log(`readStream:`, readStream);

    let fileBody: string;

    readStream.on('data', (cunk) => {
      fileBody += cunk;
    });

    readStream.on('end', () => {
      console.log(`mapFileName:`, mapFileName, `fileBody: `, fileBody);
    });

    return {
      fileName: 'asdf',
      id: 'asdf',
    };
  }
}
