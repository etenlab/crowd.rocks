import { Inject, Injectable, Logger } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { PoolClient } from 'pg';
import { Subject } from 'rxjs';
import { langInfo2String, subTags2LangInfo } from 'src/common/langUtils';
import { SubscriptionToken } from 'src/common/subscription-token';
import { ErrorType, GenericOutput } from 'src/common/types';
import { pgClientOrPool } from 'src/common/utility';
import { LanguageInput } from 'src/components/common/types';
import { PhrasesService } from 'src/components/phrases/phrases.service';
import { WordsService } from 'src/components/words/words.service';
import { PostgresService } from 'src/core/postgres.service';
import { PUB_SUB } from 'src/pubSub.module';
import { PhraseToPhraseTranslationsService } from '../phrase-to-phrase-translations.service';
import { PhraseToWordTranslationsService } from '../phrase-to-word-translations.service';
import {
  getTotalWordCountByLanguage,
  getTotalPhraseCountByLanguage,
  getTotalPhraseToWordCount,
  getTotalPhraseToPhraseCount,
  getTotalWordToWordCount,
  getTotalWordToPhraseCount,
  getTranslationLangSqlStr,
} from '../sql-string';
import {
  getTranslatedStringsById,
  getTranslationsNotByUser,
  setTranslationsVotes,
} from '../translations.repository';
import { TranslationsService } from '../translations.service';
import {
  TranslatedLanguageInfoInput,
  TranslatedLanguageInfoOutput,
  TranslateAllWordsAndPhrasesByGoogleOutput,
  ToDefinitionInput,
  TranslateAllWordsAndPhrasesByBotOutput,
  LanguageListForBotTranslateOutput,
} from '../types';
import {
  validateTranslateByBotInput,
  getLangConnectionsObjectMapAndTexts,
} from '../utility';
import { GoogleTranslateService } from './google-translate.service';
import { LiltTranslateService } from './lilt-translate.service';
import { ITranslationBot, ITranslator } from './types';

@Injectable()
export class AiTranslationsService {
  private translationSubject: Subject<number>;
  constructor(
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
    private wordsService: WordsService,
    private phrasesService: PhrasesService,
    private gTrService: GoogleTranslateService,
    private lTrService: LiltTranslateService,
    private phraseToWordTrService: PhraseToWordTranslationsService,
    private phraseToPhraseTrService: PhraseToPhraseTranslationsService,
    private pg: PostgresService,
    private translationService: TranslationsService,
  ) {
    this.translationSubject = new Subject<number>();
  }

  async getTranslationLanguageInfo(
    input: TranslatedLanguageInfoInput,
    pgClient: PoolClient | null,
  ): Promise<TranslatedLanguageInfoOutput> {
    const pg = await pgClientOrPool({
      client: pgClient,
      pool: this.pg.pool,
    });

    const { id: google_user_id } = await this.gTrService.getTranslatorToken();
    const { id: lilt_user_id } = await this.lTrService.getTranslatorToken();

    const totalWordres = await pg.query(
      ...getTotalWordCountByLanguage(input.fromLanguageCode),
    );
    const totalWordCount = totalWordres.rows[0].count;

    // total phrases
    const totalPhraseRes = await pg.query(
      ...getTotalPhraseCountByLanguage(input.fromLanguageCode),
    );
    const totalPhraseCount = totalPhraseRes.rows[0].count;

    let translatedMissingPhraseCount: number | undefined = undefined;
    // missing phrases
    if (input.toLanguageCode) {
      const totalPhraseToWordRes = await pg.query(
        ...getTotalPhraseToWordCount(
          input.fromLanguageCode,
          input.toLanguageCode,
          [google_user_id, lilt_user_id],
        ),
      );
      const totalPhraseToPhraseRes = await pg.query(
        ...getTotalPhraseToPhraseCount(
          input.fromLanguageCode,
          input.toLanguageCode,
          [google_user_id, lilt_user_id],
        ),
      );
      translatedMissingPhraseCount =
        +totalPhraseCount -
        (+totalPhraseToWordRes.rows[0].count +
          +totalPhraseToPhraseRes.rows[0].count);
    }

    // missing words
    let translatedMissingWordCount: number | undefined = undefined;
    if (input.toLanguageCode) {
      const totalWordToWordRes = await pg.query(
        ...getTotalWordToWordCount(
          input.fromLanguageCode,
          input.toLanguageCode,
          [google_user_id, lilt_user_id],
        ),
      );

      const totalWordToPhraseRes = await pg.query(
        ...getTotalWordToPhraseCount(
          input.fromLanguageCode,
          input.toLanguageCode,
          [google_user_id, lilt_user_id],
        ),
      );
      translatedMissingWordCount =
        +totalWordCount -
        (+totalWordToWordRes.rows[0].count +
          +totalWordToPhraseRes.rows[0].count);
    }

    // total possible 'to' languages bot Translators can translate to.
    const googleTranslateTotalLangCount = (await this.gTrService.getLanguages())
      .length;
    const liltTranslateTotalLangCount = (await this.lTrService.getLanguages())
      .length;

    return {
      error: ErrorType.NoError, // later
      totalPhraseCount,
      totalWordCount,
      translatedMissingPhraseCount,
      translatedMissingWordCount,
      googleTranslateTotalLangCount,
      liltTranslateTotalLangCount,
    };
  }

  async translateMissingWordsAndPhrasesByGoogle(
    from_language: LanguageInput,
    to_language: LanguageInput,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<TranslateAllWordsAndPhrasesByGoogleOutput> {
    return this.translateWordsAndPhrasesByBot(
      this.gTrService,
      from_language,
      to_language,
      token,
      pgClient,
    );
  }

  async translateMissingWordsAndPhrasesByBot(
    translator: ITranslator,
    from_language: LanguageInput,
    to_language: LanguageInput,
    pgClient: PoolClient | null,
  ): Promise<TranslateAllWordsAndPhrasesByGoogleOutput> {
    const badInputResult = validateTranslateByBotInput(
      from_language,
      to_language,
    );

    if (badInputResult) {
      return badInputResult;
    }

    try {
      const { originalTextsObjMap, wordsConnection, phrasesConnection } =
        await getLangConnectionsObjectMapAndTexts(
          from_language,
          pgClient,
          this.wordsService,
          this.phrasesService,
        );

      // console.log(otherLangstrings);
      const pg = await pgClientOrPool({ client: pgClient, pool: this.pg.pool });

      const token = await translator.getTranslatorToken();
      const botToken = token.token;
      const botUserId = token.id;

      const translatedStrs = await getTranslatedStringsById(
        from_language.language_code,
        to_language.language_code,
        botUserId,
        pg,
      );

      const textsToTranslateObjMap = new Map<
        string,
        { text: string; id: number }
      >();
      let uniqueId = 0;

      originalTextsObjMap.forEach((obj) => {
        if (translatedStrs.indexOf({ text: obj.text, type: 'text' }) < 0) {
          textsToTranslateObjMap.set(obj.text, {
            text: obj.text,
            id: uniqueId++,
          });
        }
        // we want the definitions even if they are common in both maps
        if (
          translatedStrs.indexOf({ text: obj.text, type: 'definition' }) > 0
        ) {
          textsToTranslateObjMap.set(obj.text, {
            text: obj.text,
            id: uniqueId++,
          });
        }
      });

      const missingObj: { id: number; text: string }[] = [];
      for (const obj of textsToTranslateObjMap.values()) {
        missingObj.push(obj);
      }

      const missingTexts = missingObj
        .sort((a, b) => a.id - b.id)
        .map((obj) => obj.text);

      const translationTexts = await translator.translate(
        missingTexts,
        from_language,
        to_language,
      );

      const translationsByOthers = await getTranslationsNotByUser(
        botUserId,
        pg,
        to_language.language_code,
        from_language.language_code,
      );

      const upsertInputs: {
        from_definition_id: number;
        from_definition_type_is_word: boolean;
        to_definition_input: ToDefinitionInput;
      }[] = [];

      const requestedCharactors = missingTexts.join('\n').length;

      let translatedWordCount = 0;
      let translatedPhraseCount = 0;
      let upVoteCount = 0;
      for (const edge of wordsConnection.edges) {
        const { node } = edge;
        const oWord = textsToTranslateObjMap.get(node.word);
        if (oWord === undefined) {
          continue;
        }
        const tWord = translationTexts[oWord.id];

        const isTypeWord =
          tWord
            .trim()
            .split(' ')
            .filter((w) => w !== '').length === 1;

        for (const oDef of node.definitions) {
          const oDefObj = textsToTranslateObjMap.get(oDef.definition);
          if (oDefObj === undefined) {
            continue;
          }
          const tDef = translationTexts[oDefObj.id];
          const otherSameTranslations = translationsByOthers.filter((t) => {
            return (
              t.fromDef == oDef.definition &&
              t.fromText == oWord.text &&
              t.toDef == tDef && //not sure whether to have translation of defs match...
              t.toText == tWord
            );
          });
          // process the translation if not submitted
          if (
            otherSameTranslations === undefined ||
            otherSameTranslations.length == 0
          ) {
            upsertInputs.push({
              from_definition_id: +oDef.word_definition_id,
              from_definition_type_is_word: true,
              to_definition_input: {
                word_or_phrase: tWord,
                is_type_word: isTypeWord,
                definition: tDef,
                language_code: to_language.language_code,
                dialect_code: to_language.dialect_code,
                geo_code: to_language.geo_code,
              },
            });
            translatedWordCount++;
          }
          // process: the same translation was made by someone else
          else {
            upVoteCount++;
            //console.log(`upvote ${otherSameTranslations[0].translationId}`);
            await setTranslationsVotes(
              true,
              isTypeWord,
              [+otherSameTranslations[0].translationId],
              botToken,
              true,
              pg,
            );
          }

          // reset votes any/all old/other translations (any translation that is different from current translation)
          const otherTranslationIds = translationsByOthers
            .filter(
              (t) =>
                t.fromDef == oDef.definition &&
                t.fromText == oWord.text &&
                (t.toDef !== tDef || t.toText !== tWord),
            )
            .map((t) => +t.translationId);

          await setTranslationsVotes(
            true,
            isTypeWord,
            otherTranslationIds,
            botToken,
            null,
            pg,
          );
        }
      }

      for (const edge of phrasesConnection.edges) {
        const { node } = edge;
        const oPhrase = textsToTranslateObjMap.get(node.phrase);
        if (oPhrase === undefined) {
          continue;
        }
        const tText = translationTexts[oPhrase.id];

        const isTypeWord =
          tText
            .trim()
            .split(' ')
            .filter((w) => w !== '').length === 1;

        for (const oDef of node.definitions) {
          const oDefObj = textsToTranslateObjMap.get(oDef.definition);
          if (oDefObj === undefined) {
            continue;
          }
          const tDef = translationTexts[oDefObj.id];
          const otherTranslations = await translationsByOthers.filter((t) => {
            return (
              t.fromDef == oDef.definition &&
              t.fromText == oPhrase.text &&
              t.toDef == tDef &&
              t.toText == tText
            );
          });
          if (
            otherTranslations === undefined ||
            otherTranslations.length == 0
          ) {
            upsertInputs.push({
              from_definition_id: +oDef.phrase_definition_id,
              from_definition_type_is_word: false,
              to_definition_input: {
                word_or_phrase: tText,
                is_type_word: isTypeWord,
                definition: tDef,
                language_code: to_language.language_code,
                dialect_code: to_language.dialect_code,
                geo_code: to_language.geo_code,
              },
            });
            translatedPhraseCount++;
          } else {
            // upvote other users' translation
            if (isTypeWord) {
              this.phraseToWordTrService.toggleVoteStatus(
                +otherTranslations[0].translationId,
                true,
                botToken,
                pgClient,
              );
            } else {
              this.phraseToPhraseTrService.toggleVoteStatus(
                +otherTranslations[0].translationId,
                true,
                botToken,
                pgClient,
              );
            }
          }
          // reset votes any/all old/other translations (any translation that is different from current translation)
          const otherTranslationIds = translationsByOthers
            .filter(
              (t) =>
                t.fromDef == oDef.definition &&
                t.fromText == oPhrase.text &&
                (t.toDef !== tDef || t.toText !== tText),
            )
            .map((t) => +t.translationId);

          await setTranslationsVotes(
            false,
            isTypeWord,
            otherTranslationIds,
            botToken,
            null,
            pg,
          );
        }
      }
      // console.log('upvote others:');
      // console.log(upVoteCount);

      // upsert all of the unsubmitted translations and upvote
      const { error } =
        await this.translationService.batchUpsertTranslationFromWordAndDefinitionlikeString(
          upsertInputs,
          botToken,
          pgClient,
        );
      return {
        error,
        result: {
          requestedCharacters: requestedCharactors,
          totalWordCount: wordsConnection.edges.length,
          totalPhraseCount: phrasesConnection.edges.length,
          translatedWordCount,
          translatedPhraseCount,
        },
      };
    } catch (err) {
      console.error(err);
    }
    return {
      error: ErrorType.UnknownError,
      result: null,
    };
  }

  async translateWordsAndPhrasesByGoogle(
    from_language: LanguageInput,
    to_language: LanguageInput,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<TranslateAllWordsAndPhrasesByGoogleOutput> {
    return this.translateWordsAndPhrasesByBot(
      this.gTrService,
      from_language,
      to_language,
      token,
      pgClient,
    );
  }

  async translateWordsAndPhrasesByLilt(
    from_language: LanguageInput,
    to_language: LanguageInput,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<TranslateAllWordsAndPhrasesByBotOutput> {
    return this.translateWordsAndPhrasesByBot(
      this.lTrService,
      from_language,
      to_language,
      token,
      pgClient,
    );
  }

  async translateWordsAndPhrasesByBot(
    translator: ITranslator,
    from_language: LanguageInput,
    to_language: LanguageInput,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<TranslateAllWordsAndPhrasesByGoogleOutput> {
    const badInputResult = validateTranslateByBotInput(
      from_language,
      to_language,
    );

    if (badInputResult) {
      return badInputResult;
    }

    try {
      const {
        strings: originalTexts,
        originalTextsObjMap,
        wordsConnection,
        phrasesConnection,
      } = await getLangConnectionsObjectMapAndTexts(
        from_language,
        pgClient,
        this.wordsService,
        this.phrasesService,
      );

      const translationTexts = await translator.translate(
        originalTexts,
        from_language,
        to_language,
      );

      const requestedCharactors = originalTexts.join('\n').length;

      let translatedWordCount = 0;
      let translatedPhraseCount = 0;

      if (translationTexts.length === 0) {
        return {
          error: ErrorType.NoError,
          result: {
            requestedCharacters: requestedCharactors,
            totalWordCount: wordsConnection.edges.length,
            totalPhraseCount: phrasesConnection.edges.length,
            translatedWordCount,
            translatedPhraseCount,
          },
        };
      }

      const upsertInputs: {
        from_definition_id: number;
        from_definition_type_is_word: boolean;
        to_definition_input: ToDefinitionInput;
      }[] = [];

      if (wordsConnection.error === ErrorType.NoError) {
        for (const edge of wordsConnection.edges) {
          const { node } = edge;

          const obj = originalTextsObjMap.get(node.word);

          if (obj === undefined) {
            continue;
          }

          const translatedWord = translationTexts[obj.id];

          if (translatedWord === undefined) {
            continue;
          }
          const is_type_word =
            translatedWord
              .trim()
              .split(' ')
              .filter((w) => w !== '').length === 1;

          for (const definition of node.definitions) {
            const obj = originalTextsObjMap.get(definition.definition);
            if (obj === undefined) {
              continue;
            }

            const translatedDefinition = translationTexts[obj.id];

            upsertInputs.push({
              from_definition_id: +definition.word_definition_id,
              from_definition_type_is_word: true,
              to_definition_input: {
                word_or_phrase: translatedWord,
                is_type_word,
                definition: translatedDefinition,
                language_code: to_language.language_code,
                dialect_code: to_language.dialect_code,
                geo_code: to_language.geo_code,
              },
            });

            translatedWordCount++;
          }
        }
      }

      if (phrasesConnection.error === ErrorType.NoError) {
        for (const edge of phrasesConnection.edges) {
          const { node } = edge;

          const obj = originalTextsObjMap.get(node.phrase);

          if (obj === undefined) {
            continue;
          }

          const translatedPhrase = translationTexts[obj.id];

          if (translatedPhrase === undefined) {
            continue;
          }
          const is_type_word =
            translatedPhrase
              .trim()
              .split(' ')
              .filter((w) => w !== '').length === 1;

          for (const definition of node.definitions) {
            const obj = originalTextsObjMap.get(definition.definition);

            if (obj === undefined) {
              continue;
            }

            const translatedDefinition = translationTexts[obj.id];

            upsertInputs.push({
              from_definition_id: +definition.phrase_definition_id,
              from_definition_type_is_word: false,
              to_definition_input: {
                word_or_phrase: translatedPhrase,
                is_type_word,
                definition: translatedDefinition,
                language_code: to_language.language_code,
                dialect_code: to_language.dialect_code,
                geo_code: to_language.geo_code,
              },
            });

            translatedPhraseCount++;
          }
        }
      }

      const { token } = await translator.getTranslatorToken();

      const { error } =
        await this.translationService.batchUpsertTranslationFromWordAndDefinitionlikeString(
          upsertInputs,
          token,
          pgClient,
        );

      return {
        error,
        result: {
          requestedCharacters: requestedCharactors,
          totalWordCount: wordsConnection.edges.length,
          totalPhraseCount: phrasesConnection.edges.length,
          translatedWordCount,
          translatedPhraseCount,
        },
      };
    } catch (err) {
      console.error(err);
    }

    return {
      error: ErrorType.UnknownError,
      result: null,
    };
  }

  async translateAllWordsAndPhrasesByLilt(
    from_language: LanguageInput,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<GenericOutput> {
    return this.translateAllWordsAndPhrasesByBot(
      {
        getLanguages: this.languagesForLiltTranslate,
        translateWordsAndPhrases: this.translateWordsAndPhrasesByLilt,
      },
      from_language,
      token,
      pgClient,
    );
  }

  async translateAllWordsAndPhrasesByGoogle(
    from_language: LanguageInput,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<GenericOutput> {
    return this.translateAllWordsAndPhrasesByBot(
      {
        getLanguages: this.languagesForGoogleTranslate,
        translateWordsAndPhrases: this.translateWordsAndPhrasesByGoogle,
      },
      from_language,
      token,
      pgClient,
    );
  }

  async translateAllWordsAndPhrasesByBot(
    translationBot: ITranslationBot,
    from_language: LanguageInput,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<GenericOutput> {
    try {
      if (this.translationSubject) {
        this.translationSubject.complete();
      }

      this.translationSubject = new Subject<number>();

      const { error, languages } = await translationBot.getLanguages();

      if (error !== ErrorType.NoError || !languages) {
        return { error };
      }

      let totalResult = {
        requestedCharactors: 0,
        totalWordCount: 0,
        totalPhraseCount: 0,
        translatedWordCount: 0,
        translatedPhraseCount: 0,
      };
      const hasErrors: string[] = [];
      let status: 'Progressing' | 'Completed' = 'Progressing';

      this.pubSub.publish(SubscriptionToken.TranslationReport, {
        [SubscriptionToken.TranslationReport]: {
          ...totalResult,
          status,
          message: `Translating ${langInfo2String(
            subTags2LangInfo({
              lang: from_language.language_code,
              dialect: from_language.dialect_code || undefined,
              region: from_language.geo_code || undefined,
            }),
          )} into ${
            languages.length > 0
              ? langInfo2String(
                  subTags2LangInfo({
                    lang: languages[0].code,
                    dialect: undefined,
                    region: undefined,
                  }),
                )
              : ''
          }...`,
          errors: hasErrors,
          total: languages.length,
          completed: 0,
        },
      });

      this.translationSubject.subscribe({
        next: async (step) => {
          if (step >= languages.length) {
            this.translationSubject.complete();
            return;
          }

          const language = languages[step];

          if (language.code === from_language.language_code) {
            this.translationSubject.next(step + 1);
            return;
          }

          const { error, result } =
            await translationBot.translateWordsAndPhrases(
              from_language,
              {
                language_code: language.code,
                dialect_code: null,
                geo_code: null,
              },
              token,
              pgClient,
            );

          if (error !== ErrorType.NoError) {
            hasErrors.push(
              langInfo2String(
                subTags2LangInfo({
                  lang: language.code,
                }),
              ),
            );
          }

          if (result) {
            totalResult = {
              requestedCharactors:
                totalResult.requestedCharactors + result.requestedCharacters,
              totalWordCount:
                totalResult.totalWordCount + result.totalWordCount,
              totalPhraseCount:
                totalResult.totalPhraseCount + result.totalPhraseCount,
              translatedWordCount:
                totalResult.translatedWordCount + result.totalWordCount,
              translatedPhraseCount:
                totalResult.translatedPhraseCount +
                result.translatedPhraseCount,
            };
          }

          this.pubSub.publish(SubscriptionToken.TranslationReport, {
            [SubscriptionToken.TranslationReport]: {
              ...totalResult,
              status: step + 1 === languages.length ? 'Completed' : status,
              message: `Translating ${langInfo2String(
                subTags2LangInfo({
                  lang: from_language.language_code,
                  dialect: from_language.dialect_code || undefined,
                  region: from_language.geo_code || undefined,
                }),
              )} into ${langInfo2String(
                subTags2LangInfo({
                  lang: language.code,
                  dialect: undefined,
                  region: undefined,
                }),
              )}...`,
              errors: hasErrors,
              total: languages.length,
              completed: step,
            },
          });

          this.translationSubject.next(step + 1);
        },
        complete: () => {
          status = 'Completed';
        },
      });

      this.translationSubject.next(0);
    } catch (err) {
      console.error(err);
    }

    return {
      error: ErrorType.UnknownError,
    };
  }

  async stopBotTranslation(): Promise<GenericOutput> {
    this.translationSubject.complete();
    return {
      error: ErrorType.NoError,
    };
  }

  async languagesForGoogleTranslate(): Promise<LanguageListForBotTranslateOutput> {
    try {
      const languages = await this.gTrService.getLanguages();

      return {
        error: ErrorType.NoError,
        languages,
      };
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      languages: null,
    };
  }

  async languagesForLiltTranslate(): Promise<LanguageListForBotTranslateOutput> {
    try {
      const languages = await this.lTrService.getLanguages();
      return {
        error: ErrorType.NoError,
        languages,
      };
    } catch (e) {
      Logger.error(e);
    }
    return {
      error: ErrorType.UnknownError,
      languages: null,
    };
  }
}
