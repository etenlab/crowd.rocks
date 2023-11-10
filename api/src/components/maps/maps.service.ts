import { Injectable, Inject, forwardRef, Logger } from '@nestjs/common';

import {
  MapListConnection,
  GetOrigMapsListOutput,
  MapDetailsOutput,
  MapPhraseWithTranslations,
  MapWordWithTranslations,
  MapDetailsOutputEdge,
  GetOrigMapWordsAndPhrasesInput,
  MapWordsAndPhrasesConnection,
  MapWordOrPhraseAsOrigOutput,
  GetMapWordOrPhraseByDefinitionIdInput,
  MapWordsAndPhrasesCountOutput,
  StartZipMapOutput,
  ZipMapResult,
  StartZipMapDownloadInput,
  MapDetailsInfo,
} from './types';
import { WordsService } from '../words/words.service';
import { MapsRepository } from './maps.repository';
import { WordUpsertInput } from '../words/types';
import {
  ErrorType,
  GenericOutput,
  LanguageInfo,
  SubscriptionStatus,
} from '../../common/types';
import { DEFAULT_NEW_MAP_LANGUAGE } from '../../common/const';
import { PostgresService } from '../../core/postgres.service';
import { WordDefinitionsService } from '../definitions/word-definitions.service';
import { PoolClient } from 'pg';
import { LanguageInput } from 'src/components/common/types';
import { PhraseUpsertInput } from '../phrases/types';
import { PhrasesService } from '../phrases/phrases.service';
import { PhraseDefinitionsService } from '../definitions/phrase-definitions.service';
import { downloadFile } from '../../common/utility';
import { FileService } from '../file/file.service';
import { PUB_SUB } from '../../pubSub.module';
import { PubSub } from 'graphql-subscriptions';
import { SubscriptionToken } from '../../common/subscription-token';
import * as temp from 'temp';
import * as path from 'path';
import { createReadStream } from 'fs';
import * as AdmZip from 'adm-zip';
import { subTags2Tag } from '../../../../utils';
import { MapsTranslationService } from './maps-translation.service';

const DEFAULT_MAP_WORD_DEFINITION = 'A geographical place';
const DEFAULT_MAP_PHRASE_DEFINITION = 'A geographical place phrase';
const ZIP_MIME_TYPE = 'application/zip';

export type MapTranslationResult = {
  translatedMap: string;
  translations: Array<{ source: string; translation: string }>;
};

interface IParseAndSaveNewMapParams {
  content_file_id: string;
  mapFileName: string;
  previewFileId?: string;
  mapLanguage?: LanguageInfo;
  token: string;
}
interface IParseOrigMapParams {
  mapString: string;
  mapDetails: MapDetailsInfo;
  token: string;
}
@Injectable()
export class MapsService {
  constructor(
    private pg: PostgresService,
    private mapsRepository: MapsRepository,
    private wordsService: WordsService,
    private phrasesService: PhrasesService,
    private phraseDefinitionsService: PhraseDefinitionsService,
    private wordDefinitionsService: WordDefinitionsService,
    private fileService: FileService,
    @Inject(forwardRef(() => MapsTranslationService))
    private mapTranslationsService: MapsTranslationService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  async saveNewMapInfo({
    content_file_id,
    mapFileName,
    previewFileId,
    mapLanguage = DEFAULT_NEW_MAP_LANGUAGE,
    token,
  }: IParseAndSaveNewMapParams): Promise<string | null> {
    const language_code = mapLanguage.lang.tag;
    const dialect_code = mapLanguage.dialect?.tag;
    const geo_code = mapLanguage.region?.tag;

    const dbPoolClient = await this.pg.pool.connect();
    try {
      const saveMapRes = await this.mapsRepository.saveOriginalMapTrn({
        mapFileName,
        content_file_id,
        previewFileId: previewFileId!,
        token,
        dbPoolClient,
        language_code,
        dialect_code: dialect_code || undefined,
        geo_code: geo_code || undefined,
      });
      if (!saveMapRes.map_id) {
        throw new Error(ErrorType.MapSavingError);
      }
      return saveMapRes.map_id;
    } catch (error) {
      Logger.error(`mapsService#saveNewMapInfo: ${JSON.stringify(error)}`);
      return null;
    } finally {
      dbPoolClient.release();
    }
  }

  async parseOrigMapAndSaveFoundWordsPhrases({
    mapString,
    mapDetails,
    token,
  }: IParseOrigMapParams): Promise<GenericOutput> {
    const dbPoolClient = await this.pg.pool.connect();
    try {
      const { language_code, dialect_code, geo_code } = mapDetails.language;
      const map_id = mapDetails.original_map_id;
      const { foundWords, foundPhrases } =
        this.mapTranslationsService.parseSvgMapString(mapString);

      //--save found words with definitions and original map boundng

      for (const word of foundWords) {
        const wordInput: WordUpsertInput = {
          wordlike_string: word,
          language_code,
          dialect_code,
          geo_code,
        };
        await this.saveOriginalMapWord(wordInput, map_id, token, dbPoolClient);
      }

      //--save found phrases and  bound them to original map

      for (const phrase of foundPhrases) {
        const phraseInput: PhraseUpsertInput = {
          phraselike_string: phrase,
          language_code,
          dialect_code,
          geo_code,
        };
        await this.saveOriginalMapPhrase(
          phraseInput,
          map_id,
          token,
          dbPoolClient,
        );
      }

      return {
        error: ErrorType.NoError,
      };
    } catch (e) {
      Logger.error(JSON.stringify(e));
      return {
        error: ErrorType.UnknownError,
      };
    } finally {
      dbPoolClient.release();
    }
  }

  async saveOriginalMapWord(
    wordInput: WordUpsertInput,
    map_id: string,
    token: string,
    dbPoolClient: PoolClient,
  ): Promise<string> {
    try {
      const savedWord = await this.wordsService.upsertInTrn(
        wordInput,
        token,
        dbPoolClient,
      );
      if (!savedWord.word_id) {
        throw new Error(
          `MapsService#parseAndSaveNewMap: 
          Error ${savedWord.error} with saving word ${JSON.stringify(
            wordInput,
          )}`,
        );
      }

      const savedDefinition = await this.wordDefinitionsService.upsertInTrn(
        {
          definition: DEFAULT_MAP_WORD_DEFINITION,
          word_id: savedWord.word_id,
        },
        token,
        dbPoolClient,
      );
      if (!savedDefinition.word_definition_id) {
        throw new Error(
          `MapsService#parseAndSaveNewMap: Error ${savedDefinition.error} with saving definition for word ${wordInput}`,
        );
      }

      await this.mapsRepository.saveOriginalMapWordInTrn(
        { word_id: savedWord.word_id, original_map_id: map_id },
        dbPoolClient,
      );

      return savedWord.word_id;
    } catch (e) {
      Logger.error(e);
      return '';
    }
  }

  async saveOriginalMapPhrase(
    phraseInput: PhraseUpsertInput,
    map_id: string,
    token: string,
    dbPoolClient: PoolClient,
  ): Promise<string> {
    try {
      const savedPhrase = await this.phrasesService.upsertInTrn(
        phraseInput,
        token,
        dbPoolClient,
      );
      if (!savedPhrase.phrase_id) {
        throw new Error(
          `MapsService#parseAndSaveNewMap: 
          Error ${savedPhrase.error} with saving word ${JSON.stringify(
            phraseInput,
          )}`,
        );
      }

      const savedPhraseDefinition =
        await this.phraseDefinitionsService.upsertInTrn(
          {
            definition: DEFAULT_MAP_PHRASE_DEFINITION,
            phrase_id: String(savedPhrase.phrase_id),
          },
          token,
          dbPoolClient,
        );
      if (!savedPhraseDefinition.phrase_definition_id) {
        throw new Error(
          `MapsService#parseAndSaveNewMap: 
          Error ${savedPhraseDefinition.error} 
          with saving definition for phrase ${JSON.stringify(phraseInput)}`,
        );
      }

      await this.mapsRepository.saveOriginalMapPhraseInTrn(
        { phrase_id: String(savedPhrase.phrase_id), original_map_id: map_id },
        dbPoolClient,
      );

      return String(savedPhrase.phrase_id);
    } catch (e) {
      Logger.error(e);
      return '';
    }
  }

  async getOrigMaps(): Promise<GetOrigMapsListOutput> {
    try {
      return this.mapsRepository.getOrigMaps();
    } catch (e) {
      Logger.error(e);
      return {
        mapList: [],
      };
    }
  }

  async getAllMapsList({
    lang,
    first,
    after,
  }: {
    lang?: LanguageInput;
    first: number | null;
    after: string | null;
  }): Promise<MapListConnection> {
    try {
      const origMaps = await this.mapsRepository.getOrigMaps(lang);
      const translatedMaps = await this.mapsRepository.getTranslatedMaps({
        lang,
      });

      const origIdMap = new Map<string, boolean>();

      origMaps.mapList.forEach((item) =>
        item.mapDetails
          ? origIdMap.set(item.mapDetails.original_map_id, true)
          : null,
      );

      const allMapsList = [
        ...origMaps.mapList.filter((item) => item.mapDetails),
        ...translatedMaps.mapList
          .filter((item) => item.mapDetails)
          .filter((item) =>
            origIdMap.get(item.mapDetails!.original_map_id) ? false : true,
          ),
      ].sort((map1, map2) =>
        map1.mapDetails!.map_file_name_with_langs.localeCompare(
          map2.mapDetails!.map_file_name_with_langs,
        ),
      );

      let offset: number | null = null;
      let hasNextPage = true;
      let startCursor: string | null = null;
      let endCursor: string | null = null;

      const mapDetailsOutputEdge: MapDetailsOutputEdge[] = [];

      const makeCursorStr = (id: string, is_original: boolean) => {
        return `${id}-${is_original ? 'true' : 'false'}`;
      };

      for (let i = 0; i < allMapsList.length; i++) {
        const tempMap = allMapsList[i];
        const tempCursor = makeCursorStr(
          tempMap.mapDetails?.is_original
            ? tempMap.mapDetails!.original_map_id
            : tempMap.mapDetails!.translated_map_id!,
          tempMap.mapDetails!.is_original,
        );

        if (after === null && offset === null) {
          offset = 0;
        }

        if (tempCursor !== after && offset === null) {
          continue;
        }

        if (tempCursor === after && offset === null) {
          offset = 0;
          continue;
        }

        if (offset === 0) {
          startCursor = tempCursor;
        }

        if (first !== null && offset! >= first) {
          hasNextPage = true;
          break;
        }

        mapDetailsOutputEdge.push({
          cursor: tempCursor,
          node: tempMap,
        });

        endCursor = tempCursor;
        offset!++;
      }

      return {
        edges: mapDetailsOutputEdge,
        pageInfo: {
          hasNextPage,
          hasPreviousPage: false,
          startCursor,
          endCursor,
          totalEdges: allMapsList.length,
        },
      };
    } catch (e) {
      console.error(e);
    }

    return {
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      },
    };
  }

  async getOrigMapWithContentUrl(id: string): Promise<MapDetailsOutput> {
    try {
      return this.mapsRepository.getOrigMapWithContentUrl(id);
    } catch (e) {
      Logger.error(e);
      return {
        error: ErrorType.UnknownError,
        mapDetails: null,
      };
    }
  }

  async getTranslatedMapWithContentUrl(id: string): Promise<MapDetailsOutput> {
    try {
      const mapDetails =
        await this.mapsRepository.getTranslatedMapWithContentUrl(id);
      return mapDetails;
    } catch (e) {
      Logger.error(e);
      return {
        error: ErrorType.UnknownError,
        mapDetails: null,
      };
    }
  }

  async getOrigMapWordsAndPhrases(params: {
    input: GetOrigMapWordsAndPhrasesInput;
    first?: number | null;
    after?: string | null;
  }): Promise<MapWordsAndPhrasesConnection | undefined> {
    const dbPoolClient = await this.pg.pool.connect();
    try {
      const res = this.mapsRepository.getOrigMapWordsAndPhrases(
        dbPoolClient,
        params,
      );
      return res;
    } catch (e) {
      Logger.error(`mapsService#getOrigMapWordsAndPhrases: ${e}`);
      return {
        edges: [],
        pageInfo: {
          endCursor: null,
          startCursor: null,
          totalEdges: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
        error: ErrorType.MapWordsAndPhrasesSearchError,
      };
    } finally {
      dbPoolClient.release();
    }
  }

  async getOrigMapWordsAndPhrasesCount(
    params: GetOrigMapWordsAndPhrasesInput,
  ): Promise<MapWordsAndPhrasesCountOutput> {
    const dbPoolClient = await this.pg.pool.connect();
    try {
      const res = this.mapsRepository.getOrigMapWordsAndPhrasesCount(
        dbPoolClient,
        params,
      );
      return res;
    } catch (e) {
      Logger.error(`mapsService#getOrigMapWordsAndPhrases: ${e}`);
      return {
        count: null,
        error: ErrorType.PaginationError,
      };
    } finally {
      dbPoolClient.release();
    }
  }

  async getMapWordOrPhraseUnionByDefinitionId({
    definition_id,
    is_word_definition,
  }: GetMapWordOrPhraseByDefinitionIdInput): Promise<MapWordOrPhraseAsOrigOutput> {
    try {
      if (is_word_definition) {
        const word = await this.wordsService.getWordByDefinitionId(
          definition_id,
          null,
        );
        if (!word)
          return {
            error: ErrorType.WordNotFound,
            wordOrPhrase: null,
          };
        return {
          error: ErrorType.NoError,
          wordOrPhrase: word,
        };
      } else {
        const phrase = await this.phrasesService.getPhraseByDefinitionId(
          definition_id,
          null,
        );
        if (!phrase)
          return {
            error: ErrorType.PhraseNotFound,
            wordOrPhrase: null,
          };
        return {
          error: ErrorType.NoError,
          wordOrPhrase: phrase,
        };
      }
    } catch (e) {
      Logger.error(e);
      return {
        error: ErrorType.UnknownError,
        wordOrPhrase: null,
      };
    }
  }

  async deleteMap(mapId: string, is_original: boolean): Promise<string> {
    try {
      return is_original
        ? await this.deleteOriginalMap(mapId)
        : await this.deleteTranslatedMap(mapId);
    } catch (e) {
      Logger.error(e);
      return '';
    }
  }

  async deleteOriginalMap(mapId: string): Promise<string> {
    try {
      const mapInfo = await this.mapsRepository.getOrigMapWithContentUrl(mapId);
      const translatedMaps = await this.mapsRepository.getTranslatedMaps({
        originalMapId: Number(mapId),
      });

      for (const translatedMap of translatedMaps.mapList) {
        translatedMap.mapDetails?.translated_map_id &&
          (await this.deleteTranslatedMap(
            translatedMap.mapDetails.translated_map_id,
          ));
      }

      const deletedMapId = await this.mapsRepository.deleteOriginalMap(mapId);
      mapInfo.mapDetails?.preview_file_id &&
        (await this.fileService.deleteFile(mapInfo.mapDetails.preview_file_id));
      mapInfo.mapDetails?.content_file_id &&
        (await this.fileService.deleteFile(mapInfo.mapDetails.content_file_id));
      return deletedMapId;
    } catch (e) {
      Logger.error(e);
      return '';
    }
  }

  async deleteTranslatedMap(mapId: string): Promise<string> {
    try {
      const mapInfo = await this.mapsRepository.getTranslatedMapWithContentUrl(
        mapId,
      );
      const deletedMapId = await this.mapsRepository.deleteTranslatedMap(mapId);
      mapInfo.mapDetails?.content_file_id &&
        (await this.fileService.deleteFile(mapInfo.mapDetails.content_file_id));
      return deletedMapId;
    } catch (e) {
      Logger.error(e);
      return '';
    }
  }

  /**
   * @deprecated
   */
  getLangFullTags(
    wordsOrPhrases: Array<MapWordWithTranslations | MapPhraseWithTranslations>,
  ): Array<string> {
    const foundLangs: Array<string> = [];
    wordsOrPhrases.forEach((wordOrPhrase) => {
      wordOrPhrase.translations!.forEach((tr) => {
        if (!tr.language_code)
          throw new Error(
            `word or phrase translation id ${JSON.stringify(
              tr,
            )} does't have language tag`,
          );
        const currTag = subTags2Tag({
          lang: tr.language_code,
          region: tr.geo_code || undefined,
          dialect: tr.dialect_code || undefined,
        });
        if (foundLangs.findIndex((fl) => fl === currTag) < 0) {
          foundLangs.push(currTag);
        }
      });
    });
    return foundLangs;
  }

  async startZipMap(
    input: StartZipMapDownloadInput,
  ): Promise<StartZipMapOutput> {
    try {
      console.log('startZipMap subscription input: ', JSON.stringify(input));
      this.pubSub.publish(SubscriptionToken.ZipMapReport, {
        [SubscriptionToken.ZipMapReport]: {
          resultZipUrl: null,
          status: SubscriptionStatus.Progressing,
          errors: [],
          message: 'Started maps downloading and packing',
        } as ZipMapResult,
      });
      const maps = await this.getAllMapsList({
        lang: input.language,
        after: null,
        first: null,
      });

      if (!(maps.edges.length > 0)) {
        throw new Error(ErrorType.MapNotFound);
      }

      const fileDownloadsPromises: any[] = [];
      const fileNames: string[] = [];
      temp.track();
      const dirPath = temp.mkdirSync('map_zip');
      if (!dirPath) {
        Logger.error(`mapsService#startZipMap: can't create temporary folder`);
        throw new Error(ErrorType.MapZippingError);
      }
      for (const { node: map } of maps.edges) {
        if (!map.mapDetails?.map_file_name_with_langs) {
          Logger.error(
            `mapsService#startZipMap: map_file_name_with_langs not found for map ${JSON.stringify(
              map,
            )}`,
          );
          continue;
        }
        this.pubSub.publish(SubscriptionToken.ZipMapReport, {
          [SubscriptionToken.ZipMapReport]: {
            resultZipUrl: null,
            status: SubscriptionStatus.Progressing,
            errors: [],
            message: `Processing ${map.mapDetails?.map_file_name_with_langs}`,
          } as ZipMapResult,
        });
        const fileNameFull = path.resolve(
          dirPath,
          map.mapDetails?.map_file_name_with_langs,
        );
        fileDownloadsPromises.push(
          downloadFile(map.mapDetails?.content_file_url, fileNameFull),
        );
        fileNames.push(fileNameFull);
      }
      await Promise.all(fileDownloadsPromises);
      const zipFileName = `maps-${input.language.language_code}-${
        new Date().getMonth() + 1
      }-${new Date().getDate()}.zip`;
      this.pubSub.publish(SubscriptionToken.ZipMapReport, {
        [SubscriptionToken.ZipMapReport]: {
          resultZipUrl: null,
          status: SubscriptionStatus.Progressing,
          errors: [],
          message: `Creating zip file ${zipFileName}`,
        } as ZipMapResult,
      });

      const zip = new AdmZip();
      zip.addLocalFolder(dirPath);
      zip.writeZip(path.resolve(dirPath, zipFileName));
      const tempFile = await this.fileService.uploadTemporaryFile(
        createReadStream(path.resolve(dirPath, zipFileName)),
        zipFileName,
        ZIP_MIME_TYPE,
      );
      this.pubSub.publish(SubscriptionToken.ZipMapReport, {
        [SubscriptionToken.ZipMapReport]: {
          resultZipUrl: tempFile,
          status: SubscriptionStatus.Completed,
          errors: [],
          message: `Zip file creation completed`,
        } as ZipMapResult,
      });
      return { error: ErrorType.NoError };
    } catch (error) {
      Logger.error(error);
      return { error };
    } finally {
      temp.cleanup();
    }
  }

  async getMapAsStringById(
    map_id: string,
  ): Promise<{ str: string; details: MapDetailsInfo }> {
    const mapDetatilsOutput =
      await this.mapsRepository.getOrigMapWithContentUrl(map_id);
    if (
      !mapDetatilsOutput?.mapDetails?.original_map_id ||
      !mapDetatilsOutput?.mapDetails?.content_file_id
    ) {
      throw new Error(
        `mapsService#getMapAsStringById: original_map_id or content_file_id not found. ${JSON.stringify(
          mapDetatilsOutput,
        )}`,
      );
    }
    const str = await this.fileService.getFileContentAsString(
      mapDetatilsOutput.mapDetails.content_file_id,
    );
    if (!str) {
      throw new Error(
        `mapsService#getMapAsStringById: can't get map string from map file`,
      );
    }
    return { str, details: mapDetatilsOutput.mapDetails };
  }

  async getTranslatedMaps({
    lang,
    originalMapId,
  }: {
    lang?: LanguageInput | undefined;
    originalMapId?: number | undefined;
  }): Promise<GetOrigMapsListOutput> {
    return this.mapsRepository.getTranslatedMaps({
      lang,
      originalMapId,
    });
  }
}
