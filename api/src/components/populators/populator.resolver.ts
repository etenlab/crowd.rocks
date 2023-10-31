import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Args, Context, Int, Mutation, Resolver } from '@nestjs/graphql';
import { ErrorType, GenericOutput } from 'src/common/types';
import { getBearer } from 'src/common/utility';
import { createReadStream, ReadStream } from 'fs';
import { AuthorizationService } from '../authorization/authorization.service';
import { FileService } from '../file/file.service';
import { MapsResolver } from '../maps/maps.resolver';
import { Populator } from './types';
import { join } from 'path';
import { Octokit } from '@octokit/rest';
import { lastValueFrom } from 'rxjs';
import { AiTranslationsService } from '../translator-bots/ai-translations.service';
import { LanguageInput } from '../common/types';

@Injectable()
@Resolver(Populator)
export class PopulatorResolver {
  constructor(
    private httpService: HttpService,
    private mapRes: MapsResolver,
    private fileService: FileService,
    private authService: AuthorizationService,
    private aiTranslationService: AiTranslationsService,
  ) {}

  @Mutation(() => GenericOutput)
  async populateMapTranslations(
    @Args('to_languages', { type: () => [LanguageInput] })
    to_languages: LanguageInput[],
    @Context() req: any,
  ): Promise<GenericOutput> {
    const token = getBearer(req);
    if (!token) {
      return {
        error: ErrorType.Unauthorized,
      };
    }
    if (!this.authService.is_authorized(token)) {
      return {
        error: ErrorType.Unauthorized,
      };
    }

    for (let i = 0; i < to_languages.length; i++) {
      this.aiTranslationService.translateWordsAndPhrasesByFaker(
        { language_code: 'en', geo_code: null, dialect_code: null },
        to_languages[i],
        token,
        null,
      );
    }

    return {
      error: ErrorType.NoError,
    };
  }

  @Mutation(() => GenericOutput)
  async populateMaps(
    @Context() req: any,
    @Args('map_amount', { type: () => Int, nullable: true }) mapAmount?: number,
  ): Promise<GenericOutput> {
    const token = getBearer(req);
    if (!token) {
      return {
        error: ErrorType.Unauthorized,
      };
    }
    if (!this.authService.is_authorized(token)) {
      return {
        error: ErrorType.Unauthorized,
      };
    }
    const octokit = new Octokit();

    const { data } = await octokit.rest.repos.getContent({
      owner: 'etenlab',
      repo: 'datasets',
      path: 'maps/finished',
    });

    console.log(typeof data);
    if (!Array.isArray(data)) {
      return { error: ErrorType.UnknownError };
    }
    let thumbFileID: null | number = null;
    if (!mapAmount) {
      mapAmount = data.length;
    }
    for (let i = 0; i < mapAmount; i++) {
      if (!data[i].download_url) {
        console.log('no download url. skipping...');
        continue;
      }
      if (data[i].download_url === null) {
        console.log('no download url. skipping...');
        continue;
      }
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
      console.log('upload finished. errors:');
      console.log(upload.error);
      if (upload.error === ErrorType.MapFilenameAlreadyExists) {
        console.log('Map exists. skipping...');
      }
    }

    return { error: ErrorType.NoError };
  }
}
