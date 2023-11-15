import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { hash } from 'argon2';
import { randomInt } from 'crypto';
import { createReadStream, ReadStream } from 'fs';
import { join } from 'path';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { ErrorType, SubscriptionStatus } from 'src/common/types';
import { createToken } from 'src/common/utility';
import { PostgresService } from 'src/core/postgres.service';
import { LanguageInput } from '../common/types';
import { DefinitionsService } from '../definitions/definitions.service';
import {
  FromPhraseAndDefintionlikeStringUpsertInput,
  FromWordAndDefintionlikeStringUpsertInput,
} from '../definitions/types';
import { FileService } from '../file/file.service';
import { MapVotesService } from '../maps/map-votes.service';
import { MapsResolver } from '../maps/maps.resolver';
import { PhraseVotesService } from '../phrases/phrase-votes.service';
import { AiTranslationsService } from '../translator-bots/ai-translations.service';
import { FakerTranslateService } from '../translator-bots/faker-translate.service';
import {
  ITranslator,
  LanguageListForBotTranslateOutput,
} from '../translator-bots/types';
import { WordVotesService } from '../words/word-votes.service';
import {
  callBatchRegisterBotProcedure,
  callTranslationVoteSetProcedureByTableName,
} from './sql-string';
import { DataGenProgress } from './types';
import fetch from 'node-fetch';

@Injectable()
export class PopulatorService {
  constructor(
    private httpService: HttpService,
    private mapRes: MapsResolver,
    private fileService: FileService,
    private aiTranslationService: AiTranslationsService,
    private pg: PostgresService,
    private fakerService: FakerTranslateService,
    private definitionsService: DefinitionsService,
    private mapVotesService: MapVotesService,
    private wordVotesService: WordVotesService,
    private phraseVotesService: PhraseVotesService,
  ) {}

  populateData(
    token: string,
    req: any,
    to_languages?: LanguageInput[] | null,
    mapAmount?: number | null,
    userAmount?: number | null,
    wordAmount?: number | null,
    phraseAmount?: number | null,
  ) {
    const value = new BehaviorSubject({
      output: ``,
      overallStatus: SubscriptionStatus.Progressing,
    } as DataGenProgress);
    const observable = value.asObservable();

    const observer = async () => {
      // --------------------------------
      // populate maps...
      // --------------------------------
      if (mapAmount && mapAmount != 0) {
        value.next({
          output: `Uploading Maps: 0 / 0`,
          overallStatus: SubscriptionStatus.Progressing,
        } as DataGenProgress);
        const octokit = new Octokit({
          request: {
            fetch: fetch,
          },
        });

        const { data } = await octokit.rest.repos.getContent({
          owner: 'etenlab',
          repo: 'datasets',
          path: 'maps/finished',
        });

        console.log(typeof data);
        if (!Array.isArray(data)) {
          value.error({
            output: `Uploading Maps: ERROR`,
            overallStatus: SubscriptionStatus.Error,
          } as DataGenProgress);
          value.complete();
          return;
        }
        let thumbFileID: null | number = null;
        let total = 0;

        if (!mapAmount) {
          mapAmount = data.length;
        }

        total = mapAmount;
        let totalUploaded = 0;

        value.next({
          output: `Uploading Maps: 0 / ${total}...`,
          overallStatus: SubscriptionStatus.Progressing,
        } as DataGenProgress);

        for (let i = 0; i < mapAmount; i++) {
          if (i === data.length) {
            console.log(
              'reached limit of maps in dataset. continuing with execution...',
            );
            value.next({
              output: `${total} / ${total}`,
              overallStatus: SubscriptionStatus.Progressing,
            } as DataGenProgress);
            break;
          }
          if (!data[i].download_url) {
            console.log('no download url. skipping...');
            continue;
          }
          if (data[i].download_url === null) {
            console.log('no download url. skipping...');
            continue;
          }

          console.log(`checking if ${data[i].name} exists...`);
          const res1 = await this.pg.pool.query(
            `
              select
                original_map_id
              from
                original_maps
              where
                map_file_name = $1;
              `,
            [data[i].name],
          );
          if (res1.rowCount === 1) {
            console.log(`${data[i].name} already exists. Skipping...`);
            mapAmount++;
            continue;
          }

          console.log(`${data[i].name} does NOT exist yet`);
          console.log('processing thumb file');
          const thumb_file = createReadStream(
            join(process.cwd(), 'test-thumb.png'),
          );
          if (thumbFileID === null) {
            const resp = await this.fileService.uploadFile(
              thumb_file,
              'testmaps-thumb',
              'image/png',
              token,
              undefined,
            );
            console.log('thumb Saved. error:');
            console.log(resp?.error);
            if (resp && resp.file && resp.error === ErrorType.NoError) {
              thumbFileID = resp?.file?.id;
            }
          }

          console.log('getting maps link info');

          const { data: dataStream } = await lastValueFrom(
            this.httpService.get<ReadStream>(data[i].download_url!, {
              responseType: 'stream',
            }),
          );

          const upload = await this.mapRes.mapUpload(
            {
              createReadStream: () => dataStream,
              filename: data[i].name,
              fieldName: 'fieldName',
              mimetype: 'mimetype',
              encoding: 'encoding',
            },
            thumbFileID + '',
            'image/svg+xml',
            req,
            data[i].size,
          );
          value.next({
            output: `Uploading Maps: ${totalUploaded} / ${total}...`,
            overallStatus: SubscriptionStatus.Progressing,
          } as DataGenProgress);
          totalUploaded++;
          console.log('upload finished. errors:');
          console.log(upload.error);
        }
        value.next({
          output: `Maps Uploaded: ${total} / ${total}`,
          overallStatus: SubscriptionStatus.Progressing,
        } as DataGenProgress);
      }

      // --------------------------------
      // populate translations of all words/phrases...
      // --------------------------------
      if (to_languages && to_languages.length > 0) {
        value.next({
          output: `Generating translations for ${to_languages?.length} languages...`,
          overallStatus: SubscriptionStatus.Progressing,
        } as DataGenProgress);
        for (let i = 0; i < to_languages.length; i++) {
          console.log(`add translations to ${to_languages[i]}...`);
          await this.aiTranslationService.translateWordsAndPhrasesByFaker(
            { language_code: 'en', geo_code: null, dialect_code: null },
            to_languages[i],
            token,
            null,
          );
        }
      }

      // --------------------------------
      // Generate words and phrases
      // --------------------------------
      const wordlikeString = 'faked-word';
      const phraseLikeString = 'Faked phrase';
      const definitionString = 'faked definition of phrase or word';
      const { token: fakerToken } =
        await this.fakerService.getTranslatorToken();

      if (wordAmount && wordAmount > 0) {
        console.log('generating words');
        value.next({
          output: `Generating words...`,
          overallStatus: SubscriptionStatus.Progressing,
        } as DataGenProgress);
        const inputs: FromWordAndDefintionlikeStringUpsertInput[] = [];
        for (let i = 0; i < wordAmount; i++) {
          inputs.push({
            wordlike_string: wordlikeString + randomInt(wordAmount * 10000),
            definitionlike_string: definitionString,
            language_code: 'en',
            dialect_code: null,
            geo_code: null,
          });
        }

        this.definitionsService.batchUpsertFromWordAndDefinitionlikeString(
          inputs,
          fakerToken,
          null,
        );
        console.log('done');
      }

      if (phraseAmount && phraseAmount > 0) {
        console.log('generating phrases');
        value.next({
          output: `Generating Phrases...`,
          overallStatus: SubscriptionStatus.Progressing,
        } as DataGenProgress);
        const inputs: FromPhraseAndDefintionlikeStringUpsertInput[] = [];
        for (let i = 0; i < phraseAmount; i++) {
          inputs.push({
            phraselike_string:
              phraseLikeString + randomInt(phraseAmount * 10000),
            definitionlike_string: definitionString,
            language_code: 'en',
            dialect_code: null,
            geo_code: null,
          });
        }

        this.definitionsService.batchUpsertFromPhraseAndDefinitionlikeString(
          inputs,
          fakerToken,
          null,
        );
        console.log('done');
      }

      // --------------------------------
      // Generate users and Vote
      // --------------------------------
      value.next({
        output: `Generating users...`,
        overallStatus: SubscriptionStatus.Progressing,
      } as DataGenProgress);
      // make passwords
      if (userAmount) {
        const passwords: Array<string> = [];
        const usernames: Array<string> = [];
        const emails: Array<string> = [];
        const tokens: Array<string> = [];
        for (let i = 0; i < userAmount; i++) {
          const token = createToken();
          tokens.push(token);
          passwords.push('asdfasdf');
          const username = 'fakeuser' + randomInt(userAmount * 100);
          usernames.push(username);
          emails.push(username + '@crowd.rocks');
        }

        // console.log(
        //   ...callBatchRegisterBotProcedure({
        //     tokens,
        //     emails,
        //     usernames,
        //     passwords,
        //   }),
        // );
        const userRes = await this.pg.pool.query(
          ...callBatchRegisterBotProcedure({
            tokens,
            emails,
            usernames,
            passwords,
          }),
        );
        const userIds: Array<number> = userRes.rows
          .map((u) => u.p_user_ids)
          .flat();

        if (to_languages && to_languages.length > 0) {
          for (let i = 0; i < passwords.length; i++) {
            const translate = this.fakerService.translate;
            const getToken = () =>
              this.getMockUserToken(emails[i], passwords[i], usernames[i]);
            const mockTranslationService = new (class implements ITranslator {
              translate: (
                originalTexts: string[],
                from_language: LanguageInput,
                to_language: LanguageInput,
                version?: any,
              ) => Promise<string[]> = translate;
              getTranslatorToken: (
                version?: any,
              ) => Promise<{ id: string; token: string }> = getToken;
              async getLanguages(): Promise<LanguageListForBotTranslateOutput> {
                return {
                  languages: null,
                  error: ErrorType.NoError,
                };
              }
            })();

            for (let g = 0; g < to_languages.length; g++) {
              value.next({
                output: `User submitting translations: ${usernames[i]}`,
                overallStatus: SubscriptionStatus.Progressing,
              } as DataGenProgress);
              const res =
                await this.aiTranslationService.translateWordsAndPhrasesByBot(
                  mockTranslationService,
                  { language_code: 'en', geo_code: null, dialect_code: null },
                  to_languages[g],
                  null,
                );
              console.log(res.error);
            }
          }
        }

        // ------------------------------------
        // ReTranslate Maps
        // ------------------------------------
        value.next({
          output: `Retranslating Maps...`,
          overallStatus: SubscriptionStatus.Progressing,
        } as DataGenProgress);
        await this.mapRes.mapsReTranslate(req);

        const translationTableNames = [
          'word_to_word_translation',
          'word_to_phrase_translation',
          'phrase_to_phrase_translation',
          'phrase_to_word_translation',
        ];

        value.next({
          output: `Users voting...`,
          overallStatus: SubscriptionStatus.Progressing,
        } as DataGenProgress);
        console.log('userIds:');
        console.log(userIds);
        translationTableNames.forEach(async (table) => {
          console.log(table);
          const tableIdRes = await this.pg.pool.query(
            `select ${table}_id as id from ${table}s`,
          );
          const tableIds: Array<number> = tableIdRes.rows.map((r) => r.id);
          for (let i = 0; i < userIds.length; i++) {
            console.log(
              ...callTranslationVoteSetProcedureByTableName({
                baseTableName: table,
                translationIds: tableIds,
                token,
                vote: randomInt(2) % 2 === 0 ? true : false,
                userId: userIds[i],
              }),
            );
            await this.pg.pool.query(
              ...callTranslationVoteSetProcedureByTableName({
                baseTableName: table,
                translationIds: tableIds,
                token,
                vote: randomInt(2) % 2 === 0 ? true : false,
                userId: userIds[i],
              }),
            );
          }
        });

        value.next({
          output: `${userAmount} users are voting on everything...`,
          overallStatus: SubscriptionStatus.Progressing,
        });

        const userTokens: string[] = [];
        for (let i = 0; i < passwords.length; i++) {
          const { token } = await this.getMockUserToken(
            emails[i],
            passwords[i],
            usernames[i],
          );
          userTokens.push(token);
        }
        let res = await this.pg.pool.query(
          'select original_map_id as id from original_maps',
        );
        let ids: Array<number> = res.rows.map((m) => m.id);
        for (let i = 0; i < ids.length; i++) {
          for (let g = 0; g < tokens.length; g++) {
            const vote = randomInt(3);
            if (vote == 2) {
              continue;
            }
            this.mapVotesService.toggleVoteStatus(
              ids[i],
              true,
              vote % 2 === 0 ? true : false,
              tokens[g],
              null,
            );
          }
        }
        res = await this.pg.pool.query(
          'select translated_map_id as id from translated_maps',
        );
        ids = res.rows.map((m) => m.id);
        for (let i = 0; i < ids.length; i++) {
          for (let g = 0; g < tokens.length; g++) {
            const vote = randomInt(3);
            if (vote == 2) {
              continue;
            }
            this.mapVotesService.toggleVoteStatus(
              ids[i],
              false,
              vote % 2 === 0 ? true : false,
              tokens[g],
              null,
            );
          }
        }
        res = await this.pg.pool.query('select word_id as id from words');
        ids = res.rows.map((m) => m.id);
        for (let i = 0; i < ids.length; i++) {
          for (let g = 0; g < tokens.length; g++) {
            const vote = randomInt(3);
            if (vote == 2) {
              continue;
            }
            this.wordVotesService.toggleVoteStatus(
              ids[i],
              vote % 2 === 0 ? true : false,
              tokens[g],
              null,
            );
          }
        }
        res = await this.pg.pool.query('select phrase_id as id from phrases');
        ids = res.rows.map((m) => m.id);
        for (let i = 0; i < ids.length; i++) {
          for (let g = 0; g < tokens.length; g++) {
            const vote = randomInt(3);
            if (vote == 2) {
              continue;
            }
            this.phraseVotesService.toggleVoteStatus(
              ids[i],
              vote % 2 === 0 ? true : false,
              tokens[g],
              null,
            );
          }
        }
      }

      value.next({
        output: `Done!`,
        overallStatus: SubscriptionStatus.Completed,
      } as DataGenProgress);
    };

    observer();
    return observable;
  }

  async getMockUserToken(
    mockUserEmail: string,
    mockUserPassword: string,
    mockUserName: string,
  ): Promise<{ id: string; token: string }> {
    // // check if token for googlebot exists
    const tokenRes = await this.pg.pool.query(
      `select t.token, u.user_id
            from tokens t
            join users u
            on t.user_id = u.user_id
            where u.email=$1;`,
      [mockUserEmail],
    );
    let gid = tokenRes.rows[0]?.user_id;
    if (!gid) {
      const pash = await hash(mockUserPassword);
      const token = createToken();
      const res = await this.pg.pool.query(
        `
        call authentication_register_bot($1, $2, $3, $4, 0, '');
        `,
        [mockUserEmail, mockUserName, pash, token],
      );
      gid = res.rows[0].p_user_id;
    }
    let token = tokenRes.rows[0]?.token;
    if (!token) {
      token = createToken();
      await this.pg.pool.query(
        `
          insert into tokens(token, user_id) values($1, $2);
        `,
        [token, gid],
      );
    }
    return { id: gid, token };
  }
}
