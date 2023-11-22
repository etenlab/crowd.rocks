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
import { BotType, ChatGPTVersion, GenericOutput } from 'src/common/types';
import { getBearer } from 'src/common/utility';
import { PUB_SUB } from 'src/pubSub.module';
import { IsAuthAdmin } from '../../decorators/is-auth-admin.decorator';
import { LanguageInput } from '../common/types';
import { AiTranslationsService } from './ai-translations.service';
import {
  LanguageListForBotTranslateOutput,
  TranslatedLanguageInfoOutput,
  TranslatedLanguageInfoInput,
  TranslateAllWordsAndPhrasesByBotOutput,
  TranslateAllWordsAndPhrasesByBotResult,
  BotTranslateDocumentInput,
  GPTTranslateProgress,
} from './types';

@Injectable()
@Resolver()
export class BotsResolver {
  constructor(
    private aiTranslationsService: AiTranslationsService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Query(() => LanguageListForBotTranslateOutput)
  async languagesForBotTranslate(
    @Args('botType', { type: () => BotType }) botType,
  ): Promise<LanguageListForBotTranslateOutput> {
    console.log('languagesForBotTranslate resolver');
    return this.aiTranslationsService.languagesForBotTranslate(botType);
  }

  @Query(() => TranslatedLanguageInfoOutput)
  async getLanguageTranslationInfo(
    @Args('input')
    input: TranslatedLanguageInfoInput,
  ): Promise<TranslatedLanguageInfoOutput> {
    console.log(
      `getLanguageTranslationInfo resolver fromLang: ${input.fromLanguageCode} toLang: ${input.toLanguageCode}`,
    );
    return this.aiTranslationsService.getTranslationLanguageInfo(input, null);
  }

  @IsAuthAdmin()
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

    return this.aiTranslationsService.translateWordsAndPhrasesByGoogle(
      from_language,
      to_language,
      null,
    );
  }

  @IsAuthAdmin()
  @Mutation(() => TranslateAllWordsAndPhrasesByBotOutput)
  async translateWordsAndPhrasesByChatGPT35(
    @Args('from_language', { type: () => LanguageInput })
    from_language: LanguageInput,
    @Args('to_language', { type: () => LanguageInput })
    to_language: LanguageInput,
    @Context() req: any,
  ): Promise<TranslateAllWordsAndPhrasesByBotOutput> {
    return this.aiTranslationsService.translateWordsAndPhrasesByChatGPT35(
      from_language,
      to_language,
      getBearer(req) || '',
      null,
    );
  }

  @IsAuthAdmin()
  @Mutation(() => TranslateAllWordsAndPhrasesByBotOutput)
  async translateWordsAndPhrasesByChatGPTFAKE(
    @Args('from_language', { type: () => LanguageInput })
    from_language: LanguageInput,
    @Args('to_language', { type: () => LanguageInput })
    to_language: LanguageInput,
    @Context() req: any,
  ): Promise<TranslateAllWordsAndPhrasesByBotOutput> {
    console.log('translateWordsAndPhrasesByGPTFAKE');
    return this.aiTranslationsService.translateWordsAndPhrasesByChatGPTFAKE(
      from_language,
      to_language,
      getBearer(req) || '',
      null,
    );
  }

  @IsAuthAdmin()
  @Mutation(() => TranslateAllWordsAndPhrasesByBotOutput)
  async translateWordsAndPhrasesByChatGPT4(
    @Args('from_language', { type: () => LanguageInput })
    from_language: LanguageInput,
    @Args('to_language', { type: () => LanguageInput })
    to_language: LanguageInput,
    @Context() req: any,
  ): Promise<TranslateAllWordsAndPhrasesByBotOutput> {
    return this.aiTranslationsService.translateWordsAndPhrasesByChatGPT4(
      from_language,
      to_language,
      getBearer(req) || '',
      null,
    );
  }

  @IsAuthAdmin()
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

    return this.aiTranslationsService.translateWordsAndPhrasesByLilt(
      from_language,
      to_language,
      null,
    );
  }

  @IsAuthAdmin()
  @Mutation(() => TranslateAllWordsAndPhrasesByBotOutput)
  async translateMissingWordsAndPhrasesByLilt(
    @Args('from_language', { type: () => LanguageInput })
    from_language: LanguageInput,
    @Args('to_language', { type: () => LanguageInput })
    to_language: LanguageInput,
    @Context() req: any,
  ): Promise<TranslateAllWordsAndPhrasesByBotOutput> {
    console.log(
      'translateMissingWordsAndPhrasesByLilt',
      JSON.stringify({
        from_language,
        to_language,
      }),
    );

    return this.aiTranslationsService.translateMissingWordsAndPhrasesByLilt(
      from_language,
      to_language,
      getBearer(req) || '',
      null,
    );
  }

  @IsAuthAdmin()
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

    return this.aiTranslationsService.translateWordsAndPhrasesBySmartcat(
      from_language,
      to_language,
      null,
    );
  }

  @IsAuthAdmin()
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

    return this.aiTranslationsService.translateWordsAndPhrasesByDeepL(
      from_language,
      to_language,
      null,
    );
  }

  @IsAuthAdmin()
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

    return this.aiTranslationsService.translateMissingWordsAndPhrasesByGoogle(
      from_language,
      to_language,
      getBearer(req) || '',
      null,
    );
  }

  @IsAuthAdmin()
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

    return this.aiTranslationsService.translateMissingWordsAndPhrasesByDeepL(
      from_language,
      to_language,
      getBearer(req) || '',
      null,
    );
  }

  @IsAuthAdmin()
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

    return this.aiTranslationsService.translateAllWordsAndPhrasesByDeepL(
      from_language,
      getBearer(req) || '',
      null,
    );
  }

  @IsAuthAdmin()
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

    return this.aiTranslationsService.translateMissingWordsAndPhrasesByGpt35(
      from_language,
      to_language,
      getBearer(req) || '',
      null,
      version,
    );
  }

  @IsAuthAdmin()
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

    return this.aiTranslationsService.translateWordsAndPhrasesToAllLangsByGoogle(
      from_language,
      getBearer(req) || '',
      null,
    );
  }

  @IsAuthAdmin()
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

    return this.aiTranslationsService.translateWordsAndPhrasesToAllLangsByLilt(
      from_language,
      getBearer(req) || '',
      null,
    );
  }

  @IsAuthAdmin()
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

    return this.aiTranslationsService.translateWordsAndPhrasesToAllLangsBySmartcat(
      from_language,
      getBearer(req) || '',
      null,
    );
  }

  @IsAuthAdmin()
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

    return this.aiTranslationsService.translateMissingWordsAndPhrasesBySmartcat(
      from_language,
      to_language,
      getBearer(req) || '',
      null,
    );
  }

  @IsAuthAdmin()
  @Mutation(() => GenericOutput)
  async stopBotTranslation(): Promise<GenericOutput> {
    console.log('stopBotTranslation');
    return this.aiTranslationsService.stopBotTranslation();
  }

  @Subscription(() => TranslateAllWordsAndPhrasesByBotResult, {
    name: SubscriptionToken.TranslationReport,
  })
  async subscribeToTranslationReport() {
    console.log('subscribeToTranslationReport');
    return this.pubSub.asyncIterator(SubscriptionToken.TranslationReport);
  }

  @Subscription(() => GPTTranslateProgress, {
    name: SubscriptionToken.ChatGptTranslateProgress,
  })
  async subscribeToGptTranslateProgress() {
    console.log('subscribeToGptTranslateProgress');
    return this.pubSub.asyncIterator(
      SubscriptionToken.ChatGptTranslateProgress,
    );
  }

  @IsAuthAdmin()
  @Mutation(() => GenericOutput)
  async botTranslateDocument(
    @Args('input', { type: () => BotTranslateDocumentInput })
    input: BotTranslateDocumentInput,
  ): Promise<GenericOutput> {
    return this.aiTranslationsService.botTranslateDocument(input);
  }
}
