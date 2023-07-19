import { Injectable } from '@nestjs/common';
import { Args, Query, Resolver, Mutation, Context, ID } from '@nestjs/graphql';

import { getBearer } from 'src/common/utility';

import { WordToWordTranslationsService } from './word-to-word-translations.service';

import {
  WordToWordTranslation,
  WordToWordTranslationReadOutput,
  WordToWordTranslationUpsertInput,
  WordToWordTranslationUpsertOutput,
} from './types';

@Injectable()
@Resolver(WordToWordTranslation)
export class WordToWordTranslationResolver {
  constructor(
    private wordToWordTranslationService: WordToWordTranslationsService,
  ) {}

  @Query(() => WordToWordTranslationReadOutput)
  async wordToWordTranslationRead(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<WordToWordTranslationReadOutput> {
    console.log(
      'word-to-word-translation read resolver, word_to_word_translation_id:',
      id,
    );

    return this.wordToWordTranslationService.read(+id);
  }

  @Mutation(() => WordToWordTranslationUpsertOutput)
  async wordToWordTranslationUpsert(
    @Args('input') input: WordToWordTranslationUpsertInput,
    @Context() req: any,
  ): Promise<WordToWordTranslationUpsertOutput> {
    console.log(
      `word-to-word-translation upsert resolver, from_word_definition_id: ${input.from_word_definition_id}, to_word_definition_id: ${input.to_word_definition_id}`,
    );

    return this.wordToWordTranslationService.upsert(
      +input.from_word_definition_id,
      +input.to_word_definition_id,
      getBearer(req),
    );
  }
}
