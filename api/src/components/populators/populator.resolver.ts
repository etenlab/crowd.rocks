import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { ErrorType, GenericOutput } from 'src/common/types';
import { getBearer } from 'src/common/utility';
import { AuthorizationService } from '../authorization/authorization.service';
import { FileService } from '../file/file.service';
import { MapsResolver } from '../maps/maps.resolver';
import { DataGenInput, DataGenProgress, Populator } from './types';
import { AiTranslationsService } from '../translator-bots/ai-translations.service';
import { PostgresService } from 'src/core/postgres.service';
import { PopulatorService } from './populator.service';
import { SubscriptionToken } from 'src/common/subscription-token';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from 'src/pubSub.module';

@Injectable()
@Resolver(Populator)
export class PopulatorResolver {
  constructor(
    private httpService: HttpService,
    private mapRes: MapsResolver,
    private fileService: FileService,
    private authService: AuthorizationService,
    private aiTranslationService: AiTranslationsService,
    private pg: PostgresService,
    private generator: PopulatorService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Mutation(() => GenericOutput)
  async generateData(
    @Args('input', { type: () => DataGenInput })
    input: DataGenInput,
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
    const { error: mapGenError } = await this.generator.populateMaps(
      input.mapAmount,
      token,
      req,
    );

    if (mapGenError !== ErrorType.NoError) {
      return { error: mapGenError };
    }
    await this.generator.populateMapTranslations(input.mapsToLanguages, token);

    return {
      error: ErrorType.NoError,
    };
  }

  @Subscription(() => DataGenProgress, {
    name: SubscriptionToken.DataGenerationReport,
  })
  async subscribeToDataGenerator() {
    console.log('subscribeToDataGenerationReport');
    return this.pubSub.asyncIterator(SubscriptionToken.DataGenerationReport);
  }
}
