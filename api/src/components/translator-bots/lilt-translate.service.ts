import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { hash } from 'argon2';
import { createToken } from 'src/common/utility';
import { LanguageInput } from 'src/components/common/types';
import { ConfigService } from 'src/core/config.service';
import { PostgresService } from 'src/core/postgres.service';
import { ErrorType, GenericOutput } from '../../common/types';
import {
  ITranslator,
  LanguageForBotTranslate,
  LanguageListForBotTranslateOutput,
} from './types';
import fetch, { Headers } from 'node-fetch';
import {
  getLangsRegistry,
  languageInput2tag,
  sortSiteTextFn,
} from '../../../../utils';
import { Readable } from 'stream';
import { delay } from './utility';

const LIMIT_REQUESTS = 4000; // per LIMIT_TIME
const LIMIT_TIME = 60 * 1000; // per minute
const WAIT_TIMEOUT = 60 * 1000 + 100; // miliseconds; if limit_requests reached, need to wait 60 seconds before the next request
const LIMIT_LENGTH = 5000; // characters of a source string per request
const JOINER = '<br/>'; // joins words or phrases before sending to lilt api
const FILE_TRANSLATION_CHECK_INTERVALS = [1000, 2000, 5000, 7000, 10000];

const LILT_BOT_EMAIL = 'liltbot@crowd.rocks';
const LILT_API_URL = 'https://lilt.com/2';

export enum liltTranslationStatus {
  IN_PROGRESS = 'InProgress',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
  READY_FOR_DOWNLOAD = 'ReadyForDownload',
}

type TResLangs = {
  source_to_target: {
    [key: string]: { [key: string]: boolean };
  };
  code_to_name: {
    [key: string]: string;
  };
};

type TLiltMemoryObject = {
  id: number;
  srclang: string;
  trglang: string;
  srclocale: string;
  trglocale: string;
  name: string;
  version: number;
  created_at: number;
  updated_at: number;
  resources: string[];
};

type TLiltMemoryCreateBody = {
  name: string;
  srclang: string;
  trglang: string;
  srclocale?: string;
  trglocale?: string;
};

type TlilitTranslateResponce = {
  untokenizedSource: string;
  tokenizedSource: string;
  sourceDelimiters: string[];
  translation: Array<
    [
      {
        score: number;
        align: string;
        targetDelimiters: string[];
        targetWords: string[];
        target: string;
        targetWithTags: string;
        isTMMatch: boolean;
        provenance: string;
      },
    ]
  >;
};

type TLiltSourceFile = {
  id: number;
  name: string;
  file_hash: string;
  detected_lang: string;
  detected_lang_confidence: number;
  category: string;
  labels: string[];
  created_at: string;
  updated_at: string;
};

type TLiltTranslationOfFile = {
  id: number;
  fileId: number;
  status: string;
  createdAt: string;
};

type TLiltDeleteFileRes = {
  id: number;
  deleted: boolean;
};

@Injectable()
export class LiltTranslateService implements ITranslator {
  private firstOperateTime: number;
  private lastOperateTime: number;
  private availableRequests: number;

  constructor(private config: ConfigService, private pg: PostgresService) {
    this.firstOperateTime = 0;
    this.lastOperateTime = 0;
    this.availableRequests = LIMIT_REQUESTS;
  }

  private async liltTranslateApiCall(origStr, memoryId: number): Promise<any> {
    const strEncoded = encodeURIComponent(origStr);
    const url = `${LILT_API_URL}/translate?key=${this.config.LILT_KEY}&memory_id=${memoryId}&source=${strEncoded}`;
    const res = await fetch(url, {
      method: 'GET',
    });
    const translatedObj = (await res.json()) as TlilitTranslateResponce;
    return translatedObj;
  }

  private liltMemoryName(
    fromLang: LanguageInput,
    toLang: LanguageInput,
  ): string {
    const s_langFullTag = languageInput2tag(fromLang);
    const t_langFullTag = languageInput2tag(toLang);
    return `liltbot@crowd.rocks-${s_langFullTag}-${t_langFullTag}`;
  }

  private async liltGetMemoriesApiCall(): Promise<TLiltMemoryObject[]> {
    const url = `${LILT_API_URL}/memories?key=${this.config.LILT_KEY}`;
    const res = await fetch(url, {
      method: 'GET',
    });
    const liltMemoriesRes = await res.json();
    if (!(liltMemoriesRes?.length > 0)) {
      Logger.error(
        `liltTranslateService#liltGetMemoryIdApiCall: ${JSON.stringify(
          liltMemoriesRes,
        )}`,
      );
      return [];
    }
    return liltMemoriesRes as TLiltMemoryObject[];
  }

  private async liltCreateMemoryIdApiCall(
    fromLang: LanguageInput,
    toLang: LanguageInput,
  ): Promise<TLiltMemoryObject | null> {
    const reqBody: TLiltMemoryCreateBody = {
      name: this.liltMemoryName(fromLang, toLang),
      srclang: fromLang.language_code,
      trglang: toLang.language_code,
    };
    if (fromLang.geo_code) {
      reqBody.srclocale = fromLang.geo_code;
    }
    if (toLang.geo_code) {
      reqBody.trglocale = toLang.geo_code;
    }
    const body = JSON.stringify(reqBody);

    const url = `${LILT_API_URL}/memories?key=${this.config.LILT_KEY}`;
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    const liltCrerateMemoryRes = await res.json();
    if (!liltCrerateMemoryRes?.id) {
      Logger.error(
        `liltTranslateService#liltCreateMemoryIdApiCall: ${JSON.stringify(
          liltCrerateMemoryRes,
        )}`,
      );
      return null;
    }
    return liltCrerateMemoryRes as TLiltMemoryObject;
  }

  private async getLiltMemoryId(
    fromLang: LanguageInput,
    toLang: LanguageInput,
  ): Promise<TLiltMemoryObject | undefined> {
    const existingMemories = await this.liltGetMemoriesApiCall();
    const foundMemory = existingMemories.find(
      (memory) => memory.name === this.liltMemoryName(fromLang, toLang),
    );
    if (foundMemory?.id) {
      Logger.log(`Lilt memory found, id: ${foundMemory.id}`);
      return foundMemory;
    }

    const newMemory = await this.liltCreateMemoryIdApiCall(fromLang, toLang);
    if (newMemory?.id) {
      Logger.log(`Lilt memory created: ${newMemory.id}`);
      return newMemory;
    }

    Logger.log(
      `Error with find or create Lilt memory: ${JSON.stringify(
        foundMemory,
      )},${JSON.stringify(newMemory)}`,
    );
    return undefined;
  }

  // specific to Lilt methods:

  private async sendFileToLilt(
    fileString: string,
    fileName: string,
  ): Promise<TLiltSourceFile | undefined> {
    const url = `${LILT_API_URL}/files?key=${this.config.LILT_KEY}&name=${fileName}&labels=crowdrocks_bot`;
    const headers = new Headers();
    headers.append('Content-Type', 'application/octet-stream');
    headers.append('Accept', 'application/json');
    const body = Readable.from(fileString);

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    const sourceFile: TLiltSourceFile = await res.json();
    if (sourceFile.id) {
      Logger.log(`file is uploaded to Lilt, id: ${sourceFile.id}`);
      return sourceFile;
    } else {
      Logger.error(
        `Error with file upload to Lilt: ${JSON.stringify(sourceFile)}`,
      );
    }
  }

  private async startFileTranslation(
    fileId: number,
    memoryId: number,
  ): Promise<TLiltTranslationOfFile | undefined> {
    const url = `${LILT_API_URL}/translate/file?key=${this.config.LILT_KEY}&fileId=${fileId}&memoryId=${memoryId}`;
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    const res = await fetch(url, {
      method: 'POST',
      headers,
    });

    const fileTranslation: TLiltTranslationOfFile[] = await res.json();
    if (fileTranslation[0].id) {
      Logger.log(
        `file translation with Lilt has started. ${JSON.stringify(
          fileTranslation,
        )}`,
      );
      return fileTranslation[0];
    } else {
      Logger.error(
        `Error translation with Lilt: ${JSON.stringify(fileTranslation)}`,
      );
    }
  }

  private async checkFileTranslationStatus(
    translationId: number,
  ): Promise<TLiltTranslationOfFile | undefined> {
    const url = `${LILT_API_URL}/translate/file?key=${this.config.LILT_KEY}&translationIds=${translationId}`;
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    const res = await fetch(url, {
      method: 'GET',
      headers,
    });

    const fileTranslation: TLiltTranslationOfFile[] = await res.json();
    if (fileTranslation[0].id) {
      Logger.log(
        `file translation status checked: ${JSON.stringify(fileTranslation)}`,
      );
      return fileTranslation[0];
    } else {
      Logger.error(
        `Error translation check failed: ${JSON.stringify(fileTranslation)}`,
      );
    }
  }

  private async getTranslatedFile(
    translationId: number,
  ): Promise<string | undefined> {
    const url = `${LILT_API_URL}/translate/files?key=${this.config.LILT_KEY}&id=${translationId}`;
    const headers = new Headers();
    headers.append('Accept', 'application/octet-stream');

    const res = await fetch(url, {
      method: 'GET',
      headers,
    });
    const sourceFile = await res.text();

    if (sourceFile) {
      Logger.log(`translated file is downloaded from Lilt`);
      return sourceFile;
    } else {
      Logger.error(
        `Error with file upload to Lilt: ${JSON.stringify(sourceFile)}`,
      );
    }
  }

  private async deleteFileFromLilt(fileId: number): Promise<true | undefined> {
    const url = `${LILT_API_URL}/files?key=${this.config.LILT_KEY}&id=${fileId}`;
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    const res = await fetch(url, {
      method: 'DELETE',
      headers,
    });
    if (res.status === HttpStatus.NO_CONTENT) {
      Logger.log(`translated file deleted from Lilt`);
      return true;
    } else {
      Logger.error(
        `Error with file upload to Lilt: ${JSON.stringify(res.json())}`,
      );
    }
  }

  private async waitForTranslation(
    translationId: number,
    intervals: Array<number>,
  ): Promise<liltTranslationStatus | undefined> {
    let attempts = 0;
    let liltTrStatus: TLiltTranslationOfFile | undefined;
    for (const interval of intervals) {
      await delay(interval);
      attempts++;
      liltTrStatus = await this.checkFileTranslationStatus(translationId);
      if (
        liltTrStatus?.status &&
        [
          liltTranslationStatus.FAILED as string,
          liltTranslationStatus.READY_FOR_DOWNLOAD as string,
        ].includes(liltTrStatus.status)
      ) {
        Logger.log(
          `Lilt translation completed in ${attempts} attempts, status ${liltTrStatus.status}`,
        );
        return liltTrStatus.status as liltTranslationStatus;
      }
    }
    Logger.error(
      `Lilt translation failed, used ${attempts} attempts. last status ${JSON.stringify(
        liltTrStatus,
      )}`,
    );
  }

  public translateFileString = async (
    fileString: string,
    fileName: string,
    fromLang: LanguageInput,
    toLang: LanguageInput,
  ): Promise<GenericOutput & { translatedFileString?: string }> => {
    const memory = await this.getLiltMemoryId(fromLang, toLang);
    if (!memory) {
      Logger.error(`LiltTranslateService#translateFile: !memory`);
      return {
        error: ErrorType.BotTranslationError,
      };
    }
    const sourceFile = await this.sendFileToLilt(fileString, fileName);
    if (!sourceFile) {
      Logger.error(`LiltTranslateService#translateFile: !sourceFile`);
      return {
        error: ErrorType.BotTranslationError,
      };
    }
    try {
      const translation = await this.startFileTranslation(
        sourceFile?.id,
        memory?.id,
      );
      if (!translation) {
        Logger.error(`LiltTranslateService#translateFile: !translation`);
        return {
          error: ErrorType.BotTranslationError,
        };
      }
      const result = await this.waitForTranslation(
        translation.id,
        FILE_TRANSLATION_CHECK_INTERVALS,
      );
      if (result != liltTranslationStatus.READY_FOR_DOWNLOAD) {
        Logger.error(`LiltTranslateService#translateFile: result is ${result}`);
        return {
          error: ErrorType.BotTranslationError,
        };
      }
      const translatedFile = await this.getTranslatedFile(translation.id);
      if (!translatedFile) {
        Logger.error(`LiltTranslateService#translateFile: !translatedFile`);
        return {
          error: ErrorType.BotTranslationError,
        };
      }
      const deleteFile = await this.deleteFileFromLilt(sourceFile.id);
      if (!deleteFile) {
        Logger.error(`LiltTranslateService#translateFile: !deleteFile`);
      }

      return {
        error: ErrorType.NoError,
        translatedFileString: translatedFile,
      };
    } catch (error) {
      Logger.error(
        `LiltTranslateService#translateFile: unknown error: ${JSON.stringify(
          error,
        )}`,
      );
      return {
        error: ErrorType.BotTranslationError,
      };
    } finally {
      Logger.log(
        `LiltTranslateService#translateFile: Finally check file cleanup`,
      );
      await this.deleteFileFromLilt(sourceFile.id);
    }
  };

  // mandatory ITranslator intefrace methods:

  public translate = async (
    texts: string[],
    fromLang: LanguageInput,
    toLang: LanguageInput,
  ): Promise<string[]> => {
    try {
      texts.forEach((text) => {
        if (text.length >= LIMIT_LENGTH - JOINER.length) {
          Logger.error(
            `Input text too long, more than ${LIMIT_LENGTH - JOINER.length}`,
          );
          return [];
        }
      });

      const memoryId = await this.getLiltMemoryId(fromLang, toLang);
      if (!memoryId) {
        Logger.error(
          `liltTranslateService#translate: lilt memory Id is undefined`,
        );
        return [];
      }

      const translationPromises: Array<any> = [];
      this.firstOperateTime = Date.now();
      for (const text of texts) {
        if (
          Date.now() - this.firstOperateTime < LIMIT_TIME &&
          this.availableRequests < 1
        ) {
          Logger.debug(
            `Lilt request limit reached. Waiting timeout ${WAIT_TIMEOUT} ms.`,
          );
          await delay(WAIT_TIMEOUT);
          this.availableRequests = LIMIT_REQUESTS;
          this.firstOperateTime = Date.now();
        }
        translationPromises.push(this.liltTranslateApiCall(text, memoryId.id));
        this.availableRequests--;
      }
      const translatedObjects = await Promise.all(translationPromises);
      const translatedTexts = translatedObjects.map((to) => to[0]);

      return translatedTexts;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  public async getLanguages(): Promise<LanguageListForBotTranslateOutput> {
    try {
      const ourLangTags = (await getLangsRegistry()).langs.map((l) => l.tag);
      const url = `${LILT_API_URL}/languages?key=${this.config.LILT_KEY}`;
      const res = await fetch(url, {
        method: 'GET',
      });
      const liltLangsRes = await res.json();
      const targetLangsObj = (liltLangsRes as TResLangs).source_to_target['en'];
      const targetLangsNames = (liltLangsRes as TResLangs).code_to_name;
      const languages: LanguageForBotTranslate[] = [];
      const filteredOut: Array<LanguageForBotTranslate & { reason: string }> =
        [];

      for (const [langCode, isTrue] of Object.entries(targetLangsObj)) {
        if (!isTrue) {
          filteredOut.push({
            code: langCode,
            name: targetLangsNames[langCode],
            reason: 'Lilt translate status is false',
          });
          continue;
        }

        if (ourLangTags.includes(langCode)) {
          languages.push({
            code: langCode,
            name: targetLangsNames[langCode],
          });
        } else {
          filteredOut.push({
            code: langCode,
            name: targetLangsNames[langCode],
            reason: 'Not Found in RFC 5646 language codes',
          });
        }
      }

      Logger.log(
        `filtered out lilt's languages: ${JSON.stringify(filteredOut)}`,
      );

      return {
        languages,
        error: ErrorType.NoError,
      };
    } catch (error) {
      return {
        languages: null,
        error: ErrorType.BotTranslationLanguagesListError,
      };
    }
  }

  public getTranslatorToken = async (): Promise<{
    id: string;
    token: string;
  }> => {
    // // check if token for liltbot exists
    const tokenRes = await this.pg.pool.query(
      `select t.token, u.user_id
            from users u
            left join tokens t
            on u.user_id = t.user_id
            where u.email=$1;`,
      [LILT_BOT_EMAIL],
    );
    let id = tokenRes.rows[0]?.user_id;
    if (!id) {
      const pash = await hash(this.config.CR_GOOGLE_BOT_PASSWORD);
      const token = createToken();
      const res = await this.pg.pool.query(
        `
        call authentication_register_bot($1, $2, $3, $4, 0, '');
        `,
        [LILT_BOT_EMAIL, 'LiltBot', pash, token],
      );
      id = res.rows[0].p_user_id;
    }

    let token = tokenRes.rows[0]?.token;
    if (!token) {
      const res = await this.pg.pool.query(
        `
          insert into tokens(token, user_id) values($1, $2)
          returning token
        `,
        [createToken(), id],
      );
      token = res.rows[0].token;
    }
    return { id, token };
  };
}
