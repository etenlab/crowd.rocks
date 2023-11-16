import { Injectable, Logger } from '@nestjs/common';
import { PoolClient } from 'pg';

import { pgClientOrPool } from 'src/common/utility';

import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';

import {
  DocumentWordEntry,
  DocumentWordEntriesOutput,
  DocumentWordEntriesEdge,
  DocumentWordEntriesListConnection,
} from './types';

import {
  GetDocumentWordEntryRow,
  getDocumentWordEntryByIds,
  getDocumentWordEntryByDocumentId,
  GetDocumentWordEntriesTotalPageSize,
  getDocumentWordEntriesTotalPageSize,
  DocumentWordEntryUpsertsProcedureOutputRow,
  callDocumentWordEntryUpsertsProcedure,
} from './sql-string';
import { WordlikeStringsService } from '../words/wordlike-strings.service';
import { WordlikeString } from '../words/types';
import { AuthorizationService } from '../authorization/authorization.service';

@Injectable()
export class DocumentWordEntriesService {
  constructor(
    private pg: PostgresService,
    private wordlikeStringsService: WordlikeStringsService,
    private authService: AuthorizationService,
  ) {}

  private async convertQueryResultToDocumentWordEntries(
    rows: GetDocumentWordEntryRow[],
    pgClient: PoolClient | null,
  ): Promise<DocumentWordEntriesOutput> {
    try {
      const wordlikeStringIds: number[] = [];

      rows.forEach((row) => {
        wordlikeStringIds.push(+row.wordlike_string_id);
      });

      const { error, wordlike_strings } =
        await this.wordlikeStringsService.reads(wordlikeStringIds, pgClient);

      if (error !== ErrorType.NoError) {
        return {
          error,
          document_word_entries: [],
        };
      }

      const wordlikeStringsMap = new Map<string, WordlikeString>();

      wordlike_strings.forEach((wordlike_string) =>
        wordlike_string
          ? wordlikeStringsMap.set(
              wordlike_string.wordlike_string_id,
              wordlike_string,
            )
          : null,
      );

      return {
        error: ErrorType.NoError,
        document_word_entries: rows.map((row) => {
          const wordlike_string = wordlikeStringsMap.get(
            row.wordlike_string_id,
          );

          if (!wordlike_string) {
            return null;
          }

          return {
            document_word_entry_id: row.document_word_entry_id,
            document_id: row.document_id,
            wordlike_string,
            parent_document_word_entry_id: row.parent_document_word_entry_id,
            page: +row.page,
          };
        }),
      };
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      document_word_entries: [],
    };
  }

  async reads(
    ids: number[],
    pgClient: PoolClient | null,
  ): Promise<DocumentWordEntriesOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetDocumentWordEntryRow>(...getDocumentWordEntryByIds(ids));

      return this.convertQueryResultToDocumentWordEntries(res.rows, pgClient);
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      document_word_entries: [],
    };
  }

  async upserts(
    input: {
      document_id: number;
      wordlike_string_id: number;
      parent_document_word_entry_id: number | null;
      page: number;
    }[],
    isSequentialUpsert: boolean,
    token: string,
    pgClient: PoolClient | null,
  ): Promise<DocumentWordEntriesOutput> {
    if (input.length === 0) {
      return {
        error: ErrorType.NoError,
        document_word_entries: [],
      };
    }

    if (!(await this.authService.is_authorized(token))) {
      return {
        error: ErrorType.Unauthorized,
        document_word_entries: [],
      };
    }

    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<DocumentWordEntryUpsertsProcedureOutputRow>(
        ...callDocumentWordEntryUpsertsProcedure({
          document_ids: input.map((item) => item.document_id),
          wordlike_string_ids: input.map((item) => item.wordlike_string_id),
          parent_document_word_entry_ids: input.map(
            (item) => item.parent_document_word_entry_id,
          ),
          pages: input.map((item) => item.page),
          isSequentialUpsert,
          token,
        }),
      );

      const creatingError = res.rows[0].p_error_type;
      const document_word_entry_ids = res.rows[0].p_document_word_entry_ids;

      if (creatingError !== ErrorType.NoError) {
        return {
          error: creatingError,
          document_word_entries: [],
        };
      }

      return this.reads(
        document_word_entry_ids.map((id) => +id),
        pgClient,
      );
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      document_word_entries: [],
    };
  }

  async getDocumentWordEntriesByDocumentId(
    document_id: number,
    first: number | null,
    after: string | null,
    pgClient: PoolClient | null,
  ): Promise<DocumentWordEntriesListConnection> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetDocumentWordEntryRow>(
        ...getDocumentWordEntryByDocumentId(
          document_id,
          first ? first + 1 : null,
          after ? +JSON.parse(after).page : 0,
        ),
      );

      const pageMap = new Map<number, DocumentWordEntry[]>();

      const { error, document_word_entries } =
        await this.convertQueryResultToDocumentWordEntries(res.rows, pgClient);

      if (error !== ErrorType.NoError) {
        return {
          error,
          edges: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null,
            totalEdges: 0,
          },
        };
      }

      for (let i = 0; i < document_word_entries.length; i++) {
        const documentWordEntry = document_word_entries[i];
        if (documentWordEntry === null) {
          return {
            error: ErrorType.DocumentEntryReadError,
            edges: [],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: null,
              endCursor: null,
              totalEdges: 0,
            },
          };
        }

        const entries = pageMap.get(documentWordEntry.page);

        if (entries) {
          entries.push(documentWordEntry);
        } else {
          pageMap.set(documentWordEntry.page, [documentWordEntry]);
        }
      }

      const res1 = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetDocumentWordEntriesTotalPageSize>(
        ...getDocumentWordEntriesTotalPageSize(document_id),
      );

      const tempEdges: DocumentWordEntriesEdge[] = [];

      const endPage = first ? first + 1 : res1.rows[0].total_pages + 1;
      const startPage = after ? +JSON.parse(after).page + 1 : 1;

      for (let i = 0; i < endPage; i++) {
        const entries = pageMap.get(startPage + i);

        if (entries) {
          tempEdges.push({
            cursor: JSON.stringify({ document_id, page: startPage + i }),
            node: entries,
          });
        }
      }

      const edges =
        first && tempEdges.length > first
          ? tempEdges.slice(0, first)
          : tempEdges;

      return {
        error: ErrorType.NoError,
        edges,
        pageInfo: {
          hasNextPage: first ? tempEdges.length > first : false,
          hasPreviousPage: false,
          startCursor: edges.length > 0 ? edges[0].cursor : null,
          endCursor:
            edges.length > 0 ? edges[edges.length - 1].cursor || null : null,
          totalEdges: res1.rowCount > 0 ? res1.rows[0].total_pages : 0,
        },
      };
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
        totalEdges: 0,
      },
    };
  }
}
