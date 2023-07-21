import { Injectable } from '@nestjs/common';
import { Args, Resolver, Mutation, Int } from '@nestjs/graphql';

import { MapsService } from './maps.service';

import { TMapFile } from './gqlTypes';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';

@Injectable()
@Resolver(Map)
export class MapsResolver {
  constructor(private mapService: MapsService) {}

  @Mutation(() => TMapFile)
  async mapUpload(
    @Args({ name: 'mapFile', type: () => GraphQLUpload })
    { createReadStream, filename: map_file_name }: FileUpload,
  ): Promise<MapMetadata> {
    const map = await this.mapService.createAndSaveMap(
      createReadStream(),
      map_file_name,
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
