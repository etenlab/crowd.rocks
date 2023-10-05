import { Injectable } from '@nestjs/common';
import { Args, Query, Resolver, Mutation, Context, ID } from '@nestjs/graphql';

import { getBearer } from 'src/common/utility';

import { SiteTextsService } from './site-texts.service';
import { SiteTextTranslationsService } from './site-text-translations.service';
import { SiteTextWordDefinitionsService } from './site-text-word-definitions.service';
import { SiteTextPhraseDefinitionsService } from './site-text-phrase-definitions.service';

import { TranslationOutput } from 'src/components/translations/types';

import {
  SiteTextUpsertInput,
  SiteTextDefinitionOutput,
  SiteTextWordDefinitionOutput,
  SiteTextPhraseDefinitionOutput,
  SiteTextTranslationsFromInput,
  SiteTextTranslationsToInput,
  SiteTextDefinitionListOutput,
  SiteTextTranslationUpsertInput,
  SiteTextTranslationVoteStatusOutputRow,
  SiteTextLanguageListOutput,
  SiteTextTranslationWithVoteListOutput,
  SiteTextTranslationWithVoteOutput,
  SiteTextTranslationWithVoteListByLanguageOutput,
  SiteTextTranslationWithVoteListByLanguageListOutput,
  SiteTextLanguageWithTranslationInfoListOutput,
} from './types';

import { SiteTextTranslationVotesService } from './site-text-translation-votes.service';

@Injectable()
@Resolver()
export class SiteTextsResolver {
  constructor(
    private siteTextService: SiteTextsService,
    private siteTextTranslationService: SiteTextTranslationsService,
    private siteTextTranslationVoteService: SiteTextTranslationVotesService,
    private siteTextWordDefinitionService: SiteTextWordDefinitionsService,
    private siteTextPhraseDefinitionService: SiteTextPhraseDefinitionsService,
  ) {}

  @Query(() => SiteTextWordDefinitionOutput)
  async siteTextWordDefinitionRead(
    @Args('id') id: string,
  ): Promise<SiteTextWordDefinitionOutput> {
    console.log('site text word definition resolver, site_text_id:', id);

    return this.siteTextWordDefinitionService.read(+id, null);
  }

  @Mutation(() => SiteTextWordDefinitionOutput)
  async siteTextWordDefinitionUpsert(
    @Args('word_definition_id', { type: () => ID })
    word_definition_id: string,
    @Context() req: any,
  ): Promise<SiteTextWordDefinitionOutput> {
    console.log(
      'site text word definition upsert resolver, string: word_definition_id: ',
      word_definition_id,
    );

    return this.siteTextWordDefinitionService.upsert(
      +word_definition_id,
      getBearer(req) || '',
      null,
    );
  }

  @Query(() => SiteTextPhraseDefinitionOutput)
  async siteTextPhraseDefinitionRead(
    @Args('id') id: string,
  ): Promise<SiteTextPhraseDefinitionOutput> {
    console.log('site text word definition resolver, site_text_id:', id);

    return this.siteTextPhraseDefinitionService.read(+id, null);
  }

  @Mutation(() => SiteTextPhraseDefinitionOutput)
  async siteTextPhraseDefinitionUpsert(
    @Args('phrase_definition_id', { type: () => ID })
    phrase_definition_id: string,
    @Context() req: any,
  ): Promise<SiteTextPhraseDefinitionOutput> {
    console.log(
      'site text word definition upsert resolver, string: phrase_definition_id: ',
      phrase_definition_id,
    );

    return this.siteTextPhraseDefinitionService.upsert(
      +phrase_definition_id,
      getBearer(req) || '',
      null,
    );
  }

  @Mutation(() => SiteTextDefinitionOutput)
  async siteTextUpsert(
    @Args('input') input: SiteTextUpsertInput,
    @Context() req: any,
  ): Promise<SiteTextDefinitionOutput> {
    console.log(
      `site text upsert resolver, string: siteTextlike_string: ${input.siteTextlike_string}, definitionlike_string: ${input.definitionlike_string} `,
    );

    return this.siteTextService.upsert(input, getBearer(req) || '', null);
  }

  @Mutation(() => TranslationOutput)
  async upsertFromTranslationlikeString(
    @Args('fromInput') fromInput: SiteTextTranslationsFromInput,
    @Args('toInput') toInput: SiteTextTranslationsToInput,
    @Context() req: any,
  ): Promise<TranslationOutput> {
    console.log(
      `site text upsertFromTranslationlikeString resolver`,
      JSON.stringify(fromInput, null, 2),
      JSON.stringify(toInput, null, 2),
    );

    return this.siteTextTranslationService.upsertFromTranslationlikeString(
      fromInput,
      toInput,
      getBearer(req) || '',
      null,
    );
  }

  @Mutation(() => TranslationOutput)
  async upsertSiteTextTranslation(
    @Args('input') input: SiteTextTranslationUpsertInput,
    @Context() req: any,
  ): Promise<TranslationOutput> {
    console.log(
      `site text upsertTranslation upsert resolver`,
      JSON.stringify(input, null, 2),
    );

    return this.siteTextTranslationService.upsertTranslation(
      input,
      getBearer(req) || '',
      null,
    );
  }

  @Query(() => SiteTextTranslationVoteStatusOutputRow)
  async getSiteTextTranslationVoteStatus(
    @Args('translation_id', { type: () => ID })
    translation_id: string,
    @Args('from_type_is_word', { type: () => Boolean })
    from_type_is_word: boolean,
    @Args('to_type_is_word', { type: () => Boolean })
    to_type_is_word: boolean,
  ): Promise<SiteTextTranslationVoteStatusOutputRow> {
    console.log(
      'site text translation getVoteStatus resolver, translation_id:',
      translation_id,
    );

    return this.siteTextTranslationVoteService.getVoteStatus(
      +translation_id,
      from_type_is_word,
      to_type_is_word,
      null,
    );
  }

  @Mutation(() => SiteTextTranslationVoteStatusOutputRow)
  async toggleSiteTextTranslationVoteStatus(
    @Args('translation_id', { type: () => ID })
    translation_id: string,
    @Args('from_type_is_word', { type: () => Boolean })
    from_type_is_word: boolean,
    @Args('to_type_is_word', { type: () => Boolean })
    to_type_is_word: boolean,
    @Args('vote')
    vote: boolean,
    @Context() req: any,
  ): Promise<SiteTextTranslationVoteStatusOutputRow> {
    console.log('toggleSiteTextTranslationVoteStatus resolver');

    return this.siteTextTranslationVoteService.toggleVoteStatus(
      +translation_id,
      from_type_is_word,
      to_type_is_word,
      vote,
      getBearer(req) || '',
      null,
    );
  }

  @Query(() => SiteTextTranslationWithVoteListOutput)
  async getAllTranslationFromSiteTextDefinitionID(
    @Args('site_text_id', { type: () => ID }) site_text_id: string,
    @Args('site_text_type_is_word', { type: () => Boolean })
    site_text_type_is_word,
    @Args('language_code') language_code: string,
    @Args('dialect_code', { type: () => String, nullable: true })
    dialect_code: string | null,
    @Args('geo_code', { type: () => String, nullable: true })
    geo_code: string | null,
  ): Promise<SiteTextTranslationWithVoteListOutput> {
    console.log(
      'site text translation getAllTranslationFromSiteTextDefinitionID resolver',
    );

    return this.siteTextTranslationService.getAllTranslationFromSiteTextDefinitionID(
      +site_text_id,
      site_text_type_is_word,
      language_code,
      dialect_code,
      geo_code,
      null,
    );
  }

  @Query(() => SiteTextTranslationWithVoteOutput)
  async getRecommendedTranslationFromSiteTextDefinitionID(
    @Args('site_text_id', { type: () => ID }) site_text_id: string,
    @Args('site_text_type_is_word', { type: () => Boolean })
    site_text_type_is_word,
    @Args('language_code') language_code: string,
    @Args('dialect_code', { type: () => String, nullable: true })
    dialect_code: string | null,
    @Args('geo_code', { type: () => String, nullable: true })
    geo_code: string | null,
  ): Promise<SiteTextTranslationWithVoteOutput> {
    console.log(
      'site text translation getRecommendedTranslationFromSiteTextDefinitionID resolver',
    );

    return this.siteTextTranslationService.getRecommendedTranslationFromSiteTextDefinitionID(
      +site_text_id,
      site_text_type_is_word,
      language_code,
      dialect_code,
      geo_code,
      null,
    );
  }

  @Query(() => SiteTextTranslationWithVoteListByLanguageOutput)
  async getAllRecommendedSiteTextTranslationListByLanguage(
    @Args('language_code') language_code: string,
    @Args('dialect_code', { type: () => String, nullable: true })
    dialect_code: string | null,
    @Args('geo_code', { type: () => String, nullable: true })
    geo_code: string | null,
  ): Promise<SiteTextTranslationWithVoteListByLanguageOutput> {
    console.log(
      'site text translation getAllRecommendedTranslationByLanguage resolver',
    );

    return this.siteTextTranslationService.getAllRecommendedTranslationListByLanguage(
      language_code,
      dialect_code,
      geo_code,
      null,
    );
  }

  @Query(() => SiteTextTranslationWithVoteListByLanguageListOutput)
  async getAllRecommendedSiteTextTranslationList(): Promise<SiteTextTranslationWithVoteListByLanguageListOutput> {
    console.log(
      'site text translation getAllRecommendedSiteTextTranslationList resolver',
    );

    return this.siteTextTranslationService.getAllRecommendedTranslationList(
      null,
    );
  }

  @Query(() => SiteTextDefinitionListOutput)
  async getAllSiteTextDefinitions(
    @Args('filter', { type: () => String, nullable: true })
    filter: string | null,
  ): Promise<SiteTextDefinitionListOutput> {
    console.log('site text getAllSiteTextDefinitions resolver');

    return this.siteTextService.getAllSiteTextDefinitions({
      filter: filter || undefined,
      pgClient: null,
    });
  }

  @Query(() => SiteTextLanguageListOutput)
  async getAllSiteTextLanguageList(): Promise<SiteTextLanguageListOutput> {
    console.log('site text getAllSiteTextLanguageList resolver');

    return this.siteTextService.getAllSiteTextLanguageList(null);
  }

  @Query(() => SiteTextLanguageWithTranslationInfoListOutput)
  async getAllSiteTextLanguageListWithRate(): Promise<SiteTextLanguageWithTranslationInfoListOutput> {
    console.log('site text getAllSiteTextLanguageListWithRate resolver');

    return this.siteTextService.getAllSiteTextLanguageListWithRate(null);
  }
}
