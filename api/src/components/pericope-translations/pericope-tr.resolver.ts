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
import { getBearer } from '../../common/utility';
import { PericopeTrService } from './pericope-tr.service';
import {
  AddPericopeTrAndDescInput,
  AddPericopeTrAndDescOutput,
  GetPericopiesTrInput,
  PericopeTranslation,
  PericopiesTextsWithTranslationConnection,
} from './types';
import { BearerTokenAuthGuard } from '../../guards/bearer-token-auth.guard';

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
    @Args('input') input: AddPericopeTrAndDescInput,
    @Context() req: any,
  ): Promise<PericopeTranslation> {
    Logger.log(
      `${JSON.stringify(input)}`,
      `PericopeTrResolver#addPericopeTrAndDesc`,
    );
    const token = req.req.token as string;
    return this.pericopeTrService.addPericopeTrAndDesc(input, token);
  }
}
