import { Injectable } from '@nestjs/common';
import { Args, Query, Resolver, Mutation, Context } from '@nestjs/graphql';

import { getBearer } from 'src/common/utility';

import { PostgresService } from 'src/core/postgres.service';
import { FlagsService } from './flags.service';

import { FlagsOutput } from './types';

import { FlagType } from 'src/common/types';

@Injectable()
@Resolver()
export class FlagsResolver {
  constructor(
    private pg: PostgresService,
    private flagsService: FlagsService,
  ) {}

  @Query(() => FlagsOutput)
  async getFlagsFromRef(
    @Args('parent_table', { type: () => String }) parent_table: string,
    @Args('parent_id', { type: () => String }) parent_id: string,
  ): Promise<FlagsOutput> {
    console.log('get getFlagsFromRef:', {
      parent_table,
      parent_id,
    });

    return this.flagsService.getFlagsFromRef(parent_table, +parent_id, null);
  }

  @Mutation(() => FlagsOutput)
  async toggleFlagWithRef(
    @Args('parent_table', { type: () => String }) parent_table: string,
    @Args('parent_id', { type: () => String }) parent_id: string,
    @Args('name', { type: () => String }) name: FlagType,
    @Context() req: any,
  ): Promise<FlagsOutput> {
    console.log(`toggleFlagWithRef: `, {
      parent_table,
      parent_id,
      name,
    });

    return this.flagsService.toggleFlagWithRef(
      parent_table,
      +parent_id,
      name,
      getBearer(req) || '',
      null,
    );
  }
}
