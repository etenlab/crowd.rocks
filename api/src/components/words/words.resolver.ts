import { Injectable } from '@nestjs/common';
import { Args, Query, Resolver, Mutation, Context } from '@nestjs/graphql';

import { WordsService } from './words.service';

import {
  Word,
  WordReadInput,
  WordReadOutput,
  WordUpsertOutput,
  WordUpsertInput,
} from './types';
import { getBearer } from 'src/common/utility';

@Injectable()
@Resolver(Word)
export class WordsResolver {
  constructor(private wordService: WordsService) {}

  @Query(() => WordReadOutput)
  async wordRead(@Args('input') input: WordReadInput): Promise<WordReadOutput> {
    console.log('word read resolver, word_id:', input.word_id);

    return this.wordService.read(input);
  }

  @Mutation(() => WordUpsertOutput)
  async wordUpsert(
    @Args('input') input: WordUpsertInput,
    @Context() req: any,
  ): Promise<WordUpsertOutput> {
    console.log('word upsert resolver, string: ', input.wordlike_string);

    return this.wordService.upsert(input, getBearer(req));
  }
}
