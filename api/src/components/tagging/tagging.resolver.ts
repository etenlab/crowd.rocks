import { Injectable, Logger, Inject } from '@nestjs/common';
import {
  Args,
  Resolver,
  Query,
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

import { WordRangeTagsService } from './word-range-tags.service';
import { WordRangeTagVotesService } from './word-range-tag-votes.service';

import {
  WordRangeTagVoteStatusOutput,
  WordRangeTagsListConnection,
  WordRangeTagWithVotesOutput,
} from './types';

@Injectable()
@Resolver()
export class TaggingsResolver {
  constructor(
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
    private wordRangeTagsService: WordRangeTagsService,
    private wordRangeTagVotesService: WordRangeTagVotesService,
  ) {}

  @Query(() => WordRangeTagsListConnection)
  async getWordRangeTagsByDocumentId(
    @Args('document_id', { type: () => ID }) document_id: string,
    @Args('first', { type: () => Int, nullable: true }) first: number | null,
    @Args('after', { type: () => ID, nullable: true }) after: string | null,
  ): Promise<WordRangeTagsListConnection> {
    Logger.log(
      'getWordRangeTagsByDocumentId',
      JSON.stringify({ document_id, first, after }, null, 2),
    );

    return this.wordRangeTagsService.getWordRangeTagsByDocumentId(
      +document_id,
      first,
      after,
      null,
    );
  }

  @Query(() => WordRangeTagWithVotesOutput)
  async getWordRangeTagsByBeginWordEntryId(
    @Args('begin_document_word_entry_id', { type: () => ID })
    begin_document_word_entry_id: string,
  ): Promise<WordRangeTagWithVotesOutput> {
    Logger.log(
      'getWordRangeTagsByBeginWordEntryId',
      JSON.stringify({ begin_document_word_entry_id }, null, 2),
    );

    return this.wordRangeTagsService.getWordRangeTagsByBeginWordEntryId(
      +begin_document_word_entry_id,
      null,
    );
  }

  @Query(() => WordRangeTagVoteStatusOutput)
  async getWordRangeTagVoteStatus(
    @Args('word_range_tag_id', { type: () => ID }) word_range_tag_id: string,
  ): Promise<WordRangeTagVoteStatusOutput> {
    Logger.log(
      'getWordRangeTagVoteStatus, word_range_tag_id:',
      word_range_tag_id,
    );

    const { error, vote_status_list } =
      await this.wordRangeTagVotesService.getVoteStatusFromIds(
        [+word_range_tag_id],
        null,
      );

    return {
      error,
      vote_status: vote_status_list.length > 0 ? vote_status_list[0] : null,
    };
  }

  @Mutation(() => WordRangeTagWithVotesOutput)
  async upsertWordRangeTag(
    @Args('word_range_id', { type: () => ID })
    word_range_id: string,
    @Args('tag_name', { type: () => String })
    tag_name: string,
    @Context() req: any,
  ): Promise<WordRangeTagWithVotesOutput> {
    Logger.log('upsertWordRangeTag: ', { word_range_id, tag_name });

    const newWordRangeTagWithVotes = await this.wordRangeTagsService.upserts(
      [{ word_range_id: +word_range_id, tag_name }],
      getBearer(req) || '',
      null,
    );

    this.pubSub.publish(SubscriptionToken.wordRangeTagWithVoteAdded, {
      [SubscriptionToken.wordRangeTagWithVoteAdded]: newWordRangeTagWithVotes,
    });

    return newWordRangeTagWithVotes;
  }

  @Mutation(() => WordRangeTagWithVotesOutput)
  async createTaggingOnWordRange(
    @Args('begin_document_word_entry_id', { type: () => ID })
    begin_document_word_entry_id: string,
    @Args('end_document_word_entry_id', { type: () => ID })
    end_document_word_entry_id: string,
    @Args('tag_names', { type: () => [String!]! })
    tag_names: string[],
    @Context() req: any,
  ): Promise<WordRangeTagWithVotesOutput> {
    Logger.log('createTaggingOnWordRange: ', {
      begin_document_word_entry_id,
      end_document_word_entry_id,
      tag_names,
    });

    const newWordRangeTagWithVotes =
      await this.wordRangeTagsService.createTaggingOnWordRange(
        +begin_document_word_entry_id,
        +end_document_word_entry_id,
        tag_names,
        getBearer(req) || '',
        null,
      );

    this.pubSub.publish(SubscriptionToken.wordRangeTagWithVoteAdded, {
      [SubscriptionToken.wordRangeTagWithVoteAdded]: newWordRangeTagWithVotes,
    });

    return newWordRangeTagWithVotes;
  }

  @Subscription(() => WordRangeTagWithVotesOutput, {
    name: SubscriptionToken.wordRangeTagWithVoteAdded,
  })
  subscribeToWordRangeTagWithVoteAdded() {
    return this.pubSub.asyncIterator(
      SubscriptionToken.wordRangeTagWithVoteAdded,
    );
  }

  @Mutation(() => WordRangeTagVoteStatusOutput)
  async toggleWordRangeTagVoteStatus(
    @Args('word_range_tag_id', { type: () => ID })
    word_range_tag_id: string,
    @Args('vote', { type: () => Boolean })
    vote: boolean,
    @Context() req: any,
  ): Promise<WordRangeTagVoteStatusOutput> {
    Logger.log('toggleWordRangeTagVoteStatus: ', {
      word_range_tag_id,
      vote,
    });

    const newVoteStatus = this.wordRangeTagVotesService.toggleVoteStatus(
      +word_range_tag_id,
      vote,
      getBearer(req) || '',
      null,
    );

    this.pubSub.publish(SubscriptionToken.wordRangeTagVoteStatusToggled, {
      [SubscriptionToken.wordRangeTagVoteStatusToggled]: newVoteStatus,
    });

    return newVoteStatus;
  }

  @Subscription(() => WordRangeTagVoteStatusOutput, {
    name: SubscriptionToken.wordRangeTagVoteStatusToggled,
  })
  subscribeToWordRangeTagVoteStatusToggled() {
    return this.pubSub.asyncIterator(
      SubscriptionToken.wordRangeTagVoteStatusToggled,
    );
  }
}
