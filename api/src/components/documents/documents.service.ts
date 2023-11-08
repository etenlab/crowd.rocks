import { Injectable, Logger } from '@nestjs/common';

import { ErrorType } from 'src/common/types';
import { LanguageInput } from '../common/types';

import { FileService } from '../file/file.service';
import { WordlikeStringsService } from '../words/wordlike-strings.service';
import { PostgresService } from '../../core/postgres.service';
import { DocumentWordEntriesService } from './document-word-entries.service';
import { AuthorizationService } from '../authorization/authorization.service';

import {
  DocumentListConnection,
  GetDocumentOutput,
  TextyDocumentInput,
  DocumentUploadOutput,
  DocumentEdge,
} from './types';

import {
  CreateDocumentProcedureOutputRow,
  callCreateDocumentProcedure,
  GetDocumentById,
  getDocumentById,
  getAllDocuments,
  getDocumentsTotalSize,
  GetDocumentsTotalSize,
} from './sql-string';

const PAGE_SIZE = 1000;

@Injectable()
export class DocumentsService {
  constructor(
    private pg: PostgresService,
    private fileService: FileService,
    private wordlikeStringService: WordlikeStringsService,
    private documentWordEntryService: DocumentWordEntriesService,
    private authService: AuthorizationService,
  ) {}

  async saveDocument({
    document,
    token,
  }: {
    document: TextyDocumentInput;
    token: string;
  }): Promise<DocumentUploadOutput> {
    const dbPoolClient = await this.pg.pool.connect();
    if (!(await this.authService.is_authorized(token))) {
      return {
        error: ErrorType.Unauthorized,
        document: null,
      };
    }
    try {
      const content = await this.fileService.getFileContentAsString(
        document.file_id,
      );

      const wordlikeStrings = content
        .replace(/(\r\n|\n|\r)/gm, ' ')
        .split(' ')
        .filter((word) => word.length > 0);

      const { wordlike_strings, error: wordError } =
        await this.wordlikeStringService.upserts(
          wordlikeStrings,
          token,
          dbPoolClient,
        );

      for (let i = 0; i < wordlike_strings.length; i++) {
        if (wordlike_strings[i] === null) {
          return {
            error: ErrorType.WordLikeStringInsertFailed,
            document: null,
          };
        }
      }

      if (wordError !== ErrorType.NoError) {
        dbPoolClient.release();

        return {
          error: wordError,
          document: null,
        };
      }

      await dbPoolClient.query('BEGIN');

      const res = await dbPoolClient.query<CreateDocumentProcedureOutputRow>(
        ...callCreateDocumentProcedure(document, token),
      );

      const document_id = res.rows[0].p_document_id;
      const error = res.rows[0].p_error_type;

      if (error !== ErrorType.NoError) {
        await dbPoolClient.query('ROLLBACK');
        dbPoolClient.release();

        return {
          error,
          document: null,
        };
      }

      const documentWordEntries: {
        document_id: number;
        wordlike_string_id: number;
        parent_document_word_entry_id: number | null;
        page: number;
      }[] = [];

      for (let i = 0; i < wordlike_strings.length; i++) {
        documentWordEntries.push({
          document_id: +document_id,
          wordlike_string_id: +wordlike_strings[i]!.wordlike_string_id,
          parent_document_word_entry_id: null,
          page: Math.ceil((i + 1) / PAGE_SIZE),
        });
      }

      const { error: documentWordEntryError, document_word_entries } =
        await this.documentWordEntryService.upserts(
          documentWordEntries,
          true,
          token,
          dbPoolClient,
        );

      if (documentWordEntryError !== ErrorType.NoError) {
        await dbPoolClient.query('ROLLBACK');
        dbPoolClient.release();

        return {
          error,
          document: null,
        };
      }

      for (let i = 0; i < document_word_entries.length; i++) {
        if (document_word_entries[i] === null) {
          await dbPoolClient.query('ROLLBACK');
          dbPoolClient.release();

          return {
            error: ErrorType.DocumentWordEntryInsertFailed,
            document: null,
          };
        }
      }

      await dbPoolClient.query('COMMIT');
      dbPoolClient.release();

      return this.getDocument(+document_id);
    } catch (err) {
      Logger.log(err);
      await dbPoolClient.query('ROLLBACK');
      dbPoolClient.release();
    }

    return {
      error: ErrorType.UnknownError,
      document: null,
    };
  }

  async getAllDocuments(input: {
    lang: LanguageInput | null;
    first: number | null;
    after: string | null;
  }): Promise<DocumentListConnection> {
    try {
      const res = await this.pg.pool.query<GetDocumentById>(
        ...getAllDocuments({
          lang: input.lang,
          first: input.first ? input.first * 2 : null,
          after: input.after,
        }),
      );

      const res1 = await this.pg.pool.query<GetDocumentsTotalSize>(
        ...getDocumentsTotalSize({ lang: input.lang }),
      );

      const tempEdges: DocumentEdge[] = res.rows.map((item) => ({
        cursor: item.file_name,
        node: item,
      }));

      const edges =
        input.first && tempEdges.length > input.first
          ? tempEdges.slice(0, input.first)
          : tempEdges;

      return {
        error: ErrorType.NoError,
        edges: res.rows.map((row) => ({
          cursor: row.file_name,
          node: row,
        })),
        pageInfo: {
          hasNextPage: input.first ? res.rowCount > input.first : false,
          hasPreviousPage: false,
          startCursor: edges.length > 0 ? edges[0].cursor : null,
          endCursor:
            edges.length > 0 ? edges[edges.length - 1].cursor || null : null,
          totalEdges: res1.rowCount > 0 ? res1.rows[0].total_records : 0,
        },
      };
    } catch (err) {
      Logger.log(err);
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

  async getDocument(document_id: number): Promise<GetDocumentOutput> {
    try {
      const res = await this.pg.pool.query<GetDocumentById>(
        ...getDocumentById(document_id),
      );

      if (res.rows.length === 0) {
        return {
          error: ErrorType.DocumentNotFound,
          document: null,
        };
      }

      return {
        error: ErrorType.NoError,
        document: res.rows[0],
      };
    } catch (err) {
      Logger.log(err);
    }

    return {
      error: ErrorType.UnknownError,
      document: null,
    };
  }
}
