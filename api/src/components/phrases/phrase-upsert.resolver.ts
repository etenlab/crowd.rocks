import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { ErrorType } from 'src/common/types';
import { getBearer } from 'src/common/utility';

import { PostgresService } from 'src/core/postgres.service';
import { PhraseReadResolver } from './phrase-read.resolver';

import { Phrase, PhraseUpsertInput, PhraseUpsertOutput } from './types';

import {
  callPhraseUpsertProcedure,
  PhraseUpsertProcedureOutputRow,
} from './sql-string';

@Resolver(Phrase)
export class PhraseUpsertResolver {
  constructor(
    private pg: PostgresService,
    private wordRead: PhraseReadResolver,
  ) {}

  @Mutation(() => PhraseUpsertOutput)
  async phraseUpsertResolver(
    @Args('input') input: PhraseUpsertInput,
    @Context() req: any,
  ): Promise<PhraseUpsertOutput> {
    console.log('word upsert resolver, string: ', input.phraselike_string);

    try {
      const res = await this.pg.pool.query<PhraseUpsertProcedureOutputRow>(
        ...callPhraseUpsertProcedure({
          phraselike_string: input.phraselike_string,
          language_code: input.language_code,
          dialect_code: input.dialect_code,
          geo_code: input.geo_code,
          token: getBearer(req),
        }),
      );

      const error = res.rows[0].p_error_type;
      const phrase_id = res.rows[0].p_phrase_id;

      if (error !== ErrorType.NoError || !phrase_id) {
        return {
          error,
          phrase: null,
        };
      }

      const phrase = await (
        await this.wordRead.phraseReadResolver({ phrase_id })
      ).phrase;

      return {
        error,
        phrase,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase: null,
    };
  }
}
