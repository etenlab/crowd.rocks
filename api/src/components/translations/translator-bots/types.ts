import { LanguageInput } from 'src/components/common/types';
import { LanguageListForBotTranslateOutput } from '../types';

export interface ITranslator {
  translate: (
    originalTexts: string[],
    from_language: LanguageInput,
    to_language: LanguageInput,
  ) => Promise<string[]>;
  getTranslatorToken: () => Promise<{ id: string; token: string }>;
  getLanguages(): Promise<LanguageListForBotTranslateOutput>;
}

export const LIMITS = 6000000 - 1000000;

export const GOOGLE_BOT_EMAIL = 'googlebot@crowd.rocks';
