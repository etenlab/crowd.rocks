import { Injectable } from '@nestjs/common';
import { Args, Query, Resolver, Mutation, Context, ID } from '@nestjs/graphql';

import { getBearer } from 'src/common/utility';

import { PhraseToPhraseTranslationsService } from './phrase-to-phrase-translations.service';

import {
  PhraseToPhraseTranslation,
  PhraseToPhraseTranslationReadOutput,
  PhraseToPhraseTranslationUpsertInput,
  PhraseToPhraseTranslationUpsertOutput,
} from './types';

@Injectable()
@Resolver(PhraseToPhraseTranslation)
export class PhraseToPhraseTranslationResolver {
  constructor(
    private phraseToPhraseTranslationService: PhraseToPhraseTranslationsService,
  ) {}

  @Query(() => PhraseToPhraseTranslationReadOutput)
  async phraseToPhraseTranslationRead(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<PhraseToPhraseTranslationReadOutput> {
    console.log(
      'phrase-to-phrase-translation read resolver, phrase_to_phrase_translation_id:',
      id,
    );

    return this.phraseToPhraseTranslationService.read(+id);
  }

  @Mutation(() => PhraseToPhraseTranslationUpsertOutput)
  async phraseToPhraseTranslationUpsert(
    @Args('input') input: PhraseToPhraseTranslationUpsertInput,
    @Context() req: any,
  ): Promise<PhraseToPhraseTranslationUpsertOutput> {
    console.log(
      `phrase-to-phrase-translation upsert resolver, from_phrase_definition_id: ${input.from_phrase_definition_id}, to_phrase_definition_id: ${input.to_phrase_definition_id}`,
    );

    return this.phraseToPhraseTranslationService.upsert(
      +input.from_phrase_definition_id,
      +input.to_phrase_definition_id,
      getBearer(req),
    );
  }
}
