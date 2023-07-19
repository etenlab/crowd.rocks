import { Injectable } from '@nestjs/common';

import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';
import { WordsService } from 'src/components/words/words.service';

import {
  WordDefinitionUpsertInput,
  WordDefinitionReadOutput,
  WordDefinitionUpsertOutput,
} from './types';

import {
  getWordDefinitionObjById,
  GetWordDefinitionObjectById,
  callWordDefinitionUpsertProcedure,
  WordDefinitionUpsertProcedureOutputRow,
} from './sql-string';

@Injectable()
export class WordDefinitionsService {
  constructor(private pg: PostgresService, private wordService: WordsService) {}

  async read(id: number): Promise<WordDefinitionReadOutput> {
    try {
      const res1 = await this.pg.pool.query<GetWordDefinitionObjectById>(
        ...getWordDefinitionObjById(+id),
      );

      if (res1.rowCount !== 1) {
        console.error(`no word definition for id: ${id}`);
      } else {
        const wordOutput = await this.wordService.read({
          word_id: res1.rows[0].word_id + '',
        });

        return {
          error: wordOutput.error,
          word_definition: {
            word_definition_id: id + '',
            word: wordOutput.word,
            definition: res1.rows[0].definition,
          },
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_definition: null,
    };
  }

  async upsert(
    input: WordDefinitionUpsertInput,
    token?: string,
  ): Promise<WordDefinitionUpsertOutput> {
    try {
      const res =
        await this.pg.pool.query<WordDefinitionUpsertProcedureOutputRow>(
          ...callWordDefinitionUpsertProcedure({
            word_id: +input.word_id,
            definition: input.definition,
            token: token,
          }),
        );

      const creatingError = res.rows[0].p_error_type;
      const word_definition_id = res.rows[0].p_word_definition_id;

      if (creatingError !== ErrorType.NoError || !word_definition_id) {
        return {
          error: creatingError,
          word_definition: null,
        };
      }

      const { error: readingError, word_definition } = await this.read(
        word_definition_id,
      );

      return {
        error: readingError,
        word_definition,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_definition: null,
    };
  }
}
