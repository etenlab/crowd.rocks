import { Injectable } from '@nestjs/common';
import { Args, Query, Resolver, Mutation, Context, ID } from '@nestjs/graphql';

import { getBearer } from 'src/common/utility';

import { AuthenticationService } from 'src/components/authentication/authentication.service';
import { MapsService } from 'src/components/maps/maps.service';

import { WordToWordTranslationsService } from './word-to-word-translations.service';
import { WordToPhraseTranslationsService } from './word-to-phrase-translations.service';
import { PhraseToWordTranslationsService } from './phrase-to-word-translations.service';
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
  WordToPhraseVoteStatusOutputRow,
  PhraseToWordVoteStatusOutputRow,
  PhraseToPhraseVoteStatusOutputRow,
} from './types';

@Injectable()
@Resolver()
export class TranslationsResolver {
  constructor(
    private wordToWordTranslationService: WordToWordTranslationsService,
    private wordToPhraseTranslationService: WordToPhraseTranslationsService,
    private phraseToWordTranslationService: PhraseToWordTranslationsService,
    private phraseToPhraseTranslationService: PhraseToPhraseTranslationsService,
    private authenticationService: AuthenticationService,
    private mapsService: MapsService,
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

    const newWordTr =
      this.wordToWordTranslationService.addWordAsTranslationForWord(
        input.originalDefinitionId,
        input.translationWord,
        input.translationDefinition,
        token,
      );
    // todo make here test if best translation changed and run maps tranlation conditionally
    this.mapsService.translateMapsWithWordDefinitionId(
      input.originalDefinitionId,
      token,
    ); // let it be synchronuos intentionally, lets see if any race conditions will appear...

    return newWordTr;
  }

  @Query(() => WordTrVoteStatusOutputRow)
  async getWordToWordTrVoteStatus(
    @Args('word_to_word_translation_id', { type: () => ID })
    word_to_word_translation_id: string,
  ): Promise<WordTrVoteStatusOutputRow> {
    console.log(
      'get word-to-word-translation resolver, word_to_word_translation_id:',
      word_to_word_translation_id,
    );

    return this.wordToWordTranslationService.getVoteStatus(
      +word_to_word_translation_id,
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

    const wordVoteStatus =
      await this.wordToWordTranslationService.toggleVoteStatus(
        input.word_to_word_translation_id,
        input.vote,
        token,
      );
    // todo make here test if best translation changed and run maps tranlation conditionally

    const { from_word_definition_id } =
      await this.wordToWordTranslationService.getDefinitionsIds(
        input.word_to_word_translation_id,
      );
    this.mapsService.translateMapsWithWordDefinitionId(
      from_word_definition_id,
      token,
    );

    return wordVoteStatus;
  }

  @Query(() => WordToPhraseVoteStatusOutputRow)
  async getWordToPhraseTrVoteStatus(
    @Args('word_to_phrase_translation_id', { type: () => ID })
    word_to_phrase_translation_id: string,
  ): Promise<WordToPhraseVoteStatusOutputRow> {
    console.log(
      'getWordToPhraseTrVoteStatus resolver',
      word_to_phrase_translation_id,
    );

    return this.wordToPhraseTranslationService.getVoteStatus(
      +word_to_phrase_translation_id,
    );
  }

  @Mutation(() => WordToPhraseVoteStatusOutputRow)
  async toggleWordToPhraseTrVoteStatus(
    @Args('word_to_phrase_translation_id', { type: () => ID })
    word_to_phrase_translation_id: string,
    @Args('vote', { type: () => Boolean }) vote: boolean,
    @Context() req: any,
  ): Promise<WordToPhraseVoteStatusOutputRow> {
    console.log('toggleWordToPhraseTrVoteStatus');

    return this.wordToPhraseTranslationService.toggleVoteStatus(
      +word_to_phrase_translation_id,
      vote,
      getBearer(req),
    );
  }

  @Query(() => PhraseToWordVoteStatusOutputRow)
  async getPhraseToWordTrVoteStatus(
    @Args('phrase_to_word_translation_id', { type: () => ID })
    phrase_to_word_translation_id: string,
  ): Promise<PhraseToWordVoteStatusOutputRow> {
    console.log(
      'getPhraseToWordTrVoteStatus resolver',
      phrase_to_word_translation_id,
    );

    return this.phraseToWordTranslationService.getVoteStatus(
      +phrase_to_word_translation_id,
    );
  }

  @Mutation(() => PhraseToWordVoteStatusOutputRow)
  async togglePhraseToWordTrVoteStatus(
    @Args('phrase_to_word_translation_id', { type: () => ID })
    phrase_to_word_translation_id: string,
    @Args('vote', { type: () => Boolean }) vote: boolean,
    @Context() req: any,
  ): Promise<PhraseToWordVoteStatusOutputRow> {
    console.log('togglePhraseToWordTrVoteStatus');

    return this.phraseToWordTranslationService.toggleVoteStatus(
      +phrase_to_word_translation_id,
      vote,
      getBearer(req),
    );
  }

  @Query(() => PhraseToPhraseVoteStatusOutputRow)
  async getPhraseToPhraseTrVoteStatus(
    @Args('phrase_to_phrase_translation_id', { type: () => ID })
    phrase_to_phrase_translation_id: string,
  ): Promise<PhraseToPhraseVoteStatusOutputRow> {
    console.log(
      'getPhraseToPhraseTrVoteStatus resolver',
      phrase_to_phrase_translation_id,
    );

    return this.phraseToPhraseTranslationService.getVoteStatus(
      +phrase_to_phrase_translation_id,
    );
  }

  @Mutation(() => PhraseToPhraseVoteStatusOutputRow)
  async togglePhraseToPhraseTrVoteStatus(
    @Args('phrase_to_phrase_translation_id', { type: () => ID })
    phrase_to_phrase_translation_id: string,
    @Args('vote', { type: () => Boolean }) vote: boolean,
    @Context() req: any,
  ): Promise<PhraseToPhraseVoteStatusOutputRow> {
    console.log('togglePhraseToPhraseTrVoteStatus');

    return this.phraseToPhraseTranslationService.toggleVoteStatus(
      +phrase_to_phrase_translation_id,
      vote,
      getBearer(req),
    );
  }
}
