import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/rest';
import { createReadStream, ReadStream } from 'fs';
import { PubSub } from 'graphql-subscriptions';
import { join } from 'path';
import { lastValueFrom } from 'rxjs';
import { SubscriptionToken } from 'src/common/subscription-token';
import { ErrorType, GenericOutput, SubscriptionStatus } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';
import { PUB_SUB } from 'src/pubSub.module';
import { AuthorizationService } from '../authorization/authorization.service';
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
    private authService: AuthorizationService,
    private aiTranslationService: AiTranslationsService,
    private pg: PostgresService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  async populateMapTranslations(
    to_languages: LanguageInput[],
    token: string,
  ): Promise<GenericOutput> {
    this.pubSub.publish(SubscriptionToken.DataGenerationReport, {
      [SubscriptionToken.DataGenerationReport]: {
        mapUpload: `Completed`,
        mapUploadStatus: SubscriptionStatus.Completed,
        mapTranslationsStatus: SubscriptionStatus.Progressing,
      } as DataGenProgress,
    });
    for (let i = 0; i < to_languages.length; i++) {
      console.log(`add translations to ${to_languages[i]}...`);
      this.aiTranslationService.translateWordsAndPhrasesByFaker(
        { language_code: 'en', geo_code: null, dialect_code: null },
        to_languages[i],
        token,
        null,
      );
    }
    this.pubSub.publish(SubscriptionToken.DataGenerationReport, {
      [SubscriptionToken.DataGenerationReport]: {
        mapUpload: `Completed`,
        mapUploadStatus: SubscriptionStatus.Completed,
        mapTranslationsStatus: SubscriptionStatus.Completed,
      } as DataGenProgress,
    });
    console.log('... done');
    return {
      error: ErrorType.NoError,
    };
  }

  async populateMaps(
    mapAmount: number,
    token: string,
    req: any,
  ): Promise<GenericOutput> {
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
      this.pubSub.publish(SubscriptionToken.DataGenerationReport, {
        [SubscriptionToken.DataGenerationReport]: {
          mapUpload: `0 / 0`,
          mapUploadStatus: SubscriptionStatus.Error,
          mapTranslationsStatus: SubscriptionStatus.NotStarted,
        } as DataGenProgress,
      });
      return { error: ErrorType.UnknownError };
    }
    let thumbFileID: null | number = null;
    let total = 0;
    if (!mapAmount) {
      mapAmount = data.length;
      total = mapAmount;
    }

    this.pubSub.publish(SubscriptionToken.DataGenerationReport, {
      [SubscriptionToken.DataGenerationReport]: {
        mapUpload: `0 / ${total}...`,
        mapUploadStatus: SubscriptionStatus.Progressing,
        mapTranslationsStatus: SubscriptionStatus.NotStarted,
      } as DataGenProgress,
    });

    for (let i = 0; i < mapAmount; i++) {
      if (i === data.length) {
        console.log(
          'reached limit of maps in dataset. continuing with execution...',
        );
        this.pubSub.publish(SubscriptionToken.DataGenerationReport, {
          [SubscriptionToken.DataGenerationReport]: {
            mapUpload: `${total} / ${total}`,
            mapUploadStatus: SubscriptionStatus.Completed,
            mapTranslationsStatus: SubscriptionStatus.NotStarted,
          } as DataGenProgress,
        });
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
      this.pubSub.publish(SubscriptionToken.DataGenerationReport, {
        [SubscriptionToken.DataGenerationReport]: {
          mapUpload: `${i + 1} / ${total}...`,
          mapUploadStatus: SubscriptionStatus.Progressing,
          mapTranslationsStatus: SubscriptionStatus.NotStarted,
        } as DataGenProgress,
      });
      console.log('upload finished. errors:');
      console.log(upload.error);
      console.log(upload.error == ErrorType.MapFilenameAlreadyExists);
    }

    this.pubSub.publish(SubscriptionToken.DataGenerationReport, {
      [SubscriptionToken.DataGenerationReport]: {
        mapUpload: `${total} / ${total}`,
        mapUploadStatus: SubscriptionStatus.Completed,
        mapTranslationsStatus: SubscriptionStatus.NotStarted,
      } as DataGenProgress,
    });

    return { error: ErrorType.NoError };
  }
}
