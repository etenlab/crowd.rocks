import { Injectable } from '@nestjs/common';
// import { convert } from 'html-to-text';

import { LanguageInput } from '../common/types';
import { ConfigService } from 'src/core/config.service';
import { LanguageResult } from './translations.service';
// import { substituteN, unSubstituteN } from '../../common/utility';

const LIMIT_REQUESTS = 4000; // per LIMIT_TIME
const LIMIT_TIME = 60 * 1000; // per minute
const WAIT_TIMEOUT = 60 * 1000; // miliseconds; if limit_requests reached, need to wait 60 seconds before the next request
const LIMIT_LENGTH = 5000; // characters of a source string per request
const JOINER = '.<br/>'; // joins words or phrases before sending to lilt api

function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

@Injectable()
export class LiltTranslateService {
  private firstOperateTime: number;
  private lastOperateTime: number;
  private availableRequests: number;

  constructor(private config: ConfigService) {
    this.firstOperateTime = 0;
    this.lastOperateTime = 0;
    this.availableRequests = LIMIT_REQUESTS;
  }

  async liltTranslate(
    origStr,
    from: LanguageInput,
    to: LanguageInput,
  ): Promise<string> {
    //todo
    return origStr;
  }

  processApiCall = async (
    chunks: Array<string>,
    from: LanguageInput,
    to: LanguageInput,
  ): Promise<Array<string>> => {
    if (!(chunks?.length > 0)) return [];
    if (
      Date.now() - this.firstOperateTime < 60 * LIMIT_TIME &&
      this.availableRequests < 1
    ) {
      await delay(WAIT_TIMEOUT);
      this.availableRequests = LIMIT_REQUESTS;
    }

    const translation = await this.liltTranslate(chunks.join(JOINER), from, to);
    const translatedChunks = translation.split(JOINER);

    this.lastOperateTime = Date.now();
    this.availableRequests--;
    return translatedChunks;
  };

  async translate(
    texts: string[],
    from: LanguageInput,
    to: LanguageInput,
  ): Promise<string[]> {
    try {
      texts.forEach((text) => {
        if (text.length >= LIMIT_LENGTH - JOINER.length) {
          throw new Error(
            `Input text too long, more than ${LIMIT_LENGTH - JOINER.length}`,
          );
        }
      });

      let chunks: string[] = [];
      const translatedTexts: string[] = [];
      let availableCharacters = LIMIT_LENGTH;

      for (const text of texts) {
        if (availableCharacters < text.length + JOINER.length) {
          translatedTexts.push(
            ...(await this.processApiCall(chunks, from, to)),
          );
          chunks = [];
          availableCharacters = LIMIT_LENGTH;
        }
        chunks.push(text);
        availableCharacters = availableCharacters - text.length - JOINER.length;
      }
      // last one
      translatedTexts.push(...(await this.processApiCall(chunks, from, to)));

      return translatedTexts;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async getLanguages(): Promise<LanguageResult[]> {
    //todo
    return [
      {
        code: 'uk',
        name: 'Ukrainian (mocked)',
      },
      {
        code: 'pl',
        name: 'Polish (mocked)',
      },
    ];
  }
}
