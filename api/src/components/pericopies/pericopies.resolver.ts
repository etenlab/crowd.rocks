import { Injectable, Logger, Inject } from '@nestjs/common';
import {
  Args,
  Query,
  Resolver,
  Mutation,
  Subscription,
  Context,
  ID,
  Int,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { SubscriptionToken } from 'src/common/subscription-token';
import { PUB_SUB } from 'src/pubSub.module';

import { getBearer } from 'src/common/utility';
import { GetPericopeTextInput } from '../pericope-translations/types';

import { PericopeVotesService } from './pericope-votes.service';
import { PericopiesService } from './pericopies.service';

import {
  PericopiesOutput,
  PericopeVoteStatusOutput,
  PericopeWithVotesListConnection,
  PericopeTextWithDescription,
  PericopeDeleteOutput,
  RecomendedPericopiesChangedAtDocumentId,
  PericopeTagsQasCountOutput,
} from './types';

@Injectable()
@Resolver()
export class PericopiesResolver {
  constructor(
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
    private pericopiesService: PericopiesService,
    private pericopeVotesService: PericopeVotesService,
  ) {}

  @Query(() => PericopiesOutput)
  async readPericopies(
    @Args('ids', { type: () => [ID] }) ids: string[],
  ): Promise<PericopiesOutput> {
    Logger.log('readPericopies, ids:', ids);

    return this.pericopiesService.reads(
      ids.map((id) => +id),
      null,
    );
  }

  @Query(() => PericopeWithVotesListConnection)
  async getPericopiesByDocumentId(
    @Args('document_id', { type: () => ID }) document_id: string,
    @Args('first', { type: () => Int, nullable: true }) first: number | null,
    @Args('after', { type: () => ID, nullable: true }) after: string | null,
  ): Promise<PericopeWithVotesListConnection> {
    Logger.log(
      'getPericopiesByDocumentId',
      JSON.stringify({ document_id, first, after }, null, 2),
    );

    return this.pericopiesService.getPericopiesByDocumentId(
      +document_id,
      first,
      after,
      null,
    );
  }

  @Query(() => PericopeVoteStatusOutput)
  async getPericopeVoteStatus(
    @Args('pericope_id', { type: () => ID }) pericope_id: string,
  ): Promise<PericopeVoteStatusOutput> {
    Logger.log('getPericopeVoteStatus, pericope_id:', pericope_id);

    const { error, vote_status_list } =
      await this.pericopeVotesService.getVoteStatusFromIds(
        [+pericope_id],
        null,
      );

    return {
      error,
      vote_status: vote_status_list.length > 0 ? vote_status_list[0] : null,
    };
  }

  @Mutation(() => PericopiesOutput)
  async upsertPericopies(
    @Args('startWords', { type: () => [String] })
    startWords: string[],
    @Context() req: any,
  ): Promise<PericopiesOutput> {
    Logger.log('upsertPericopies: ', startWords);

    const newPericopies = await this.pericopiesService.upserts(
      startWords.map((word) => +word),
      getBearer(req) || '',
      null,
    );

    this.pubSub.publish(SubscriptionToken.pericopiesAdded, {
      [SubscriptionToken.pericopiesAdded]: newPericopies,
    });

    if (newPericopies.pericopies[0]?.pericope_id) {
      const documentsData =
        await this.pericopiesService.getDocumentIdsAndLangsOfPericopeIds([
          newPericopies.pericopies[0]?.pericope_id,
        ]);
      this.pubSub.publish(SubscriptionToken.recommendedPericopiesChanged, {
        [SubscriptionToken.recommendedPericopiesChanged]: {
          documentId: documentsData[0].documentId,
        },
      });
    }

    return newPericopies;
  }

  @Subscription(() => RecomendedPericopiesChangedAtDocumentId, {
    name: SubscriptionToken.recommendedPericopiesChanged,
  })
  async subscribeToRecommendedPericopiesChanged() {
    return this.pubSub.asyncIterator(
      SubscriptionToken.recommendedPericopiesChanged,
    );
  }

  @Subscription(() => PericopiesOutput, {
    name: SubscriptionToken.pericopiesAdded,
  })
  subscribeToPericopiesAdded() {
    return this.pubSub.asyncIterator(SubscriptionToken.pericopiesAdded);
  }

  @Mutation(() => PericopeDeleteOutput)
  async deletePericopie(
    @Args('pericope_id', { type: () => ID })
    pericope_id: string,
    @Context() req: any,
  ): Promise<PericopeDeleteOutput> {
    Logger.log('deletePericopies: ', pericope_id);

    const documentsData =
      await this.pericopiesService.getDocumentIdsAndLangsOfPericopeIds([
        pericope_id,
      ]);

    const deletedPericope = await this.pericopiesService.delete(
      +pericope_id,
      getBearer(req) || '',
      null,
    );

    this.pubSub.publish(SubscriptionToken.pericopeDeleted, {
      [SubscriptionToken.pericopeDeleted]: deletedPericope,
    });

    if (documentsData[0].documentId) {
      this.pubSub.publish(SubscriptionToken.recommendedPericopiesChanged, {
        [SubscriptionToken.recommendedPericopiesChanged]: {
          documentId: documentsData[0].documentId,
        },
      });
    }

    return deletedPericope;
  }

  @Subscription(() => PericopeDeleteOutput, {
    name: SubscriptionToken.pericopeDeleted,
  })
  subscribeToPericopeDeleted() {
    return this.pubSub.asyncIterator(SubscriptionToken.pericopeDeleted);
  }

  @Mutation(() => PericopeVoteStatusOutput)
  async togglePericopeVoteStatus(
    @Args('pericope_id', { type: () => ID })
    pericope_id: string,
    @Args('vote', { type: () => Boolean })
    vote: boolean,
    @Context() req: any,
  ): Promise<PericopeVoteStatusOutput> {
    Logger.log('togglePericopeVoteStatus: ', {
      pericope_id,
      vote,
    });

    const newVoteStatus = await this.pericopeVotesService.toggleVoteStatus(
      +pericope_id,
      vote,
      getBearer(req) || '',
      null,
    );

    this.pubSub.publish(SubscriptionToken.pericopeVoteStatusToggled, {
      [SubscriptionToken.pericopeVoteStatusToggled]: newVoteStatus,
    });

    return newVoteStatus;
  }

  @Subscription(() => PericopeVoteStatusOutput, {
    name: SubscriptionToken.pericopeVoteStatusToggled,
  })
  subscribeToPericopeVoteStatusToggled() {
    return this.pubSub.asyncIterator(
      SubscriptionToken.pericopeVoteStatusToggled,
    );
  }

  @Query(() => PericopeTextWithDescription)
  async getPericopeTextAndDesctiption(
    @Args('input') input: GetPericopeTextInput,
  ): Promise<PericopeTextWithDescription> {
    Logger.log(
      `${JSON.stringify(input)}`,
      `PericopeResolver#getPericopeTextAndDesctiption`,
    );
    return this.pericopiesService.getPericopeTextWithDescription(
      input.pericopeId,
    );
  }

  @Query(() => PericopeTagsQasCountOutput)
  async getPericopeTagsQasCount(
    @Args('pericopeId') pericopeId: string,
  ): Promise<PericopeTagsQasCountOutput> {
    Logger.log(
      `${JSON.stringify(pericopeId)}`,
      `PericopeResolver#getPericopeTagsQasCount`,
    );
    return this.pericopiesService.getPericopeTagsQasCount(pericopeId);
  }
}
