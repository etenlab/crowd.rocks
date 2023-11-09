import { Inject, Injectable } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { ErrorType, GenericOutput, SubscriptionStatus } from 'src/common/types';
import { getBearer } from 'src/common/utility';
import { AuthorizationService } from '../authorization/authorization.service';
import { DataGenInput, DataGenProgress, Populator } from './types';
import { PopulatorService } from './populator.service';
import { SubscriptionToken } from 'src/common/subscription-token';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from 'src/pubSub.module';
import { MapsService } from '../maps/maps.service';
import { Observable } from 'rxjs';

@Injectable()
@Resolver(Populator)
export class PopulatorResolver {
  constructor(
    private authService: AuthorizationService,
    private mapsService: MapsService,
    private generator: PopulatorService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Mutation(() => GenericOutput)
  async generateData(
    @Args('input', { type: () => DataGenInput })
    input: DataGenInput,
    @Context() req: any,
  ): Promise<GenericOutput> {
    this.pubSub.publish(SubscriptionToken.DataGenerationReport, {
      [SubscriptionToken.DataGenerationReport]: {
        output: ``,
        mapUploadStatus: SubscriptionStatus.NotStarted,
        mapTranslationsStatus: SubscriptionStatus.NotStarted,
        mapReTranslationsStatus: SubscriptionStatus.NotStarted,
        overallStatus: SubscriptionStatus.NotStarted,
      } as DataGenProgress,
    });
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
      token,
      req,
      input.mapAmount,
    );

    if (mapGenError !== ErrorType.NoError) {
      return { error: mapGenError };
    }
    if (input.mapsToLanguages) {
      this.generator.populateMapTranslations(
        input.mapsToLanguages,
        token,
        req,
        input.mapAmount,
      );

      const forLangTags = input.mapsToLanguages.map((l) => l.language_code);
      for (let i = 0; i < forLangTags!.length; i++) {
        this.pubSub.publish(SubscriptionToken.DataGenerationReport, {
          [SubscriptionToken.DataGenerationReport]: {
            output: `${i + 1} / ${forLangTags.length}`,
            mapUploadStatus: SubscriptionStatus.Completed,
            mapTranslationsStatus: SubscriptionStatus.Completed,
            mapReTranslationsStatus: SubscriptionStatus.Progressing,
            overallStatus: SubscriptionStatus.Progressing,
          } as DataGenProgress,
        });
        await this.mapsService.reTranslate(token, forLangTags[i]!);
      }

      // Add any new data generations here...
      // ...

      this.pubSub.publish(SubscriptionToken.DataGenerationReport, {
        [SubscriptionToken.DataGenerationReport]: {
          output: `${forLangTags.length} / ${forLangTags.length}`,
          mapUploadStatus: SubscriptionStatus.Completed,
          mapTranslationsStatus: SubscriptionStatus.Completed,
          mapReTranslationsStatus: SubscriptionStatus.Completed,
          overallStatus: SubscriptionStatus.Progressing,
        } as DataGenProgress,
      });
    }

    this.pubSub.publish(SubscriptionToken.DataGenerationReport, {
      [SubscriptionToken.DataGenerationReport]: {
        output: `Done`,
        mapUploadStatus: SubscriptionStatus.Completed,
        mapTranslationsStatus: SubscriptionStatus.Completed,
        mapReTranslationsStatus: SubscriptionStatus.Completed,
        overallStatus: SubscriptionStatus.Completed,
      } as DataGenProgress,
    });

    return {
      error: ErrorType.NoError,
    };
  }

  @Subscription(() => DataGenProgress, {
    name: SubscriptionToken.DataGenerationReport,
  })
  async subscribeToDataGen() {
    console.log('subscribeToDataGen');
    return this.pubSub.asyncIterator(SubscriptionToken.DataGenerationReport);
  }
}
