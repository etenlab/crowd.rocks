import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';

import { pgClientOrPool } from 'src/common/utility';
import { ErrorType, FlagType, TableNameType } from 'src/common/types';

import { PostgresService } from 'src/core/postgres.service';
import { WordDefinitionsService } from '../definitions/word-definitions.service';
import { PhraseDefinitionsService } from '../definitions/phrase-definitions.service';

import {
  Flag,
  FlagsOutput,
  FlagsListOutput,
  WordDefinitionListConnection,
  PhraseDefinitionListConnection,
} from './types';
import { WordDefinition, PhraseDefinition } from '../definitions/types';

import {
  GetFlagRow,
  getFlagsFromRefQuery,
  getFlagsFromRefsQuery,
  FlagToggleProcedureOutput,
  callFlagToggleFlagWithRef,
  getFlagsByRef,
} from './sql-string';

@Injectable()
export class FlagsService {
  constructor(
    private pg: PostgresService,
    private wordDefinitionsService: WordDefinitionsService,
    private phraseDefinitionsService: PhraseDefinitionsService,
  ) {}

  async getFlagsFromRef(
    parent_table: TableNameType,
    parent_id: number,
    pgClient: PoolClient | null,
  ): Promise<FlagsOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetFlagRow>(
        ...getFlagsFromRefQuery({
          parent_table,
          parent_id,
        }),
      );

      return {
        error: ErrorType.NoError,
        flags: res.rows,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      flags: [],
    };
  }

  async getFlagsFromRefs(
    refs: {
      parent_table: TableNameType;
      parent_id: number;
    }[],
    pgClient: PoolClient | null,
  ): Promise<FlagsListOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetFlagRow>(...getFlagsFromRefsQuery(refs));

      const flagsMap = new Map<string, Flag[]>();

      res.rows.forEach((row) => {
        const keyStr = `${row.parent_table}-${row.parent_id}`;
        const arr = flagsMap.get(keyStr);

        if (arr === undefined) {
          flagsMap.set(keyStr, [row]);
        } else {
          arr.push(row);
        }
      });

      return {
        error: ErrorType.NoError,
        flags_list: refs.map(
          (ref) => flagsMap.get(`${ref.parent_table}-${ref.parent_id}`) || [],
        ),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      flags_list: [],
    };
  }

  async toggleFlagWithRef(
    parent_table: TableNameType,
    parent_id: number,
    name: FlagType,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<FlagsOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<FlagToggleProcedureOutput>(
        ...callFlagToggleFlagWithRef({
          parent_table,
          parent_id,
          flag_name: name,
          token,
        }),
      );

      const creatingError = res.rows[0].p_error_type;
      const flag_id = res.rows[0].p_flag_id;

      if (creatingError !== ErrorType.NoError || !flag_id) {
        return {
          error: creatingError,
          flags: [],
        };
      }

      return this.getFlagsFromRef(parent_table, parent_id, pgClient);
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      flags: [],
    };
  }

  async getWordDefinitionsByFlag(
    flag_name: FlagType,
    first: number | null,
    after: string | null,
    pgClient: PoolClient | null,
  ): Promise<WordDefinitionListConnection> {
    try {
      const res1 = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetFlagRow>(
        ...getFlagsByRef({
          flag_name,
          parent_table: TableNameType.word_definitions,
        }),
      );
      const res2 = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetFlagRow>(
        ...getFlagsByRef({
          flag_name,
          parent_table: TableNameType.words,
        }),
      );

      const { error: wordDefinitionError, ids } =
        await this.wordDefinitionsService.getWordDefinitionIdsByWordIds(
          res2.rows.map((row) => +row.parent_id),
          null,
        );

      if (wordDefinitionError !== ErrorType.NoError) {
        return {
          error: wordDefinitionError,
          edges: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null,
          },
        };
      }

      const wordDefinitionIds: string[] = [
        ...res1.rows.map((row) => row.parent_id),
        ...ids.map((id) => id),
      ];

      const selectedIds: number[] = [];

      let offset: number | null = null;
      let hasNextPage = false;
      let startCursor: string | null = null;
      let endCursor: string | null = null;

      for (let i = 0; i < wordDefinitionIds.length; i++) {
        const id = wordDefinitionIds[i];

        if (after === null && offset === null) {
          offset = 0;
        }

        if (id !== after && offset === null) {
          continue;
        }

        if (id === after && offset === null) {
          offset = 0;
          continue;
        }

        if (offset === 0) {
          startCursor = id;
        }

        if (first !== null && offset! >= first) {
          hasNextPage = true;
          break;
        }

        selectedIds.push(+id);

        endCursor = id;
        offset!++;
      }

      const { error, word_definitions } =
        await this.wordDefinitionsService.reads(selectedIds, pgClient);

      if (error !== ErrorType.NoError) {
        return {
          error,
          edges: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null,
          },
        };
      }

      return {
        error: ErrorType.NoError,
        edges: word_definitions
          .filter((word_definition) => word_definition)
          .map((word_definition: WordDefinition) => ({
            cursor: word_definition.word_definition_id,
            node: word_definition,
          })),
        pageInfo: {
          hasNextPage,
          hasPreviousPage: false,
          startCursor,
          endCursor,
        },
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      },
    };
  }

  async getPhraseDefinitionsByFlag(
    flag_name: FlagType,
    first: number | null,
    after: string | null,
    pgClient: PoolClient | null,
  ): Promise<PhraseDefinitionListConnection> {
    try {
      const res1 = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetFlagRow>(
        ...getFlagsByRef({
          flag_name,
          parent_table: TableNameType.phrase_definitions,
        }),
      );
      const res2 = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetFlagRow>(
        ...getFlagsByRef({
          flag_name,
          parent_table: TableNameType.phrases,
        }),
      );

      const { error: phraseDefinitionError, ids } =
        await this.phraseDefinitionsService.getPhraseDefinitionIdsByPhraseIds(
          res2.rows.map((row) => +row.parent_id),
          null,
        );

      if (phraseDefinitionError !== ErrorType.NoError) {
        return {
          error: phraseDefinitionError,
          edges: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null,
          },
        };
      }

      const phraseDefinitionIds: string[] = [
        ...res1.rows.map((row) => row.parent_id),
        ...ids.map((id) => id),
      ];

      const selectedIds: number[] = [];

      let offset: number | null = null;
      let hasNextPage = false;
      let startCursor: string | null = null;
      let endCursor: string | null = null;

      for (let i = 0; i < phraseDefinitionIds.length; i++) {
        const id = phraseDefinitionIds[i];

        if (after === null && offset === null) {
          offset = 0;
        }

        if (id !== after && offset === null) {
          continue;
        }

        if (id === after && offset === null) {
          offset = 0;
          continue;
        }

        if (offset === 0) {
          startCursor = id;
        }

        if (first !== null && offset! >= first) {
          hasNextPage = true;
          break;
        }

        selectedIds.push(+id);

        endCursor = id;
        offset!++;
      }

      const { error, phrase_definitions } =
        await this.phraseDefinitionsService.reads(selectedIds, pgClient);

      if (error !== ErrorType.NoError) {
        return {
          error,
          edges: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null,
          },
        };
      }

      return {
        error: ErrorType.NoError,
        edges: phrase_definitions
          .filter((phrase_definition) => phrase_definition)
          .map((phrase_definition: PhraseDefinition) => ({
            cursor: phrase_definition.phrase_definition_id,
            node: phrase_definition,
          })),
        pageInfo: {
          hasNextPage,
          hasPreviousPage: false,
          startCursor,
          endCursor,
        },
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      },
    };
  }
}
