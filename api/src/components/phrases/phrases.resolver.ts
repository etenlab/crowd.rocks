import { Injectable } from '@nestjs/common';
import {
  Args,
  Query,
  Resolver,
  Mutation,
  Context,
  ID,
  Int,
} from '@nestjs/graphql';

import { getBearer } from 'src/common/utility';

import { PhrasesService } from './phrases.service';
import { PhraseVotesService } from './phrase-votes.service';

import {
  Phrase,
  PhraseReadInput,
  PhraseOutput,
  PhraseUpsertInput,
  PhraseVoteOutput,
  PhraseVoteUpsertInput,
  PhraseVoteStatusOutputRow,
  PhraseWithVoteListConnection,
  PhraseWithVoteOutput,
} from './types';

import { LanguageInput } from 'src/components/common/types';

@Injectable()
@Resolver(Phrase)
export class PhrasesResolver {
  constructor(
    private phraseService: PhrasesService,
    private phraseVoteService: PhraseVotesService,
  ) {}

  @Query(() => PhraseOutput)
  async phraseRead(
    @Args('input') input: PhraseReadInput,
  ): Promise<PhraseOutput> {
    console.log('phrase read resolver, phrase_id:', input.phrase_id);

    return this.phraseService.read(input, null);
  }

  @Mutation(() => PhraseOutput)
  async phraseUpsert(
    @Args('input') input: PhraseUpsertInput,
    @Context() req: any,
  ): Promise<PhraseOutput> {
    console.log('phrase upsert resolver, string: ', input.phraselike_string);

    return this.phraseService.upsert(input, getBearer(req) || '', null);
  }

  @Query(() => PhraseVoteOutput)
  async phraseVoteRead(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<PhraseVoteOutput> {
    console.log('phrase vote read resolver, words_vote_id:', id);

    return this.phraseVoteService.read(+id, null);
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

    return this.phraseVoteService.upsert(input, getBearer(req) || '', null);
  }

  @Query(() => PhraseVoteStatusOutputRow)
  async getPhraseVoteStatus(
    @Args('phrase_id', { type: () => ID }) phrase_id: string,
  ): Promise<PhraseVoteStatusOutputRow> {
    console.log('get phrase vote status resolver, word_id:', phrase_id);

    return this.phraseVoteService.getVoteStatus(+phrase_id, null);
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
      getBearer(req) || '',
      null,
    );
  }

  @Query(() => PhraseWithVoteListConnection)
  async getPhrasesByLanguage(
    @Args('input', { type: () => LanguageInput }) input: LanguageInput,
    @Args('first', { type: () => Int, nullable: true }) first: number | null,
    @Args('after', { type: () => ID, nullable: true }) after: string | null,
  ): Promise<PhraseWithVoteListConnection> {
    console.log(
      'get phrases by language resolver',
      JSON.stringify(input, null, 2),
    );

    return this.phraseService.getPhrasesByLanguage(input, first, after, null);
  }

  @Query(() => PhraseWithVoteOutput)
  async getPhraseWithVoteById(
    @Args('phrase_id', { type: () => ID }) phrase_id: string,
  ): Promise<PhraseWithVoteOutput> {
    console.log('getPhraseWithVoteById resolver', phrase_id);

    return this.phraseService.getPhraseWithVoteById(+phrase_id, null);
  }
}
