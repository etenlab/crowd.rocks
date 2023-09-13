import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { ErrorType } from '../../common/types';
import { PostgresService } from '../../core/postgres.service';
import { LanguageInput } from '../common/types';
import {
  GetAllDocumentsOutput,
  GetDocumentOutput,
  TextyDocumentInput,
} from './types';

@Injectable()
export class DocumentsRepository {
  constructor(private pg: PostgresService) {}

  /**
   * dbPoolClient is optional. If providerd, then it will be used to run query (useful for SQL transactions)
   * if not - then new client will be get from pg.pool
   */
  async saveDocumentTrn(
    { file_id, language_code, dialect_code, geo_code }: TextyDocumentInput,
    token,
    dbPoolClient: PoolClient,
  ): Promise<string> {
    const res = await dbPoolClient.query(
      `
        call document_create($1,$2,$3,$4,$5,null,null,null,null)
      `,
      [file_id, token, language_code, dialect_code, geo_code],
    );

    if (!res.rows[0].p_document_id) {
      throw new Error(res.rows[0].p_error_type);
    }

    return res.rows[0].document_id;
  }

  async getAllDocuments(lang?: LanguageInput): Promise<GetAllDocumentsOutput> {
    const params: string[] = [];
    let languageClause = '';
    if (lang?.language_code) {
      params.push(lang?.language_code);
      languageClause += ` and language_code = $${params.length}`;
    }
    if (lang?.dialect_code) {
      params.push(lang?.dialect_code);
      languageClause += ` and dialect_code = $${params.length}`;
    }
    if (lang?.geo_code) {
      params.push(lang?.geo_code);
      languageClause += ` and geo_code = $${params.length}`;
    }
    const sqlStr = `
        select
          d.document_id,
          d.language_code,
          d.dialect_code,
          d.geo_code,
          d.file_id,
          f.file_name,
          f.file_url
        from
          documents d
        left join files f on
          d.file_id  = f.file_id
        where true
        ${languageClause}
      `;
    const resQ = await this.pg.pool.query(sqlStr, params);

    const allDocumentsOutput: GetAllDocumentsOutput = {
      error: ErrorType.NoError,
      documents: resQ.rows.map(
        ({
          document_id,
          language_code,
          dialect_code,
          geo_code,
          file_id,
          file_name,
          file_url,
        }) => ({
          document_id,
          language_code,
          dialect_code,
          geo_code,
          file_id,
          file_name,
          file_url,
        }),
      ),
    };

    return allDocumentsOutput;
  }

  async getDocument(document_id: string): Promise<GetDocumentOutput> {
    if (!document_id) {
      return {
        error: ErrorType.DocumentIdNotProvided,
        document: null,
      };
    }
    const sqlStr = `
        select
          d.document_id,
          d.language_code,
          d.dialect_code,
          d.geo_code,
          d.file_id,
          f.file_name,
          f.file_url
        from
          documents d
        left join files f on
          d.file_id  = f.file_id
        where d.document_id = $1
      `;
    const resQ = await this.pg.pool.query(sqlStr, [document_id]);
    if (!(resQ.rows.length > 0)) {
      return {
        error: ErrorType.DocumentNotFound,
        document: null,
      };
    }
    const {
      language_code,
      dialect_code,
      geo_code,
      file_id,
      file_name,
      file_url,
    } = resQ.rows[0];

    return {
      error: ErrorType.NoError,
      document: {
        document_id,
        language_code,
        dialect_code,
        geo_code,
        file_id,
        file_name,
        file_url,
      },
    };
  }
}
