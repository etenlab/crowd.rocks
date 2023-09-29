import { Injectable } from '@nestjs/common';
import { v2 } from '@google-cloud/translate';
import { convert } from 'html-to-text';

import { LanguageInput } from '../common/types';

import { ConfigService } from 'src/core/config.service';
import { substituteN, unSubstituteN } from '../../common/utility';
import { LanguageResult } from './translations.service';

const LIMITS = 6000000 - 1000000;

function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

@Injectable()
export class GoogleTranslateService {
  private gcpTranslateClient: v2.Translate | null;
  private availableCharactors: number;
  private lastOperateTime: number;

  constructor(private config: ConfigService) {
    if (
      this.config.GCP_API_KEY &&
      this.config.GCP_API_KEY.trim().length > 0 &&
      this.config.GCP_PROJECT_ID &&
      this.config.GCP_PROJECT_ID.trim().length > 0
    ) {
      this.gcpTranslateClient = new v2.Translate({
        projectId: this.config.GCP_PROJECT_ID,
        key: this.config.GCP_API_KEY,
      });

      this.lastOperateTime = 0;
    }
  }

  async translate(
    texts: string[],
    from: LanguageInput,
    to: LanguageInput,
  ): Promise<string[]> {
    try {
      if (!this.gcpTranslateClient) {
        throw new Error('no translation client');
      }

      texts.forEach((text) => {
        if (text.length >= LIMITS) {
          throw new Error('Input text too long');
        }
      });

      if (Date.now() - this.lastOperateTime > 60 * 1000) {
        this.availableCharactors = LIMITS;
      }

      let chunks: string[] = [];
      let translationTexts: string[] = [];

      const processApiCall = async () => {
        if (
          Date.now() - this.lastOperateTime < 60 * 1000 &&
          this.availableCharactors < 1
        ) {
          await delay(60 * 1000);
          this.availableCharactors = LIMITS;
        }

        const [translations] = await this.gcpTranslateClient!.translate(
          substituteN(chunks).join('<br/>'),
          {
            from: from.language_code,
            to: to.language_code,
            format: 'html',
          },
        );

        translationTexts = [
          ...translationTexts,
          ...unSubstituteN(
            translations
              .split('<br/>')
              .map((translation) => convert(translation)),
          ),
        ];

        chunks = [];
        this.lastOperateTime = Date.now();
      };

      for (const text of texts) {
        if (this.availableCharactors < text.length) {
          this.availableCharactors -= text.length;
          await processApiCall();
        }

        chunks.push(text);
        this.availableCharactors = this.availableCharactors - text.length;
      }

      if (chunks.length > 0) {
        await processApiCall();
      }

      return translationTexts;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async getLanguages(): Promise<LanguageResult[]> {
    if (!this.gcpTranslateClient) {
      throw new Error('no translate client');
    }

    const [googleLanguageResults] =
      await this.gcpTranslateClient!.getLanguages();

    // explisit cast just to be obvious that we return our LanguageResult interface, not google's v2.LanguageRsult
    return googleLanguageResults.map((gl) => ({
      code: gl.code,
      name: gl.name,
    }));
  }
}
