import { Injectable } from '@nestjs/common';
import { PoolClient } from 'pg';
import { PostgresService } from '../../core/postgres.service';
import { TextyDocument } from './types';

@Injectable()
export class DocumentsRepository {
  constructor(private pg: PostgresService) {}

  /**
   * dbPoolClient is optional. If providerd, then it will be used to run query (useful for SQL transactions)
   * if not - then new client will be get from pg.pool
   */
  async saveDocumentTrn(
    { file_id, language_code, dialect_code, geo_code }: TextyDocument,
    token,
    dbPoolClient: PoolClient,
  ): Promise<string> {
    const res = await dbPoolClient.query(
      `
        call document_create($1,$2,$3,$4,$5,null,null,null,null)
      `,
      [file_id, token, language_code, dialect_code, geo_code],
    );

    if (!res.rows[0].document_id) {
      throw new Error(res.rows[0].p_error_type);
    }

    return res.rows[0].document_id;
  }
}
