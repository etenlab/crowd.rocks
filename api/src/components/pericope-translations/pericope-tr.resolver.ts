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
  PericopeTrVoteStatusAndBestTrListOutput,
  PericopiesTextsWithTranslationConnection,
} from './types';
import { BearerTokenAuthGuard } from '../../guards/bearer-token-auth.guard';
import { ErrorType } from '../../common/types';
import { LanguageInput } from '../common/types';

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
  async addPericopeTr(
    @Args('input') input: AddPericopeTranslationInput,
    @Context() req: any,
  ): Promise<PericopeTranslation> {
    Logger.log(`${JSON.stringify(input)}`, `PericopeTrResolver#addPericopeTr`);
    const token = req.req.token as string;
    return this.pericopeTrService.addPericopeTrAndDesc(input, token);
  }

  @UseGuards(BearerTokenAuthGuard)
  @Mutation(() => PericopeTrVoteStatusAndBestTrListOutput)
  async togglePericopeTrVoteStatus(
    @Args('pericope_translation_id', { type: () => ID })
    pericope_translation_id: string,
    @Args('vote', { type: () => Boolean }) vote: boolean,
    @Context() req: any,
  ): Promise<PericopeTrVoteStatusAndBestTrListOutput> {
    Logger.log(
      `${JSON.stringify(pericope_translation_id)}`,
      `PericopeTrResolver#togglePericopeTrVoteStatus`,
    );

    const vote_status_list = await this.pericopeTrService.toggleVoteStatus(
      pericope_translation_id,
      vote,
      req.req.token as string,
    );

    const pIdsLangs: { pericopeId: string; lang: LanguageInput }[] =
      await this.pericopeTrService.getPericopeIdsAndLangsOfTranslationIds(
        vote_status_list.vote_status_list.map((v) => v.pericope_translation_id),
      );

    const bestTrListPromises: Promise<PericopeTranslation | null>[] =
      pIdsLangs.map((pIdLang) => {
        return this.pericopeTrService.getRecomendedPericopeTranslation(
          pIdLang.pericopeId,
          pIdLang.lang,
        );
      });

    return {
      ...vote_status_list,
      best_translation_list: await Promise.all(bestTrListPromises),
    };
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
