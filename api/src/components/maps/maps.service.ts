import { Injectable } from '@nestjs/common';
import { ReadStream } from 'fs';

import {
  GetAllMapsListOutput,
  GetOrigMapContentOutput,
  GetOrigMapsListOutput,
  GetOrigMapWordsInput,
  GetOrigMapWordsOutput,
  MapFileOutput,
  OriginalMapWordInput,
} from './types';
import { type INode } from 'svgson';
import { parseSync as readSvg, stringify } from 'svgson';
import { WordsService } from '../words/words.service';
import { MapsRepository } from './maps.repository';
import { WordTranslations, WordUpsertInput } from '../words/types';
import { GenericOutput, LanguageInfo } from '../../common/types';
import { DEFAULT_NEW_MAP_LANGUAGE } from '../../common/const';
import { PostgresService } from '../../core/postgres.service';
import { WordDefinitionsService } from '../definitions/word-definitions.service';
import { PoolClient } from 'pg';
import { WordToWordTranslationsService } from '../translations/word-to-word-translations.service';
import { subTags2Tag, tag2langInfo } from '../../common/langUtils';
import { LanguageInput } from '../definitions/types';

// const TEXTY_INODE_NAMES = ['text', 'textPath']; // Final nodes of text. All children nodes' values will be gathered and concatenated into one value
const TEXTY_INODE_NAMES = ['tspan']; // Final nodes of text. All children nodes' values will be gathered and concatenated into one value
const SKIP_INODE_NAMES = ['rect', 'style', 'clipPath', 'image', 'rect']; // Nodes that definitenly don't contain any text. skipped for a performance purposes.
const DEFAULT_MAP_WORD_DEFINITION = 'A geographical place';

export type MapTranslationResult = {
  translatedMap: string;
  translations: Array<{ source: string; translation: string }>;
};

interface parseAndSaveNewMapParams {
  readStream: ReadStream;
  mapFileName: string;
  mapLanguage?: LanguageInfo;
  token: string;
}
@Injectable()
export class MapsService {
  constructor(
    private pg: PostgresService,
    private mapsRepository: MapsRepository,
    private wordsService: WordsService,
    private wordDefinitionsService: WordDefinitionsService,
    private wordToWordTranslationsService: WordToWordTranslationsService,
  ) {}

  async parseAndSaveNewMap({
    readStream,
    mapFileName,
    mapLanguage = DEFAULT_NEW_MAP_LANGUAGE,
    token,
  }: parseAndSaveNewMapParams): Promise<MapFileOutput> {
    let fileBody: string;
    for await (const chunk of readStream) {
      if (!fileBody) {
        fileBody = chunk;
      } else {
        fileBody += chunk;
      }
    }

    const { transformedSvgINode, foundWords } =
      this.parseSvgMapString(fileBody);

    const dbPoolClient = await this.pg.pool.connect();
    try {
      dbPoolClient.query('BEGIN');
      const savedWordIds: string[] = [];
      const savedDefinitionIds: string[] = [];

      const { map_file_name, map_id, created_at, created_by } =
        await this.mapsRepository.saveOriginalMap({
          mapFileName,
          fileBody,
          token,
          dbPoolClient,
          language_code: mapLanguage.lang.tag,
          dialect_code: mapLanguage.dialect?.tag,
          geo_code: mapLanguage.region?.tag,
        });

      for (const word of foundWords) {
        const wordInput: WordUpsertInput = {
          wordlike_string: word,
          language_code: mapLanguage.lang.tag,
        };
        const savedWord = await this.wordsService.upsertInTrn(
          wordInput,
          token,
          dbPoolClient,
        );
        if (!savedWord.word_id) {
          console.error(
            `MapsService#parseAndSaveNewMap: Error ${savedWord.error} with saving word ${wordInput}`,
          );
          continue;
        }
        savedWordIds.push(savedWord.word_id);

        const savedDefinition = await this.wordDefinitionsService.upsertInTrn(
          {
            definition: DEFAULT_MAP_WORD_DEFINITION,
            word_id: savedWord.word_id,
          },
          token,
          dbPoolClient,
        );
        if (!savedDefinition.word_definition_id) {
          console.error(
            `MapsService#parseAndSaveNewMap: Error ${savedDefinition.error} with saving definition for word ${wordInput}`,
          );
          continue;
        }
        savedDefinitionIds.push(savedDefinition.word_definition_id);

        const savedOrginalMapWord = await this.saveOriginalMapWordInTrn(
          { word_id: savedWord.word_id, original_map_id: map_id },
          dbPoolClient,
        );
      }

      // todo bind words to map and sustain other relations

      await dbPoolClient.query('COMMIT');

      return {
        map_file_name,
        original_map_id: map_id,
        created_at,
        created_by,
      };
    } catch (error) {
      await dbPoolClient.query('ROLLBACK');
    } finally {
      dbPoolClient.release();
    }
  }

  async getOrigMaps(): Promise<GetOrigMapsListOutput> {
    return this.mapsRepository.getOrigMaps();
  }

  // async getAllMaps(lang?: LanguageInput): Promise<GetAllMapsListOutput> {
  //   const origMaps = this.mapsRepository.getOrigMaps(lang);
  //   const translatedMaps = this.mapsRepository.getTranslatedMaps(lang);
  //   const allMaps = { ...origMaps, ...translatedMaps }
  //   return allMaps
  // }

  async getOrigMapContent(id: string): Promise<GetOrigMapContentOutput> {
    return this.mapsRepository.getOrigMapContent(id);
  }

  /**
   * Since we must concatenate word if it is divided into several subtags inside some texty tag,
   * we also have transformed file with replaced (concatenated) each texty tag.
   */
  parseSvgMapString(originalSvgString: string): {
    transformedSvgINode: INode;
    foundWords: string[];
  } {
    const svgAsINode = readSvg(originalSvgString);
    const foundWords: string[] = [];
    this.iterateOverINode(svgAsINode, SKIP_INODE_NAMES, (node) => {
      if (TEXTY_INODE_NAMES.includes(node.name)) {
        let currNodeAllText = node.value || '';
        if (node.children && node.children.length > 0) {
          this.iterateOverINode(node, [], (subNode) => {
            currNodeAllText += subNode.value;
          });
          node.children = [
            {
              value: currNodeAllText,
              type: 'text',
              name: '',
              children: [],
              attributes: {},
            },
          ]; // mutate svgAsINode, if node is texty and has children nodes, make it text with concatanated value from children's balues
        }

        if (!currNodeAllText) return;
        if (currNodeAllText.trim().length <= 1) return;
        if (!isNaN(Number(currNodeAllText))) return;
        const isExist = foundWords.findIndex((w) => w === currNodeAllText);
        if (isExist < 0) {
          foundWords.push(currNodeAllText);
        }
      }
    });
    return {
      transformedSvgINode: svgAsINode,
      foundWords,
    };
  }

  async saveOriginalMapWordInTrn(
    input: OriginalMapWordInput,
    dbPoolClient: PoolClient,
  ): Promise<{ original_map_word_id: string | null } & GenericOutput> {
    return this.mapsRepository.saveOriginalMapWordInTrn(input, dbPoolClient);
  }

  async getOrigMapWords(
    input: GetOrigMapWordsInput,
  ): Promise<GetOrigMapWordsOutput> {
    const { original_map_id, ...langRestrictions } = input;
    return this.mapsRepository.getOrigMapWords(
      original_map_id,
      langRestrictions,
    );
  }

  async translateMapsWithWordDefinitionId(
    wordDefinitionId: string,
    token: string,
  ): Promise<Array<string>> {
    const origMapIds = await this.mapsRepository.getOrigMapIdsByWordDefinition(
      wordDefinitionId,
    );
    const translatedMapsIds: string[] = [];
    for (const origMapId of origMapIds) {
      const translatedToSomeLanguages = await this.translateMapAndSave(
        origMapId,
        token,
      );
      translatedMapsIds.push(...translatedToSomeLanguages);
    }
    return translatedMapsIds;
  }

  async translateMapAndSave(
    origMapId,
    token,
    toLang?: LanguageInput,
  ): Promise<Array<string>> {
    const translatedMapIds: Array<string> = [];
    const { content: origMapContentStr } =
      await this.mapsRepository.getOrigMapContent(origMapId);

    const { origMapWords } = await this.getOrigMapWords({
      original_map_id: origMapId,
    });

    let targetLanguagesFullTags: Array<string>;
    if (toLang) {
      targetLanguagesFullTags = [
        subTags2Tag({
          lang: toLang.language_code,
          dialect: toLang.dialect_code,
          region: toLang.geo_code,
        }),
      ];
    } else {
      targetLanguagesFullTags = this.getLangFullTags(origMapWords);
    }

    for (const languageFullTag of targetLanguagesFullTags) {
      const language_code: string = tag2langInfo(languageFullTag).lang.tag;
      const dialect_code: string | undefined =
        tag2langInfo(languageFullTag)?.dialect?.tag;
      const geo_code: string | undefined =
        tag2langInfo(languageFullTag)?.region?.tag;

      const translations: Array<{
        source: string;
        translation: string;
      }> = [];
      for (const origWordTranslations of origMapWords) {
        const origWordTranslated =
          this.wordToWordTranslationsService.chooseBestTranslation(
            origWordTranslations,
            { language_code, dialect_code, geo_code },
          );
        translations.push({
          source: origWordTranslations.word,
          translation: origWordTranslated.word || origWordTranslations.word,
        });
      }

      const { translatedMap } = await this.translateMapString(
        origMapContentStr,
        translations,
      );

      const { map_id } = await this.mapsRepository.saveTranslatedMap({
        original_map_id: origMapId,
        fileBody: translatedMap,
        token,
        t_language_code: language_code,
        t_dialect_code: dialect_code,
        t_geo_code: geo_code,
      });
      translatedMapIds.push(map_id);

      console.log('translations', translations);
      console.log('translated_map_id', translatedMapIds);
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

  getLangFullTags(words: WordTranslations[]): Array<string> {
    const foundLangs: Array<string> = [];
    words.forEach((word) => {
      word.translations.forEach((tr) => {
        const currTag = subTags2Tag({
          lang: tr.language_code,
          region: tr.geo_code,
          dialect: tr.dialect_code,
        });
        if (foundLangs.findIndex((fl) => fl === currTag) < 0) {
          foundLangs.push(currTag);
        }
      });
    });
    return foundLangs;
  }
}
