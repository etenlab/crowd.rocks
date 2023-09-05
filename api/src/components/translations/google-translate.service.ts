import { Injectable } from '@nestjs/common';
import { v2 } from '@google-cloud/translate';

import { LanguageInput } from '../common/types';

import { ConfigService } from 'src/core/config.service';

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
      texts.forEach((text) => {
        if (text.length >= LIMITS) {
          throw 'Input text too long';
        }
      });

      if (Date.now() - this.lastOperateTime > 60 * 1000) {
        this.availableCharactors = LIMITS;
      }

      let chunks = [];
      let translationTexts: string[] = [];

      const processApiCall = async () => {
        if (
          Date.now() - this.lastOperateTime < 60 * 1000 &&
          this.availableCharactors < 1
        ) {
          await delay(60 * 1000);
        }

        const [translations] = await this.gcpTranslateClient.translate(
          chunks.join('\n'),
          {
            from: from.language_code,
            to: to.language_code,
          },
        );

        translationTexts = [...translationTexts, ...translations.split('\n')];

        chunks = [];
        this.lastOperateTime = Date.now();
        this.availableCharactors = LIMITS;
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

  async getLanguages() {
    const [languages] = await this.gcpTranslateClient.getLanguages();

    return languages;
  }
}