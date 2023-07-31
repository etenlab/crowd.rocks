import { Injectable } from '@nestjs/common';
import { Args, Query, Resolver, Mutation, Context, ID } from '@nestjs/graphql';

import {
  Phrase,
  PhraseReadInput,
  PhraseReadOutput,
  PhraseUpsertOutput,
  PhraseUpsertInput,
  PhraseVoteOutput,
  PhraseVoteUpsertInput,
  PhraseVoteStatusOutputRow,
} from './types';

import { PhrasesService } from './phrases.service';

import { getBearer } from 'src/common/utility';
import { PhraseVotesService } from './phrase-votes.service';

@Injectable()
@Resolver(Phrase)
export class PhrasesResolver {
  constructor(
    private phraseService: PhrasesService,
    private phraseVoteService: PhraseVotesService,
  ) {}

  @Query(() => PhraseReadOutput)
  async phraseRead(
    @Args('input') input: PhraseReadInput,
  ): Promise<PhraseReadOutput> {
    console.log('phrase read resolver, phrase_id:', input.phrase_id);

    return this.phraseService.read(input);
  }

  @Mutation(() => PhraseUpsertOutput)
  async phraseUpsert(
    @Args('input') input: PhraseUpsertInput,
    @Context() req: any,
  ): Promise<PhraseUpsertOutput> {
    console.log('phrase upsert resolver, string: ', input.phraselike_string);

    return this.phraseService.upsert(input, getBearer(req));
  }

  @Query(() => PhraseVoteOutput)
  async phraseVoteRead(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<PhraseVoteOutput> {
    console.log('phrase vote read resolver, words_vote_id:', id);

    return this.phraseVoteService.read(+id);
  }

  @Mutation(() => PhraseVoteOutput)
  async phraseVoteUpsert(
    @Args('input') input: PhraseVoteUpsertInput,
    @Context() req: any,
  ): Promise<PhraseVoteOutput> {
    console.log(
      'phrase vote upsert resolver: ',
      JSON.stringify(input, null, 2),
    );

    return this.phraseVoteService.upsert(input, getBearer(req));
  }

  @Query(() => PhraseVoteStatusOutputRow)
  async getPhraseVoteStatus(
    @Args('phrase_id', { type: () => ID }) phrase_id: string,
  ): Promise<PhraseVoteStatusOutputRow> {
    console.log('get phrase vote status resolver, word_id:', phrase_id);

    return this.phraseVoteService.getVoteStatus(+phrase_id);
  }

  @Mutation(() => PhraseVoteStatusOutputRow)
  async togglePhraseVoteStatus(
    @Args('phrase_id', { type: () => ID }) phrase_id: string,
    @Args('vote', { type: () => Boolean }) vote: boolean,
    @Context() req: any,
  ): Promise<PhraseVoteStatusOutputRow> {
    console.log(
      `toggle phrase vote resolver: phrase_id=${phrase_id} vote=${vote} `,
    );

    return this.phraseVoteService.toggleVoteStatus(
      +phrase_id,
      vote,
      getBearer(req),
    );
  }
}
