import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { createReadStream, ReadStream } from 'fs';
import { join } from 'path';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { ErrorType, SubscriptionStatus } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';
import { LanguageInput } from '../common/types';
import { FileService } from '../file/file.service';
import { MapsResolver } from '../maps/maps.resolver';
import { AiTranslationsService } from '../translator-bots/ai-translations.service';
import { DataGenProgress } from './types';

@Injectable()
export class PopulatorService {
  constructor(
    private httpService: HttpService,
    private mapRes: MapsResolver,
    private fileService: FileService,
    private aiTranslationService: AiTranslationsService,
    private pg: PostgresService,
  ) {}

  populateData(
    to_languages: LanguageInput[],
    token: string,
    req: any,
    mapAmount?: number | null,
  ) {
    const value = new BehaviorSubject({
      output: `Some output`,
      mapUploadStatus: SubscriptionStatus.Progressing,
      mapTranslationsStatus: SubscriptionStatus.Progressing,
      mapReTranslationsStatus: SubscriptionStatus.NotStarted,
      overallStatus: SubscriptionStatus.Progressing,
    } as DataGenProgress);
    const observable = value.asObservable();

    const observer = async () => {
      // --------------------------------
      // populate maps...
      // --------------------------------
      value.next({
        output: ``,
        mapUploadStatus: SubscriptionStatus.Progressing,
        mapTranslationsStatus: SubscriptionStatus.NotStarted,
        mapReTranslationsStatus: SubscriptionStatus.NotStarted,
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
          output: `0 / 0`,
          mapUploadStatus: SubscriptionStatus.Error,
          mapTranslationsStatus: SubscriptionStatus.NotStarted,
          mapReTranslationsStatus: SubscriptionStatus.NotStarted,
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
        output: `0 / ${total}...`,
        mapUploadStatus: SubscriptionStatus.Progressing,
        mapTranslationsStatus: SubscriptionStatus.NotStarted,
        mapReTranslationsStatus: SubscriptionStatus.NotStarted,
        overallStatus: SubscriptionStatus.Progressing,
      } as DataGenProgress);

      for (let i = 0; i < mapAmount; i++) {
        if (i === data.length) {
          console.log(
            'reached limit of maps in dataset. continuing with execution...',
          );
          value.next({
            output: `${total} / ${total}`,
            mapUploadStatus: SubscriptionStatus.Completed,
            mapTranslationsStatus: SubscriptionStatus.NotStarted,
            mapReTranslationsStatus: SubscriptionStatus.NotStarted,
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
          output: `${totalUploaded} / ${total}...`,
          mapUploadStatus: SubscriptionStatus.Progressing,
          mapTranslationsStatus: SubscriptionStatus.NotStarted,
          mapReTranslationsStatus: SubscriptionStatus.NotStarted,
          overallStatus: SubscriptionStatus.Progressing,
        } as DataGenProgress);
        totalUploaded++;
        console.log('upload finished. errors:');
        console.log(upload.error);
      }

      value.next({
        output: `${total} / ${total}`,
        mapUploadStatus: SubscriptionStatus.Completed,
        mapTranslationsStatus: SubscriptionStatus.NotStarted,
        mapReTranslationsStatus: SubscriptionStatus.NotStarted,
        overallStatus: SubscriptionStatus.Progressing,
      } as DataGenProgress);

      // --------------------------------
      // populate translations of all words/phrases...
      // --------------------------------
      for (let i = 0; i < to_languages.length; i++) {
        console.log(`add translations to ${to_languages[i]}...`);
        value.next({
          output: `generating translations for ${to_languages[i].language_code}...`,
          mapUploadStatus: SubscriptionStatus.Completed,
          mapTranslationsStatus: SubscriptionStatus.Progressing,
          mapReTranslationsStatus: SubscriptionStatus.NotStarted,
          overallStatus: SubscriptionStatus.Progressing,
        } as DataGenProgress);
        await this.aiTranslationService.translateWordsAndPhrasesByFaker(
          { language_code: 'en', geo_code: null, dialect_code: null },
          to_languages[i],
          token,
          null,
        );
      }
      value.next({
        output: `Completed`,
        mapUploadStatus: SubscriptionStatus.Completed,
        mapTranslationsStatus: SubscriptionStatus.Completed,
        mapReTranslationsStatus: SubscriptionStatus.NotStarted,
        overallStatus: SubscriptionStatus.Progressing,
      } as DataGenProgress);

      // --------------------------------
      // Maps ReTranslate
      // --------------------------------
      value.next({
        output: `Retranslating all Available Langs...`,
        mapUploadStatus: SubscriptionStatus.Completed,
        mapTranslationsStatus: SubscriptionStatus.Completed,
        mapReTranslationsStatus: SubscriptionStatus.Progressing,
        overallStatus: SubscriptionStatus.Progressing,
      } as DataGenProgress);
      await this.mapRes.mapsReTranslate(req);

      value.next({
        output: `Done`,
        mapUploadStatus: SubscriptionStatus.Completed,
        mapTranslationsStatus: SubscriptionStatus.Completed,
        mapReTranslationsStatus: SubscriptionStatus.Completed,
        overallStatus: SubscriptionStatus.Completed,
      } as DataGenProgress);
    };

    observer();
    return observable;
  }
}
