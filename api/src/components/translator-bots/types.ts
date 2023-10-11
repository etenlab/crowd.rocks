import { ObjectType, Field, InputType, ID, Int } from '@nestjs/graphql';
import { GenericOutput, BotType } from 'src/common/types';
import { LanguageInput } from 'src/components/common/types';

export const LIMITS = 6000000 - 1000000;

export const GOOGLE_BOT_EMAIL = 'googlebot@crowd.rocks';

export enum ChatGPTVersion {
  Three = 'gpt-3.5-turbo',
  Four = 'gpt-4',
}

export interface ITranslator {
  translate: (
    originalTexts: string[],
    from_language: LanguageInput,
    to_language: LanguageInput,
    version?: any,
  ) => Promise<string[]>;
  getTranslatorToken: (version?: any) => Promise<{
    id: string;
    token: string;
  }>;
  getLanguages(): Promise<LanguageListForBotTranslateOutput>;
}

export interface IGPTTranslator extends ITranslator {
  translate: (
    originalTexts: string[],
    from_language: LanguageInput,
    to_language: LanguageInput,
    version: ChatGPTVersion,
  ) => Promise<string[]>;
  getTranslatorToken: (version: ChatGPTVersion) => Promise<{
    id: string;
    token: string;
  }>;
}

@ObjectType()
export class LanguageForBotTranslate {
  @Field(() => String) code: string;
  @Field(() => String) name: string;
}

@ObjectType()
export class LanguageListForBotTranslateOutput extends GenericOutput {
  @Field(() => [LanguageForBotTranslate], { nullable: true })
  languages: LanguageForBotTranslate[] | null;
}

@InputType()
export class LanguageListForBotTranslateInput {
  @Field(() => String) botType: BotType;
}

@InputType()
export class TranslatedLanguageInfoInput {
  @Field(() => ID)
  fromLanguageCode: string;
  @Field(() => ID, { nullable: true })
  toLanguageCode?: string;
}

@ObjectType()
export class TranslatedLanguageInfoOutput extends GenericOutput {
  @Field(() => Int) totalWordCount: number;
  @Field(() => Int) totalPhraseCount: number;
  @Field(() => Int, { nullable: true }) translatedMissingWordCount?: number;
  @Field(() => Int, { nullable: true }) translatedMissingPhraseCount?: number;
  @Field(() => Int) googleTranslateTotalLangCount: number;
  @Field(() => Int) liltTranslateTotalLangCount: number;
  @Field(() => Int) smartcatTranslateTotalLangCount: number;
}

@ObjectType()
export class TranslateAllWordsAndPhrasesByBotResult {
  @Field(() => Int) requestedCharacters: number;
  @Field(() => Int) totalWordCount: number;
  @Field(() => Int) totalPhraseCount: number;
  @Field(() => Int) translatedWordCount: number;
  @Field(() => Int) translatedPhraseCount: number;
  @Field(() => String, { nullable: true }) status?:
    | 'Completed'
    | 'Progressing'
    | 'Error';
  @Field(() => String, { nullable: true }) message?: string;
  @Field(() => [String], { nullable: true }) errors?: string[];
  @Field(() => Int, { nullable: true }) total?: number;
  @Field(() => Int, { nullable: true }) completed?: number;
}

@ObjectType()
export class TranslateAllWordsAndPhrasesByBotOutput extends GenericOutput {
  @Field(() => TranslateAllWordsAndPhrasesByBotResult, { nullable: true })
  result: TranslateAllWordsAndPhrasesByBotResult | null;
}

@InputType()
export class ChatGPTVersionInput {
  @Field(() => String) version: ChatGPTVersion;
}
