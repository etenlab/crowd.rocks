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
} from './types';

@Injectable()
@Resolver()
export class SiteTextsResolver {
  constructor(
    private siteTextService: SiteTextsService,
    private siteTextTranslationService: SiteTextTranslationsService,
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
    fromInput: SiteTextTranslationsFromInput,
    toInput: SiteTextTranslationsToInput,
    @Context() req: any,
  ): Promise<SiteTextTranslationUpsertOutput> {
    console.log(
      `site text word definition upsert resolver`,
      JSON.stringify(fromInput, null, 2),
      JSON.stringify(toInput, null, 2),
    );

    return this.siteTextTranslationService.upsertFromTranslationlikeString(
      fromInput,
      toInput,
      getBearer(req),
    );
  }
}
