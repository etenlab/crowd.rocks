import { Injectable, Logger } from '@nestjs/common';
import {
  Args,
  Query,
  Resolver,
  Mutation,
  Context,
  ID,
  Int,
} from '@nestjs/graphql';
import { getBearer } from 'src/common/utility';
import {
  GetPericopeTextInput,
  PericopeTextWithDescription,
} from '../pericope-translations/types';

import { PericopeVotesService } from './pericope-votes.service';
import { PericopiesService } from './pericopies.service';

import {
  PericopiesOutput,
  PericopeVoteStatusOutput,
  PericopeWithVotesListConnection,
} from './types';

@Injectable()
@Resolver()
export class PericopiesResolver {
  constructor(
    private pericopiesService: PericopiesService,
    private pericopeVotesService: PericopeVotesService,
  ) {}

  @Query(() => PericopiesOutput)
  async readPericopies(
    @Args('ids', { type: () => [ID] }) ids: string[],
  ): Promise<PericopiesOutput> {
    Logger.log('readPericopies, ids:', ids);

    return this.pericopiesService.reads(
      ids.map((id) => +id),
      null,
    );
  }

  @Query(() => PericopeWithVotesListConnection)
  async getPericopiesByDocumentId(
    @Args('document_id', { type: () => ID }) document_id: string,
    @Args('first', { type: () => Int, nullable: true }) first: number | null,
    @Args('after', { type: () => ID, nullable: true }) after: string | null,
  ): Promise<PericopeWithVotesListConnection> {
    Logger.log(
      'getPericopiesByDocumentId',
      JSON.stringify({ document_id, first, after }, null, 2),
    );

    return this.pericopiesService.getPericopiesByDocumentId(
      +document_id,
      first,
      after,
      null,
    );
  }

  @Mutation(() => PericopiesOutput)
  async upsertPericopies(
    @Args('startWords', { type: () => [String] })
    startWords: string[],
    @Context() req: any,
  ): Promise<PericopiesOutput> {
    Logger.log('upsertPericopies: ', startWords);

    return this.pericopiesService.upserts(
      startWords.map((word) => +word),
      getBearer(req) || '',
      null,
    );
  }

  @Query(() => PericopeVoteStatusOutput)
  async getPericopeVoteStatus(
    @Args('pericope_id', { type: () => ID }) pericope_id: string,
  ): Promise<PericopeVoteStatusOutput> {
    Logger.log('getPericopeVoteStatus, pericope_id:', pericope_id);

    const { error, vote_status_list } =
      await this.pericopeVotesService.getVoteStatusFromIds(
        [+pericope_id],
        null,
      );

    return {
      error,
      vote_status: vote_status_list.length > 0 ? vote_status_list[0] : null,
    };
  }

  @Mutation(() => PericopeVoteStatusOutput)
  async togglePericopeVoteStatus(
    @Args('pericope_id', { type: () => ID })
    pericope_id: string,
    @Args('vote', { type: () => Boolean })
    vote: boolean,
    @Context() req: any,
  ): Promise<PericopeVoteStatusOutput> {
    Logger.log('togglePericopeVoteStatus: ', {
      pericope_id,
      vote,
    });

    return this.pericopeVotesService.toggleVoteStatus(
      +pericope_id,
      vote,
      getBearer(req) || '',
      null,
    );
  }

  @Query(() => PericopeTextWithDescription)
  async useGetPericopeTextQuery(
    @Args('input') input: GetPericopeTextInput,
  ): Promise<PericopeTextWithDescription> {
    return this.pericopiesService.getPericopeTextWithDescription(input);
  }
}
