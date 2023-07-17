import { Injectable } from '@nestjs/common';
import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { ErrorType } from 'src/common/types';
import { getBearer } from 'src/common/utility';
import { PostgresService } from 'src/core/postgres.service';
import { Word, WordReadInput, WordReadOutput } from './types';

@Injectable()
@Resolver(Word)
export class WordReadResolver {
  constructor(private pg: PostgresService) {}
  @Query(() => WordReadOutput)
  async wordReadResolver(
    @Args('input') input: WordReadInput,
    @Context() req: any,
  ): Promise<WordReadOutput> {
    console.log('word read resolver, word_id:', input.word_id);
    try {
      const res1 = await this.pg.pool.query(
        `
          select 
            wordlike_string as word,
            word_definitions.word_definition_id as word_definition_id,
            word_definitions.definition as definition,
            language_code,
            dialect_code, 
            geo_code
          from words
          inner join wordlike_strings
            on wordlike_strings.wordlike_string_id = words.wordlike_string_id
          full outer join word_definitions
            on words.word_definition_id = word_definitions.word_definition_id
          where words.word_id = $1
        `,
        [input.word_id],
      );

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
