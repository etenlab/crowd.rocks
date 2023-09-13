import { Injectable } from '@nestjs/common';
import { PostgresService } from '../../core/postgres.service';
import { LanguageInput } from '../common/types';
import { DocumentsRepository } from './documents.repository';
import {
  GetAllDocumentsOutput,
  GetDocumentOutput,
  TextyDocumentInput,
} from './types';

export interface ISaveDocumentParams {
  document: TextyDocumentInput;
  token: string;
}

@Injectable()
export class DocumentsService {
  constructor(
    private pg: PostgresService,
    private documentsRepository: DocumentsRepository,
  ) {}

  async saveDocument({ document, token }: ISaveDocumentParams) {
    const dbPoolClient = await this.pg.pool.connect();

    try {
      dbPoolClient.query('BEGIN');
      const document_id = await this.documentsRepository.saveDocumentTrn(
        document,
        token,
        dbPoolClient,
      );
      await dbPoolClient.query('COMMIT');
      return document_id;
    } catch (error) {
      dbPoolClient.query('ROLLBACK');
      throw error;
    } finally {
      dbPoolClient.release();
    }
  }

  async getAllDocuments(lang?: LanguageInput): Promise<GetAllDocumentsOutput> {
    return this.documentsRepository.getAllDocuments(lang);
  }
  async getDocument(document_id: string): Promise<GetDocumentOutput> {
    return this.documentsRepository.getDocument(document_id);
  }
}
