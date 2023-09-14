import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PoolClient } from 'pg';

import { pgClientOrPool } from 'src/common/utility';

import { ErrorType, GenericOutput } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';
import { PhrasesService } from 'src/components/phrases/phrases.service';
import { PhraseDefinitionVotesService } from './phrase-definition-votes.service';

import {
  PhraseDefinitionWithVote,
  PhraseDefinitionUpsertInput,
  PhraseDefinitionOutput,
  PhraseDefinitionsOutput,
  PhraseDefinitionUpdateInput,
  PhraseDefinitionWithVoteListOutput,
  PhraseDefinition,
  DefinitionIdsOutput,
} from './types';
import { Phrase } from '../phrases/types';

import { LanguageInput } from 'src/components/common/types';

import {
  getPhraseDefinitionObjByIds,
  GetPhraseDefinitionObjectById,
  callPhraseDefinitionUpsertProcedure,
  PhraseDefinitionUpsertProcedureOutputRow,
  callPhraseDefinitionUpsertsProcedure,
  PhraseDefinitionUpsertsProcedureOutput,
  PhraseDefinitionUpdateProcedureOutputRow,
  callPhraseDefinitionUpdateProcedure,
  GetPhraseDefinitionListByLang,
  getPhraseDefinitionListByLang,
  GetPhraseDefinitionListByPhraseId,
  getPhraseDefinitionListByPhraseIds,
} from './sql-string';

@Injectable()
export class PhraseDefinitionsService {
  constructor(
    private pg: PostgresService,
    @Inject(forwardRef(() => PhrasesService))
    private phraseService: PhrasesService,
    private phraseDefinitionVoteService: PhraseDefinitionVotesService,
  ) {}

  async read(
    id: number,
    pgClient: PoolClient | null,
  ): Promise<PhraseDefinitionOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetPhraseDefinitionObjectById>(
        ...getPhraseDefinitionObjByIds([+id]),
      );

      if (res.rowCount !== 1) {
        console.error(`no phrase definition for id: ${id}`);

        return {
          error: ErrorType.PhraseDefinitionNotFound,
          phrase_definition: null,
        };
      } else {
        const phraseOutput = await this.phraseService.read(
          {
            phrase_id: res.rows[0].phrase_id + '',
          },
          pgClient,
        );

        if (!phraseOutput.phrase) {
          return {
            error: ErrorType.WordDefinitionNotFound,
            phrase_definition: null,
          };
        }

        return {
          error: phraseOutput.error,
          phrase_definition: {
            phrase_definition_id: id + '',
            phrase: phraseOutput.phrase,
            definition: res.rows[0].definition,
            created_at: res.rows[0].created_at,
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

  async reads(
    ids: number[],
    pgClient: PoolClient | null,
  ): Promise<PhraseDefinitionsOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetPhraseDefinitionObjectById>(
        ...getPhraseDefinitionObjByIds(ids),
      );

      const { error, phrases } = await this.phraseService.reads(
        res.rows.map((row) => +row.phrase_id),
        pgClient,
      );

      if (error !== ErrorType.NoError) {
        return {
          error: error,
          phrase_definitions: [],
        };
      }

      const phraseMap = new Map<string, Phrase>();
      const phraseDefinitionsMap = new Map<string, PhraseDefinition>();

      phrases.forEach((phrase) =>
        phrase ? phraseMap.set(phrase.phrase_id, phrase) : null,
      );

      res.rows.forEach((row) => {
        const phrase = phraseMap.get(row.phrase_id);

        if (phrase && row) {
          phraseDefinitionsMap.set(row.phrase_definition_id, {
            phrase_definition_id: row.phrase_definition_id + '',
            phrase: phrase!,
            definition: row.definition,
            created_at: row.created_at,
          });
        }
      });

      return {
        error: ErrorType.NoError,
        phrase_definitions: ids.map((id) => {
          const phraseDefinition = phraseDefinitionsMap.get(id + '');

          return phraseDefinition ? phraseDefinition : null;
        }),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase_definitions: [],
    };
  }

  async upsert(
    input: PhraseDefinitionUpsertInput,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<PhraseDefinitionOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<PhraseDefinitionUpsertProcedureOutputRow>(
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
        +phrase_definition_id,
        pgClient,
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

  async upserts(
    input: {
      phrase_id: number;
      definition: string;
    }[],
    token: string,
    pgClient: PoolClient | null,
  ): Promise<PhraseDefinitionsOutput> {
    if (input.length === 0) {
      return {
        error: ErrorType.NoError,
        phrase_definitions: [],
      };
    }

    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<PhraseDefinitionUpsertsProcedureOutput>(
        ...callPhraseDefinitionUpsertsProcedure({
          phrase_ids: input.map((item) => item.phrase_id),
          definitions: input.map((item) => item.definition),
          token: token,
        }),
      );

      const creatingError = res.rows[0].p_error_type;
      const creatingErrors = res.rows[0].p_error_types;
      const phrase_definition_ids = res.rows[0].p_phrase_definition_ids;

      if (creatingError !== ErrorType.NoError) {
        return {
          error: creatingError,
          phrase_definitions: [],
        };
      }

      const ids: { phrase_definition_id: string; error: ErrorType }[] = [];

      for (let i = 0; i < phrase_definition_ids.length; i++) {
        ids.push({
          phrase_definition_id: phrase_definition_ids[i],
          error: creatingErrors[i],
        });
      }

      const { error: readingError, phrase_definitions } = await this.reads(
        ids
          .filter((id) => id.error === ErrorType.NoError)
          .map((id) => +id.phrase_definition_id),
        pgClient,
      );

      const phraseDefinitionsMap = new Map<string, PhraseDefinition>();

      phrase_definitions.forEach((phrase_definition) =>
        phrase_definition
          ? phraseDefinitionsMap.set(
              phrase_definition.phrase_definition_id,
              phrase_definition,
            )
          : null,
      );

      return {
        error: readingError,
        phrase_definitions: ids.map((id) => {
          if (id.error !== ErrorType.NoError) {
            return null;
          }

          return phraseDefinitionsMap.get(id.phrase_definition_id) || null;
        }),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase_definitions: [],
    };
  }

  async upsertInTrn(
    input: PhraseDefinitionUpsertInput,
    token: string,
    dbPoolClient: PoolClient,
  ): Promise<{ phrase_definition_id: number | null } & GenericOutput> {
    try {
      const res =
        await dbPoolClient.query<PhraseDefinitionUpsertProcedureOutputRow>(
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
          phrase_definition_id: null,
        };
      }

      return {
        error: ErrorType.NoError,
        phrase_definition_id: +phrase_definition_id,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase_definition_id: null,
    };
  }

  async update(
    input: PhraseDefinitionUpdateInput,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<PhraseDefinitionOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<PhraseDefinitionUpdateProcedureOutputRow>(
        ...callPhraseDefinitionUpdateProcedure({
          phrase_definition_id: +input.phrase_definition_id,
          definition: input.definitionlike_string,
          token: token,
        }),
      );

      const updatingError = res.rows[0].p_error_type;

      if (updatingError !== ErrorType.NoError) {
        return {
          error: updatingError,
          phrase_definition: null,
        };
      }

      const { error: readingError, phrase_definition } = await this.read(
        +input.phrase_definition_id,
        pgClient,
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

  async getPhraseDefinitionWithVoteListFromIds(
    ids: number[],
    pgClient: PoolClient | null,
  ): Promise<PhraseDefinitionWithVoteListOutput> {
    try {
      const { error: phraseDefinitionReadsError, phrase_definitions } =
        await this.reads(ids, pgClient);

      if (phraseDefinitionReadsError !== ErrorType.NoError) {
        return {
          error: phraseDefinitionReadsError,
          phrase_definition_list: [],
        };
      }

      const { error: voteError, vote_status_list } =
        await this.phraseDefinitionVoteService.getVoteStatusFromPhraseDefinitionIds(
          ids,
          pgClient,
        );

      if (voteError !== ErrorType.NoError) {
        return {
          error: voteError,
          phrase_definition_list: [],
        };
      }

      return {
        error: ErrorType.NoError,
        phrase_definition_list: ids.map((_id, index) => {
          if (phrase_definitions[index] && vote_status_list[index]) {
            return {
              ...phrase_definitions[index],
              upvotes: vote_status_list[index].upvotes,
              downvotes: vote_status_list[index].downvotes,
            } as PhraseDefinitionWithVote;
          } else {
            return null;
          }
        }),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase_definition_list: [],
    };
  }

  async getPhraseDefinitionsByLanguage(
    input: LanguageInput,
    pgClient: PoolClient | null,
  ): Promise<PhraseDefinitionWithVoteListOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetPhraseDefinitionListByLang>(
        ...getPhraseDefinitionListByLang({
          ...input,
        }),
      );

      return await this.getPhraseDefinitionWithVoteListFromIds(
        res.rows.map((row) => +row.phrase_definition_id),
        pgClient,
      );
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase_definition_list: [],
    };
  }

  async getPhraseDefinitionsByPhraseId(
    phrase_id: number,
    pgClient: PoolClient | null,
  ): Promise<PhraseDefinitionWithVoteListOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetPhraseDefinitionListByPhraseId>(
        ...getPhraseDefinitionListByPhraseIds([phrase_id]),
      );

      return await this.getPhraseDefinitionWithVoteListFromIds(
        res.rows.map((row) => +row.phrase_definition_id),
        pgClient,
      );
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase_definition_list: [],
    };
  }

  async getPhraseDefinitionIdsByPhraseIds(
    phraseIds: number[],
    pgClient: PoolClient | null,
  ): Promise<DefinitionIdsOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetPhraseDefinitionListByPhraseId>(
        ...getPhraseDefinitionListByPhraseIds(phraseIds),
      );

      return {
        error: ErrorType.NoError,
        ids: res.rows.map((row) => row.phrase_definition_id),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      ids: [],
    };
  }

  async getPhraseDefinitionsByPhraseIds(
    phraseIds: number[],
    pgClient: PoolClient | null,
  ): Promise<PhraseDefinitionWithVoteListOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetPhraseDefinitionListByPhraseId>(
        ...getPhraseDefinitionListByPhraseIds(phraseIds),
      );

      return await this.getPhraseDefinitionWithVoteListFromIds(
        res.rows.map((row) => +row.phrase_definition_id),
        pgClient,
      );
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      phrase_definition_list: [],
    };
  }

  getDiscussionTitle = async (id: string): Promise<string> => {
    const phrase_def = await this.read(Number(id), null);
    if (
      phrase_def.error !== ErrorType.NoError ||
      phrase_def.phrase_definition == null
    ) {
      console.error(phrase_def.error);
      return 'Phrase Book: ';
    }

    return `Phrase Book: ${phrase_def.phrase_definition.phrase.phrase} - ${phrase_def.phrase_definition.definition}`;
  };
}
