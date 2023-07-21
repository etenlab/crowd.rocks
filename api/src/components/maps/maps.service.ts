import { Injectable } from '@nestjs/common';

import { PostgresService } from 'src/core/postgres.service';

@Injectable()
export class MapsService {
  constructor(private pg: PostgresService) {}
  async createAndSaveMap(
    readStream: ReadStream,
    mapFileName: string,
  ): Promise<MapMetadata> {}
}
