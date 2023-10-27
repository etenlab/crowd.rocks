import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  Args,
  Resolver,
  Mutation,
  Query,
  Context,
  Int,
  ID,
  Subscription,
} from '@nestjs/graphql';

import { MapsService } from './maps.service';

import { getBearer } from '../../common/utility';
import {
  GetAllMapsListInput,
  MapListConnection,
  GetOrigMapListInput,
  GetOrigMapsListOutput,
  MapDeleteInput,
  MapDeleteOutput,
  MapUploadOutput,
  MapDetailsOutput,
  GetMapDetailsInput,
  GetOrigMapWordsAndPhrasesInput,
  MapWordsAndPhrasesConnection,
  MapWordOrPhraseAsOrigOutput,
  GetMapWordOrPhraseByDefinitionIdInput,
  MapVoteOutput,
  MapVoteUpsertInput,
  MapVoteStatusOutputRow,
  MapWordsAndPhrasesCountOutput,
  OrigMapWordsAndPhrasesOutput,
  StartZipMapOutput,
  ZipMapResult,
  StartZipMapDownloadInput,
} from './types';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { AuthenticationService } from '../authentication/authentication.service';
import { ErrorType, GenericOutput } from 'src/common/types';
import { FileService } from '../file/file.service';
import { MapVotesService } from './map-votes.service';
import { PUB_SUB } from '../../pubSub.module';
import { PubSub } from 'graphql-subscriptions';
import { SubscriptionToken } from '../../common/subscription-token';

@Injectable()
@Resolver(Map) // todo: wtf with paramenter, looks like `Map` is wrong and redundant here.
export class MapsResolver {
  constructor(
    private mapsService: MapsService,
    private mapVotesService: MapVotesService,
    private authenticationService: AuthenticationService,
    private fileService: FileService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Mutation(() => MapUploadOutput)
  async mapUpload(
    @Args({ name: 'file', type: () => GraphQLUpload })
    { createReadStream, filename: map_file_name }: FileUpload,
    @Args({ name: 'previewFileId', type: () => String, nullable: true })
    previewFileId: string | undefined | null,
    @Args({ name: 'file_type', type: () => String })
    file_type: string,
    @Args({ name: 'file_size', type: () => Int })
    file_size: number,
    @Context() req: any,
  ): Promise<MapUploadOutput> {
    console.log(`mapUpload resolver `, map_file_name);
    const bearer = getBearer(req) || '';
    let fileBody = '';
    const readStream = createReadStream();
    const filePormise = this.fileService.uploadFile(
      readStream,
      map_file_name,
      file_type,
      file_size,
      bearer,
    );
    for await (const chunk of readStream) {
      if (!fileBody) {
        fileBody = chunk;
      } else {
        fileBody += chunk;
      }
    }
    const uploadedContent = await filePormise;

    const user_id = await this.authenticationService.get_user_id_from_bearer(
      bearer,
    );
    const admin_id = await this.authenticationService.get_admin_id();
    if (admin_id !== user_id) {
      return {
        error: ErrorType.Unauthorized,
        mapDetailsOutput: null,
      };
    }
    if (!uploadedContent?.file?.fileUrl) {
      return {
        error: ErrorType.FileSaveFailed,
        mapDetailsOutput: null,
      };
    }
    if (isNaN(Number(uploadedContent.file.id))) {
      return {
        error: ErrorType.FileSaveFailed,
        mapDetailsOutput: null,
      };
    }
    try {
      const savedParsedMap = await this.mapsService.saveAndParseNewMap({
        content_file_id: String(uploadedContent.file.id),
        mapFileName: map_file_name,
        previewFileId: previewFileId!,
        token: bearer,
      });
      if (!savedParsedMap.mapDetails?.original_map_id) {
        Logger.error(
          `mapsResolver#mapUpload: savedParsedMap.mapDetails?.original_map_id is falsy`,
        );
        throw new Error(ErrorType.MapNotFound);
      }
      await this.mapsService.translateOrigMapsByIds(
        [savedParsedMap.mapDetails.original_map_id],
        bearer,
      );
      return {
        error: ErrorType.NoError,
        mapDetailsOutput: savedParsedMap,
      };
    } catch (error) {
      return {
        error: error,
        mapDetailsOutput: null,
      };
    }
  }

  @Mutation(() => MapDeleteOutput)
  async mapDelete(
    @Args('input') { mapId, is_original }: MapDeleteInput,
    @Context() req: any,
  ): Promise<MapDeleteOutput> {
    console.log(`mapDelete resolver `, mapId, is_original);
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
      const deletedMapId = await this.mapsService.deleteMap(mapId, is_original);

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
    console.log(`mapDelete resolver `);
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
      await this.mapsService.translationsReset(userToken);
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
    console.log(`mapsReTranslate resolver `, forLangTag);
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
      await this.mapsService.reTranslate(userToken, forLangTag!);
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Args('input') input: GetOrigMapListInput,
  ): Promise<GetOrigMapsListOutput> {
    console.log(`getOrigMapsList resolver `);
    const maps = await this.mapsService.getOrigMaps();
    return maps;
  }

  @Query(() => MapListConnection)
  async getAllMapsList(
    @Args('input') input: GetAllMapsListInput,
    @Args('first', { type: () => Int, nullable: true }) first: number | null,
    @Args('after', { type: () => ID, nullable: true }) after: string | null,
  ): Promise<MapListConnection> {
    console.log(
      `getAllMapsList resolver `,
      JSON.stringify(input),
      first,
      after,
    );
    return this.mapsService.getAllMapsList({
      lang: input.lang,
      first,
      after,
    });
  }

  @Query(() => MapDetailsOutput)
  async getMapDetails(
    @Args('input') input: GetMapDetailsInput,
  ): Promise<MapDetailsOutput> {
    console.log(`getMapDetails resolver `, input);

    return input.is_original
      ? this.mapsService.getOrigMapWithContentUrl(input.map_id)
      : this.mapsService.getTranslatedMapWithContentUrl(input.map_id);
  }

  @Query(() => MapWordsAndPhrasesConnection)
  async getOrigMapWordsAndPhrases(
    @Args('input') input: GetOrigMapWordsAndPhrasesInput,
    @Args('first', { type: () => Int, nullable: true }) first?: number | null,
    @Args('after', { type: () => ID, nullable: true })
    after?: string | null,
  ): Promise<MapWordsAndPhrasesConnection | undefined> {
    console.log(`getOrigMapWordsAndPhrases resolver `, input, first, after);
    return this.mapsService.getOrigMapWordsAndPhrases({ input, first, after });
  }

  @Query(() => MapWordsAndPhrasesCountOutput)
  async getOrigMapWordsAndPhrasesCount(
    @Args('input') input: GetOrigMapWordsAndPhrasesInput,
  ): Promise<MapWordsAndPhrasesCountOutput | undefined> {
    console.log(`getOrigMapWordsAndPhrasesCount resolver `, input);
    return this.mapsService.getOrigMapWordsAndPhrasesCount(input);
  }

  @Query(() => OrigMapWordsAndPhrasesOutput)
  async getOrigMapWordsAndPhrasesPaginated(
    @Args('input') input: GetOrigMapWordsAndPhrasesInput,
    @Args('offset', { type: () => Int, nullable: true }) offset?: number | null,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number | null,
  ): Promise<OrigMapWordsAndPhrasesOutput | undefined> {
    console.log(
      `getOrigMapWordsAndPhrasesPaginated resolver `,
      input,
      offset,
      limit,
    );
    return this.mapsService.getOrigMapWordsAndPhrasesPaginated(
      input,
      offset,
      limit,
    );
  }

  @Query(() => MapWordOrPhraseAsOrigOutput)
  async getMapWordOrPhraseAsOrigByDefinitionId(
    @Args('input') input: GetMapWordOrPhraseByDefinitionIdInput,
  ): Promise<MapWordOrPhraseAsOrigOutput | undefined> {
    console.log(`getMapWordOrPhraseAsOrigByDefinitionId resolver `, input);
    return this.mapsService.getMapWordOrPhraseUnionByDefinitionId(input);
  }

  ///////////////////////////////////////////////
  ///////////// MAP VOTING //////////////////////
  ///////////////////////////////////////////////

  @Mutation(() => MapVoteOutput)
  async mapVoteUpsert(
    @Args('input') input: MapVoteUpsertInput,
    @Context() req: any,
  ): Promise<MapVoteOutput> {
    console.log('mapVoteUpsert resolver: ', input);

    return this.mapVotesService.upsert(input, getBearer(req)! || '', null);
  }

  @Query(() => MapVoteStatusOutputRow)
  async getMapVoteStatus(
    @Args('map_id', { type: () => ID }) map_id: string,
    @Args('is_original', { type: () => Boolean }) is_original: boolean,
  ): Promise<MapVoteStatusOutputRow> {
    console.log('getMapVoteStatus resolver, map_id:', map_id, is_original);

    return this.mapVotesService.getVoteStatus(+map_id, is_original, null);
  }

  @Mutation(() => MapVoteStatusOutputRow)
  async toggleMapVoteStatus(
    @Args('map_id', { type: () => ID }) map_id: string,
    @Args('is_original', { type: () => Boolean }) is_original: boolean,
    @Args('vote', { type: () => Boolean }) vote: boolean,
    @Context() req: any,
  ): Promise<MapVoteStatusOutputRow> {
    console.log(`toggleMapVoteStatus resolver`, map_id, is_original, vote);

    return this.mapVotesService.toggleVoteStatus(
      +map_id,
      is_original,
      vote,
      getBearer(req)! || '',
      null,
    );
  }

  @Mutation(() => StartZipMapOutput)
  async startZipMapDownload(
    @Args('input', { type: () => StartZipMapDownloadInput })
    input: StartZipMapDownloadInput,
  ): Promise<StartZipMapOutput> {
    console.log(`startMapZipDownload`, input);
    return this.mapsService.startZipMap(input);
  }

  @Subscription(() => ZipMapResult, {
    name: SubscriptionToken.ZipMapReport,
  })
  async subscribeToZipMap() {
    console.log('subscribeToZipMap');
    return this.pubSub.asyncIterator(SubscriptionToken.ZipMapReport);
  }
}
