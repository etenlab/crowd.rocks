import { Injectable } from '@nestjs/common';
import { Args, Resolver, Mutation, Query, Context } from '@nestjs/graphql';

import { MapsService } from './maps.service';

import { getBearer } from '../../common/utility';
import {
  GetAllMapsListInput,
  GetAllMapsListOutput,
  GetOrigMapContentInput,
  GetOrigMapContentOutput,
  GetOrigMapListInput,
  GetOrigMapPhrasesInput,
  GetOrigMapPhrasesOutput,
  GetOrigMapsListOutput,
  GetOrigMapWordsInput,
  GetOrigMapWordsOutput,
  GetTranslatedMapContentInput,
  GetTranslatedMapContentOutput,
  MapDeleteInput,
  MapDeleteOutput,
  MapUploadOutput,
} from './types';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { AuthenticationService } from '../authentication/authentication.service';
import { ErrorType, GenericOutput } from 'src/common/types';

@Injectable()
@Resolver(Map) // todo: wtf with paramenter, looks like `Map` is wrong and redundant here.
export class MapsResolver {
  constructor(
    private mapService: MapsService,
    private authenticationService: AuthenticationService,
  ) {}

  @Mutation(() => MapUploadOutput)
  async mapUpload(
    @Args({ name: 'file', type: () => GraphQLUpload })
    { createReadStream, filename: map_file_name }: FileUpload,
    @Args({ name: 'previewFileId', type: () => String, nullable: true })
    previewFileId: string | undefined | null,
    @Context() req: any,
  ): Promise<MapUploadOutput> {
    const bearer = getBearer(req) || '';
    let fileBody = '';
    for await (const chunk of createReadStream()) {
      if (!fileBody) {
        fileBody = chunk;
      } else {
        fileBody += chunk;
      }
    }

    const user_id = await this.authenticationService.get_user_id_from_bearer(
      bearer,
    );
    const admin_id = await this.authenticationService.get_admin_id();
    if (admin_id !== user_id) {
      return {
        error: ErrorType.Unauthorized,
        mapFileOutput: null,
      };
    }
    try {
      const map = await this.mapService.saveAndParseNewMap({
        fileBody,
        mapFileName: map_file_name,
        previewFileId: previewFileId!,
        token: bearer,
      });
      await this.mapService.translateOrigMapsByIds(
        [map.original_map_id],
        bearer,
      );
      return {
        error: ErrorType.NoError,
        mapFileOutput: map,
      };
    } catch (error) {
      return {
        error: error,
        mapFileOutput: null,
      };
    }
  }

  @Mutation(() => MapDeleteOutput)
  async mapDelete(
    @Args('input') { mapId, is_original }: MapDeleteInput,
    @Context() req: any,
  ): Promise<MapDeleteOutput> {
    const userToken = getBearer(req) || '';
    const user_id = await this.authenticationService.get_user_id_from_bearer(
      userToken,
    );
    const admin_id = await this.authenticationService.get_admin_id();
    if (admin_id !== user_id) {
      return {
        deletedMapId: null,
        error: ErrorType.Unauthorized,
      };
    }
    try {
      const deletedMapId = await this.mapService.deleteMap(mapId, is_original);

      return {
        deletedMapId,
        error: ErrorType.NoError,
      };
    } catch (error) {
      return {
        deletedMapId: null,
        error: error,
      };
    }
  }

  @Mutation(() => GenericOutput)
  async mapsTranslationsReset(@Context() req: any): Promise<GenericOutput> {
    const userToken = getBearer(req);
    const user_id = await this.authenticationService.get_user_id_from_bearer(
      userToken || '',
    );
    const admin_id = await this.authenticationService.get_admin_id();
    if (admin_id !== user_id) {
      return {
        error: ErrorType.Unauthorized,
      };
    }
    try {
      await this.mapService.translationsReset(userToken);
      return {
        error: ErrorType.NoError,
      };
    } catch (error) {
      return {
        error: error,
      };
    }
  }

  @Mutation(() => GenericOutput)
  async mapsReTranslate(
    @Context() req: any,
    @Args({ name: 'forLangTag', type: () => String, nullable: true })
    forLangTag?: string,
  ): Promise<GenericOutput> {
    const userToken = getBearer(req) || '';
    const user_id = await this.authenticationService.get_user_id_from_bearer(
      userToken,
    );
    const admin_id = await this.authenticationService.get_admin_id();
    if (admin_id !== user_id) {
      return {
        error: ErrorType.Unauthorized,
      };
    }
    try {
      await this.mapService.reTranslate(userToken, forLangTag!);
      return {
        error: ErrorType.NoError,
      };
    } catch (error) {
      return {
        error: error,
      };
    }
  }

  @Query(() => GetOrigMapsListOutput)
  async getOrigMapsList(
    @Args('input') input: GetOrigMapListInput,
  ): Promise<GetOrigMapsListOutput> {
    const maps = await this.mapService.getOrigMaps();
    return maps;
  }

  @Query(() => GetAllMapsListOutput)
  async getAllMapsList(
    @Args('input') input: GetAllMapsListInput,
  ): Promise<GetAllMapsListOutput> {
    const maps = await this.mapService.getAllMapsList(input.lang);
    return maps;
  }

  @Query(() => GetOrigMapContentOutput)
  async getOrigMapContent(
    @Args('input') input: GetOrigMapContentInput,
  ): Promise<GetOrigMapContentOutput> {
    const mapContent = await this.mapService.getOrigMapContent(
      input.original_map_id,
    );
    return mapContent;
  }

  @Query(() => GetTranslatedMapContentOutput)
  async getTranslatedMapContent(
    @Args('input') input: GetTranslatedMapContentInput,
  ): Promise<GetTranslatedMapContentOutput> {
    const mapContent = await this.mapService.getTranslatedMapContent(
      input.translated_map_id,
    );
    return mapContent;
  }

  @Query(() => GetOrigMapWordsOutput)
  async getOrigMapWords(
    @Args('input', { nullable: true }) input?: GetOrigMapWordsInput,
  ): Promise<GetOrigMapWordsOutput> {
    const words = await this.mapService.getOrigMapWords(input!);

    return words;
  }

  @Query(() => GetOrigMapPhrasesOutput)
  async getOrigMapPhrases(
    @Args('input', { nullable: true }) input?: GetOrigMapPhrasesInput,
  ): Promise<GetOrigMapPhrasesOutput> {
    const origMapPhraseTranslations = await this.mapService.getOrigMapPhrases(
      input!,
    );
    return origMapPhraseTranslations;
  }
}
