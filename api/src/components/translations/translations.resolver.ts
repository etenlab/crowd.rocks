import { Injectable } from '@nestjs/common';
import { Args, Query, Resolver, Mutation, Context, ID } from '@nestjs/graphql';

import { getBearer } from 'src/common/utility';

import { WordToWordTranslationsService } from './word-to-word-translations.service';
import { WordToPhraseTranslationsService } from './word-to-phrase-translations.service';
import { PhraseToPhraseTranslationsService } from './phrase-to-phrase-translations.service';

import {
  WordToWordTranslationReadOutput,
  WordToWordTranslationUpsertInput,
  WordToWordTranslationUpsertOutput,
  WordToPhraseTranslationReadOutput,
  WordToPhraseTranslationUpsertOutput,
  WordToPhraseTranslationUpsertInput,
  PhraseToPhraseTranslationReadOutput,
  PhraseToPhraseTranslationUpsertOutput,
  PhraseToPhraseTranslationUpsertInput,
  AddWordAsTranslationForWordOutput,
  AddWordAsTranslationForWordInput,
  WordTrVoteStatusOutputRow,
  WordTrVoteStatusInput,
} from './types';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable()
@Resolver()
export class TranslationsResolver {
  constructor(
    private wordToWordTranslationService: WordToWordTranslationsService,
    private wordToPhraseTranslationService: WordToPhraseTranslationsService,
    private phraseToPhraseTranslationService: PhraseToPhraseTranslationsService,
    private authenticationService: AuthenticationService,
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

  @Mutation(() => AddWordAsTranslationForWordOutput)
  async addWordAsTranslationForWord(
    @Args('input') input: AddWordAsTranslationForWordInput,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Context() req: any,
  ): Promise<AddWordAsTranslationForWordOutput> {
    // const token = getBearer(req);
    const token = await this.authenticationService.getAdminToken();

    return this.wordToWordTranslationService.addWordAsTranslationForWord(
      input.originalDefinitionId,
      input.translationWord,
      input.translationDefinition,
      token,
    );
  }

  @Mutation(() => WordTrVoteStatusOutputRow)
  async toggleWordTrVoteStatus(
    @Args('input') input: WordTrVoteStatusInput,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Context() req: any,
  ): Promise<WordTrVoteStatusOutputRow> {
    // const token = getBearer(req);
    const token = await this.authenticationService.getAdminToken();

    return this.wordToWordTranslationService.toggleVoteStatus(
      input.word_to_word_translation_id,
      input.vote,
      token,
    );
  }
}
