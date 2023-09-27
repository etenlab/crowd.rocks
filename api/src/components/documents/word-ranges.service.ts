import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';

import { pgClientOrPool } from 'src/common/utility';

import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';
import { DocumentWordEntriesService } from './document-word-entries.service';

import {
  WordRangesOutput,
  WordRangeUpsertInput,
  DocumentWordEntry,
} from './types';

import {
  GetWordRangeRow,
  getWordRangeByIds,
  getWordRangeByDocumentId,
  getWordRangeByBeginWordIds,
  WordRangeUpsertsProcedureOutputRow,
  callWordRangeUpsertsProcedure,
} from './sql-string';

@Injectable()
export class WordRangesService {
  constructor(
    private pg: PostgresService,
    private documentWordEntryService: DocumentWordEntriesService,
  ) {}

  private async convertRowResultToWordRange(
    rows: GetWordRangeRow[],
    pgClient: PoolClient | null,
  ) {
    try {
      const wordRangesMap = new Map<string, GetWordRangeRow>();

      const documentWordEntryIds: number[] = [];

      rows.forEach((row) => {
        wordRangesMap.set(row.word_range_id, row);

        documentWordEntryIds.push(+row.begin_word, +row.end_word);
      });

      const { error, document_word_entries } =
        await this.documentWordEntryService.reads(
          documentWordEntryIds,
          pgClient,
        );

      if (error !== ErrorType.NoError) {
        return {
          error,
          word_ranges: [],
        };
      }

      const documentWordEntriesMap = new Map<string, DocumentWordEntry>();

      document_word_entries.forEach((document_word_entry) =>
        document_word_entry
          ? documentWordEntriesMap.set(
              document_word_entry.document_word_entry_id,
              document_word_entry,
            )
          : null,
      );

      return {
        error: ErrorType.NoError,
        word_ranges: rows.map((row) => {
          const begin = documentWordEntriesMap.get(row.begin_word);
          const end = documentWordEntriesMap.get(row.end_word);

          if (!begin || !end) {
            return null;
          }

          return {
            word_range_id: row.word_range_id,
            begin,
            end,
          };
        }),
      };
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_ranges: [],
    };
  }

  async reads(
    ids: number[],
    pgClient: PoolClient | null,
  ): Promise<WordRangesOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetWordRangeRow>(...getWordRangeByIds(ids));

      return this.convertRowResultToWordRange(res.rows, pgClient);
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_ranges: [],
    };
  }

  async getByBeginWordIds(
    ids: number[],
    pgClient: PoolClient | null,
  ): Promise<WordRangesOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetWordRangeRow>(...getWordRangeByBeginWordIds(ids));

      return this.convertRowResultToWordRange(res.rows, pgClient);
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_ranges: [],
    };
  }

  async getByDocumentId(
    id: number,
    pgClient: PoolClient | null,
  ): Promise<WordRangesOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetWordRangeRow>(...getWordRangeByDocumentId(id));

      return this.convertRowResultToWordRange(res.rows, pgClient);
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_ranges: [],
    };
  }

  async upserts(
    input: WordRangeUpsertInput[],
    token: string,
    pgClient: PoolClient | null,
  ): Promise<WordRangesOutput> {
    if (input.length === 0) {
      return {
        error: ErrorType.NoError,
        word_ranges: [],
      };
    }

    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<WordRangeUpsertsProcedureOutputRow>(
        ...callWordRangeUpsertsProcedure({
          begin_words: input.map((item) => +item.begin_word),
          end_words: input.map((item) => +item.end_word),
          token,
        }),
      );

      const creatingError = res.rows[0].p_error_type;
      const word_range_ids = res.rows[0].p_word_range_ids;

      if (creatingError !== ErrorType.NoError) {
        return {
          error: creatingError,
          word_ranges: [],
        };
      }

      return this.reads(
        word_range_ids.map((id) => +id),
        pgClient,
      );
    } catch (e) {
      console.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_ranges: [],
    };
  }
}
