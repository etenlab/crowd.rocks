import { Injectable, Logger } from '@nestjs/common';
import { Args, Query, Mutation, Resolver, Context, ID } from '@nestjs/graphql';

import { getBearer } from 'src/common/utility';

import { LanguageInput } from 'src/components/common/types';

import { WordToWordTranslationsService } from './word-to-word-translations.service';
import { WordToPhraseTranslationsService } from './word-to-phrase-translations.service';
import { PhraseToWordTranslationsService } from './phrase-to-word-translations.service';
import { PhraseToPhraseTranslationsService } from './phrase-to-phrase-translations.service';
import { TranslationsService } from './translations.service';

import {
  WordToWordTranslationOutput,
  WordToWordTranslationUpsertInput,
  WordToPhraseTranslationOutput,
  WordToPhraseTranslationUpsertInput,
  PhraseToPhraseTranslationOutput,
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
  TranslationOutput,
  ToDefinitionInput,
  TranslationWithVoteOutput,
} from './types';
import { ErrorType } from '../../common/types';
import { MapsTranslationService } from '../maps/maps-translation.service';

@Injectable()
@Resolver()
export class TranslationsResolver {
  constructor(
    private translationService: TranslationsService,
    private wordToWordTranslationService: WordToWordTranslationsService,
    private wordToPhraseTranslationService: WordToPhraseTranslationsService,
    private phraseToWordTranslationService: PhraseToWordTranslationsService,
    private phraseToPhraseTranslationService: PhraseToPhraseTranslationsService,
    private mapsTranslationService: MapsTranslationService,
  ) {}

  @Query(() => WordToWordTranslationOutput)
  async wordToWordTranslationRead(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<WordToWordTranslationOutput> {
    Logger.log(
      'word-to-word-translation read resolver, word_to_word_translation_id:',
      id,
    );

    return this.wordToWordTranslationService.read(+id, null);
  }

  @Mutation(() => WordToWordTranslationOutput)
  async wordToWordTranslationUpsert(
    @Args('input') input: WordToWordTranslationUpsertInput,
    @Context() req: any,
  ): Promise<WordToWordTranslationOutput> {
    Logger.log(
      `word-to-word-translation upsert resolver, from_word_definition_id: ${input.from_word_definition_id}, to_word_definition_id: ${input.to_word_definition_id}`,
    );

    return this.wordToWordTranslationService.upsert(
      +input.from_word_definition_id,
      +input.to_word_definition_id,
      getBearer(req) || '',
      null,
    );
  }

  @Query(() => WordToPhraseTranslationOutput)
  async wordToPhraseTranslationRead(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<WordToPhraseTranslationOutput> {
    Logger.log(
      'word-to-phrase-translation read resolver, word_to_phrase_translation_id:',
      id,
    );

    return this.wordToPhraseTranslationService.read(+id, null);
  }

  @Mutation(() => WordToPhraseTranslationOutput)
  async wordToPhraseTranslationUpsert(
    @Args('input') input: WordToPhraseTranslationUpsertInput,
    @Context() req: any,
  ): Promise<WordToPhraseTranslationOutput> {
    Logger.log(
      `word-to-phrase-translation upsert resolver, from_word_definition_id: ${input.from_word_definition_id}, to_phrase_definition_id: ${input.to_phrase_definition_id}`,
    );

    return this.wordToPhraseTranslationService.upsert(
      +input.from_word_definition_id,
      +input.to_phrase_definition_id,
      getBearer(req) || '',
      null,
    );
  }

  @Query(() => PhraseToPhraseTranslationOutput)
  async phraseToPhraseTranslationRead(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<PhraseToPhraseTranslationOutput> {
    Logger.log(
      'phrase-to-phrase-translation read resolver, phrase_to_phrase_translation_id:',
      id,
    );

    return this.phraseToPhraseTranslationService.read(+id, null);
  }

  @Mutation(() => PhraseToPhraseTranslationOutput)
  async phraseToPhraseTranslationUpsert(
    @Args('input') input: PhraseToPhraseTranslationUpsertInput,
    @Context() req: any,
  ): Promise<PhraseToPhraseTranslationOutput> {
    Logger.log(
      `phrase-to-phrase-translation upsert resolver, from_phrase_definition_id: ${input.from_phrase_definition_id}, to_phrase_definition_id: ${input.to_phrase_definition_id}`,
    );

    return this.phraseToPhraseTranslationService.upsert(
      +input.from_phrase_definition_id,
      +input.to_phrase_definition_id,
      getBearer(req) || '',
      null,
    );
  }

  @Query(() => WordTrVoteStatusOutputRow)
  async getWordToWordTrVoteStatus(
    @Args('word_to_word_translation_id', { type: () => ID })
    word_to_word_translation_id: string,
  ): Promise<WordTrVoteStatusOutputRow> {
    Logger.log(
      'get word-to-word-translation resolver, word_to_word_translation_id:',
      word_to_word_translation_id,
    );

    return this.wordToWordTranslationService.getVoteStatus(
      +word_to_word_translation_id,
      null,
    );
  }

  @Query(() => WordToPhraseTranslationVoteStatusOutputRow)
  async getWordToPhraseTrVoteStatus(
    @Args('word_to_phrase_translation_id', { type: () => ID })
    word_to_phrase_translation_id: string,
  ): Promise<WordToPhraseTranslationVoteStatusOutputRow> {
    Logger.log(
      'getWordToPhraseTrVoteStatus resolver',
      word_to_phrase_translation_id,
    );

    return this.wordToPhraseTranslationService.getVoteStatus(
      +word_to_phrase_translation_id,
      null,
    );
  }

  @Mutation(() => WordToPhraseTranslationVoteStatusOutputRow)
  async toggleWordToPhraseTrVoteStatus(
    @Args('word_to_phrase_translation_id', { type: () => ID })
    word_to_phrase_translation_id: string,
    @Args('vote', { type: () => Boolean }) vote: boolean,
    @Context() req: any,
  ): Promise<WordToPhraseTranslationVoteStatusOutputRow> {
    Logger.log('toggleWordToPhraseTrVoteStatus');

    return this.wordToPhraseTranslationService.toggleVoteStatus(
      +word_to_phrase_translation_id,
      vote,
      getBearer(req) || '',
      null,
    );
  }

  @Query(() => PhraseToWordTranslationVoteStatusOutputRow)
  async getPhraseToWordTrVoteStatus(
    @Args('phrase_to_word_translation_id', { type: () => ID })
    phrase_to_word_translation_id: string,
  ): Promise<PhraseToWordTranslationVoteStatusOutputRow> {
    Logger.log(
      'getPhraseToWordTrVoteStatus resolver',
      phrase_to_word_translation_id,
    );

    return this.phraseToWordTranslationService.getVoteStatus(
      +phrase_to_word_translation_id,
      null,
    );
  }

  @Mutation(() => PhraseToWordTranslationVoteStatusOutputRow)
  async togglePhraseToWordTrVoteStatus(
    @Args('phrase_to_word_translation_id', { type: () => ID })
    phrase_to_word_translation_id: string,
    @Args('vote', { type: () => Boolean }) vote: boolean,
    @Context() req: any,
  ): Promise<PhraseToWordTranslationVoteStatusOutputRow> {
    Logger.log('togglePhraseToWordTrVoteStatus');

    return this.phraseToWordTranslationService.toggleVoteStatus(
      +phrase_to_word_translation_id,
      vote,
      getBearer(req) || '',
      null,
    );
  }

  @Query(() => PhraseToPhraseTranslationVoteStatusOutputRow)
  async getPhraseToPhraseTrVoteStatus(
    @Args('phrase_to_phrase_translation_id', { type: () => ID })
    phrase_to_phrase_translation_id: string,
  ): Promise<PhraseToPhraseTranslationVoteStatusOutputRow> {
    Logger.log(
      'getPhraseToPhraseTrVoteStatus resolver',
      phrase_to_phrase_translation_id,
    );

    return this.phraseToPhraseTranslationService.getVoteStatus(
      +phrase_to_phrase_translation_id,
      null,
    );
  }

  @Mutation(() => PhraseToPhraseTranslationVoteStatusOutputRow)
  async togglePhraseToPhraseTrVoteStatus(
    @Args('phrase_to_phrase_translation_id', { type: () => ID })
    phrase_to_phrase_translation_id: string,
    @Args('vote', { type: () => Boolean }) vote: boolean,
    @Context() req: any,
  ): Promise<PhraseToPhraseTranslationVoteStatusOutputRow> {
    Logger.log('togglePhraseToPhraseTrVoteStatus');

    return this.phraseToPhraseTranslationService.toggleVoteStatus(
      +phrase_to_phrase_translation_id,
      vote,
      getBearer(req) || '',
      null,
    );
  }

  @Query(() => WordToWordTranslationWithVoteListOutput)
  async getWordToWordTranslationsByFromWordDefinitionId(
    @Args('from_word_definition_id', { type: () => ID })
    from_word_definition_id: string,
    @Args('langInfo', { type: () => LanguageInput }) langInfo: LanguageInput,
  ): Promise<WordToWordTranslationWithVoteListOutput> {
    Logger.log(
      'getWordToWordTranslationsByFromWordDefinitionId resolver',
      from_word_definition_id,
      JSON.stringify(langInfo, null, 2),
    );

    return this.wordToWordTranslationService.getTranslationsByFromWordDefinitionId(
      +from_word_definition_id,
      langInfo,
      null,
    );
  }

  @Query(() => WordToPhraseTranslationWithVoteListOutput)
  async getWordToPhraseTranslationsByFromWordDefinitionId(
    @Args('from_word_definition_id', { type: () => ID })
    from_word_definition_id: string,
    @Args('langInfo', { type: () => LanguageInput }) langInfo: LanguageInput,
  ): Promise<WordToPhraseTranslationWithVoteListOutput> {
    Logger.log(
      'getWordToPhraseTranslationsByFromWordDefinitionId resolver',
      from_word_definition_id,
      JSON.stringify(langInfo, null, 2),
    );

    return this.wordToPhraseTranslationService.getTranslationsByFromWordDefinitionId(
      +from_word_definition_id,
      langInfo,
      null,
    );
  }

  @Query(() => PhraseToWordTranslationWithVoteListOutput)
  async getPhraseToWordTranslationsByFromPhraseDefinitionId(
    @Args('from_phrase_definition_id', { type: () => ID })
    from_phrase_definition_id: string,
    @Args('langInfo', { type: () => LanguageInput }) langInfo: LanguageInput,
  ): Promise<PhraseToWordTranslationWithVoteListOutput> {
    Logger.log(
      'getPhraseToWordTranslationsByFromPhraseDefinitionId resolver',
      from_phrase_definition_id,
      JSON.stringify(langInfo, null, 2),
    );

    return this.phraseToWordTranslationService.getTranslationsByFromPhraseDefinitionId(
      +from_phrase_definition_id,
      langInfo,
      null,
    );
  }

  @Query(() => PhraseToPhraseTranslationWithVoteListOutput)
  async getPhraseToPhraseTranslationsByFromPhraseDefinitionId(
    @Args('from_phrase_definition_id', { type: () => ID })
    from_phrase_definition_id: string,
    @Args('langInfo', { type: () => LanguageInput }) langInfo: LanguageInput,
  ): Promise<PhraseToPhraseTranslationWithVoteListOutput> {
    Logger.log(
      'getPhraseToPhraseTranslationsByFromPhraseDefinitionId resolver',
      from_phrase_definition_id,
      JSON.stringify(langInfo, null, 2),
    );

    return this.phraseToPhraseTranslationService.getTranslationsByFromPhraseDefinitionId(
      +from_phrase_definition_id,
      langInfo,
      null,
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
    Logger.log('getTranslationsByFromDefinitionId resolver');

    return this.translationService.getTranslationsByFromDefinitionId(
      +definition_id,
      from_definition_type_is_word,
      langInfo,
      null,
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
    Logger.log(
      'getRecommendedTranslationFromDefinitionID resolver',
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
      null,
    );
  }

  @Query(() => TranslationWithVoteListOutput)
  async getRecommendedTranslationFromDefinitionIDs(
    @Args('from_definition_ids', { type: () => [ID] })
    from_definition_ids: string[],
    @Args('from_type_is_words', { type: () => [Boolean] })
    from_type_is_words: boolean[],
    @Args('langInfo', { type: () => LanguageInput }) langInfo: LanguageInput,
  ): Promise<TranslationWithVoteListOutput> {
    Logger.log(
      'getTranslationsByFromDefinitionIds resolver',
      from_definition_ids,
      from_type_is_words,
      langInfo,
    );

    const fromDefinitionIds: {
      from_definition_id: number;
      from_type_is_word: boolean;
    }[] = [];

    for (let i = 0; i < from_definition_ids.length; i++) {
      fromDefinitionIds.push({
        from_definition_id: +from_definition_ids[i],
        from_type_is_word: from_type_is_words[i],
      });
    }

    return this.translationService.getRecommendedTranslationFromDefinitionIDs(
      fromDefinitionIds,
      langInfo.language_code,
      langInfo.dialect_code,
      langInfo.geo_code,
      null,
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
    Logger.log('toggleTranslationVoteStatus');

    const res = await this.translationService.toggleTranslationVoteStatus(
      +translation_id,
      from_definition_type_is_word,
      to_definition_type_is_word,
      vote,
      getBearer(req) || '',
      null,
    );

    if (res.error === ErrorType.NoError) {
      this.mapsTranslationService.markTrMapsByTranslationId({
        translation_id: String(translation_id),
        from_definition_type_is_word,
        to_definition_type_is_word,
      });
    }

    return res;
  }

  @Mutation(() => TranslationOutput)
  async upsertTranslation(
    @Args('from_definition_id', { type: () => ID }) from_definition_id: string,
    @Args('from_definition_type_is_word', { type: () => Boolean })
    from_definition_type_is_word: boolean,
    @Args('to_definition_id', { type: () => ID })
    to_definition_id: string,
    @Args('to_definition_type_is_word', { type: () => Boolean })
    to_definition_type_is_word: boolean,
    @Context() req: any,
  ): Promise<TranslationOutput> {
    Logger.log('upsertTranslation');

    const res = await this.translationService.upsertTranslation(
      +from_definition_id,
      from_definition_type_is_word,
      +to_definition_id,
      to_definition_type_is_word,
      getBearer(req) || '',
      null,
    );

    if (res.error === ErrorType.NoError) {
      this.mapsTranslationService.markTrMapsByDefinitionsIds({
        from_definition_id,
        from_definition_type_is_word,
        to_definition_id,
        to_definition_type_is_word,
      });
    }
    return res;
  }

  @Mutation(() => TranslationOutput)
  async upsertTranslationFromWordAndDefinitionlikeString(
    @Args('from_definition_id', { type: () => ID }) from_definition_id: string,
    @Args('from_definition_type_is_word', { type: () => Boolean })
    from_definition_type_is_word: boolean,
    @Args('to_definition_input', { type: () => ToDefinitionInput })
    to_definition_input: ToDefinitionInput,
    @Context() req: any,
  ): Promise<TranslationOutput> {
    Logger.log('upsertTranslationFromWordAndDefinitionlikeString');

    const res =
      await this.translationService.upsertTranslationFromWordAndDefinitionlikeString(
        +from_definition_id,
        from_definition_type_is_word,
        to_definition_input,
        getBearer(req) || '',
        null,
      );

    if (res.error === ErrorType.NoError) {
      this.mapsTranslationService.markTrMapsByFromDefinitionIdAndLang({
        from_definition_id,
        from_definition_type_is_word,
        toLang: {
          language_code: to_definition_input.language_code,
          dialect_code: to_definition_input.dialect_code || null,
          geo_code: to_definition_input.geo_code || null,
        },
      });
    }
    return res;
  }
}
