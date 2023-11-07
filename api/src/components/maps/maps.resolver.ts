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
import { ReTranslationService } from './maps-retranslation.service';

@Injectable()
@Resolver()
export class MapsResolver {
  constructor(
    private mapsService: MapsService,
    private reTranslationService: ReTranslationService,
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
    @Context() req: any,
    @Args({ name: 'file_size', type: () => Int })
    file_size?: number,
  ): Promise<MapUploadOutput> {
    console.log(`mapUpload resolver `, map_file_name);
    const bearer = getBearer(req) || '';
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

    let fileBody = '';
    const readStream = createReadStream();
    const filePormise = this.fileService.uploadFile(
      readStream,
      map_file_name,
      file_type,
      bearer,
      file_size,
    );
    for await (const chunk of readStream) {
      if (!fileBody) {
        fileBody = chunk;
      } else {
        fileBody += chunk;
      }
    }
    const uploadedContent = await filePormise;
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
      const savedMapId = await this.mapsService.saveNewMapInfo({
        content_file_id: String(uploadedContent.file.id),
        mapFileName: map_file_name,
        previewFileId: previewFileId!,
        token: bearer,
      });
      if (!savedMapId) {
        Logger.error(`mapsResolver#mapUpload: savedMapId is null`);
        return {
          error: ErrorType.MapSavingError,
          mapDetailsOutput: null,
        };
      }
      const { str: mapString, details: mapDetails } =
        await this.mapsService.getMapAsStringById(savedMapId);
      await this.mapsService.parseOrigMapAndSaveFoundWordsPhrases({
        mapString,
        mapDetails,
        token: bearer,
      });
      await this.mapsService.translateMapStringToAllLangsAndSaveTranslated({
        origMapString: mapString,
        origMapDetails: mapDetails,
        token: bearer,
      });
      return {
        error: ErrorType.NoError,
        mapDetailsOutput: {
          error: ErrorType.NoError,
          mapDetails: mapDetails,
        },
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
      await this.reTranslationService.mapReTranslate(userToken, forLangTag);
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
  async mapsReTranslateToLangs(
    @Context() req: any,
    @Args({ name: 'forLangTags', type: () => [String] })
    forLangTags: string[],
  ): Promise<GenericOutput> {
    console.log(`mapsReTranslate resolver `, forLangTags);
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
      for (let i = 0; i < forLangTags!.length; i++) {
        await this.reTranslationService.mapReTranslate(
          userToken,
          forLangTags[i]!,
        );
      }
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
    console.log(`getMapDetails resolver `, JSON.stringify(input));

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
    console.log(
      `getOrigMapWordsAndPhrases resolver `,
      JSON.stringify(input),
      first,
      after,
    );
    return this.mapsService.getOrigMapWordsAndPhrases({ input, first, after });
  }

  @Query(() => MapWordsAndPhrasesCountOutput)
  async getOrigMapWordsAndPhrasesCount(
    @Args('input') input: GetOrigMapWordsAndPhrasesInput,
  ): Promise<MapWordsAndPhrasesCountOutput | undefined> {
    console.log(
      `getOrigMapWordsAndPhrasesCount resolver `,
      JSON.stringify(input),
    );
    return this.mapsService.getOrigMapWordsAndPhrasesCount(input);
  }

  @Query(() => MapWordOrPhraseAsOrigOutput)
  async getMapWordOrPhraseAsOrigByDefinitionId(
    @Args('input') input: GetMapWordOrPhraseByDefinitionIdInput,
  ): Promise<MapWordOrPhraseAsOrigOutput | undefined> {
    console.log(
      `getMapWordOrPhraseAsOrigByDefinitionId resolver `,
      JSON.stringify(input),
    );
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
    console.log('mapVoteUpsert resolver: ', JSON.stringify(input));

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
    console.log(`startMapZipDownload`, JSON.stringify(input));
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
