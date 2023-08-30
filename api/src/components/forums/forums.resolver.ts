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

import { forumsService } from './words.service';
import { WordVotesService } from './word-votes.service';

import {
  Word,
  WordReadInput,
  WordReadOutput,
  WordUpsertOutput,
  WordUpsertInput,
  WordVoteOutput,
  WordVoteUpsertInput,
  WordVoteStatusOutputRow,
  WordWithVoteListConnection,
  WordWithVoteOutput,
} from './types';
import { getBearer } from 'src/common/utility';
import { LanguageInput } from 'src/components/common/types';

@Injectable()
@Resolver(Word)
export class ForumsResolver {
  constructor(
    private forumsService: forumsService,
    private wordVoteService: WordVotesService,
  ) {}

  @Query(() => WordReadOutput)
  async wordRead(@Args('input') input: WordReadInput): Promise<WordReadOutput> {
    console.log('word read resolver, word_id:', input.word_id);

    return this.forumsService.read(input);
  }

  @Mutation(() => WordUpsertOutput)
  async wordUpsert(
    @Args('input') input: WordUpsertInput,
    @Context() req: any,
  ): Promise<WordUpsertOutput> {
    console.log('word upsert resolver, string: ', input.wordlike_string);

    return this.forumsService.upsert(input, getBearer(req));
  }

  @Query(() => WordVoteOutput)
  async wordVoteRead(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<WordVoteOutput> {
    console.log('word vote read resolver, words_vote_id:', id);

    return this.wordVoteService.read(+id);
  }

  @Mutation(() => WordVoteOutput)
  async wordVoteUpsert(
    @Args('input') input: WordVoteUpsertInput,
    @Context() req: any,
  ): Promise<WordVoteOutput> {
    console.log('word vote upsert resolver: ', JSON.stringify(input, null, 2));

    return this.wordVoteService.upsert(input, getBearer(req));
  }

  @Query(() => WordVoteStatusOutputRow)
  async getWordVoteStatus(
    @Args('word_id', { type: () => ID }) word_id: string,
  ): Promise<WordVoteStatusOutputRow> {
    console.log('get word vote status resolver, word_id:', word_id);

    return this.wordVoteService.getVoteStatus(+word_id);
  }

  @Mutation(() => WordVoteStatusOutputRow)
  async toggleWordVoteStatus(
    @Args('word_id', { type: () => ID }) word_id: string,
    @Args('vote', { type: () => Boolean }) vote: boolean,
    @Context() req: any,
  ): Promise<WordVoteStatusOutputRow> {
    console.log(`toggle word vote resolver: word_id=${word_id} vote=${vote} `);

    return this.wordVoteService.toggleVoteStatus(
      +word_id,
      vote,
      getBearer(req),
    );
  }

  @Query(() => WordWithVoteListConnection)
  async getWordsByLanguage(
    @Args('input', { type: () => LanguageInput }) input: LanguageInput,
    @Args('first', { type: () => Int }) first: number,
    @Args('after', { type: () => ID, nullable: true }) after: string | null,
  ): Promise<WordWithVoteListConnection> {
    console.log(
      'get words by language resolver',
      JSON.stringify({ ...input, first, after }, null, 2),
    );

    return this.forumsService.getWordsByLanguage(input, first, after);
  }

  @Query(() => WordWithVoteOutput)
  async getWordWithVoteById(
    @Args('word_id', { type: () => ID }) word_id: string,
  ): Promise<WordWithVoteOutput> {
    console.log('getWordWithVoteById resolver', word_id);

    return this.forumsService.getWordWithVoteById(+word_id);
  }
}
