import { Injectable, Logger } from '@nestjs/common';
import { PoolClient } from 'pg';

import { calc_vote_weight, pgClientOrPool } from 'src/common/utility';

import { ErrorType } from 'src/common/types';

import { AuthorizationService } from '../authorization/authorization.service';
import { PostgresService } from 'src/core/postgres.service';
import { PericopeVotesService } from './pericope-votes.service';

import {
  PericopiesOutput,
  PericopeWithVotesListConnection,
  PericopeWithVote,
  PericopeWithVotesEdge,
  PericopeTextWithDescription,
} from './types';
import {
  PericopeUpsertsProcedureOutput,
  callPericopeUpsertsProcedure,
  GetPericopiesObjectRow,
  getPericopiesObjByIds,
  GetPericopiesObjByDocumentId,
  getPericopiesObjByDocumentId,
  getPericopiesWithVotesByDocumentIdSql,
  PericopeWithVotesSqlR,
  DocumentWordSqlR,
  getWordsTillNextPericopeSql,
  GetPericopeDocumentSqlR,
  getPericopeDocumentSql,
  GetPericopeDescripionSqlR,
  getPericopeDescripionSql,
  GetNextWordSqlR,
  getNextWordSql,
  getWordsTillEndOfDocumentSql,
  WordsTillEndOfDocumentSqlR,
} from './sql-string';
import {
  GetDocumentWordEntriesTotalPageSize,
  getDocumentWordEntriesTotalPageSize,
} from '../documents/sql-string';
import { start } from 'repl';

export const WORDS_JOINER = ' ';

@Injectable()
export class PericopiesService {
  constructor(
    private pg: PostgresService,
    private pericopeVoteService: PericopeVotesService,
    private authService: AuthorizationService,
  ) {}

  async reads(
    ids: number[],
    pgClient: PoolClient | null,
  ): Promise<PericopiesOutput> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetPericopiesObjectRow>(...getPericopiesObjByIds({ ids }));

      return {
        error: ErrorType.NoError,
        pericopies: res.rows,
      };
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      pericopies: [],
    };
  }

  async upserts(
    startWords: number[],
    token: string,
    pgClient: PoolClient | null,
  ): Promise<PericopiesOutput> {
    if (startWords.length === 0) {
      return {
        error: ErrorType.NoError,
        pericopies: [],
      };
    }

    if (!(await this.authService.is_authorized(token))) {
      return {
        error: ErrorType.Unauthorized,
        pericopies: [],
      };
    }

    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<PericopeUpsertsProcedureOutput>(
        ...callPericopeUpsertsProcedure({
          start_words: startWords,
          token,
        }),
      );

      const creatingError = res.rows[0].p_error_type;
      const creatingErrors = res.rows[0].p_error_types;
      const pericope_ids = res.rows[0].p_pericope_ids;

      if (creatingError !== ErrorType.NoError) {
        return {
          error: creatingError,
          pericopies: [],
        };
      }

      return {
        error: ErrorType.NoError,
        pericopies: pericope_ids.map((pericope_id, index) => {
          if (creatingErrors[index] !== ErrorType.NoError) {
            return null;
          }

          return {
            pericope_id,
            start_word: startWords[index] + '',
          };
        }),
      };
    } catch (e) {
      Logger.error(e);
    }

    return {
      error: ErrorType.UnknownError,
      pericopies: [],
    };
  }

  async getPericopiesByDocumentId(
    document_id: number,
    first: number | null,
    after: string | null,
    pgClient: PoolClient | null,
  ): Promise<PericopeWithVotesListConnection> {
    try {
      const res = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetPericopiesObjByDocumentId>(
        ...getPericopiesObjByDocumentId(
          document_id,
          first ? first + 1 : null,
          after ? +JSON.parse(after).page : 0,
        ),
      );

      const pageMap = new Map<number, PericopeWithVote[]>();

      const pericopeIds = res.rows.map((row) => +row.pericope_id);

      const { error, vote_status_list } =
        await this.pericopeVoteService.getVoteStatusFromIds(
          pericopeIds,
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
            totalEdges: 0,
          },
        };
      }

      for (let i = 0; i < res.rows.length; i++) {
        const pericopeWithVote = {
          pericope_id: vote_status_list[i].pericope_id,
          start_word: res.rows[i].start_word,
          upvotes: vote_status_list[i].upvotes,
          downvotes: vote_status_list[i].downvotes,
        };

        const entries = pageMap.get(+res.rows[i].page);

        if (entries) {
          entries.push(pericopeWithVote);
        } else {
          pageMap.set(+res.rows[i].page, [pericopeWithVote]);
        }
      }

      const res1 = await pgClientOrPool({
        client: pgClient,
        pool: this.pg.pool,
      }).query<GetDocumentWordEntriesTotalPageSize>(
        ...getDocumentWordEntriesTotalPageSize(document_id),
      );

      const tempEdges: PericopeWithVotesEdge[] = [];

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

  async getRecomendedPericopiesByDocumentId(
    documentId: string,
  ): Promise<PericopeWithVotesSqlR[]> {
    try {
      const resQ = await this.pg.pool.query<PericopeWithVotesSqlR>(
        ...getPericopiesWithVotesByDocumentIdSql({ documentId }),
      );
      return this.filterRecomendedPericopies(resQ.rows);
    } catch (error) {
      Logger.error(
        `PericopiesService#getRecomendedPericopiesIdsByDocumentId: ${JSON.stringify(
          error,
        )}`,
      );
      return [];
    }
  }

  filterRecomendedPericopies(
    pericopies: PericopeWithVotesSqlR[],
  ): PericopeWithVotesSqlR[] {
    return pericopies.filter(
      (p) => calc_vote_weight(p.upvotes, p.downvotes) >= 0,
    );
  }

  async getWordsTillEndOfDocument(
    documentId: string,
    start_word_id: string,
  ): Promise<WordsTillEndOfDocumentSqlR[]> {
    try {
      const resQ = await this.pg.pool.query<WordsTillEndOfDocumentSqlR>(
        ...getWordsTillEndOfDocumentSql({ documentId, start_word_id }),
      );
      const pericopeWords = resQ.rows;

      return pericopeWords;
    } catch (error) {
      Logger.error(
        `PericopiesService#getWordsTillNextPericope: ${JSON.stringify(error)}`,
      );
      return [];
    }
  }

  async getFirstWordOfDocument(document_id: string): Promise<string | null> {
    const resQ = await this.pg.pool.query(
      `
      select
        dwe.document_word_entry_id 
      from
        document_word_entries dwe
      where
        document_id = $1
        and parent_document_word_entry_id is null
    `,
      [document_id],
    );
    return resQ.rows[0]?.document_word_entry_id || null;
  }

  async getWordsTillNextPericope(
    documentId: string,
    start_word_id: string,
  ): Promise<DocumentWordSqlR[]> {
    try {
      const resQ = await this.pg.pool.query<DocumentWordSqlR>(
        ...getWordsTillNextPericopeSql({ documentId, start_word_id }),
      );
      return resQ.rows;
    } catch (error) {
      Logger.error(
        `PericopiesService#getWordsTillNextPericope: ${JSON.stringify(error)}`,
      );
      return [];
    }
  }

  async getPericopeTextWithDescription(
    pericopeId: string,
  ): Promise<PericopeTextWithDescription> {
    try {
      const pericopeDocumentQ =
        await this.pg.pool.query<GetPericopeDocumentSqlR>(
          ...getPericopeDocumentSql({ pericopeIds: [pericopeId] }),
        );

      const pericopeWords = await this.getWordsTillNextPericope(
        pericopeDocumentQ.rows[0].document_id,
        pericopeDocumentQ.rows[0].start_word,
      );

      const pericopeDescriptionTextRows =
        await this.pg.pool.query<GetPericopeDescripionSqlR>(
          ...getPericopeDescripionSql({ pericopeIds: [pericopeId] }),
        );

      const pericope_description_text =
        pericopeDescriptionTextRows.rows[0]?.description || '';

      if (!(pericopeWords.length > 0)) {
        Logger.error(
          `PericopiesService#getPericopeTextWithDescription: Pericope words not found`,
        );
        return {
          error: ErrorType.PericopeNotFound,
          pericope_id: null,
          pericope_description_text: '',
          pericope_text: '',
        };
      }

      return {
        error: ErrorType.NoError,
        pericope_id: pericopeId,
        pericope_description_text,
        pericope_text: pericopeWords
          .map((w) => w.wordlike_string)
          .join(WORDS_JOINER),
      };
    } catch (error) {
      Logger.error(
        `PericopiesService#getPericopeTextWithDescription: ${JSON.stringify(
          error,
        )}`,
      );
      return {
        error: ErrorType.PericopeNotFound,
        pericope_id: null,
        pericope_description_text: '',
        pericope_text: '',
      };
    }
  }
}
