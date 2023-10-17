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
import { BotType, GenericOutput } from 'src/common/types';
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
  async languagesForBotTranslate(
    @Args('botType', { type: () => BotType }) botType,
  ): Promise<LanguageListForBotTranslateOutput> {
    console.log('languagesForBotTranslate resolver');
    return this.aiTranslations.languagesForBotTranslate(botType);
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
  async translateWordsAndPhrasesByDeepL(
    @Args('from_language', { type: () => LanguageInput })
    from_language: LanguageInput,
    @Args('to_language', { type: () => LanguageInput })
    to_language: LanguageInput,
  ): Promise<TranslateAllWordsAndPhrasesByBotOutput> {
    console.log(
      'translateWordsAndPhrasesByDeepl',
      JSON.stringify({
        from_language,
        to_language,
      }),
    );

    return this.aiTranslations.translateWordsAndPhrasesByDeepL(
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
  async translateMissingWordsAndPhrasesByDeepL(
    @Args('from_language', { type: () => LanguageInput })
    from_language: LanguageInput,
    @Args('to_language', { type: () => LanguageInput })
    to_language: LanguageInput,
    @Context() req: any,
  ): Promise<TranslateAllWordsAndPhrasesByBotOutput> {
    console.log(
      'translateMissingWordsAndPhrasesByDeepL',
      JSON.stringify({
        from_language,
        to_language,
      }),
    );

    return this.aiTranslations.translateMissingWordsAndPhrasesByDeepL(
      from_language,
      to_language,
      getBearer(req) || '',
      null,
    );
  }

  @Mutation(() => GenericOutput)
  async translateAllWordsAndPhrasesByDeepL(
    @Args('from_language', { type: () => LanguageInput })
    from_language: LanguageInput,
    @Context() req: any,
  ): Promise<GenericOutput> {
    console.log(
      'translateAllWordsAndPhrasesByDeepL',
      JSON.stringify({
        from_language,
      }),
    );

    return this.aiTranslations.translateAllWordsAndPhrasesByDeepL(
      from_language,
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

  @Mutation(() => TranslateAllWordsAndPhrasesByBotOutput)
  async translateMissingWordsAndPhrasesBySmartcat(
    @Args('from_language', { type: () => LanguageInput })
    from_language: LanguageInput,
    @Args('to_language', { type: () => LanguageInput })
    to_language: LanguageInput,
    @Context() req: any,
  ): Promise<TranslateAllWordsAndPhrasesByBotOutput> {
    console.log(
      'translateMissingWordsAndPhrasesBySmartcat',
      JSON.stringify({
        from_language,
        to_language,
      }),
    );

    return this.aiTranslations.translateMissingWordsAndPhrasesBySmartcat(
      from_language,
      to_language,
      getBearer(req) || '',
      null,
    );
  }

  @Mutation(() => GenericOutput)
  async stopBotTranslation(): Promise<GenericOutput> {
    console.log('stopBotTranslation');
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
