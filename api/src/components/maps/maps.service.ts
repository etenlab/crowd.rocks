import { Injectable } from '@nestjs/common';
import { ReadStream } from 'fs';

import {
  GetAllMapsListOutput,
  GetOrigMapContentOutput,
  GetOrigMapPhrasesInput,
  GetOrigMapPhrasesOutput,
  GetOrigMapsListOutput,
  GetOrigMapWordsInput,
  GetOrigMapWordsOutput,
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
import { DefinitionsService } from '../definitions/definitions.service';

// const TEXTY_INODE_NAMES = ['text', 'textPath']; // Final nodes of text. All children nodes' values will be gathered and concatenated into one value
const POSSIBLE_TEXTY_INODE_NAMES = ['text']; // Considered as final node of text if doesn't have other children texty nodes.
const TEXTY_INODE_NAMES = ['tspan']; // Final nodes of text. All children nodes' values will be gathered and concatenated into one value
const SKIP_INODE_NAMES = ['rect', 'style', 'clipPath', 'image', 'rect']; // Nodes that definitenly don't contain any text. skipped for a performance purposes.
const DEFAULT_MAP_WORD_DEFINITION = 'A geographical place';
const DEFAULT_MAP_PHRASE_DEFINITION = 'A geographical place phrase';
const WORDS_SEPARATOR = ' ';

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
    private phrasesService: PhrasesService,
    private phraseDefinitionsService: PhraseDefinitionsService,
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
    const language_code = mapLanguage.lang.tag;
    const dialect_code = mapLanguage.dialect?.tag;
    const geo_code = mapLanguage.region?.tag;

    const { transformedSvgINode, foundWords, foundPhrases } =
      this.parseSvgMapString(fileBody);

    const dbPoolClient = await this.pg.pool.connect();
    try {
      dbPoolClient.query('BEGIN');

      //-- Save map

      const { map_file_name, map_id, created_at, created_by } =
        await this.mapsRepository.saveOriginalMap({
          mapFileName,
          fileBody,
          token,
          dbPoolClient,
          language_code,
          dialect_code,
          geo_code,
        });

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
    } catch (error) {
      await dbPoolClient.query('ROLLBACK');
      throw error;
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
    const translatedMaps = await this.mapsRepository.getTranslatedMaps(lang);
    const allMapsList = [
      ...origMaps.origMapList,
      ...translatedMaps.origMapList,
    ];
    return { allMapsList };
  }

  async getOrigMapContent(id: string): Promise<GetOrigMapContentOutput> {
    return this.mapsRepository.getOrigMapContent(id);
  }

  async getTranslatedMapContent(id: string): Promise<GetOrigMapContentOutput> {
    return this.mapsRepository.getTranslatedMapContent(id);
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
            currNodeAllText = null; // if possible texty inode has inner texty nodes, do nothing here and dive deeper to inspect these inner nodes.
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
      original_map_id,
      langRestrictions,
    );
  }

  async getOrigMapPhrases(
    input: GetOrigMapPhrasesInput,
  ): Promise<GetOrigMapPhrasesOutput> {
    const { original_map_id, ...langRestrictions } = input;
    const origMapPhrases = await this.mapsRepository.getOrigMapPhrases(
      original_map_id,
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
      wordOrPhrase.translations.forEach((tr) => {
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

    return this.translateOrigMapsByIds(origMapIds, token);
  }

  async translateOrigMapsByIds(
    origMapIds: Array<string>,
    token: string,
  ): Promise<Array<string>> {
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

  async translateMapsWithDefinitionId({
    from_definition_id,
    from_definition_type_is_word,
    token,
  }: {
    from_definition_id: string;
    from_definition_type_is_word: boolean;
    token: string;
  }): Promise<Array<string>> {
    let origMapIds = [];
    if (from_definition_type_is_word) {
      origMapIds = await this.mapsRepository.getOrigMapsIdsByWordDefinition(
        from_definition_id,
      );
    } else {
      origMapIds = await this.mapsRepository.getOrigMapsIdsByPhraseDefinition(
        from_definition_id,
      );
    }
    return this.translateOrigMapsByIds(origMapIds, token);
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
          dialect: toLang.dialect_code,
          region: toLang.geo_code,
        }),
      ];
    } else {
      targetLanguagesFullTags = this.getLangFullTags(origMapWordsAndPhrases);
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
      for (const origMapWordOrPhrase of origMapWordsAndPhrases) {
        const origWordOrPhraseTranslated =
          this.wordToWordTranslationsService.chooseBestTranslation(
            origMapWordOrPhrase,
            { language_code, dialect_code, geo_code },
          );
        if ('word' in origMapWordOrPhrase) {
          if (
            'word' in origWordOrPhraseTranslated &&
            origWordOrPhraseTranslated.word.length > 0
          ) {
            translations.push({
              source: origMapWordOrPhrase.word,
              translation: origWordOrPhraseTranslated.word,
            });
          } else if (
            'phrase' in origWordOrPhraseTranslated &&
            origWordOrPhraseTranslated.phrase.length > 0
          ) {
            translations.push({
              source: origMapWordOrPhrase.word,
              translation: origWordOrPhraseTranslated.phrase,
            });
          }
        } else {
          if (
            'word' in origWordOrPhraseTranslated &&
            origWordOrPhraseTranslated.word.length > 0
          ) {
            translations.push({
              source: origMapWordOrPhrase.phrase,
              translation: origWordOrPhraseTranslated.word,
            });
          } else if (
            'phrase' in origWordOrPhraseTranslated &&
            origWordOrPhraseTranslated.phrase.length > 0
          ) {
            translations.push({
              source: origMapWordOrPhrase.phrase,
              translation: origWordOrPhraseTranslated.phrase,
            });
          }
        }
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

  getLangFullTags(
    wordsOrPhrases: Array<MapWordTranslations | MapPhraseTranslations>,
  ): Array<string> {
    const foundLangs: Array<string> = [];
    wordsOrPhrases.forEach((wordOrPhrase) => {
      wordOrPhrase.translations.forEach((tr) => {
        if (!tr.language_code)
          throw new Error(
            `word or phrase translation id ${JSON.stringify(
              tr,
            )} does't have language tag`,
          );
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
