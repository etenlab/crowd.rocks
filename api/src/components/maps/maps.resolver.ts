import { Injectable } from '@nestjs/common';
import { Args, Resolver, Mutation, Query, Context } from '@nestjs/graphql';

import { MapsService } from './maps.service';

import { getBearer } from '../../common/utility';
import {
  GetOrigMapContentInput,
  GetOrigMapContentOutput,
  GetOrigMapListInput,
  GetOrigMapsListOutput,
  GetOrigMapWordsInput,
  GetOrigMapWordsOutput,
  MapFileOutput,
} from './types';
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

    const map = await this.mapService.parseAndSaveNewMap({
      readStream: createReadStream(),
      mapFileName: map_file_name,
      token: userToken,
    });
    return map;
  }

  @Query(() => GetOrigMapsListOutput)
  async getOrigMapsList(
    @Args('input') input: GetOrigMapListInput,
  ): Promise<GetOrigMapsListOutput> {
    // TODO: refactor auth system. existing sysyem via passing token to sql proc is unconvinient
    // when no need in sql proc (request too small - just single-line select)

    // TODO: search by pattern
    // console.log(input.search);

    const maps = await this.mapService.getOrigMaps();
    return maps;
  }

  @Query(() => GetOrigMapContentOutput)
  async getOrigMapContent(
    @Args('input') input: GetOrigMapContentInput,
  ): Promise<GetOrigMapContentOutput> {
    // TODO: refactor auth system. existing sysyem via passing token to sql proc is unconvinient
    // when no need in sql proc (request too small - just single-line select)

    const mapContent = await this.mapService.getOrigMapContent(
      input.original_map_id,
    );
    return mapContent;
  }

  @Query(() => GetOrigMapWordsOutput)
  async getOrigMapWords(
    @Args('input') input: GetOrigMapWordsInput,
  ): Promise<GetOrigMapWordsOutput> {
    const words = await this.mapService.getOrigMapWords(input.original_map_id);
    return words;
  }
}
