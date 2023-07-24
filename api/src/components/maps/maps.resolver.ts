import { Injectable } from '@nestjs/common';
import { Args, Resolver, Mutation, Query, Context } from '@nestjs/graphql';

import { MapsService } from './maps.service';

import { getBearer } from '../../common/utility';
import { GetOrigMapsListOutput, MapFileOutput } from './types';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable()
@Resolver(Map)
export class MapsResolver {
  constructor(
    private mapService: MapsService,
    private authenticationService: AuthenticationService,
  ) {}

  @Mutation(() => MapFileOutput)
  async mapUpload(
    @Args({ name: 'file', type: () => GraphQLUpload })
    { createReadStream, filename: map_file_name }: FileUpload,
    @Context() req: any,
  ): Promise<MapFileOutput> {
    // const userToken = getBearer(req);
    console.log(
      `request bearer token: `,
      getBearer(req),
      ` but temporary using mocked admin token`,
    );
    const userToken = await this.authenticationService.getAdminToken();

    const map = await this.mapService.createAndSaveMap(
      createReadStream(),
      map_file_name,
      userToken,
    );
    return map;
  }

  @Query(() => GetOrigMapsListOutput)
  async getOrigMapsList(): Promise<GetOrigMapsListOutput> {
    // TODO: make global auth system. existing sysyem via passing token to sql proc is unconvinient
    // when no need in sql proc (request too small - just single-line select)

    const maps = await this.mapService.getOrigMaps();
    return maps;
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
