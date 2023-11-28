import { Injectable, Logger } from '@nestjs/common';
import { Args, ID, Int, Query, Resolver } from '@nestjs/graphql';
import { PericopeTrService } from './pericope-tr.service';
import {
  GetPericopiesTrInput,
  PericopiesTextsWithTranslationConnection,
} from './types';

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
    Logger.log(`PericopeTrResolver#getPericopiesTr`);
    console.log(JSON.stringify(input), first, after);
    return this.pericopeTrService.getPericopiesTextsWithTranslationConnection(
      input,
      first,
      after,
    );
  }
}
