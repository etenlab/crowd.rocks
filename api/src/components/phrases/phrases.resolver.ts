import { Injectable } from '@nestjs/common';
import { Args, Query, Resolver, Mutation, Context } from '@nestjs/graphql';

import {
  Phrase,
  PhraseReadInput,
  PhraseReadOutput,
  PhraseUpsertOutput,
  PhraseUpsertInput,
} from './types';

import { PhrasesService } from './phrases.service';

import { getBearer } from 'src/common/utility';

@Injectable()
@Resolver(Phrase)
export class PhrasesResolver {
  constructor(private phraseService: PhrasesService) {}

  @Query(() => PhraseReadOutput)
  async phraseReadResolver(
    @Args('input') input: PhraseReadInput,
  ): Promise<PhraseReadOutput> {
    console.log('phrase read resolver, phrase_id:', input.phrase_id);

    return this.phraseService.read(input);
  }

  @Mutation(() => PhraseUpsertOutput)
  async phraseUpsertResolver(
    @Args('input') input: PhraseUpsertInput,
    @Context() req: any,
  ): Promise<PhraseUpsertOutput> {
    console.log('word upsert resolver, string: ', input.phraselike_string);

    return this.phraseService.upsert(input, getBearer(req));
  }
}
