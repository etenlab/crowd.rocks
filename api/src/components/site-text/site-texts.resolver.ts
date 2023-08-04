import { Injectable } from '@nestjs/common';
import { Args, Query, Resolver, Mutation, Context } from '@nestjs/graphql';

import { getBearer } from 'src/common/utility';

import { SiteTextsService } from './site-texts.service';
import { SiteTextTranslationsService } from './site-text-translations.service';
import { SiteTextWordDefinitionsService } from './site-text-word-definitions.service';
import { SiteTextPhraseDefinitionsService } from './site-text-phrase-definitions.service';

import {
  SiteTextUpsertInput,
  SiteTextUpsertOutput,
  SiteTextWordDefinitionReadOutput,
  SiteTextWordDefinitionUpsertInput,
  SiteTextWordDefinitionUpsertOutput,
  SiteTextPhraseDefinitionReadOutput,
  SiteTextPhraseDefinitionUpsertInput,
  SiteTextPhraseDefinitionUpsertOutput,
  SiteTextTranslationReadOutput,
  SiteTextTranslationUpsertOutput,
  SiteTextTranslationInput,
  SiteTextTranslationsFromInput,
  SiteTextTranslationsToInput,
  SiteTextTranslationVoteReadOutput,
  SiteTextTranslationVoteUpsertOutput,
  SiteTextTranslationVoteUpsertInput,
  SiteTextTranslationWithVoteListOutput,
  SiteTextTranslationWithVoteOutput,
  SiteTextDefinitionListOutput,
  SiteTextTranslationUpsertInput,
  VoteStatusOutputRow,
  SiteTextLanguageListOutput,
} from './types';

import {
  DefinitionUpdateaInput,
  DefinitionUpdateOutput,
} from 'src/components/definitions/types';

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

  @Query(() => SiteTextWordDefinitionReadOutput)
  async siteTextWordDefinitionRead(
    @Args('id') id: string,
  ): Promise<SiteTextWordDefinitionReadOutput> {
    console.log('site text word definition resolver, site_text_id:', id);

    return this.siteTextWordDefinitionService.read(+id);
  }

  @Mutation(() => SiteTextWordDefinitionUpsertOutput)
  async siteTextWordDefinitionUpsert(
    @Args('input') input: SiteTextWordDefinitionUpsertInput,
    @Context() req: any,
  ): Promise<SiteTextWordDefinitionUpsertOutput> {
    console.log(
      'site text word definition upsert resolver, string: word_definition_id: ',
      input.word_definition_id,
    );

    return this.siteTextWordDefinitionService.upsert(input, getBearer(req));
  }

  @Query(() => SiteTextPhraseDefinitionReadOutput)
  async siteTextPhraseDefinitionRead(
    @Args('id') id: string,
  ): Promise<SiteTextPhraseDefinitionReadOutput> {
    console.log('site text word definition resolver, site_text_id:', id);

    return this.siteTextPhraseDefinitionService.read(+id);
  }

  @Mutation(() => SiteTextPhraseDefinitionUpsertOutput)
  async siteTextPhraseDefinitionUpsert(
    @Args('input') input: SiteTextPhraseDefinitionUpsertInput,
    @Context() req: any,
  ): Promise<SiteTextPhraseDefinitionUpsertOutput> {
    console.log(
      'site text word definition upsert resolver, string: phrase_definition_id: ',
      input.phrase_definition_id,
    );

    return this.siteTextPhraseDefinitionService.upsert(input, getBearer(req));
  }

  @Mutation(() => SiteTextUpsertOutput)
  async siteTextUpsert(
    @Args('input') input: SiteTextUpsertInput,
    @Context() req: any,
  ): Promise<SiteTextUpsertOutput> {
    console.log(
      `site text upsert resolver, string: siteTextlike_string: ${input.siteTextlike_string}, definitionlike_string: ${input.definitionlike_string} `,
    );

    return this.siteTextService.upsert(input, getBearer(req));
  }

  @Query(() => SiteTextTranslationReadOutput)
  async siteTextTranslationRead(
    @Args('id') id: string,
  ): Promise<SiteTextTranslationReadOutput> {
    console.log('site text translation resolver, id:', id);

    return this.siteTextTranslationService.read(+id);
  }

  @Mutation(() => SiteTextTranslationUpsertOutput)
  async siteTextTranslationUpsert(
    @Args('input') input: SiteTextTranslationInput,
    @Context() req: any,
  ): Promise<SiteTextTranslationUpsertOutput> {
    console.log(
      `site text word definition upsert resolver`,
      JSON.stringify(input, null, 2),
    );

    return this.siteTextTranslationService.upsert(input, getBearer(req));
  }

  @Mutation(() => SiteTextTranslationUpsertOutput)
  async upsertFromTranslationlikeString(
    @Args('fromInput') fromInput: SiteTextTranslationsFromInput,
    @Args('toInput') toInput: SiteTextTranslationsToInput,
    @Context() req: any,
  ): Promise<SiteTextTranslationUpsertOutput> {
    console.log(
      `site text upsertFromTranslationlikeString resolver`,
      JSON.stringify(fromInput, null, 2),
      JSON.stringify(toInput, null, 2),
    );

    return this.siteTextTranslationService.upsertFromTranslationlikeString(
      fromInput,
      toInput,
      getBearer(req),
    );
  }

  @Mutation(() => SiteTextTranslationUpsertOutput)
  async upsertTranslation(
    @Args('input') input: SiteTextTranslationUpsertInput,
    @Context() req: any,
  ): Promise<SiteTextTranslationUpsertOutput> {
    console.log(
      `site text upsertTranslation upsert resolver`,
      JSON.stringify(input, null, 2),
    );

    return this.siteTextTranslationService.upsertTranslation(
      input,
      getBearer(req),
    );
  }

  @Query(() => SiteTextTranslationVoteReadOutput)
  async siteTextTranslationVoteRead(
    @Args('id') id: string,
  ): Promise<SiteTextTranslationVoteReadOutput> {
    console.log('site text translation vote read resolver, id:', id);

    return this.siteTextTranslationVoteService.read(+id);
  }

  @Query(() => SiteTextTranslationVoteReadOutput)
  async getVoteStatus(
    @Args('site_text_translation_id') site_text_translation_id: string,
  ): Promise<SiteTextTranslationVoteReadOutput> {
    console.log(
      'site text translation getVoteStatus resolver, site_text_translation_id:',
      site_text_translation_id,
    );

    return this.siteTextTranslationVoteService.read(+site_text_translation_id);
  }

  @Mutation(() => VoteStatusOutputRow)
  async toggleVoteStatus(
    @Args('site_text_translation_id') site_text_translation_id: string,
    @Args('vote') vote: boolean,
    @Context() req: any,
  ): Promise<VoteStatusOutputRow> {
    console.log('site text toggleVoteStatus resolver');

    return this.siteTextTranslationVoteService.toggleVoteStatus(
      +site_text_translation_id,
      vote,
      getBearer(req),
    );
  }

  @Mutation(() => SiteTextTranslationVoteUpsertOutput)
  async siteTextTranslationVoteUpsert(
    @Args('input') input: SiteTextTranslationVoteUpsertInput,
    @Context() req: any,
  ): Promise<SiteTextTranslationVoteUpsertOutput> {
    console.log(
      `site text translation vote upsert resolver`,
      JSON.stringify(input, null, 2),
    );

    return this.siteTextTranslationVoteService.upsert(input, getBearer(req));
  }

  @Query(() => SiteTextTranslationWithVoteListOutput)
  async getAllTranslationFromSiteTextDefinitionID(
    @Args('site_text_id') site_text_id: string,
    @Args('site_text_type_is_word', { type: () => Boolean })
    site_text_type_is_word,
    @Args('language_code') language_code: string,
    @Args('dialect_code', { nullable: true }) dialect_code: string | null,
    @Args('geo_code', { nullable: true }) geo_code: string | null,
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
    );
  }

  @Query(() => SiteTextTranslationWithVoteOutput)
  async getRecommendedTranslationFromSiteTextDefinitionID(
    @Args('site_text_id') site_text_id: string,
    @Args('site_text_type_is_word', { type: () => Boolean })
    site_text_type_is_word,
    @Args('language_code') language_code: string,
    @Args('dialect_code', { nullable: true }) dialect_code: string | null,
    @Args('geo_code', { nullable: true }) geo_code: string | null,
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
    );
  }

  @Query(() => SiteTextTranslationWithVoteListOutput)
  async getAllRecommendedTranslation(
    @Args('language_code') language_code: string,
    @Args('dialect_code', { nullable: true }) dialect_code: string | null,
    @Args('geo_code', { nullable: true }) geo_code: string | null,
  ): Promise<SiteTextTranslationWithVoteListOutput> {
    console.log('site text translation getAllRecommendedTranslation resolver');

    return this.siteTextTranslationService.getAllRecommendedTranslation(
      language_code,
      dialect_code,
      geo_code,
    );
  }

  @Mutation(() => DefinitionUpdateOutput)
  async updateDefinition(
    @Args('input') input: DefinitionUpdateaInput,
    @Context() req: any,
  ): Promise<DefinitionUpdateOutput> {
    console.log(
      `updateDefinition update resolver`,
      JSON.stringify(input, null, 2),
    );

    return this.siteTextService.updateDefinition(input, getBearer(req));
  }

  @Query(() => SiteTextDefinitionListOutput)
  async getAllSiteTextDefinitions(
    @Args('filter', { nullable: true }) filter?: string,
  ): Promise<SiteTextDefinitionListOutput> {
    console.log('site text getAllSiteTextDefinitions resolver');

    return this.siteTextService.getAllSiteTextDefinitions(filter);
  }

  @Query(() => SiteTextLanguageListOutput)
  async getAllSiteTextLanguageList(): Promise<SiteTextLanguageListOutput> {
    console.log('site text getAllSiteTextLanguageList resolver');

    return this.siteTextService.getAllSiteTextLanguageList();
  }
}
