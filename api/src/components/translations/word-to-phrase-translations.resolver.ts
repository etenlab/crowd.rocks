import { Injectable } from '@nestjs/common';
import { Args, Query, Resolver, Mutation, Context, ID } from '@nestjs/graphql';

import { getBearer } from 'src/common/utility';

import { WordToPhraseTranslationsService } from './word-to-phrase-translations.service';

import {
  WordToPhraseTranslation,
  WordToPhraseTranslationReadOutput,
  WordToPhraseTranslationUpsertInput,
  WordToPhraseTranslationUpsertOutput,
} from './types';

@Injectable()
@Resolver(WordToPhraseTranslation)
export class WordToPhraseTranslationResolver {
  constructor(
    private wordToPhraseTranslationService: WordToPhraseTranslationsService,
  ) {}

  @Query(() => WordToPhraseTranslationReadOutput)
  async wordToPhraseTranslationRead(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<WordToPhraseTranslationReadOutput> {
    console.log(
      'word-to-phrase-translation read resolver, word_to_phrase_translation_id:',
      id,
    );

    return this.wordToPhraseTranslationService.read(+id);
  }

  @Mutation(() => WordToPhraseTranslationUpsertOutput)
  async wordToPhraseTranslationUpsert(
    @Args('input') input: WordToPhraseTranslationUpsertInput,
    @Context() req: any,
  ): Promise<WordToPhraseTranslationUpsertOutput> {
    console.log(
      `word-to-phrase-translation upsert resolver, from_word_definition_id: ${input.from_word_definition_id}, to_phrase_definition_id: ${input.to_phrase_definition_id}`,
    );

    return this.wordToPhraseTranslationService.upsert(
      +input.from_word_definition_id,
      +input.to_phrase_definition_id,
      getBearer(req),
    );
  }
}
