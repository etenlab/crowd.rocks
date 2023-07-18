import { Injectable } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';

import { ErrorType } from 'src/common/types';

import { PostgresService } from 'src/core/postgres.service';

import { Word, WordReadInput, WordReadOutput } from './types';
import { getWordObjById } from './sql-string';

@Injectable()
@Resolver(Word)
export class WordReadResolver {
  constructor(private pg: PostgresService) {}

  @Query(() => WordReadOutput)
  async wordReadResolver(
    @Args('input') input: WordReadInput,
  ): Promise<WordReadOutput> {
    console.log('word read resolver, word_id:', input.word_id);

    try {
      const res1 = await this.pg.pool.query(...getWordObjById(input.word_id));

      if (res1.rowCount !== 1) {
        console.error(`no word for id: ${input.word_id}`);
      } else {
        return {
          error: ErrorType.NoError,
          word: {
            word_id: input.word_id,
            word: res1.rows[0].word,
            definition:
              res1.rows[0].word_definition_id && res1.rows[0].definition
                ? {
                    word_definition_id: res1.rows[0].word_definition_id,
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
      word: null,
    };
  }
}
