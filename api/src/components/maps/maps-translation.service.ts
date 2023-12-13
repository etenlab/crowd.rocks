import { forwardRef, Inject, Logger } from '@nestjs/common';
import { LanguageInput } from '../common/types';
import {
  MapsRepository,
  MapTrOfWordOrPhrase,
  MapTrWordsPhrases,
} from './maps.repository';
import { MapsService, MapTranslationResult } from './maps.service';
import { TranslationsService } from '../translations/translations.service';
import { parseSync as readSvg, INode, stringify } from 'svgson';
import { putLangCodesToFileName } from '../../common/utility';
import { Readable } from 'stream';
import { tag2langInfo } from '../../../../utils';
import { MapDetailsInfo } from './types';
import { FileService } from '../file/file.service';
import { WordToWordTranslationsService } from '../translations/word-to-word-translations.service';

const POSSIBLE_TEXTY_INODE_NAMES = ['text']; // Considered as final node of text if doesn't have other children texty nodes.
const TEXTY_INODE_NAMES = ['tspan']; // Final nodes of text. All children nodes' values will be gathered and concatenated into one value
const SKIP_INODE_NAMES = ['rect', 'style', 'clipPath', 'image', 'rect']; // Nodes that definitenly don't contain any text. skipped for a performance purposes.
const SVG_MIME_TYPE = 'image/svg+xml';

export class MapsTranslationService {
  constructor(
    private mapsRepository: MapsRepository,
    @Inject(forwardRef(() => MapsService))
    private mapsService: MapsService,
    private translationsService: TranslationsService,
    private fileService: FileService,
    @Inject(forwardRef(() => WordToWordTranslationsService))
    private wordToWordTranslationsService: WordToWordTranslationsService,
  ) {}

  /**
   * @returns ids of marked translated maps
   */
  async markTrMapsByTranslationId({
    translation_id,
    from_definition_type_is_word,
    to_definition_type_is_word,
  }: {
    translation_id: string;
    from_definition_type_is_word: boolean;
    to_definition_type_is_word: boolean;
  }): Promise<string[]> {
    console.log('markTrMapsByTranslationId');
    try {
      const originalMapsIds =
        await this.mapsRepository.getOrigMapsIdsByTranslationData({
          translation_id,
          from_definition_type_is_word,
          to_definition_type_is_word,
        });
      const targetLanguage =
        await this.translationsService.getTranslationLanguage(
          translation_id,
          from_definition_type_is_word,
          to_definition_type_is_word,
        );
      if (!targetLanguage) {
        Logger.error(
          `MapsTranslationsService#markTrMapsByTranslationId: targetLanguage not found`,
        );
        return [];
      }
      const res = await this.mapsRepository.markTrMapsByOrigIdToRetranslate({
        originalMapsIds,
        targetLanguage,
      });
      return res;
    } catch (error) {
      Logger.error(
        `MapsTranslationsService#markTrMapsByTranslationId: ` +
          JSON.stringify(error),
      );
      return [];
    }
  }

  async unmarkTrMaps(trMapIds: string[]): Promise<string[]> {
    return this.mapsRepository.unmarkTrMaps(trMapIds);
  }

  /**
   * @returns ids of marked translated maps
   */
  async markTrMapsByDefinitionsIds({
    from_definition_id,
    from_definition_type_is_word,
    to_definition_id,
    to_definition_type_is_word,
  }: {
    from_definition_id: string;
    from_definition_type_is_word: boolean;
    to_definition_id: string;
    to_definition_type_is_word: boolean;
  }): Promise<string[]> {
    console.log('markTrMapsByDefinitionsIds');
    try {
      const translation_id =
        await this.translationsService.getTranslationIdByFromToDefinitionsIds({
          from_definition_id,
          from_definition_type_is_word,
          to_definition_id,
          to_definition_type_is_word,
        });
      if (!translation_id) return [];
      return this.markTrMapsByTranslationId({
        translation_id,
        from_definition_type_is_word,
        to_definition_type_is_word,
      });
    } catch (error) {
      Logger.error(
        `MapsTranslationsService#markTrMapsByDefinitionsIds: ` +
          JSON.stringify(error),
      );
      return [];
    }
  }

  /**
   * @returns ids of marked translated maps
   */
  async markTrMapsByFromDefinitionIdAndLang({
    from_definition_id,
    from_definition_type_is_word,
    toLang,
  }: {
    from_definition_id: string;
    from_definition_type_is_word: boolean;
    toLang: LanguageInput;
  }): Promise<string[]> {
    console.log('markTrMapsByFromDefinitionIdAndLang');
    try {
      const originalMapsIds = from_definition_type_is_word
        ? await this.mapsRepository.getOrigMapsIdsByWordDefinition(
            from_definition_id,
          )
        : await this.mapsRepository.getOrigMapsIdsByPhraseDefinition(
            from_definition_id,
          );

      const res = await this.mapsRepository.markTrMapsByOrigIdToRetranslate({
        originalMapsIds,
        targetLanguage: toLang,
      });
      return res;
    } catch (error) {
      Logger.error(
        `MapsTranslationsService#markTrMapsByFromDefinitionIdAndLang: ` +
          JSON.stringify(error),
      );
      return [];
    }
  }

  /**
   * @returns ids of marked translated maps
   */
  async markTrMapsByOriginalMapsIds(
    originalMapsIds: string[],
  ): Promise<string[]> {
    console.log('markTrMapsByOriginalMapsIds');
    try {
      const res = await this.mapsRepository.markTrMapsByOrigIdToRetranslate({
        originalMapsIds,
      });
      return res;
    } catch (error) {
      Logger.error(
        `MapsTranslationsService#markTrMapsByFromDefinitionIdAndLang: ` +
          JSON.stringify(error),
      );
      return [];
    }
  }

  /**
   * @returns  Ids of translated maps
   */
  async retranslateMarkedMaps(token: string): Promise<string[]> {
    const trMapsRowsToRetranslate =
      await this.mapsRepository.getAllMarkedAndNotIsTranslatingTrMapsRows();
    const origMapsToRetranslate = trMapsRowsToRetranslate.reduce(
      (foundOrgMaps, trMap) => {
        const foundIdx = foundOrgMaps.findIndex(
          (om) => om.origMapId === trMap.original_map_id,
        );
        if (foundIdx && foundIdx >= 0) {
          foundOrgMaps[foundIdx].languages.push({
            language_code: trMap.language_code,
            dialect_code: trMap.dialect_code,
            geo_code: trMap.geo_code,
          });
        } else {
          foundOrgMaps.push({
            origMapId: trMap.original_map_id,
            languages: [
              {
                language_code: trMap.language_code,
                dialect_code: trMap.dialect_code,
                geo_code: trMap.geo_code,
              },
            ],
          });
        }
        return foundOrgMaps;
      },
      [] as Array<{
        origMapId: string;
        languages: Array<LanguageInput>;
      }>,
    );

    if (!(origMapsToRetranslate.length > 0)) {
      return [];
    }

    const trMapsIds: Set<string> = new Set();
    trMapsRowsToRetranslate.forEach((t_m) => {
      trMapsIds.add(t_m.translated_map_id);
    });
    await this.mapsRepository.markTrMapsAdIsRetranslatingNow(
      Array.from(trMapsIds),
    );
    Logger.log(
      `Start retranslating translated maps ${JSON.stringify(
        Array.from(trMapsIds),
      )}`,
    );

    const translatedMapIds: Array<string> = [];
    for (const om of origMapsToRetranslate) {
      translatedMapIds.push(
        ...(await this.translateOrigMapIdToLangs(
          om.origMapId,
          om.languages,
          token,
        )),
      );
    }
    if (translatedMapIds.length > 0) {
      const unmarked = await this.unmarkTrMaps(translatedMapIds);
      Logger.log(
        `Unmark translated maps ${JSON.stringify(
          unmarked,
        )}. (retrnanslation completed.)`,
      );
    }
    return translatedMapIds;
  }

  async mapReTranslateAllNow(
    token: string,
    forLangTag?: string | null,
  ): Promise<void> {
    try {
      const originalMaps = await this.mapsRepository.getOrigMaps();
      if (!(originalMaps.mapList?.length > 0)) return;
      const origMapIds = originalMaps.mapList.map(
        (m) => m.mapDetails!.original_map_id,
      );
      for (const origMapId of origMapIds) {
        const { str: origMapString, details: origMapDetails } =
          await this.mapsService.getMapAsStringById(origMapId);
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

  async translateOrigMapIdToLangs(
    origMapId: string,
    toLangs: LanguageInput[],
    token: string,
  ): Promise<Array<string>> {
    try {
      const { str, details } = await this.mapsService.getMapAsStringById(
        origMapId,
      );
      const translatedMapsIdsPromises: Array<any> = [];
      for (const toLang of toLangs) {
        translatedMapsIdsPromises.push(
          this.translateMapStringToLangAndSaveTranslated({
            origMapString: str,
            origMapDetails: details,
            token,
            toLang,
          }),
        );
      }
      const translatedMapsIds = await Promise.all(translatedMapsIdsPromises);
      return translatedMapsIds.filter((tmid) => !!tmid) as string[];
    } catch (error) {
      Logger.error(error);
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
        const { str, details } = await this.mapsService.getMapAsStringById(
          origMapId,
        );
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
      Logger.debug(`translation is done in ${p3 - p1} ms`);

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
          await this.mapsService.getMapAsStringById(
            origMap.mapDetails.original_map_id,
          );

        await this.mapsService.parseOrigMapAndSaveFoundWordsPhrases({
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

  async checkAndCreateNewlyTranslatedMaps(
    token: string,
  ): Promise<Array<string>> {
    const originalMaps = await this.mapsRepository.getOrigMaps();
    const newlyTranslatedMapIds: Array<string> = [];
    for (const om of originalMaps.mapList) {
      if (!om.mapDetails?.original_map_id) continue;
      const possibleLangs = await this.mapsRepository.getPossibleMapLanguages(
        om.mapDetails.original_map_id,
      );
      for (const lang of possibleLangs) {
        const translatedMap = await this.mapsRepository.getTranslatedMaps({
          originalMapId: Number(om.mapDetails.original_map_id),
          lang,
        });
        if (!translatedMap.mapList || translatedMap.mapList.length === 0) {
          const newTranslatedMap = await this.translateOrigMapIdToLangs(
            om.mapDetails.original_map_id,
            [lang],
            token,
          );
          newlyTranslatedMapIds.push(...newTranslatedMap);
        }
      }
    }
    return newlyTranslatedMapIds;
  }

  /**
   * Mutates INode sturcture - replaces subnodes' values using provided valuesToReplace
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

  cleanFromUnmeaningfulChars(inStr: string): string {
    return inStr
      .split(' ')
      .map((w) => w.trim())
      .filter((w) => w.length > 0)
      .join(' ');
  }

  // /**
  //  * @deprecated
  //  */
  // async translateMapsWithTranslationId({
  //   translation_id,
  //   from_definition_type_is_word,
  //   to_definition_type_is_word,
  //   token,
  // }: {
  //   translation_id: string;
  //   from_definition_type_is_word: boolean;
  //   to_definition_type_is_word: boolean;
  //   token: string;
  // }) {
  //   try {
  //     const origMapIds =
  //       await this.mapsRepository.getOrigMapsIdsByTranslationData({
  //         translation_id,
  //         from_definition_type_is_word,
  //         to_definition_type_is_word,
  //       });

  //     const toLang = await this.translationsService.getTranslationLanguage(
  //       translation_id,
  //       from_definition_type_is_word,
  //       to_definition_type_is_word,
  //     );

  //     if (!toLang) {
  //       Logger.error(
  //         `mapsService#translateMapsWithTranslationId: toLang is not defined`,
  //       );
  //       return [];
  //     }

  //     return this.translateOrigMapsByIds(origMapIds, token, toLang);
  //   } catch (e) {
  //     Logger.error(e);
  //     return [];
  //   }
  // }

  // /**
  //  * @deprecated
  //  */
  // async translateMapsWithDefinitionId({
  //   from_definition_id,
  //   from_definition_type_is_word,
  //   token,
  //   toLang,
  // }: {
  //   from_definition_id: string;
  //   from_definition_type_is_word: boolean;
  //   token: string;
  //   toLang?: LanguageInput;
  // }): Promise<Array<string>> {
  //   try {
  //     let origMapIds: string[] = [];
  //     if (from_definition_type_is_word) {
  //       origMapIds = await this.mapsRepository.getOrigMapsIdsByWordDefinition(
  //         from_definition_id,
  //       );
  //     } else {
  //       origMapIds = await this.mapsRepository.getOrigMapsIdsByPhraseDefinition(
  //         from_definition_id,
  //       );
  //     }
  //     return this.translateOrigMapsByIds(origMapIds, token, toLang);
  //   } catch (e) {
  //     Logger.error(e);
  //     return [];
  //   }
  // }
}
