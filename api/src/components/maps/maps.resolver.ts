import { Injectable } from '@nestjs/common';
import { Args, Resolver, Mutation, Int, Context } from '@nestjs/graphql';

import { MapsService } from './maps.service';

import { getBearer } from '../../common/utility';
import { MapFileInput, MapFileOutput } from './types';

@Injectable()
@Resolver(Map)
export class MapsResolver {
  constructor(private mapService: MapsService) {}

  @Mutation(() => MapFileOutput)
  async mapUpload(
    @Args('input') input: MapFileInput,
    @Context() req: any,
  ): Promise<MapFileOutput> {
    const { createReadStream, filename: map_file_name } = input.mapFile;
    const map = await this.mapService.createAndSaveMap(
      createReadStream(),
      map_file_name,
      getBearer(req),
    );
    return map;
  }

  // @Mutation(() => TMapFile)
  // async mapUpdate(
  //   @Args({ name: 'file', type: () => GraphQLUpload })
  //   { createReadStream, filename: file_name }: FileUpload,
  //   @Args({ name: 'id', type: () => Int }) id: number,
  // ): Promise<File> {
  //   const file = await this.mapService.updateMapContent(
  //     createReadStream(),
  //     id,
  //     file_name,
  //   );
  //   return file;
  // }
}
