import { Injectable, Logger } from '@nestjs/common';
import { PoolClient } from 'pg';

import { pgClientOrPool } from 'src/common/utility';

import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';
import { DocumentWordEntriesService } from './document-word-entries.service';

import {
  WordRange,
  WordRangesEdge,
  WordRangesOutput,
  TextFromRangesOutput,
  WordRangeInput,
  DocumentWordEntry,
  WordRangesListConnection,
  TextFromRange,
} from './types';

import {
  GetWordRangeRow,
  getWordRangeByIds,
  getWordRangeByDocumentId,
  getWordRangeByBeginWordIds,
  WordRangeUpsertsProcedureOutputRow,
  callWordRangeUpsertsProcedure,
  GetWordRangeByDocumentId,
} from './sql-string';
import { AuthorizationService } from '../authorization/authorization.service';

@Injectable()
export class WordRangesService {
  constructor(
    private pg: PostgresService,
    private documentWordEntryService: DocumentWordEntriesService,
    private authService: AuthorizationService,
  ) {}

  private async convertQueryResultToWordRange(
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
      Logger.error(e);
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

      return this.convertQueryResultToWordRange(res.rows, pgClient);
    } catch (e) {
      Logger.error(e);
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

      return this.convertQueryResultToWordRange(res.rows, pgClient);
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_ranges: [],
    };
  }

  async getTextFromRanges(
    ranges: WordRangeInput[],
    pgClient: PoolClient | null,
  ): Promise<TextFromRangesOutput> {
    try {
      if (ranges.length === 0) {
        return {
          error: ErrorType.NoError,
          list: [],
        };
      }

      const wordIds = ranges
        .map((item) => [
          +item.begin_document_word_entry_id,
          +item.end_document_word_entry_id,
        ])
        .reduce((acc, item) => [...acc, ...item], []);

      const { error, document_word_entries } =
        await this.documentWordEntryService.reads(wordIds, pgClient);

      if (error !== ErrorType.NoError) {
        return {
          error,
          list: [],
        };
      }

      const documentWordEntriesMap = new Map<string, DocumentWordEntry>();

      document_word_entries.forEach(
        (entry) =>
          entry &&
          documentWordEntriesMap.set(entry.document_word_entry_id, entry),
      );

      const list: TextFromRange[] = [];

      for (const range of ranges) {
        const beginDocumentWordEntry = documentWordEntriesMap.get(
          range.begin_document_word_entry_id,
        );
        const endDocumentWordEntry = documentWordEntriesMap.get(
          range.end_document_word_entry_id,
        );

        if (!beginDocumentWordEntry || !endDocumentWordEntry) {
          return {
            error: ErrorType.InvalidInputs,
            list: [],
          };
        }

        if (
          beginDocumentWordEntry.document_id !==
          endDocumentWordEntry.document_id
        ) {
          return {
            error: ErrorType.InvalidInputs,
            list: [],
          };
        }

        const document_id = beginDocumentWordEntry.document_id;
        const beginPageNumber = beginDocumentWordEntry.page;
        const endPageNumber = endDocumentWordEntry.page;

        if (beginPageNumber > endPageNumber) {
          return {
            error: ErrorType.InvalidInputs,
            list: [],
          };
        }

        const { error: beginError, edges: beginEdges } =
          await this.documentWordEntryService.getDocumentWordEntriesByDocumentId(
            +document_id,
            1,
            JSON.stringify({
              document_id: +document_id,
              page: beginPageNumber - 1,
            }),
            pgClient,
          );

        if (beginError !== ErrorType.NoError) {
          return {
            error: beginError,
            list: [],
          };
        }

        const beginPage = beginEdges[0].node;

        const { error: endError, edges: endEdges } =
          await this.documentWordEntryService.getDocumentWordEntriesByDocumentId(
            +document_id,
            1,
            JSON.stringify({
              document_id: +document_id,
              page: endPageNumber - 1,
            }),
            pgClient,
          );

        if (endError !== ErrorType.NoError) {
          return {
            error: endError,
            list: [],
          };
        }

        const endPage = endEdges[0].node;

        if (beginPageNumber === endPageNumber) {
          const beginIndex = beginPage.findIndex(
            (entry) =>
              entry.document_word_entry_id ===
              range.begin_document_word_entry_id,
          );
          const endIndex = beginPage.findIndex(
            (entry) =>
              entry.document_word_entry_id === range.end_document_word_entry_id,
          );

          if (beginIndex === -1 || endIndex === -1 || beginIndex > endIndex) {
            return {
              error: ErrorType.InvalidInputs,
              list: [],
            };
          }

          if (beginIndex === endIndex) {
            list.push({
              piece_of_text:
                beginPage[beginIndex].wordlike_string.wordlike_string,
              begin_document_word_entry_id:
                beginDocumentWordEntry.document_word_entry_id,
              end_document_word_entry_id:
                endDocumentWordEntry.document_word_entry_id,
            });

            continue;
          }

          if (beginIndex < endIndex) {
            list.push({
              piece_of_text: beginPage
                .slice(beginIndex, endIndex + 1)
                .map((entry) => entry.wordlike_string.wordlike_string)
                .join(' '),
              begin_document_word_entry_id:
                beginDocumentWordEntry.document_word_entry_id,
              end_document_word_entry_id:
                endDocumentWordEntry.document_word_entry_id,
            });

            continue;
          }
        }

        const beginIndex = beginPage.findIndex(
          (entry) =>
            entry.document_word_entry_id === range.begin_document_word_entry_id,
        );
        const endIndex = endPage.findIndex(
          (entry) =>
            entry.document_word_entry_id === range.end_document_word_entry_id,
        );

        if (beginIndex === -1 || endIndex === -1) {
          return {
            error: ErrorType.InvalidInputs,
            list: [],
          };
        }

        if (beginPageNumber + 1 === endPageNumber) {
          list.push({
            piece_of_text: [
              ...beginPage
                .slice(beginIndex)
                .map((entry) => entry.wordlike_string.wordlike_string),
              ...endPage
                .slice(0, endIndex + 1)
                .map((entry) => entry.wordlike_string.wordlike_string),
            ].join(' '),
            begin_document_word_entry_id:
              beginDocumentWordEntry.document_word_entry_id,
            end_document_word_entry_id:
              endDocumentWordEntry.document_word_entry_id,
          });
        } else {
          list.push({
            piece_of_text: [
              beginPage
                .slice(beginIndex)
                .map((entry) => entry.wordlike_string.wordlike_string)
                .join(' '),
              ...endPage
                .slice(0, endIndex + 1)
                .map((entry) => entry.wordlike_string.wordlike_string)
                .join(' '),
            ].join(' ... '),
            begin_document_word_entry_id:
              beginDocumentWordEntry.document_word_entry_id,
            end_document_word_entry_id:
              endDocumentWordEntry.document_word_entry_id,
          });
        }
      }

      return {
        error: ErrorType.NoError,
        list,
      };
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      list: [],
    };
  }

  async getByDocumentId(
    document_id: number,
    first: number | null,
    after: string | null,
    pgClient: PoolClient | null,
  ): Promise<WordRangesListConnection> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetWordRangeByDocumentId>(
        ...getWordRangeByDocumentId(
          document_id,
          first ? first + 1 : null,
          after ? +JSON.parse(after).page : 0,
        ),
      );

      const { error, word_ranges } = await this.convertQueryResultToWordRange(
        res.rows.map((row) => ({
          word_range_id: row.word_range_id,
          begin_word: row.begin_word,
          end_word: row.end_word,
        })),
        pgClient,
      );

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

      const pageMap = new Map<number, WordRange[]>();
      let maxPage = after ? +JSON.parse(after).page + 1 : 1;

      for (let i = 0; i < word_ranges.length; i++) {
        const wordRange = word_ranges[i];

        if (!wordRange) {
          continue;
        }

        if (maxPage < wordRange.begin.page) {
          maxPage = wordRange.begin.page;
        }

        const entries = pageMap.get(wordRange.begin.page);

        if (entries) {
          entries.push(wordRange);
        } else {
          pageMap.set(wordRange.begin.page, [wordRange]);
        }
      }

      const tempEdges: WordRangesEdge[] = [];

      const startPage = after ? +JSON.parse(after).page + 1 : 1;

      for (let i = 0; maxPage >= startPage + i; i++) {
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
      },
    };
  }

  async upserts(
    input: WordRangeInput[],
    token: string,
    pgClient: PoolClient | null,
  ): Promise<WordRangesOutput> {
    if (!(await this.authService.is_authorized(token))) {
      return {
        error: ErrorType.Unauthorized,
        word_ranges: [],
      };
    }
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
          begin_words: input.map((item) => +item.begin_document_word_entry_id),
          end_words: input.map((item) => +item.end_document_word_entry_id),
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
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_ranges: [],
    };
  }
}
