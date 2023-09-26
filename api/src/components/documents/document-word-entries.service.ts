import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';

import { pgClientOrPool } from 'src/common/utility';

import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';

import { DocumentWordEntriesOutput } from './types';

import {
  GetDocumentWordEntryRow,
  getDocumentWordEntryByIds,
  getDocumentWordEntryByDocumentId,
  DocumentWordEntryUpsertsProcedureOutputRow,
  callDocumentWordEntryUpsertsProcedure,
} from './sql-string';
import { WordlikeStringsService } from '../words/wordlike-strings.service';
import { WordlikeString } from '../words/types';

@Injectable()
export class DocumentWordEntriesService {
  constructor(
    private pg: PostgresService,
    private wordlikeStringsService: WordlikeStringsService,
  ) {}

  async reads(
    ids: number[],
    pgClient: PoolClient | null,
  ): Promise<DocumentWordEntriesOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetDocumentWordEntryRow>(...getDocumentWordEntryByIds(ids));

      const documentWordEntriesMap = new Map<string, GetDocumentWordEntryRow>();
      const wordlikeStringIds: number[] = [];

      res.rows.forEach((row) => {
        documentWordEntriesMap.set(row.document_word_entry_id, row);

        wordlikeStringIds.push(+row.document_word_entry_id);

        if (+row.parent_wordlike_string_id !== 0) {
          wordlikeStringIds.push(+row.parent_wordlike_string_id);
        }
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
        document_word_entries: ids.map((id) => {
          const documentWordEntry = documentWordEntriesMap.get(id + '')!;
          const wordlike_string = wordlikeStringsMap.get(
            documentWordEntry.wordlike_string_id,
          );
          const parent_wordlike_string =
            wordlikeStringsMap.get(
              documentWordEntry.parent_wordlike_string_id,
            ) || null;

          if (!wordlike_string) {
            return null;
          }

          return {
            document_word_entry_id: documentWordEntry.document_word_entry_id,
            document_id: documentWordEntry.document_id,
            wordlike_string,
            parent_wordlike_string,
          };
        }),
      };
    } catch (e) {
      console.error(e);
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
      parent_wordlike_string_id: number;
    }[],
    token: string,
    pgClient: PoolClient | null,
  ): Promise<DocumentWordEntriesOutput> {
    if (input.length === 0) {
      return {
        error: ErrorType.NoError,
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
          parent_wordlike_string_ids: input.map(
            (item) => item.parent_wordlike_string_id,
          ),
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
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      document_word_entries: [],
    };
  }

  async getDocumentWordEntriesByDocumentId(
    document_id: number,
    pgClient: PoolClient | null,
  ): Promise<DocumentWordEntriesOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetDocumentWordEntryRow>(
        ...getDocumentWordEntryByDocumentId(document_id),
      );

      const documentWordEntryIds = res.rows.map(
        (row) => +row.document_word_entry_id,
      );

      const { error, document_word_entries } = await this.reads(
        documentWordEntryIds,
        pgClient,
      );

      if (error !== ErrorType.NoError) {
        return {
          error,
          document_word_entries: [],
        };
      }

      for (let i = 0; i < document_word_entries.length; i++) {
        if (document_word_entries[i] === null) {
          return {
            error: ErrorType.DocumentEntryReadError,
            document_word_entries: [],
          };
        }
      }

      return {
        error: ErrorType.NoError,
        document_word_entries,
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      document_word_entries: [],
    };
  }
}
