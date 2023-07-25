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

const TEXTY_INODE_NAMES = ['text', 'textPath']; // Final nodes of text. All children nodes' values will be gathered and concatenated into one value
const SKIP_INODE_NAMES = ['rect', 'style', 'clipPath', 'image', 'rect']; // Nodes that definitenly don't contain any text. skipped for a performance purposes.

@Injectable()
export class MapsService {
  constructor(private pg: PostgresService) {}
  async createAndSaveMap(
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

    console.log('transformedSvgINode ', transformedSvgINode);
    console.log('foundWords ', foundWords);

    let res;
    try {
      //TODO: make some abstraction on DB procedures call with errors handling
      res = await this.pg.pool.query(
        `
          call original_map_create($1,$2,$3, null,null,null,null)
        `,
        [mapFileName, fileBody, token],
      );
      console.log(
        'sql stored proc message: ',
        JSON.stringify(res.rows[0].p_error_type),
      );
    } catch (error) {
      console.log(`Caught error ${error}`);
    }

    return {
      map_file_name: mapFileName,
      original_map_id: res.rows[0].p_original_map_id,
      created_at: res.rows[0].p_created_at,
      created_by: res.rows[0].p_created_by,
    };
  }

  async getOrigMaps(): Promise<GetOrigMapsListOutput> {
    const resQ = await this.pg.pool.query(
      `
        select original_map_id, map_file_name, created_at, created_by from original_maps
      `,
      [],
    );

    const origMapList = resQ.rows.map(
      ({ original_map_id, map_file_name, created_at, created_by }) => ({
        original_map_id,
        map_file_name,
        created_at,
        created_by,
      }),
    );

    return { origMapList };
  }

  async getOrigMapContent(id: string): Promise<GetOrigMapContentOutput> {
    const resQ = await this.pg.pool.query(
      `
        select content, map_file_name, created_at, created_by from original_maps where original_map_id = $1
      `,
      [id],
    );

    return {
      original_map_id: String(id),
      map_file_name: resQ.rows[0].map_file_name,
      created_at: resQ.rows[0].created_at,
      created_by: resQ.rows[0].created_by,
      content: resQ.rows[0].content,
    };
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
