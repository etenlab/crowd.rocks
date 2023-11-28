import { Injectable, Logger } from '@nestjs/common';
import { PoolClient } from 'pg';

import { pgClientOrPool } from 'src/common/utility';

import { ErrorType } from 'src/common/types';

import { PostgresService } from 'src/core/postgres.service';

import { WordRangesService } from 'src/components/documents/word-ranges.service';

import { WordRange } from 'src/components/documents/types';
import {
  WordRangeTagWithVotesOutput,
  WordRangeTagsListConnection,
  WordRangeTagWithVote,
  WordRangeTagVoteStatus,
} from './types';

import {
  getWordRangeTagsByIds,
  getWordRangeTagsByWordRangeIds,
  WordRangeTagRow,
  WordRangeTagUpsertsProcedureOutput,
  callWordRangeTagUpsertsProcedure,
} from './sql-string';
import { AuthorizationService } from '../authorization/authorization.service';
import { WordRangeTagVotesService } from './word-range-tag-votes.service';

@Injectable()
export class WordRangeTagsService {
  constructor(
    private pg: PostgresService,
    private wordRangesService: WordRangesService,
    private wordRangeTagVotesService: WordRangeTagVotesService,
    private authService: AuthorizationService,
  ) {}

  private async convertQueryResultToWordRangeTags(
    rows: WordRangeTagRow[],
    pgClient: PoolClient | null,
  ): Promise<WordRangeTagWithVotesOutput> {
    try {
      const wordRangeIds: number[] = rows.map((row) => +row.word_range_id);
      const wordRangeTagIds: number[] = rows.map(
        (row) => +row.word_range_tag_id,
      );

      const { error, word_ranges } = await this.wordRangesService.reads(
        wordRangeIds,
        pgClient,
      );

      if (error !== ErrorType.NoError) {
        return {
          error,
          word_range_tags: [],
        };
      }

      const wordRangesMap = new Map<string, WordRange>();

      word_ranges.forEach((wordRange) =>
        wordRange
          ? wordRangesMap.set(wordRange.word_range_id, wordRange)
          : null,
      );

      const { error: voteError, vote_status_list } =
        await this.wordRangeTagVotesService.getVoteStatusFromIds(
          wordRangeTagIds,
          pgClient,
        );

      if (voteError !== ErrorType.NoError) {
        return {
          error,
          word_range_tags: [],
        };
      }

      const wordRangeTagVotesMap = new Map<string, WordRangeTagVoteStatus>();

      vote_status_list.forEach((voteStatus) =>
        voteStatus
          ? wordRangeTagVotesMap.set(voteStatus.word_range_tag_id, voteStatus)
          : null,
      );

      return {
        error: ErrorType.NoError,
        word_range_tags: rows.map((row) => {
          const wordRange = wordRangesMap.get(row.word_range_id);
          const voteStatus = wordRangeTagVotesMap.get(row.word_range_tag_id);

          if (!wordRange) {
            return null;
          }

          if (!voteStatus) {
            return {
              word_range_tag_id: row.word_range_tag_id,
              word_range: wordRange,
              tag_name: row.word_range_tag.tag_name,
              upvotes: 0,
              downvotes: 0,
            };
          } else {
            return {
              word_range_tag_id: row.word_range_tag_id,
              word_range: wordRange,
              tag_name: row.word_range_tag.tag_name,
              upvotes: voteStatus.upvotes,
              downvotes: voteStatus.downvotes,
            };
          }
        }),
      };
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_range_tags: [],
    };
  }

  async reads(
    ids: number[],
    pgClient: PoolClient | null,
  ): Promise<WordRangeTagWithVotesOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<WordRangeTagRow>(...getWordRangeTagsByIds(ids));

      return this.convertQueryResultToWordRangeTags(res.rows, pgClient);
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_range_tags: [],
    };
  }

  async getWordRangeTagsByWordRangeIds(
    word_range_ids: number[],
    pgClient: PoolClient | null,
  ): Promise<WordRangeTagWithVotesOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<WordRangeTagRow>(
        ...getWordRangeTagsByWordRangeIds(word_range_ids),
      );

      return this.convertQueryResultToWordRangeTags(res.rows, pgClient);
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_range_tags: [],
    };
  }

  async upserts(
    inputs: {
      word_range_id: number;
      tag_name: string;
    }[],
    token: string,
    pgClient: PoolClient | null,
  ): Promise<WordRangeTagWithVotesOutput> {
    if (inputs.length === 0) {
      return {
        error: ErrorType.NoError,
        word_range_tags: [],
      };
    }

    if (!(await this.authService.is_authorized(token))) {
      return {
        error: ErrorType.Unauthorized,
        word_range_tags: [],
      };
    }

    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<WordRangeTagUpsertsProcedureOutput>(
        ...callWordRangeTagUpsertsProcedure({
          word_range_ids: inputs.map((input) => input.word_range_id),
          tag_names: inputs.map((input) => input.tag_name),
          token,
        }),
      );

      const creatingError = res.rows[0].p_error_type;
      const word_range_tag_ids = res.rows[0].p_word_range_tag_ids;

      if (creatingError !== ErrorType.NoError) {
        return {
          error: creatingError,
          word_range_tags: [],
        };
      }

      return this.reads(
        word_range_tag_ids.map((item) => +item),
        pgClient,
      );
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_range_tags: [],
    };
  }

  async createTaggingOnWordRange(
    begin_document_word_entry_id: number,
    end_document_word_entry_id: number,
    tag_names: string[],
    token,
    pgClient: PoolClient | null,
  ): Promise<WordRangeTagWithVotesOutput> {
    if (tag_names.length === 0) {
      return {
        error: ErrorType.NoError,
        word_range_tags: [],
      };
    }

    if (!(await this.authService.is_authorized(token))) {
      return {
        error: ErrorType.Unauthorized,
        word_range_tags: [],
      };
    }

    try {
      const { error: wordRangeError, word_ranges } =
        await this.wordRangesService.upserts(
          [
            {
              begin_document_word_entry_id: begin_document_word_entry_id + '',
              end_document_word_entry_id: end_document_word_entry_id + '',
            },
          ],
          token,
          pgClient,
        );

      if (
        wordRangeError !== ErrorType.NoError ||
        word_ranges.length === 0 ||
        !word_ranges[0]
      ) {
        return {
          error: wordRangeError,
          word_range_tags: [],
        };
      }

      return this.upserts(
        [
          ...tag_names.map((tag_name) => ({
            word_range_id: +word_ranges[0]!.word_range_id,
            tag_name,
          })),
        ],
        token,
        pgClient,
      );
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_range_tags: [],
    };
  }

  async getWordRangeTagsByDocumentId(
    document_id: number,
    first: number | null,
    after: string | null,
    pgClient,
  ): Promise<WordRangeTagsListConnection> {
    try {
      const {
        error: wordRangeError,
        edges,
        pageInfo,
      } = await this.wordRangesService.getByDocumentId(
        document_id,
        first,
        after,
        pgClient,
      );

      if (wordRangeError !== ErrorType.NoError) {
        return {
          error: wordRangeError,
          edges: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null,
          },
        };
      }

      const wordRangeIds = (
        edges
          .reduce<WordRange[]>((acc, edge) => [...acc, ...edge.node], [])
          .map((word_range) => word_range) as WordRange[]
      ).map((word_range) => +word_range.word_range_id);

      const wordRangeTagsMap = new Map<string, WordRangeTagWithVote[]>();

      const { error, word_range_tags } =
        await this.getWordRangeTagsByWordRangeIds(wordRangeIds, pgClient);

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

      word_range_tags.forEach((wordRangeTag) => {
        if (!wordRangeTag) {
          return;
        }

        const entries = wordRangeTagsMap.get(
          wordRangeTag.word_range.word_range_id,
        );

        if (entries) {
          entries.push(wordRangeTag);
        } else {
          wordRangeTagsMap.set(wordRangeTag.word_range.word_range_id, [
            wordRangeTag,
          ]);
        }
      });

      const wordRangeTagEdges = edges.map((edge) => {
        const node: WordRangeTagWithVote[] = [];

        edge.node.map((item) => {
          const entries = wordRangeTagsMap.get(item.word_range_id);

          if (entries) {
            node.push(...entries);
          }
        });

        return {
          cursor: edge.cursor,
          node,
        };
      });

      return {
        error: ErrorType.NoError,
        edges: wordRangeTagEdges,
        pageInfo,
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

  async getWordRangeTagsByBeginWordEntryId(
    begin_document_word_entry_id: number,
    pgClient: PoolClient | null,
  ): Promise<WordRangeTagWithVotesOutput> {
    try {
      const { error, word_ranges } =
        await this.wordRangesService.getByBeginWordIds(
          [begin_document_word_entry_id],
          pgClient,
        );

      if (error !== ErrorType.NoError) {
        return {
          error,
          word_range_tags: [],
        };
      }

      return this.getWordRangeTagsByWordRangeIds(
        word_ranges
          .filter((item) => item)
          .map((item: WordRange) => +item.word_range_id),
        pgClient,
      );
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      word_range_tags: [],
    };
  }
}
