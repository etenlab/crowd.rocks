import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { LanguageInput } from 'src/components/common/types';
import {
  ChatGPTVersion,
  IGPTTranslator,
  LanguageListForBotTranslateOutput,
} from './types';
import { delay, getTranslatorTokenByEmailAndUsername } from './utility';
import { ErrorType } from '../../common/types';
import { PostgresService } from 'src/core/postgres.service';
import { ConfigService } from 'src/core/config.service';

const openai = new OpenAI({
  //   apiKey: 'my api key', // defaults to process.env["OPENAI_API_KEY"]
});

const CHAT_GPT_3_EMAIL = 'chatgpt-3@crowd.rocks';
const CHAT_GPT_3_USERNAME = 'chatgpt-3.5';

const CHAT_GPT_4_EMAIL = 'chatgpt-4@crowd.rocks';
const CHAT_GPT_4_USERNAME = 'chatgpt-4';

const LIMIT_REQUESTS = 4000; // per LIMIT_TIME
const LIMIT_TOKENS = 40000; // per LIMIT_TIME
const LIMIT_TIME = 60 * 1000; // per minute
const WAIT_TIMEOUT = 60 * 1000; // miliseconds; if limit_requests reached, need to wait 60 seconds before the next request
const LIMIT_LENGTH = 1000; // characters of a source string per request
const JOINER = '.<br/>'; // joins words or phrases before sending to api, not doing chunks for now, though

@Injectable()
export class ChatGPTService implements IGPTTranslator {
  private pg: PostgresService;
  private firstOperateTime: number;
  private lastOperateTime: number;
  private availableRequests: number;
  private availableTokens: number;

  constructor(pg: PostgresService, private config: ConfigService) {
    this.pg = pg;
    this.firstOperateTime = 0;
    this.lastOperateTime = 0;
    this.availableRequests = LIMIT_REQUESTS;
    this.availableTokens = LIMIT_TOKENS;
  }

  processApiCall = async (
    chunks: Array<string>,
    from: LanguageInput,
    to: LanguageInput,
    version: ChatGPTVersion,
  ): Promise<Array<string>> => {
    if (!(chunks?.length > 0)) return [];
    if (
      Date.now() - this.firstOperateTime < 60 * LIMIT_TIME &&
      this.availableRequests < 1 &&
      this.availableTokens < 1
    ) {
      await delay(WAIT_TIMEOUT);
      this.availableRequests = LIMIT_REQUESTS;
      this.availableTokens = LIMIT_TOKENS;
    }

    const translation = await this.chatTranslate(chunks, from, to, version);
    const translatedChunks = translation.split(JOINER);

    this.lastOperateTime = Date.now();
    this.availableRequests--;
    return translatedChunks;
  };

  async translate(
    texts: string[],
    from: LanguageInput,
    to: LanguageInput,
    version: ChatGPTVersion,
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
        translatedTexts.push(
          ...(await this.processApiCall(chunks, from, to, version)),
        );
        // for now, each chunk will be the size of one because
        // chatgpt handles requests differently based on the
        // number of tokens of both the request and the response
        chunks = [];
        chunks.push(text);
        availableCharacters = availableCharacters - text.length - JOINER.length;
      }

      return translatedTexts;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async chatTranslate(
    origStr,
    from: LanguageInput,
    to: LanguageInput,
    version: ChatGPTVersion,
  ): Promise<string> {
    const dialectStrPrefix = `with dialect code=`;
    const geoCodePrefix = `with geo code=`;
    let fromLangPhrase = `from language with language code=${from.language_code}`;
    fromLangPhrase += from.dialect_code
      ? dialectStrPrefix + from.dialect_code
      : '';
    fromLangPhrase += from.geo_code ? geoCodePrefix + from.geo_code : '';

    let toLangPhrase = `to language with language code=${to.language_code}`;
    toLangPhrase += to.dialect_code ? dialectStrPrefix + to.dialect_code : '';
    toLangPhrase += to.geo_code ? geoCodePrefix + to.geo_code : '';

    const formatPhrase =
      'format your answer as a string showing only translation';

    const translateCmd = `Translate '${origStr}' ${fromLangPhrase} ${toLangPhrase} ${formatPhrase}`;
    console.log(translateCmd);

    const params: OpenAI.Chat.ChatCompletionCreateParams = {
      messages: [
        {
          role: 'user',
          content: translateCmd,
        },
      ],
      model: version,
    };
    const chatCompletion: OpenAI.Chat.ChatCompletion =
      await openai.chat.completions.create(params);

    console.log(chatCompletion.choices[0].message.content);
    this.availableTokens -= chatCompletion.usage?.total_tokens ?? 0;
    return chatCompletion.choices[0].message.content ?? '';
  }

  getTranslatorToken = (
    version: ChatGPTVersion,
  ): Promise<{
    id: string;
    token: string;
  }> => {
    const { username, email, password } = this.getUserInfoForVersion(version);
    return getTranslatorTokenByEmailAndUsername(
      email,
      username,
      password,
      this.pg,
    );
  };

  getUserInfoForVersion(version: ChatGPTVersion) {
    if (version === ChatGPTVersion.Three) {
      return {
        email: CHAT_GPT_3_EMAIL,
        username: CHAT_GPT_3_USERNAME,
        password: this.config.CR_GPT_3_PASSWORD,
      };
    } else {
      return {
        email: CHAT_GPT_4_EMAIL,
        username: CHAT_GPT_4_USERNAME,
        password: this.config.CR_GPT_4_PASSWORD,
      };
    }
  }

  async getLanguages(): Promise<LanguageListForBotTranslateOutput> {
    // from GPT: The reason for not providing an exhaustive
    // list of languages is that GPT-3 doesn't rely on predefined
    // language pairs or translation dictionaries. Instead, it is a
    // language model that has learned patterns and relationships in
    // language from a vast amount of text data.
    return { error: ErrorType.NoError, languages: [{ name: '∞', code: '∞' }] };
  }
}
