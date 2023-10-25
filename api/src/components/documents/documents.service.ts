import { Injectable, Logger } from '@nestjs/common';

import { ErrorType } from 'src/common/types';
import { LanguageInput } from '../common/types';

import { FileService } from '../file/file.service';
import { WordlikeStringsService } from '../words/wordlike-strings.service';
import { PostgresService } from '../../core/postgres.service';
import { DocumentWordEntriesService } from './document-word-entries.service';
import { DocumentsRepository } from './documents.repository';

import {
  GetAllDocumentsOutput,
  GetDocumentOutput,
  TextyDocumentInput,
  DocumentUploadOutput,
} from './types';
import { AuthorizationService } from '../authorization/authorization.service';

@Injectable()
export class DocumentsService {
  constructor(
    private pg: PostgresService,
    private documentsRepository: DocumentsRepository,
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

      const { document_id, error } =
        await this.documentsRepository.saveDocumentTrn(
          document,
          token,
          dbPoolClient,
        );

      if (error !== ErrorType.NoError || document_id === null) {
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
      }[] = [];

      for (let i = 0; i < wordlike_strings.length; i++) {
        documentWordEntries.push({
          document_id: +document_id,
          wordlike_string_id: +wordlike_strings[i]!.wordlike_string_id,
          parent_document_word_entry_id: null,
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

      return this.getDocument(document_id);
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

  async getAllDocuments(lang?: LanguageInput): Promise<GetAllDocumentsOutput> {
    try {
      return this.documentsRepository.getAllDocuments(lang);
    } catch (err) {
      Logger.log(err);
    }

    return {
      error: ErrorType.UnknownError,
      documents: [],
    };
  }

  async getDocument(document_id: string): Promise<GetDocumentOutput> {
    try {
      return this.documentsRepository.getDocument(document_id);
    } catch (err) {
      Logger.log(err);
    }

    return {
      error: ErrorType.UnknownError,
      document: null,
    };
  }
}
