import { Injectable } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';
import { Phrase, PhraseReadInput, PhraseReadOutput } from './types';

import { getPhraseObjById, GetPhraseObjByIdResultRow } from './sql-string';

@Injectable()
@Resolver(Phrase)
export class PhraseReadResolver {
  constructor(private pg: PostgresService) {}

  @Query(() => PhraseReadOutput)
  async phraseReadResolver(
    @Args('input') input: PhraseReadInput,
  ): Promise<PhraseReadOutput> {
    console.log('phrase read resolver, phrase_id:', input.phrase_id);

    try {
      const res1 = await this.pg.pool.query<GetPhraseObjByIdResultRow>(
        ...getPhraseObjById(+input.phrase_id),
      );

      if (res1.rowCount !== 1) {
        console.error(`no phrase for id: ${input.phrase_id}`);
      } else {
        return {
          error: ErrorType.NoError,
          phrase: {
            phrase_id: input.phrase_id,
            phrase: res1.rows[0].phrase,
            definition:
              res1.rows[0].definition_id && res1.rows[0].definition
                ? {
                    phrase_definition_id: res1.rows[0].definition_id + '',
                    definition: res1.rows[0].definition,
                  }
                : null,
            language_code: res1.rows[0].language_code,
            dialect_code: res1.rows[0].dialect_code,
            geo_code: res1.rows[0].geo_code,
          },
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase: null,
    };
  }
}
