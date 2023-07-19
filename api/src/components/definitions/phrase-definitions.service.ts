import { Injectable } from '@nestjs/common';

import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';
import { PhrasesService } from 'src/components/phrases/phrases.service';

import {
  PhraseDefinitionUpsertInput,
  PhraseDefinitionReadOutput,
  PhraseDefinitionUpsertOutput,
} from './types';

import {
  getPhraseDefinitionObjById,
  GetPhraseDefinitionObjectById,
  callPhraseDefinitionUpsertProcedure,
  PhraseDefinitionUpsertProcedureOutputRow,
} from './sql-string';

@Injectable()
export class PhraseDefinitionsService {
  constructor(
    private pg: PostgresService,
    private phraseService: PhrasesService,
  ) {}

  async read(id: number): Promise<PhraseDefinitionReadOutput> {
    try {
      const res1 = await this.pg.pool.query<GetPhraseDefinitionObjectById>(
        ...getPhraseDefinitionObjById(+id),
      );

      if (res1.rowCount !== 1) {
        console.error(`no phrase definition for id: ${id}`);
      } else {
        const phraseOutput = await this.phraseService.read({
          phrase_id: res1.rows[0].phrase_id + '',
        });

        return {
          error: phraseOutput.error,
          phrase_definition: {
            phrase_definition_id: id + '',
            phrase: phraseOutput.phrase,
            definition: res1.rows[0].definition,
          },
        };
      }
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase_definition: null,
    };
  }

  async upsert(
    input: PhraseDefinitionUpsertInput,
    token?: string,
  ): Promise<PhraseDefinitionUpsertOutput> {
    try {
      const res =
        await this.pg.pool.query<PhraseDefinitionUpsertProcedureOutputRow>(
          ...callPhraseDefinitionUpsertProcedure({
            phrase_id: +input.phrase_id,
            definition: input.definition,
            token: token,
          }),
        );

      const creatingError = res.rows[0].p_error_type;
      const phrase_definition_id = res.rows[0].p_phrase_definition_id;

      if (creatingError !== ErrorType.NoError || !phrase_definition_id) {
        return {
          error: creatingError,
          phrase_definition: null,
        };
      }

      const { error: readingError, phrase_definition } = await this.read(
        phrase_definition_id,
      );

      return {
        error: readingError,
        phrase_definition,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase_definition: null,
    };
  }
}