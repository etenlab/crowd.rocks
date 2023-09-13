import { Injectable } from '@nestjs/common';
import {
  Args,
  Query,
  Resolver,
  Mutation,
  Context,
  Int,
  ID,
} from '@nestjs/graphql';

import { getBearer } from 'src/common/utility';

import { PostgresService } from 'src/core/postgres.service';
import { FlagsService } from './flags.service';

import {
  FlagsOutput,
  WordDefinitionListConnection,
  PhraseDefinitionListConnection,
} from './types';

import { FlagType, TableNameType } from 'src/common/types';

@Injectable()
@Resolver()
export class FlagsResolver {
  constructor(
    private pg: PostgresService,
    private flagsService: FlagsService,
  ) {}

  @Query(() => FlagsOutput)
  async getFlagsFromRef(
    @Args('parent_table', { type: () => TableNameType })
    parent_table: TableNameType,
    @Args('parent_id', { type: () => String }) parent_id: string,
  ): Promise<FlagsOutput> {
    console.log('get getFlagsFromRef:', {
      parent_table,
      parent_id,
    });

    return this.flagsService.getFlagsFromRef(parent_table, +parent_id, null);
  }

  @Query(() => WordDefinitionListConnection)
  async getWordDefinitionsByFlag(
    @Args('flag_name', { type: () => FlagType })
    flag_name: FlagType,
    @Args('first', { type: () => Int, nullable: true }) first: number | null,
    @Args('after', { type: () => ID, nullable: true }) after: string | null,
  ): Promise<WordDefinitionListConnection> {
    console.log('get getWordsByFlag:', {
      flag_name,
      first,
      after,
    });

    return this.flagsService.getWordDefinitionsByFlag(
      flag_name,
      first,
      after,
      null,
    );
  }

  @Query(() => PhraseDefinitionListConnection)
  async getPhraseDefinitionsByFlag(
    @Args('flag_name', { type: () => FlagType })
    flag_name: FlagType,
    @Args('first', { type: () => Int, nullable: true }) first: number | null,
    @Args('after', { type: () => ID, nullable: true }) after: string | null,
  ): Promise<PhraseDefinitionListConnection> {
    console.log('get getPhrasesByFlag:', {
      flag_name,
      first,
      after,
    });

    return this.flagsService.getPhraseDefinitionsByFlag(
      flag_name,
      first,
      after,
      null,
    );
  }

  @Mutation(() => FlagsOutput)
  async toggleFlagWithRef(
    @Args('parent_table', { type: () => TableNameType })
    parent_table: TableNameType,
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
