import { PoolClient } from 'pg';
import { LanguageInput } from 'src/components/common/types';
import {
  LanguageListForBotTranslateOutput,
  TranslateAllWordsAndPhrasesByBotOutput,
} from '../types';

export interface ITranslationBot {
  getLanguages: () => Promise<LanguageListForBotTranslateOutput>;
  translateWordsAndPhrases: (
    from_language: LanguageInput,
    to_language: LanguageInput,
    token: string,
    pgClient?: PoolClient | null,
  ) => Promise<TranslateAllWordsAndPhrasesByBotOutput>;
}

export interface ITranslator {
  translate: (
    originalTexts: string[],
    from_language: LanguageInput,
    to_language: LanguageInput,
  ) => Promise<string[]>;
  getTranslatorToken: () => Promise<{ id: string; token: string }>;
  getLanguages(): Promise<LanguageResult[]>;
}

export interface LanguageResult {
  code: string;
  name: string;
}

export const LIMITS = 6000000 - 1000000;

export const GOOGLE_BOT_EMAIL = 'googlebot@crowd.rocks';
