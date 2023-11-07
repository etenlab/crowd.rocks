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
  OrigMapWordsAndPhrasesOutput,
  StartZipMapOutput,
  ZipMapResult,
  StartZipMapDownloadInput,
  MapDetailsInfo,
} from './types';
import { type INode } from 'svgson';
import { parseSync as readSvg, stringify } from 'svgson';
import { WordsService } from '../words/words.service';
import {
  MapsRepository,
  MapTrOfWordOrPhrase,
  MapTrWordsPhrases,
} from './maps.repository';
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
import { WordToWordTranslationsService } from '../translations/word-to-word-translations.service';
import { LanguageInput } from 'src/components/common/types';
import { PhraseUpsertInput } from '../phrases/types';
import { PhrasesService } from '../phrases/phrases.service';
import { PhraseDefinitionsService } from '../definitions/phrase-definitions.service';
import { downloadFile, putLangCodesToFileName } from '../../common/utility';
import { FileService } from '../file/file.service';
import { TranslationsService } from '../translations/translations.service';
import { Readable } from 'stream';
import { PUB_SUB } from '../../pubSub.module';
import { PubSub } from 'graphql-subscriptions';
import { SubscriptionToken } from '../../common/subscription-token';
import * as temp from 'temp';
import * as path from 'path';
import { createReadStream } from 'fs';
import * as AdmZip from 'adm-zip';
import { subTags2Tag, tag2langInfo } from '../../../../utils/src';

const POSSIBLE_TEXTY_INODE_NAMES = ['text']; // Considered as final node of text if doesn't have other children texty nodes.
const TEXTY_INODE_NAMES = ['tspan']; // Final nodes of text. All children nodes' values will be gathered and concatenated into one value
const SKIP_INODE_NAMES = ['rect', 'style', 'clipPath', 'image', 'rect']; // Nodes that definitenly don't contain any text. skipped for a performance purposes.
const DEFAULT_MAP_WORD_DEFINITION = 'A geographical place';
const DEFAULT_MAP_PHRASE_DEFINITION = 'A geographical place phrase';
const SVG_MIME_TYPE = 'image/svg+xml';
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
    @Inject(forwardRef(() => WordToWordTranslationsService))
    private wordToWordTranslationsService: WordToWordTranslationsService,
    private fileService: FileService,
    @Inject(forwardRef(() => TranslationsService))
    private translationsService: TranslationsService,
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
      const { foundWords, foundPhrases } = this.parseSvgMapString(mapString);

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

  /**
   * Since we must concatenate word if it is divided into several subtags inside some texty tag,
   * so as result we have transformed file with replaced (concatenated) each texty tag.
   */
  parseSvgMapString(originalSvgString: string): {
    transformedSvgINode: INode;
    foundWords: string[];
    foundPhrases: string[];
  } {
    let passes1 = 0;
    let passes2 = 0;
    try {
      const svgAsINode = readSvg(originalSvgString);
      const foundTexts: string[] = [];
      this.iterateOverINode(svgAsINode, SKIP_INODE_NAMES, (node) => {
        passes1++;
        if (
          TEXTY_INODE_NAMES.includes(node.name) ||
          POSSIBLE_TEXTY_INODE_NAMES.includes(node.name)
        ) {
          let currNodeAllText = node.value || '';
          let hasInnerTextyNodes = false;
          if (node.children && node.children.length > 0) {
            this.iterateOverINode(node, SKIP_INODE_NAMES, (subNode) => {
              passes2++;
              currNodeAllText += subNode.value;
              if (
                POSSIBLE_TEXTY_INODE_NAMES.includes(node.name) &&
                TEXTY_INODE_NAMES.includes(subNode.name)
              ) {
                hasInnerTextyNodes = true;
              }
            });
            if (!hasInnerTextyNodes) {
              // no more inner texty nodes - do cleaning of the final text and remember it
              currNodeAllText =
                this.cleanFromUnmeaningfulChars(currNodeAllText);
              node.children = [
                {
                  value: currNodeAllText,
                  type: 'text',
                  name: '',
                  children: [],
                  attributes: {},
                },
              ]; // mutate svgAsINode, if node is final texty and has children nodes, assign to its text value concatanated and cleaned value
            } else {
              currNodeAllText = ''; // if possible texty inode has inner texty nodes, do nothing here and dive deeper to inspect these inner nodes.
            }
          }

          if (!currNodeAllText) return;
          if (currNodeAllText.length <= 1) return;
          if (!isNaN(Number(currNodeAllText))) return;
          const isExist = foundTexts.findIndex((t) => t === currNodeAllText);

          if (isExist < 0) {
            foundTexts.push(currNodeAllText);
          }
        }
      });
      const foundWords: string[] = [];
      const foundPhrases: string[] = [];
      foundTexts.forEach((text) => {
        const words = text.split(' ');
        if (words.length === 0) return;
        if (words.length > 1) {
          foundPhrases.push(words.join(' '));
        } else if (words[0].length > 1 && isNaN(Number(words[0]))) {
          // push only words longer than 1 symbol and only not numbers
          foundWords.push(words[0]);
        }
      });
      // console.log('[passes through texty nodes]', passes1);
      // console.log('[passes through possible texty nodes]', passes2);
      return {
        transformedSvgINode: svgAsINode,
        foundWords,
        foundPhrases,
      };
    } catch (e) {
      Logger.error(e);
      return {
        transformedSvgINode: {
          name: '',
          type: '',
          value: '',
          attributes: {},
          children: [],
        },
        foundWords: [],
        foundPhrases: [],
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

  async getOrigMapWordsAndPhrasesPaginated(
    params: GetOrigMapWordsAndPhrasesInput,
    offset?: number | null,
    limit?: number | null,
  ): Promise<OrigMapWordsAndPhrasesOutput> {
    const dbPoolClient = await this.pg.pool.connect();
    try {
      const res = this.mapsRepository.getOrigMapWordsAndPhrasesPaginated(
        dbPoolClient,
        params,
        offset,
        limit,
      );
      return res;
    } catch (e) {
      Logger.error(`mapsService#getOrigMapWordsAndPhrases: ${e}`);
      return {
        error: ErrorType.PaginationError,
        mapWordsOrPhrases: null,
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

  checkForLanguageCodePresence(
    origMapWordsOrPhrases: Array<
      MapWordWithTranslations | MapPhraseWithTranslations
    >,
  ): boolean {
    try {
      origMapWordsOrPhrases.forEach((wordOrPhrase) => {
        if (!wordOrPhrase.language_code) {
          console.log(
            `Word or phrase ${JSON.stringify(
              wordOrPhrase,
            )} doesn't have language tag `,
          );
          return false;
        }
        wordOrPhrase!.translations!.forEach((tr) => {
          if (!tr.language_code) {
            console.log(
              `Translation ${JSON.stringify(tr)} doesn't have language tag `,
            );
            return false;
          }
        });
      });
      return true;
    } catch (e) {
      Logger.error(e);
      return false; //not sure about this...
    }
  }

  async translateMapsWithTranslationId({
    translation_id,
    from_definition_type_is_word,
    to_definition_type_is_word,
    token,
  }: {
    translation_id: string;
    from_definition_type_is_word: boolean;
    to_definition_type_is_word: boolean;
    token: string;
  }) {
    try {
      const origMapIds =
        await this.mapsRepository.getOrigMapsIdsByTranslationData({
          translation_id,
          from_definition_type_is_word,
          to_definition_type_is_word,
        });

      const toLang = await this.translationsService.getTranslationLanguage(
        translation_id,
        from_definition_type_is_word,
        to_definition_type_is_word,
      );

      if (!toLang) {
        Logger.error(
          `mapsService#translateMapsWithTranslationId: toLang is not defined`,
        );
        return [];
      }

      return this.translateOrigMapsByIds(origMapIds, token, toLang);
    } catch (e) {
      Logger.error(e);
      return [];
    }
  }

  async translateOrigMapsByIds(
    origMapIds: Array<string>,
    token: string,
    toLang?: LanguageInput,
  ): Promise<Array<string>> {
    const translatedMapsIds: Array<string | null> = [];
    try {
      for (const origMapId of origMapIds) {
        const { str, details } = await this.getMapAsStringById(origMapId);
        if (toLang) {
          translatedMapsIds.push(
            await this.translateMapStringToLangAndSaveTranslated({
              origMapString: str,
              origMapDetails: details,
              token,
              toLang,
            }),
          );
        } else {
          translatedMapsIds.push(
            ...(await this.translateMapStringToAllLangsAndSaveTranslated({
              origMapString: str,
              origMapDetails: details,
              token,
            })),
          );
        }
      }
      return translatedMapsIds.filter((tmid) => !!tmid) as string[];
    } catch (error) {
      Logger.error(error);
      return [];
    }
  }

  async translateMapsWithDefinitionId({
    from_definition_id,
    from_definition_type_is_word,
    token,
    toLang,
  }: {
    from_definition_id: string;
    from_definition_type_is_word: boolean;
    token: string;
    toLang?: LanguageInput;
  }): Promise<Array<string>> {
    try {
      let origMapIds: string[] = [];
      if (from_definition_type_is_word) {
        origMapIds = await this.mapsRepository.getOrigMapsIdsByWordDefinition(
          from_definition_id,
        );
      } else {
        origMapIds = await this.mapsRepository.getOrigMapsIdsByPhraseDefinition(
          from_definition_id,
        );
      }
      return this.translateOrigMapsByIds(origMapIds, token, toLang);
    } catch (e) {
      Logger.error(e);
      return [];
    }
  }

  async translateMapStringToAllLangsAndSaveTranslated({
    origMapString,
    origMapDetails,
    token,
  }: {
    origMapString: string;
    origMapDetails: MapDetailsInfo;
    token: string;
  }): Promise<Array<string>> {
    try {
      const languages: LanguageInput[] =
        await this.mapsRepository.getPossibleMapLanguages(
          origMapDetails.original_map_id,
        );

      const trPromises: Array<Promise<string | null>> = [];
      for (const toLang of languages) {
        trPromises.push(
          this.translateMapStringToLangAndSaveTranslated({
            origMapString,
            origMapDetails,
            token,
            toLang,
          }),
        );
      }
      const translatedMapIds = await Promise.all(trPromises);
      return translatedMapIds.filter((id) => !!id) as string[];
    } catch (e) {
      Logger.error(e);
      return [];
    }
  }

  async translateMapStringToLangAndSaveTranslated({
    origMapString,
    origMapDetails,
    toLang,
    token,
  }: {
    origMapString: string;
    origMapDetails: MapDetailsInfo;
    toLang: LanguageInput;
    token: string;
  }): Promise<string | null> {
    try {
      const origMapId = origMapDetails.original_map_id;
      if (!toLang) {
        Logger.error(
          `mapsService#translateMapToLangAndSaveTranslated: toLang isn't provided.`,
        );
        return null;
      }
      Logger.log(
        `START translating of orig map id ${origMapId} to ${JSON.stringify(
          toLang,
        )}`,
      );
      const p0 = performance.now();
      const mapTrWordsAndPhrases =
        await this.mapsRepository.getOrigMapTrWordsPhrases(origMapId, toLang);
      const p1 = performance.now();

      const translations: Array<{
        source: string;
        translation: string;
      }> =
        this.prepareTranslationsArrayFromMapTrWordsPhrases(
          mapTrWordsAndPhrases,
        );
      const p2 = performance.now();

      const { translatedMap } = await this.translateMapString(
        origMapString,
        translations,
      )!;
      const p3 = performance.now();
      // Logger.log(
      //   `get original words/phrases with translations from DB: ${p1 - p0} ms`,
      // );
      // Logger.log(`prepare translations array: ${p2 - p1} ms`);
      // Logger.log(`translate map string: ${p3 - p2} ms`);
      Logger.debug(`translation is done in ${p3 - p1} ms(${p3}-${p1})`);

      const stream = Readable.from([translatedMap]);
      const translatedContentFile = await this.fileService.uploadFile(
        stream,
        putLangCodesToFileName(origMapDetails.map_file_name, toLang),
        SVG_MIME_TYPE,
        token,
        translatedMap.length,
      );
      if (!translatedContentFile?.file?.id) {
        Logger.error(
          `mapsService#translateMapAndSaveTranslatedTrn: Error: translatedContentFile?.file?.id is undefined`,
        );
        return null;
      }

      const data = await this.mapsRepository.saveTranslatedMap({
        original_map_id: origMapId,
        content_file_id: String(translatedContentFile.file.id),
        token,
        toLang,
        translated_percent:
          mapTrWordsAndPhrases.length > 0
            ? Math.round(
                (translations.length / mapTrWordsAndPhrases.length) * 100,
              )
            : 100,
      });
      if (!data?.map_id) throw `Error saving translated map ${data}`;

      Logger.log(
        `DONE translating&saving map id ${origMapId} to lang ${JSON.stringify(
          toLang,
        )} for ${performance.now() - p0} ms.`,
      );

      return data.map_id;
    } catch (e) {
      Logger.error(e);
      return null;
    }
  }

  translateMapString(
    sourceSvgString: string,
    translations: Array<{
      source: string;
      translation: string;
    }>,
  ): MapTranslationResult | undefined {
    try {
      const p0 = performance.now();
      const { transformedSvgINode } = this.parseSvgMapString(sourceSvgString);
      const p1 = performance.now();
      this.replaceINodeTagValues(transformedSvgINode, translations);
      const p2 = performance.now();
      const translatedMap = stringify(transformedSvgINode);
      const p3 = performance.now();
      // Logger.log(`parsing: ${p1 - p0}`);
      // Logger.log(`replace originals with translations: ${p2 - p1}`);
      // Logger.log(`stringification: ${p3 - p2}`);
      return { translatedMap, translations };
    } catch (e) {
      return undefined;
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

  async translationsReset(token): Promise<void> {
    try {
      await this.mapsRepository.deleteAllOriginalMapWordsTrn();
      await this.mapsRepository.deleteAllOriginalMapPhrasesTrn();
      await this.mapsRepository.deleteAllTranslatedMapsTrn();
      const allOriginalMaps = await this.mapsRepository.getOrigMaps();
      for (const origMap of allOriginalMaps.mapList) {
        if (!origMap.mapDetails?.original_map_id) {
          Logger.error(
            `mapsService#translationsReset: origMap.mapDetails?.original_map_id is falsy`,
          );
          continue;
        }
        const { str: mapString, details: mapDetails } =
          await this.getMapAsStringById(origMap.mapDetails.original_map_id);

        await this.parseOrigMapAndSaveFoundWordsPhrases({
          mapDetails,
          mapString,
          token,
        });
        await this.translateMapStringToAllLangsAndSaveTranslated({
          origMapDetails: mapDetails,
          origMapString: mapString,
          token,
        });
      }
    } catch (error) {
      Logger.log(error);
    }
  }

  async reTranslate(token: string, forLangTag?: string | null): Promise<void> {
    try {
      const originalMaps = await this.mapsRepository.getOrigMaps();
      if (!(originalMaps.mapList?.length > 0)) return;
      const origMapIds = originalMaps.mapList.map(
        (m) => m.mapDetails!.original_map_id,
      );
      for (const origMapId of origMapIds) {
        const { str: origMapString, details: origMapDetails } =
          await this.getMapAsStringById(origMapId);
        if (forLangTag) {
          const langInfo = tag2langInfo(forLangTag);
          const toLang: LanguageInput = {
            language_code: langInfo.lang.tag,
            dialect_code: langInfo.dialect?.tag || null,
            geo_code: langInfo.region?.tag || null,
          };
          await this.translateMapStringToLangAndSaveTranslated({
            origMapDetails,
            origMapString,
            token,
            toLang,
          });
        } else {
          await this.translateMapStringToAllLangsAndSaveTranslated({
            origMapDetails,
            origMapString,
            token,
          });
        }
      }
    } catch (error) {
      Logger.error(`mapsService#reTranslate error: `, error);
    }
  }

  /**
   * Mutetes INode sturcture - replaces subnodes' values using provided valuesToReplace
   * @param iNodeStructure INode structure to replace values inside it.
   * @param valuesToReplace
   */
  replaceINodeTagValues(
    iNodeStructure: INode,
    valuesToReplace: { source: string; translation: string }[],
  ): void {
    this.iterateOverINode(iNodeStructure, SKIP_INODE_NAMES, (node) => {
      const idx = valuesToReplace.findIndex(
        ({ source }) => source === node.value,
      );
      if (idx < 0) return;
      node.value = valuesToReplace[idx].translation;
    });
  }

  iterateOverINode(
    node: INode,
    skipNodeNames: string[],
    cb: (node: INode) => void,
  ) {
    if (skipNodeNames.includes(node.name)) return;
    cb(node);
    for (const child of node.children || []) {
      this.iterateOverINode(child, skipNodeNames, cb);
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

  cleanFromUnmeaningfulChars(inStr: string): string {
    return inStr
      .split(' ')
      .map((w) => w.trim())
      .filter((w) => w.length > 0)
      .join(' ');
  }

  prepareTranslationsArrayFromMapTrWordsPhrases(
    mapWordsPhrases: MapTrWordsPhrases,
  ): Array<{
    source: string;
    translation: string;
  }> {
    const translations: Array<{
      source: string;
      translation: string;
    }> = [];
    for (const origMapWordOrPhrase of mapWordsPhrases) {
      if (!(origMapWordOrPhrase.translations.length > 0)) {
        continue;
      }
      const origWordOrPhraseTranslated =
        this.wordToWordTranslationsService.chooseBestTranslation<MapTrOfWordOrPhrase>(
          origMapWordOrPhrase.translations,
        );
      translations.push({
        source: origMapWordOrPhrase.o_like_string,
        translation: origWordOrPhraseTranslated.t_like_string,
      });
    }
    return translations;
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
}
