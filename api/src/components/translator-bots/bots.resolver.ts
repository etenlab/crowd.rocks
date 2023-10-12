import { Inject, Injectable } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { SubscriptionToken } from 'src/common/subscription-token';
import { GenericOutput } from 'src/common/types';
import { getBearer } from 'src/common/utility';
import { PUB_SUB } from 'src/pubSub.module';
import { LanguageInput } from '../common/types';
import { AiTranslationsService } from './ai-translations.service';
import {
  LanguageListForBotTranslateOutput,
  TranslatedLanguageInfoOutput,
  TranslatedLanguageInfoInput,
  TranslateAllWordsAndPhrasesByBotOutput,
  TranslateAllWordsAndPhrasesByBotResult,
  ChatGPTVersion,
} from './types';

@Injectable()
@Resolver()
export class BotsResolver {
  constructor(
    private aiTranslations: AiTranslationsService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Query(() => LanguageListForBotTranslateOutput)
  async languagesForGoogleTranslate(): Promise<LanguageListForBotTranslateOutput> {
    console.log('languagesForGoogleTranslate resolver');
    return this.aiTranslations.languagesForGoogleTranslate();
  }

  @Query(() => LanguageListForBotTranslateOutput)
  async languagesForLiltTranslate(): Promise<LanguageListForBotTranslateOutput> {
    console.log('languagesForLiltTranslate resolver');
    return this.aiTranslations.languagesForLiltTranslate();
  }

  @Query(() => LanguageListForBotTranslateOutput)
  async languagesForSmartcatTranslate(): Promise<LanguageListForBotTranslateOutput> {
    console.log('languagesForSmartcatTranslate resolver');
    return this.aiTranslations.languagesForSmartcatTranslate();
  }

  @Query(() => LanguageListForBotTranslateOutput)
  async languagesForChatGPT35Translate(): Promise<LanguageListForBotTranslateOutput> {
    console.log('languagesForChatGPT35Translate resolver');
    return this.aiTranslations.languagesForChatGPT35Translate();
  }

  @Query(() => LanguageListForBotTranslateOutput)
  async languagesForChatGPT4Translate(): Promise<LanguageListForBotTranslateOutput> {
    console.log('languagesForChatGPT4Translate resolver');
    return this.aiTranslations.languagesForChatGPT4Translate();
  }

  @Query(() => TranslatedLanguageInfoOutput)
  async getLanguageTranslationInfo(
    @Args('input')
    input: TranslatedLanguageInfoInput,
  ): Promise<TranslatedLanguageInfoOutput> {
    console.log(
      `getLanguageTranslationInfo resolver fromLang: ${input.fromLanguageCode} toLang: ${input.toLanguageCode}`,
    );
    return this.aiTranslations.getTranslationLanguageInfo(input, null);
  }

  @Mutation(() => TranslateAllWordsAndPhrasesByBotOutput)
  async translateWordsAndPhrasesByGoogle(
    @Args('from_language', { type: () => LanguageInput })
    from_language: LanguageInput,
    @Args('to_language', { type: () => LanguageInput })
    to_language: LanguageInput,
  ): Promise<TranslateAllWordsAndPhrasesByBotOutput> {
    console.log(
      'translateWordsAndPhrasesByGoogle',
      JSON.stringify({
        from_language,
        to_language,
      }),
    );

    return this.aiTranslations.translateWordsAndPhrasesByGoogle(
      from_language,
      to_language,
      null,
    );
  }

  @Mutation(() => TranslateAllWordsAndPhrasesByBotOutput)
  async translateWordsAndPhrasesByChatGPT35(
    @Args('from_language', { type: () => LanguageInput })
    from_language: LanguageInput,
    @Args('to_language', { type: () => LanguageInput })
    to_language: LanguageInput,
    @Context() req: any,
  ): Promise<TranslateAllWordsAndPhrasesByBotOutput> {
    return this.aiTranslations.translateWordsAndPhrasesByChatGPT35(
      from_language,
      to_language,
      getBearer(req) || '',
      null,
    );
  }

  @Mutation(() => TranslateAllWordsAndPhrasesByBotOutput)
  async translateWordsAndPhrasesByChatGPT4(
    @Args('from_language', { type: () => LanguageInput })
    from_language: LanguageInput,
    @Args('to_language', { type: () => LanguageInput })
    to_language: LanguageInput,
    @Context() req: any,
  ): Promise<TranslateAllWordsAndPhrasesByBotOutput> {
    return this.aiTranslations.translateWordsAndPhrasesByChatGPT4(
      from_language,
      to_language,
      getBearer(req) || '',
      null,
    );
  }

  @Mutation(() => TranslateAllWordsAndPhrasesByBotOutput)
  async translateWordsAndPhrasesByLilt(
    @Args('from_language', { type: () => LanguageInput })
    from_language: LanguageInput,
    @Args('to_language', { type: () => LanguageInput })
    to_language: LanguageInput,
  ): Promise<TranslateAllWordsAndPhrasesByBotOutput> {
    console.log(
      'translateWordsAndPhrasesByLilt',
      JSON.stringify({
        from_language,
        to_language,
      }),
    );

    return this.aiTranslations.translateWordsAndPhrasesByLilt(
      from_language,
      to_language,
      null,
    );
  }

  @Mutation(() => TranslateAllWordsAndPhrasesByBotOutput)
  async translateWordsAndPhrasesBySmartcat(
    @Args('from_language', { type: () => LanguageInput })
    from_language: LanguageInput,
    @Args('to_language', { type: () => LanguageInput })
    to_language: LanguageInput,
  ): Promise<TranslateAllWordsAndPhrasesByBotOutput> {
    console.log(
      'translateWordsAndPhrasesBySmartcat',
      JSON.stringify({
        from_language,
        to_language,
      }),
    );

    return this.aiTranslations.translateWordsAndPhrasesBySmartcat(
      from_language,
      to_language,
      null,
    );
  }

  @Mutation(() => TranslateAllWordsAndPhrasesByBotOutput)
  async translateMissingWordsAndPhrasesByGoogle(
    @Args('from_language', { type: () => LanguageInput })
    from_language: LanguageInput,
    @Args('to_language', { type: () => LanguageInput })
    to_language: LanguageInput,
    @Context() req: any,
  ): Promise<TranslateAllWordsAndPhrasesByBotOutput> {
    console.log(
      'translateMissingWordsAndPhrasesByGoogle',
      JSON.stringify({
        from_language,
        to_language,
      }),
    );

    return this.aiTranslations.translateMissingWordsAndPhrasesByGoogle(
      from_language,
      to_language,
      getBearer(req) || '',
      null,
    );
  }

  @Mutation(() => TranslateAllWordsAndPhrasesByBotOutput)
  async translateMissingWordsAndPhrasesByChatGpt(
    @Args('from_language', { type: () => LanguageInput })
    from_language: LanguageInput,
    @Args('to_language', { type: () => LanguageInput })
    to_language: LanguageInput,
    @Args('version', { type: () => String })
    version: ChatGPTVersion,
    @Context()
    req: any,
  ): Promise<TranslateAllWordsAndPhrasesByBotOutput> {
    console.log(
      'translateMissingWordsAndPhrasesChatGpt35',
      JSON.stringify({
        from_language,
        to_language,
      }),
    );

    return this.aiTranslations.translateMissingWordsAndPhrasesByGpt35(
      from_language,
      to_language,
      getBearer(req) || '',
      null,
      version,
    );
  }

  @Mutation(() => GenericOutput)
  async translateAllWordsAndPhrasesByGoogle(
    @Args('from_language', { type: () => LanguageInput })
    from_language: LanguageInput,
    @Context() req: any,
  ): Promise<GenericOutput> {
    console.log(
      'translateAllWordsAndPhrasesByGoogle',
      JSON.stringify({
        from_language,
      }),
    );

    return this.aiTranslations.translateWordsAndPhrasesToAllLangsByGoogle(
      from_language,
      getBearer(req) || '',
      null,
    );
  }

  @Mutation(() => GenericOutput)
  async translateAllWordsAndPhrasesByLilt(
    @Args('from_language', { type: () => LanguageInput })
    from_language: LanguageInput,
    @Context() req: any,
  ): Promise<GenericOutput> {
    console.log(
      'translateAllWordsAndPhrasesByLilt',
      JSON.stringify({
        from_language,
      }),
    );

    return this.aiTranslations.translateWordsAndPhrasesToAllLangsByLilt(
      from_language,
      getBearer(req) || '',
      null,
    );
  }

  @Mutation(() => GenericOutput)
  async translateAllWordsAndPhrasesBySmartcat(
    @Args('from_language', { type: () => LanguageInput })
    from_language: LanguageInput,
    @Context() req: any,
  ): Promise<GenericOutput> {
    console.log(
      'translateAllWordsAndPhrasesBySmartcat',
      JSON.stringify({
        from_language,
      }),
    );

    return this.aiTranslations.translateWordsAndPhrasesToAllLangsBySmartcat(
      from_language,
      getBearer(req) || '',
      null,
    );
  }

  @Mutation(() => GenericOutput)
  async stopGoogleTranslation(): Promise<GenericOutput> {
    console.log('stopGoogleTranslation');

    return this.aiTranslations.stopBotTranslation();
  }

  @Mutation(() => GenericOutput)
  async stopLiltTranslation(): Promise<GenericOutput> {
    console.log('stopLiltTranslation');
    return this.aiTranslations.stopBotTranslation();
  }

  @Subscription(() => TranslateAllWordsAndPhrasesByBotResult, {
    name: SubscriptionToken.TranslationReport,
  })
  async subscribeToTranslationReport() {
    console.log('subscribeToTranslationReport');
    return this.pubSub.asyncIterator(SubscriptionToken.TranslationReport);
  }
}
