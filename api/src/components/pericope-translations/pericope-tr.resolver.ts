import { Injectable, Logger, UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  ID,
  Int,
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { PericopeTrService } from './pericope-tr.service';
import {
  AddPericopeTranslationInput,
  GetPericopeTranslationsInput,
  GetPericopiesTrInput,
  PericopeTranslation,
  PericopeTranslationsOutput,
  PericopeTrVoteStatusListOutput,
  PericopiesTextsWithTranslationConnection,
} from './types';
import { BearerTokenAuthGuard } from '../../guards/bearer-token-auth.guard';
import { ErrorType } from '../../common/types';

@Injectable()
@Resolver()
export class PericopeTrResolver {
  constructor(private pericopeTrService: PericopeTrService) {}

  @Query(() => PericopiesTextsWithTranslationConnection)
  async getPericopiesTr(
    @Args('input') input: GetPericopiesTrInput,
    @Args('first', { type: () => Int, nullable: true }) first: number | null,
    @Args('after', { type: () => ID, nullable: true }) after: string | null,
  ): Promise<PericopiesTextsWithTranslationConnection> {
    Logger.log(
      `${JSON.stringify(input)}; ${first}; ${after}`,
      `PericopeTrResolver#getPericopiesTr`,
    );
    return this.pericopeTrService.getPericopiesTextsWithTranslationConnection(
      input,
      first,
      after,
    );
  }

  @UseGuards(BearerTokenAuthGuard)
  @Mutation(() => PericopeTranslation)
  async addPericopeTrAndDescTr(
    @Args('input') input: AddPericopeTranslationInput,
    @Context() req: any,
  ): Promise<PericopeTranslation> {
    Logger.log(
      `${JSON.stringify(input)}`,
      `PericopeTrResolver#addPericopeTrAndDesc`,
    );
    const token = req.req.token as string;
    return this.pericopeTrService.addPericopeTrAndDesc(input, token);
  }

  @UseGuards(BearerTokenAuthGuard)
  @Mutation(() => PericopeTrVoteStatusListOutput)
  async togglePericopeTrVoteStatus(
    @Args('pericope_translation_id', { type: () => ID })
    pericope_translation_id: string,
    @Args('vote', { type: () => Boolean }) vote: boolean,
    @Context() req: any,
  ): Promise<PericopeTrVoteStatusListOutput> {
    Logger.log(
      `${JSON.stringify(pericope_translation_id)}`,
      `PericopeTrResolver#togglePericopeTrVoteStatus`,
    );

    return this.pericopeTrService.toggleVoteStatus(
      pericope_translation_id,
      vote,
      req.req.token as string,
    );
  }

  @Query(() => PericopeTranslationsOutput)
  async getPericopeTranslations(
    @Args('input') input: GetPericopeTranslationsInput,
  ): Promise<PericopeTranslationsOutput> {
    Logger.log(
      `${JSON.stringify(input)}`,
      `PericopeTrResolver#getPericopeTranslations`,
    );
    try {
      const translations =
        await this.pericopeTrService.getPericopeTranslationsByPericopeId(
          input.pericopeId,
          input.targetLang,
        );
      return {
        error: ErrorType.NoError,
        translations: translations.map((t) => ({
          ...t,
          upvotes: t.upvotes || 0,
          downvotes: t.downvotes || 0,
        })),
      };
    } catch (error) {
      Logger.error(error, `PericopeTrResolver#getPericopeTranslations`);
      return {
        error: ErrorType.PericopeGetTranslationError,
        translations: [],
      };
    }
  }
}
