import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { LanguageInput } from 'src/components/common/types';
import { ITranslator, LanguageResult } from './types';
import { getTranslatorTokenByEmailAndUsername } from './utility';

const openai = new OpenAI({
  //   apiKey: 'my api key', // defaults to process.env["OPENAI_API_KEY"]
});

type ChatGPTVersion = 'gpt-3.5-turbo' | 'gpt-4';
const CHAT_GPT_3_EMAIL = 'chatgpt-3@crowd.rocks';
const CHAT_GPT_3_USERNAME = 'chatgpt-3.5';

const CHAT_GPT_4_EMAIL = 'chatgpt-4@crowd.rocks';
const CHAT_GPT_4_USERNAME = 'chatgpt-4';

@Injectable()
export class ChatGPTService implements ITranslator {
  version: ChatGPTVersion;

  constructor(version: ChatGPTVersion) {
    this.version = version;
  }

  async translate(
    originalTexts: string[],
    from_language: LanguageInput,
    to_language: LanguageInput,
  ): Promise<string[]> {
    const params: OpenAI.Chat.ChatCompletionCreateParams = {
      messages: [{ role: 'user', content: 'Say this is a test' }],
      model: this.version,
    };
    const chatCompletion: OpenAI.Chat.ChatCompletion =
      await openai.chat.completions.create(params);

    console.log(chatCompletion.choices[0].message);

    return [''];
  }

  getTranslatorToken(): Promise<{ id: string; token: string }> {
    const { username, email } = this.getUserInfoForVersion(this.version);
    return getTranslatorTokenByEmailAndUsername(email, username);
  }

  getUserInfoForVersion(version: ChatGPTVersion) {
    if (version === 'gpt-3.5-turbo') {
      return {
        email: CHAT_GPT_3_EMAIL,
        username: CHAT_GPT_3_USERNAME,
      };
    } else {
      return {
        email: CHAT_GPT_4_EMAIL,
        username: CHAT_GPT_4_USERNAME,
      };
    }
  }

  async getLanguages(): Promise<LanguageResult[]> {
    // from GPT: The reason for not providing an exhaustive
    // list of languages is that GPT-3 doesn't rely on predefined
    // language pairs or translation dictionaries. Instead, it is a
    // language model that has learned patterns and relationships in
    // language from a vast amount of text data.
    return [{ name: '∞', code: '∞' }];
  }
}
