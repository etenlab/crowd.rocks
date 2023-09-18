import { Injectable, Logger } from '@nestjs/common';
import {
  GetAllMapsListOutput,
  GetOrigMapContentOutput,
  GetOrigMapPhrasesInput,
  GetOrigMapPhrasesOutput,
  GetOrigMapsListOutput,
  GetOrigMapWordsInput,
  GetOrigMapWordsOutput,
  GetTranslatedMapContentOutput,
  MapFileOutput,
  MapPhraseTranslations,
  MapWordTranslations,
} from './types';
import { type INode } from 'svgson';
import { parseSync as readSvg, stringify } from 'svgson';
import { WordsService } from '../words/words.service';
import { MapsRepository } from './maps.repository';
import { WordUpsertInput } from '../words/types';
import { LanguageInfo } from '../../common/types';
import { DEFAULT_NEW_MAP_LANGUAGE } from '../../common/const';
import { PostgresService } from '../../core/postgres.service';
import { WordDefinitionsService } from '../definitions/word-definitions.service';
import { PoolClient } from 'pg';
import { WordToWordTranslationsService } from '../translations/word-to-word-translations.service';
import { subTags2Tag, tag2langInfo } from '../../common/langUtils';
import { LanguageInput } from 'src/components/common/types';
import { PhraseUpsertInput } from '../phrases/types';
import { PhrasesService } from '../phrases/phrases.service';
import { PhraseDefinitionsService } from '../definitions/phrase-definitions.service';
import { putLangCodesToFileName } from '../../common/utility';
import { FileService } from '../file/file.service';
import { TranslationsService } from '../translations/translations.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const string2fileStream = require('string-to-file-stream');

// const TEXTY_INODE_NAMES = ['text', 'textPath']; // Final nodes of text. All children nodes' values will be gathered and concatenated into one value
const POSSIBLE_TEXTY_INODE_NAMES = ['text']; // Considered as final node of text if doesn't have other children texty nodes.
const TEXTY_INODE_NAMES = ['tspan']; // Final nodes of text. All children nodes' values will be gathered and concatenated into one value
const SKIP_INODE_NAMES = ['rect', 'style', 'clipPath', 'image', 'rect']; // Nodes that definitenly don't contain any text. skipped for a performance purposes.
const DEFAULT_MAP_WORD_DEFINITION = 'A geographical place';
const DEFAULT_MAP_PHRASE_DEFINITION = 'A geographical place phrase';
const SVG_MIME_TYPE = 'image/svg+xml';

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
  map_id: string;
  token: string;
  dbPoolClient: PoolClient;
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
    private wordToWordTranslationsService: WordToWordTranslationsService,
    private fileService: FileService,
    private translationsService: TranslationsService,
  ) {}

  async saveAndParseNewMap({
    content_file_id,
    mapFileName,
    previewFileId,
    mapLanguage = DEFAULT_NEW_MAP_LANGUAGE,
    token,
  }: IParseAndSaveNewMapParams) {
    const language_code = mapLanguage.lang.tag;
    const dialect_code = mapLanguage.dialect?.tag;
    const geo_code = mapLanguage.region?.tag;

    const dbPoolClient = await this.pg.pool.connect();
    try {
      //-- Save map
      dbPoolClient.query('BEGIN');
      const { map_id } = await this.mapsRepository.saveOriginalMapTrn({
        mapFileName,
        content_file_id,
        previewFileId: previewFileId!,
        token,
        dbPoolClient,
        language_code,
        dialect_code: dialect_code || undefined,
        geo_code: geo_code || undefined,
      });
      await dbPoolClient.query('COMMIT');
      // parsing depends on results of saveOriginalMapTrn so we must commit and start a new transaction
      dbPoolClient.query('BEGIN');
      const res = await this.parseOrigMapTrn({
        map_id,
        dbPoolClient,
        token,
      });
      dbPoolClient.query('COMMIT');
      return res;
    } catch (error) {
      dbPoolClient.query('ROLLBACK');
      throw error;
    } finally {
      dbPoolClient.release();
    }
  }

  async parseOrigMapTrn({
    map_id,
    dbPoolClient,
    token,
  }: IParseOrigMapParams): Promise<MapFileOutput> {
    const { language, content_file_id, map_file_name, created_at, created_by } =
      await this.mapsRepository.getOrigMapWithContentUrl(map_id);
    const { language_code, dialect_code, geo_code } = language;
    const origMapString = await this.fileService.getFileContentAsString(
      content_file_id,
    );
    const { transformedSvgINode, foundWords, foundPhrases } =
      this.parseSvgMapString(origMapString);

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

    await dbPoolClient.query('COMMIT');

    return {
      map_file_name,
      map_file_name_with_langs: putLangCodesToFileName(map_file_name, {
        language_code,
        dialect_code,
        geo_code,
      }),
      original_map_id: map_id,
      created_at,
      created_by,
      is_original: true,
      language: {
        language_code,
        dialect_code,
        geo_code,
      },
    };
  }

  async saveOriginalMapWord(
    wordInput: WordUpsertInput,
    map_id: string,
    token: string,
    dbPoolClient: PoolClient,
  ): Promise<string> {
    const savedWord = await this.wordsService.upsertInTrn(
      wordInput,
      token,
      dbPoolClient,
    );
    if (!savedWord.word_id) {
      throw new Error(
        `MapsService#parseAndSaveNewMap: 
        Error ${savedWord.error} with saving word ${JSON.stringify(wordInput)}`,
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
  }

  async saveOriginalMapPhrase(
    phraseInput: PhraseUpsertInput,
    map_id: string,
    token: string,
    dbPoolClient: PoolClient,
  ): Promise<string> {
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
  }

  async getOrigMaps(): Promise<GetOrigMapsListOutput> {
    return this.mapsRepository.getOrigMaps();
  }

  async getAllMapsList(lang?: LanguageInput): Promise<GetAllMapsListOutput> {
    const origMaps = await this.mapsRepository.getOrigMaps(lang);
    const translatedMaps = await this.mapsRepository.getTranslatedMaps({
      lang,
    });
    const allMapsList = [...origMaps.mapList, ...translatedMaps.mapList];
    return { allMapsList };
  }

  async getOrigMapContent(id: string): Promise<GetOrigMapContentOutput> {
    return this.mapsRepository.getOrigMapWithContentUrl(id);
  }

  async getTranslatedMapContent(
    id: string,
  ): Promise<GetTranslatedMapContentOutput> {
    const mapFileInfo =
      await this.mapsRepository.getTranslatedMapWithContentUrl(id);
    return mapFileInfo;
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
    const svgAsINode = readSvg(originalSvgString);
    const foundTexts: string[] = [];
    this.iterateOverINode(svgAsINode, SKIP_INODE_NAMES, (node) => {
      if (
        TEXTY_INODE_NAMES.includes(node.name) ||
        POSSIBLE_TEXTY_INODE_NAMES.includes(node.name)
      ) {
        let currNodeAllText = node.value || '';
        let hasInnerTextyNodes = false;
        if (node.children && node.children.length > 0) {
          this.iterateOverINode(node, [], (subNode) => {
            currNodeAllText += subNode.value;
            if (
              POSSIBLE_TEXTY_INODE_NAMES.includes(node.name) &&
              TEXTY_INODE_NAMES.includes(subNode.name)
            ) {
              hasInnerTextyNodes = true;
            }
          });
          if (!hasInnerTextyNodes) {
            node.children = [
              {
                value: currNodeAllText,
                type: 'text',
                name: '',
                children: [],
                attributes: {},
              },
            ]; // mutate svgAsINode, if node is final texty and has children nodes, assign to its text value concatanated value from children's values
          } else {
            currNodeAllText = ''; // if possible texty inode has inner texty nodes, do nothing here and dive deeper to inspect these inner nodes.
          }
        }

        if (!currNodeAllText) return;
        currNodeAllText = currNodeAllText.trim();
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
      const words = text
        .split(' ')
        .map((w) => w.trim())
        .filter((w) => w.length > 1);
      if (words.length === 0) return;
      if (words.length > 1) {
        foundPhrases.push(text);
      } else {
        foundWords.push(text);
      }
    });
    return {
      transformedSvgINode: svgAsINode,
      foundWords,
      foundPhrases,
    };
  }

  async getOrigMapWords(
    input: GetOrigMapWordsInput,
  ): Promise<GetOrigMapWordsOutput> {
    const { original_map_id, ...langRestrictions } = input;
    return this.mapsRepository.getOrigMapWords(
      original_map_id || '',
      langRestrictions,
    );
  }

  async getOrigMapPhrases(
    input: GetOrigMapPhrasesInput,
  ): Promise<GetOrigMapPhrasesOutput> {
    const { original_map_id, ...langRestrictions } = input;
    const origMapPhrases = await this.mapsRepository.getOrigMapPhrases(
      original_map_id || '',
      langRestrictions,
    );
    if (!this.checkForLanguageCodePresence(origMapPhrases.origMapPhrases)) {
      throw new Error('Phrase or its translation doesnt have language code');
    }

    return origMapPhrases;
  }

  checkForLanguageCodePresence(
    origMapWordsOrPhrases: Array<MapWordTranslations | MapPhraseTranslations>,
  ): boolean {
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
  }

  async translateOrigMapsByIds(
    origMapIds: Array<string>,
    token: string,
    toLang?: LanguageInput,
  ): Promise<Array<string>> {
    const translatedMapsIds: string[] = [];
    const dbPoolClient = await this.pg.pool.connect();
    try {
      for (const origMapId of origMapIds) {
        const translatedToSomeLanguages =
          await this.translateMapAndSaveTranslatedTrn(
            origMapId,
            token,
            dbPoolClient,
            toLang,
          );
        translatedMapsIds.push(...translatedToSomeLanguages);
      }
    } catch (error) {
      Logger.error(error);
      throw error;
    } finally {
      dbPoolClient.release();
      return translatedMapsIds;
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
  }

  async translateMapAndSaveTranslatedTrn(
    origMapId,
    token,
    dbPoolClient: PoolClient,
    toLang?: LanguageInput,
  ): Promise<Array<string>> {
    const translatedMapIds: Array<string> = [];
    const { content_file_id, map_file_name } =
      await this.mapsRepository.getOrigMapWithContentUrl(origMapId);

    const { origMapWords } = await this.getOrigMapWords({
      original_map_id: origMapId,
    });

    const { origMapPhrases } = await this.getOrigMapPhrases({
      original_map_id: origMapId,
    });

    const origMapWordsAndPhrases: Array<
      MapWordTranslations | MapPhraseTranslations
    > = [...origMapWords, ...origMapPhrases];

    let targetLanguagesFullTags: Array<string>;
    if (toLang) {
      targetLanguagesFullTags = [
        subTags2Tag({
          lang: toLang.language_code,
          dialect: toLang.dialect_code || undefined,
          region: toLang.geo_code || undefined,
        }),
      ];
    } else {
      targetLanguagesFullTags = this.getLangFullTags(origMapWordsAndPhrases);
    }

    for (const languageFullTag of targetLanguagesFullTags) {
      const language_code: string = tag2langInfo(languageFullTag).lang.tag;
      const dialect_code: string | undefined =
        tag2langInfo(languageFullTag)?.dialect?.tag || undefined;
      const geo_code: string | undefined =
        tag2langInfo(languageFullTag)?.region?.tag || undefined;

      const translations: Array<{
        source: string;
        translation: string;
      }> = [];
      for (const origMapWordOrPhrase of origMapWordsAndPhrases) {
        const origWordOrPhraseTranslated =
          this.wordToWordTranslationsService.chooseBestTranslation(
            origMapWordOrPhrase,
            {
              language_code,
              dialect_code: dialect_code || null,
              geo_code: geo_code || null,
            },
          );
        if ('word' in origMapWordOrPhrase) {
          if (
            'word' in origWordOrPhraseTranslated! &&
            origWordOrPhraseTranslated.word.length > 0
          ) {
            translations.push({
              source: origMapWordOrPhrase.word,
              translation: origWordOrPhraseTranslated.word,
            });
          } else if (
            'phrase' in origWordOrPhraseTranslated! &&
            origWordOrPhraseTranslated.phrase.length > 0
          ) {
            translations.push({
              source: origMapWordOrPhrase.word,
              translation: origWordOrPhraseTranslated.phrase,
            });
          }
        } else {
          if (
            'word' in origWordOrPhraseTranslated! &&
            origWordOrPhraseTranslated.word.length > 0
          ) {
            translations.push({
              source: origMapWordOrPhrase.phrase,
              translation: origWordOrPhraseTranslated.word,
            });
          } else if (
            'phrase' in origWordOrPhraseTranslated! &&
            origWordOrPhraseTranslated.phrase.length > 0
          ) {
            translations.push({
              source: origMapWordOrPhrase.phrase,
              translation: origWordOrPhraseTranslated.phrase,
            });
          }
        }
      }
      const origMapString = await this.fileService.getFileContentAsString(
        content_file_id,
      );
      const p1 = performance.now();
      const { translatedMap } = await this.translateMapString(
        origMapString,
        translations,
      )!;
      Logger.debug(`translation is done in ${performance.now() - p1} ms`);
      const translatedContentFile = await this.fileService.uploadFile(
        string2fileStream(translatedMap),
        putLangCodesToFileName(map_file_name, {
          language_code: tag2langInfo(languageFullTag).lang.tag,
          dialect_code: tag2langInfo(languageFullTag).dialect?.tag || null,
          geo_code: tag2langInfo(languageFullTag).region?.tag || null,
        }),
        SVG_MIME_TYPE,
        translatedMap.length,
        token,
      );
      if (!translatedContentFile?.file?.id) {
        Logger.error(
          `mapsService#translateMapAndSaveTranslatedTrn: Error: translatedContentFile?.file?.id is undefined`,
        );
        return [];
      }

      const data = await this.mapsRepository.saveTranslatedMapTrn({
        original_map_id: origMapId,
        content_file_id: String(translatedContentFile.file.id),
        token,
        t_language_code: language_code,
        t_dialect_code: dialect_code,
        t_geo_code: geo_code,
        dbPoolClient,
        translated_percent:
          origMapWordsAndPhrases.length > 0
            ? Math.round(
                (translations.length / origMapWordsAndPhrases.length) * 100,
              )
            : 100,
      });
      translatedMapIds.push(data!.map_id);
    }

    return translatedMapIds;
  }

  translateMapString(
    sourceSvgString: string,
    translations: Array<{
      source: string;
      translation: string;
    }>,
  ): MapTranslationResult | undefined {
    const { transformedSvgINode } = this.parseSvgMapString(sourceSvgString);
    this.replaceINodeTagValues(transformedSvgINode, translations);
    const translatedMap = stringify(transformedSvgINode);
    return { translatedMap, translations };
  }

  async deleteMap(mapId: string, is_original: boolean): Promise<string> {
    return is_original
      ? await this.deleteOriginalMap(mapId)
      : await this.deleteTranslatedMap(mapId);
  }

  async deleteOriginalMap(mapId: string): Promise<string> {
    const mapInfo = await this.mapsRepository.getOrigMapWithContentUrl(mapId);
    const translatedMaps = await this.mapsRepository.getTranslatedMaps({
      originalMapId: Number(mapId),
    });

    for (const translatedMap of translatedMaps.mapList) {
      translatedMap.translated_map_id &&
        (await this.deleteTranslatedMap(translatedMap.translated_map_id));
    }

    const deletedMapId = await this.mapsRepository.deleteOriginalMap(mapId);
    await this.fileService.deleteFile(mapInfo.preview_file_id!);
    await this.fileService.deleteFile(mapInfo.content_file_id!);
    return deletedMapId;
  }

  async deleteTranslatedMap(mapId: string): Promise<string> {
    const mapInfo = await this.mapsRepository.getTranslatedMapWithContentUrl(
      mapId,
    );
    const deletedMapId = await this.mapsRepository.deleteTranslatedMap(mapId);
    await this.fileService.deleteFile(mapInfo.content_file_id!);
    return deletedMapId;
  }

  async translationsReset(token): Promise<void> {
    const dbPoolClient = await this.pg.pool.connect();
    try {
      dbPoolClient.query('BEGIN');
      await this.mapsRepository.deleteAllOriginalMapWordsTrn(dbPoolClient);
      await this.mapsRepository.deleteAllOriginalMapPhrasesTrn(dbPoolClient);
      await this.mapsRepository.deleteAllTranslatedMapsTrn(dbPoolClient);
      await dbPoolClient.query('COMMIT');
      const allOriginalMaps = await this.mapsRepository.getOrigMaps();
      for (const origMap of allOriginalMaps.mapList) {
        dbPoolClient.query('BEGIN');
        await this.parseOrigMapTrn({
          map_id: origMap.original_map_id,
          token,
          dbPoolClient,
        });
        await this.translateMapAndSaveTranslatedTrn(
          origMap.original_map_id,
          token,
          dbPoolClient,
        );
        await dbPoolClient.query('COMMIT');
      }
    } catch (error) {
      await dbPoolClient.query('ROLLBACK');
      throw error;
    } finally {
      dbPoolClient.release();
    }
  }

  async reTranslate(token: string, forLangTag: string): Promise<void> {
    const langInfo = tag2langInfo(forLangTag);
    const lang: LanguageInput = {
      language_code: langInfo.lang.tag,
      dialect_code: langInfo.dialect?.tag || null,
      geo_code: langInfo.region?.tag || null,
    };
    const originalMaps = await this.mapsRepository.getOrigMaps();
    if (!(originalMaps.mapList?.length > 0)) return;
    const origMapIds = originalMaps.mapList.map((m) => m.original_map_id);
    const dbPoolClient = await this.pg.pool.connect();
    try {
      for (const origMapId of origMapIds) {
        this.translateMapAndSaveTranslatedTrn(
          origMapId,
          token,
          dbPoolClient,
          lang,
        );
      }
    } catch (error) {
      Logger.error(`mapsService#reTranslate error: `, error);
      throw error;
    } finally {
      dbPoolClient.release;
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

  getLangFullTags(
    wordsOrPhrases: Array<MapWordTranslations | MapPhraseTranslations>,
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
}