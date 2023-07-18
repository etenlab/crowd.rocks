import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { ErrorType } from 'src/common/types';
import { getBearer } from 'src/common/utility';

import { PostgresService } from 'src/core/postgres.service';
import { WordReadResolver } from './word-read.resolver';

import { Word, WordUpsertInput, WordUpsertOutput } from './types';

import {
  WordUpsertProcedureOutputRow,
  callWordUpsertProcedure,
} from './sql-string';

@Resolver(Word)
export class WordUpsertResolver {
  constructor(
    private pg: PostgresService,
    private wordRead: WordReadResolver,
  ) {}

  @Mutation(() => WordUpsertOutput)
  async wordUpsertResolver(
    @Args('input') input: WordUpsertInput,
    @Context() req: any,
  ): Promise<WordUpsertOutput> {
    console.log('word upsert resolver, string: ', input.wordlike_string);

    try {
      const res = await this.pg.pool.query<WordUpsertProcedureOutputRow>(
        ...callWordUpsertProcedure({
          wordlike_string: input.wordlike_string,
          language_code: input.language_code,
          dialect_code: input.dialect_code,
          geo_code: input.geo_code,
          token: getBearer(req),
        }),
      );

      const error = res.rows[0].p_error_type;
      const word_id = res.rows[0].p_word_id;

      if (error !== ErrorType.NoError || !word_id) {
        return {
          error,
          word: null,
        };
      }

      const word = await (
        await this.wordRead.wordReadResolver({ word_id })
      ).word;

      return {
        error,
        word,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word: null,
    };
  }
}
