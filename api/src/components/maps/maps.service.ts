import { Injectable } from '@nestjs/common';
import { ReadStream } from 'fs';

import { PostgresService } from 'src/core/postgres.service';
import {
  GetOrigMapContentOutput,
  GetOrigMapsListOutput,
  MapFileOutput,
} from './types';
import { type INode } from 'svgson';
import { parseSync as readSvg } from 'svgson';
import { WordsService } from '../words/words.service';
import { MapsRepository } from './maps.repository';

const TEXTY_INODE_NAMES = ['text', 'textPath']; // Final nodes of text. All children nodes' values will be gathered and concatenated into one value
const SKIP_INODE_NAMES = ['rect', 'style', 'clipPath', 'image', 'rect']; // Nodes that definitenly don't contain any text. skipped for a performance purposes.

@Injectable()
export class MapsService {
  constructor(
    private mapsRepository: MapsRepository,
    private wordsService: WordsService,
  ) {}
  async parseAndSaveNewMap(
    readStream: ReadStream,
    mapFileName: string,
    token: string,
  ): Promise<MapFileOutput> {
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

    const { map_file_name, original_map_id, created_at, created_by } =
      await this.mapsRepository.saveOriginalMap({
        mapFileName,
        fileBody,
        token,
      });

    return {
      map_file_name,
      original_map_id,
      created_at,
      created_by,
    };
  }

  async getOrigMaps(): Promise<GetOrigMapsListOutput> {
    return this.mapsRepository.getOrigMaps();
  }

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
}
