import { Inject, Injectable, Logger, UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  ID,
  Int,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PericopeTrService } from './pericope-tr.service';
import {
  AddPericopeTranslationInput,
  BestPericopeTrChanged,
  GetPericopeTranslationsInput,
  GetPericopiesTrInput,
  PericopeTranslation,
  PericopeTranslationsOutput,
  PericopeTrVoteStatusAndBestTrOutput,
  PericopiesTextsWithTranslationConnection,
} from './types';
import { BearerTokenAuthGuard } from '../../guards/bearer-token-auth.guard';
import { ErrorType } from '../../common/types';
import { PUB_SUB } from '../../pubSub.module';
import { PubSub } from 'graphql-subscriptions';
import { SubscriptionToken } from '../../common/subscription-token';

@Injectable()
@Resolver()
export class PericopeTrResolver {
  constructor(
    private pericopeTrService: PericopeTrService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Query(() => PericopiesTextsWithTranslationConnection)
  async getPericopiesTr(
    @Args('input') input: GetPericopiesTrInput,
    @Args('first', { type: () => Int, nullable: true }) first: number | null,
    @Args('after', { type: () => ID, nullable: true }) after: string | null,
  ): Promise<PericopiesTextsWithTranslationConnection> {
    Logger.log(
      `${JSON.stringify(input)}; ${first}; ${after}`,
      `PericopeTrResolver#getPericopiesTr`,
    );
    return this.pericopeTrService.getPericopiesTextsWithTranslationConnection(
      input,
      first,
      after,
    );
  }

  @UseGuards(BearerTokenAuthGuard)
  @Mutation(() => PericopeTranslation)
  async addPericopeTr(
    @Args('input') input: AddPericopeTranslationInput,
    @Context() req: any,
  ): Promise<PericopeTranslation> {
    Logger.log(`${JSON.stringify(input)}`, `PericopeTrResolver#addPericopeTr`);
    const token = req.req.token as string;
    return this.pericopeTrService.addPericopeTrAndDesc(input, token);
  }

  @UseGuards(BearerTokenAuthGuard)
  @Mutation(() => PericopeTrVoteStatusAndBestTrOutput)
  async togglePericopeTrVoteStatus(
    @Args('pericope_translation_id', { type: () => ID })
    pericope_translation_id: string,
    @Args('vote', { type: () => Boolean }) vote: boolean,
    @Context() req: any,
  ): Promise<PericopeTrVoteStatusAndBestTrOutput> {
    Logger.log(
      `${JSON.stringify(pericope_translation_id)}`,
      `PericopeTrResolver#togglePericopeTrVoteStatus`,
    );

    const { pericopeId, lang } = (
      await this.pericopeTrService.getPericopeIdsAndLangsOfTranslationIds([
        pericope_translation_id,
      ])
    )[0];

    const oldBestTr =
      await this.pericopeTrService.getRecomendedPericopeTranslation(
        pericopeId,
        lang,
      );

    const vote_status = await this.pericopeTrService.toggleVoteStatus(
      pericope_translation_id,
      vote,
      req.req.token as string,
    );

    const best_translation =
      await this.pericopeTrService.getRecomendedPericopeTranslation(
        pericopeId,
        lang,
      );

    if (
      best_translation?.pericope_translation_id !==
      oldBestTr?.pericope_translation_id
    ) {
      this.pubSub.publish(SubscriptionToken.bestPericopeTrChanged, {
        [SubscriptionToken.bestPericopeTrChanged]: {
          newPericopeTr: best_translation,
          newVoteStatus: vote_status.vote_status,
        } as BestPericopeTrChanged,
      });
    }

    return {
      ...vote_status,
      best_translation,
    };
  }

  @Query(() => PericopeTranslationsOutput)
  async getPericopeTranslations(
    @Args('input') input: GetPericopeTranslationsInput,
  ): Promise<PericopeTranslationsOutput> {
    Logger.log(
      `${JSON.stringify(input)}`,
      `PericopeTrResolver#getPericopeTranslations`,
    );
    try {
      const translations =
        await this.pericopeTrService.getPericopeTranslationsByPericopeId(
          input.pericopeId,
          input.targetLang,
        );
      return {
        error: ErrorType.NoError,
        translations: translations.map((t) => ({
          ...t,
          upvotes: t.upvotes || 0,
          downvotes: t.downvotes || 0,
        })),
      };
    } catch (error) {
      Logger.error(error, `PericopeTrResolver#getPericopeTranslations`);
      return {
        error: ErrorType.PericopeGetTranslationError,
        translations: [],
      };
    }
  }

  @Subscription(() => BestPericopeTrChanged, {
    name: SubscriptionToken.bestPericopeTrChanged,
  })
  async bestPericopeTrChanged() {
    console.log('PericopeTrResolver#bestPericopeTrChanged');
    return this.pubSub.asyncIterator(SubscriptionToken.bestPericopeTrChanged);
  }
}
