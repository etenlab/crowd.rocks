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

@Injectable()
export class DocumentsService {
  constructor(
    private pg: PostgresService,
    private documentsRepository: DocumentsRepository,
    private fileService: FileService,
    private wordlikeStringService: WordlikeStringsService,
    private documentWordEntryService: DocumentWordEntriesService,
  ) {}

  async saveDocument({
    document,
    token,
  }: {
    document: TextyDocumentInput;
    token: string;
  }): Promise<DocumentUploadOutput> {
    const dbPoolClient = await this.pg.pool.connect();

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
            document_id: null,
          };
        }
      }

      if (wordError !== ErrorType.NoError) {
        dbPoolClient.release();

        return {
          error: wordError,
          document_id: null,
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
          document_id: null,
        };
      }

      const documentWordEntries: {
        document_id: number;
        wordlike_string_id: number;
        parent_wordlike_string_id: number;
      }[] = [];

      for (let i = 0; i < wordlike_strings.length; i++) {
        documentWordEntries.push({
          document_id: +document_id,
          wordlike_string_id: +wordlike_strings[i]!.wordlike_string_id,
          parent_wordlike_string_id:
            i > 0 ? +wordlike_strings[i - 1]!.wordlike_string_id : 0,
        });
      }

      const { error: documentWordEntryError, document_word_entries } =
        await this.documentWordEntryService.upserts(
          documentWordEntries,
          token,
          dbPoolClient,
        );

      if (documentWordEntryError !== ErrorType.NoError) {
        await dbPoolClient.query('ROLLBACK');
        dbPoolClient.release();

        return {
          error,
          document_id: null,
        };
      }

      for (let i = 0; i < document_word_entries.length; i++) {
        if (document_word_entries[i] === null) {
          await dbPoolClient.query('ROLLBACK');
          dbPoolClient.release();

          return {
            error: ErrorType.DocumentWordEntryInsertFailed,
            document_id: null,
          };
        }
      }

      await dbPoolClient.query('COMMIT');
      dbPoolClient.release();

      return {
        error: ErrorType.NoError,
        document_id,
      };
    } catch (err) {
      Logger.log(err);
      await dbPoolClient.query('ROLLBACK');
      dbPoolClient.release();
    }

    return {
      error: ErrorType.UnknownError,
      document_id: null,
    };
  }

  async getAllDocuments(lang?: LanguageInput): Promise<GetAllDocumentsOutput> {
    return this.documentsRepository.getAllDocuments(lang);
  }

  async getDocument(document_id: string): Promise<GetDocumentOutput> {
    return this.documentsRepository.getDocument(document_id);
  }
}
