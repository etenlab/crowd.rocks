import { Injectable } from '@nestjs/common';
import { Args, Query, Resolver, Mutation, Context, ID } from '@nestjs/graphql';

import { getBearer } from 'src/common/utility';

import { LanguageInput } from 'src/components/common/types';

import { AuthenticationService } from 'src/components/authentication/authentication.service';
import { MapsService } from 'src/components/maps/maps.service';

import { WordToWordTranslationsService } from './word-to-word-translations.service';
import { WordToPhraseTranslationsService } from './word-to-phrase-translations.service';
import { PhraseToWordTranslationsService } from './phrase-to-word-translations.service';
import { PhraseToPhraseTranslationsService } from './phrase-to-phrase-translations.service';
import { TranslationsService } from './translations.service';

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
  WordTrVoteStatusOutputRow,
  WordToPhraseTranslationVoteStatusOutputRow,
  PhraseToWordTranslationVoteStatusOutputRow,
  PhraseToPhraseTranslationVoteStatusOutputRow,
  WordToWordTranslationWithVoteListOutput,
  WordToPhraseTranslationWithVoteListOutput,
  PhraseToWordTranslationWithVoteListOutput,
  PhraseToPhraseTranslationWithVoteListOutput,
  TranslationWithVoteListOutput,
  TranslationVoteStatusOutputRow,
  TranslationUpsertOutput,
  ToDefinitionInput,
  TranslationWithVoteOutput,
} from './types';
import { ErrorType } from '../../common/types';

@Injectable()
@Resolver()
export class TranslationsResolver {
  constructor(
    private translationService: TranslationsService,
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

  @Query(() => WordToPhraseTranslationVoteStatusOutputRow)
  async getWordToPhraseTrVoteStatus(
    @Args('word_to_phrase_translation_id', { type: () => ID })
    word_to_phrase_translation_id: string,
  ): Promise<WordToPhraseTranslationVoteStatusOutputRow> {
    console.log(
      'getWordToPhraseTrVoteStatus resolver',
      word_to_phrase_translation_id,
    );

    return this.wordToPhraseTranslationService.getVoteStatus(
      +word_to_phrase_translation_id,
    );
  }

  @Mutation(() => WordToPhraseTranslationVoteStatusOutputRow)
  async toggleWordToPhraseTrVoteStatus(
    @Args('word_to_phrase_translation_id', { type: () => ID })
    word_to_phrase_translation_id: string,
    @Args('vote', { type: () => Boolean }) vote: boolean,
    @Context() req: any,
  ): Promise<WordToPhraseTranslationVoteStatusOutputRow> {
    console.log('toggleWordToPhraseTrVoteStatus');

    return this.wordToPhraseTranslationService.toggleVoteStatus(
      +word_to_phrase_translation_id,
      vote,
      getBearer(req),
    );
  }

  @Query(() => PhraseToWordTranslationVoteStatusOutputRow)
  async getPhraseToWordTrVoteStatus(
    @Args('phrase_to_word_translation_id', { type: () => ID })
    phrase_to_word_translation_id: string,
  ): Promise<PhraseToWordTranslationVoteStatusOutputRow> {
    console.log(
      'getPhraseToWordTrVoteStatus resolver',
      phrase_to_word_translation_id,
    );

    return this.phraseToWordTranslationService.getVoteStatus(
      +phrase_to_word_translation_id,
    );
  }

  @Mutation(() => PhraseToWordTranslationVoteStatusOutputRow)
  async togglePhraseToWordTrVoteStatus(
    @Args('phrase_to_word_translation_id', { type: () => ID })
    phrase_to_word_translation_id: string,
    @Args('vote', { type: () => Boolean }) vote: boolean,
    @Context() req: any,
  ): Promise<PhraseToWordTranslationVoteStatusOutputRow> {
    console.log('togglePhraseToWordTrVoteStatus');

    return this.phraseToWordTranslationService.toggleVoteStatus(
      +phrase_to_word_translation_id,
      vote,
      getBearer(req),
    );
  }

  @Query(() => PhraseToPhraseTranslationVoteStatusOutputRow)
  async getPhraseToPhraseTrVoteStatus(
    @Args('phrase_to_phrase_translation_id', { type: () => ID })
    phrase_to_phrase_translation_id: string,
  ): Promise<PhraseToPhraseTranslationVoteStatusOutputRow> {
    console.log(
      'getPhraseToPhraseTrVoteStatus resolver',
      phrase_to_phrase_translation_id,
    );

    return this.phraseToPhraseTranslationService.getVoteStatus(
      +phrase_to_phrase_translation_id,
    );
  }

  @Mutation(() => PhraseToPhraseTranslationVoteStatusOutputRow)
  async togglePhraseToPhraseTrVoteStatus(
    @Args('phrase_to_phrase_translation_id', { type: () => ID })
    phrase_to_phrase_translation_id: string,
    @Args('vote', { type: () => Boolean }) vote: boolean,
    @Context() req: any,
  ): Promise<PhraseToPhraseTranslationVoteStatusOutputRow> {
    console.log('togglePhraseToPhraseTrVoteStatus');

    return this.phraseToPhraseTranslationService.toggleVoteStatus(
      +phrase_to_phrase_translation_id,
      vote,
      getBearer(req),
    );
  }

  @Query(() => WordToWordTranslationWithVoteListOutput)
  async getWordToWordTranslationsByFromWordDefinitionId(
    @Args('from_word_definition_id', { type: () => ID })
    from_word_definition_id: string,
    @Args('langInfo', { type: () => LanguageInput }) langInfo: LanguageInput,
  ): Promise<WordToWordTranslationWithVoteListOutput> {
    console.log(
      'getWordToWordTranslationsByFromWordDefinitionId resolver',
      from_word_definition_id,
      JSON.stringify(langInfo, null, 2),
    );

    return this.wordToWordTranslationService.getTranslationsByFromWordDefinitionId(
      +from_word_definition_id,
      langInfo,
    );
  }

  @Query(() => WordToPhraseTranslationWithVoteListOutput)
  async getWordToPhraseTranslationsByFromWordDefinitionId(
    @Args('from_word_definition_id', { type: () => ID })
    from_word_definition_id: string,
    @Args('langInfo', { type: () => LanguageInput }) langInfo: LanguageInput,
  ): Promise<WordToPhraseTranslationWithVoteListOutput> {
    console.log(
      'getWordToPhraseTranslationsByFromWordDefinitionId resolver',
      from_word_definition_id,
      JSON.stringify(langInfo, null, 2),
    );

    return this.wordToPhraseTranslationService.getTranslationsByFromWordDefinitionId(
      +from_word_definition_id,
      langInfo,
    );
  }

  @Query(() => PhraseToWordTranslationWithVoteListOutput)
  async getPhraseToWordTranslationsByFromPhraseDefinitionId(
    @Args('from_phrase_definition_id', { type: () => ID })
    from_phrase_definition_id: string,
    @Args('langInfo', { type: () => LanguageInput }) langInfo: LanguageInput,
  ): Promise<PhraseToWordTranslationWithVoteListOutput> {
    console.log(
      'getPhraseToWordTranslationsByFromPhraseDefinitionId resolver',
      from_phrase_definition_id,
      JSON.stringify(langInfo, null, 2),
    );

    return this.phraseToWordTranslationService.getTranslationsByFromPhraseDefinitionId(
      +from_phrase_definition_id,
      langInfo,
    );
  }

  @Query(() => PhraseToPhraseTranslationWithVoteListOutput)
  async getPhraseToPhraseTranslationsByFromPhraseDefinitionId(
    @Args('from_phrase_definition_id', { type: () => ID })
    from_phrase_definition_id: string,
    @Args('langInfo', { type: () => LanguageInput }) langInfo: LanguageInput,
  ): Promise<PhraseToPhraseTranslationWithVoteListOutput> {
    console.log(
      'getPhraseToPhraseTranslationsByFromPhraseDefinitionId resolver',
      from_phrase_definition_id,
      JSON.stringify(langInfo, null, 2),
    );

    return this.phraseToPhraseTranslationService.getTranslationsByFromPhraseDefinitionId(
      +from_phrase_definition_id,
      langInfo,
    );
  }

  @Query(() => TranslationWithVoteListOutput)
  async getTranslationsByFromDefinitionId(
    @Args('definition_id', { type: () => ID })
    definition_id: string,
    @Args('from_definition_type_is_word', { type: () => Boolean })
    from_definition_type_is_word: boolean,
    @Args('langInfo', { type: () => LanguageInput }) langInfo: LanguageInput,
  ): Promise<TranslationWithVoteListOutput> {
    console.log(
      'getTranslationsByFromDefinitionId resolver',
      definition_id,
      from_definition_type_is_word,
      JSON.stringify(langInfo, null, 2),
    );

    return this.translationService.getTranslationsByFromDefinitionId(
      +definition_id,
      from_definition_type_is_word,
      langInfo,
    );
  }

  @Query(() => TranslationWithVoteOutput)
  async getRecommendedTranslationFromDefinitionID(
    @Args('from_definition_id', { type: () => ID })
    from_definition_id: string,
    @Args('from_type_is_word', { type: () => Boolean })
    from_type_is_word: boolean,
    @Args('langInfo', { type: () => LanguageInput }) langInfo: LanguageInput,
  ): Promise<TranslationWithVoteOutput> {
    console.log(
      'getTranslationsByFromDefinitionId resolver',
      from_definition_id,
      from_type_is_word,
      JSON.stringify(langInfo, null, 2),
    );

    return this.translationService.getRecommendedTranslationFromDefinitionID(
      +from_definition_id,
      from_type_is_word,
      langInfo.language_code,
      langInfo.dialect_code,
      langInfo.geo_code,
    );
  }

  @Mutation(() => TranslationVoteStatusOutputRow)
  async toggleTranslationVoteStatus(
    @Args('translation_id', { type: () => ID }) translation_id: number,
    @Args('from_definition_type_is_word', { type: () => Boolean })
    from_definition_type_is_word: boolean,
    @Args('to_definition_type_is_word', { type: () => Boolean })
    to_definition_type_is_word: boolean,
    @Args('vote', { type: () => Boolean })
    vote: boolean,
    @Context()
    req: any,
  ): Promise<TranslationVoteStatusOutputRow> {
    console.log('toggleTranslationVoteStatus');

    const res = await this.translationService.toggleTranslationVoteStatus(
      +translation_id,
      from_definition_type_is_word,
      to_definition_type_is_word,
      vote,
      getBearer(req),
    );

    if (res.error === ErrorType.NoError) {
      this.mapsService.translateMapsWithTranslationId({
        translation_id: String(translation_id),
        from_definition_type_is_word,
        to_definition_type_is_word,
        token: getBearer(req),
      });
    }

    return res;
  }

  @Mutation(() => TranslationUpsertOutput)
  async upsertTranslation(
    @Args('from_definition_id', { type: () => ID }) from_definition_id: string,
    @Args('from_definition_type_is_word', { type: () => Boolean })
    from_definition_type_is_word: boolean,
    @Args('to_definition_id', { type: () => ID })
    to_definition_id: string,
    @Args('to_definition_type_is_word', { type: () => Boolean })
    to_definition_type_is_word: boolean,
    @Context() req: any,
  ): Promise<TranslationUpsertOutput> {
    console.log('upsertTranslation');

    const res = await this.translationService.upsertTranslation(
      +from_definition_id,
      from_definition_type_is_word,
      +to_definition_id,
      to_definition_type_is_word,
      getBearer(req),
    );

    if (res.error === ErrorType.NoError) {
      this.mapsService.translateMapsWithDefinitionId({
        from_definition_id,
        from_definition_type_is_word,
        token: getBearer(req),
      });
    }
    return res;
  }

  @Mutation(() => TranslationUpsertOutput)
  async upsertTranslationFromWordAndDefinitionlikeString(
    @Args('from_definition_id', { type: () => ID }) from_definition_id: string,
    @Args('from_definition_type_is_word', { type: () => Boolean })
    from_definition_type_is_word: boolean,
    @Args('to_definition_input', { type: () => ToDefinitionInput })
    to_definition_input: ToDefinitionInput,
    @Context() req: any,
  ): Promise<TranslationUpsertOutput> {
    console.log('upsertTranslationFromWordAndDefinitionlikeString');

    const res =
      await this.translationService.upsertTranslationFromWordAndDefinitionlikeString(
        +from_definition_id,
        from_definition_type_is_word,
        to_definition_input,
        getBearer(req),
      );

    if (res.error === ErrorType.NoError) {
      this.mapsService.translateMapsWithDefinitionId({
        from_definition_id,
        from_definition_type_is_word,
        token: getBearer(req),
      });
    }
    return res;
  }
}
