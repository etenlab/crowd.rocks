import { Injectable } from '@nestjs/common';
import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';
import { GetFileListOutput, IFile } from './types';

interface FileFindParams {
  where?: {
    file_id?: number;
    file_name?: string;
    file_type?: string;
    file_size?: number;
    file_hash?: string;
  };
}

interface FileSaveParams {
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  file_hash: string;
}

@Injectable()
export class FileRepository {
  constructor(private pg: PostgresService) {}

  async find(input?: FileFindParams): Promise<IFile> {
    const params = [];
    let fileClause = '';

    if (input.where) {
      for (const [key, value] of Object.entries(input.where)) {
        if (value) {
          params.push(value);
          fileClause += ` and ${key} = $${params.length}`;
        }
      }
    }

    const sqlStr = `
            select 
                file_id,
                file_name,
                file_size,
                file_type,
                file_url,
                file_hash
            from
                files
            where true
            ${fileClause}
        `;

    const resQ = await this.pg.pool.query(sqlStr, params);
    if (resQ.rowCount === 0) return null;

    return {
      id: resQ.rows[0].file_id,
      fileName: resQ.rows[0].file_name,
      fileSize: resQ.rows[0].file_size,
      fileType: resQ.rows[0].file_type,
      fileUrl: resQ.rows[0].file_url,
      fileHash: resQ.rows[0].file_hash,
    };
  }

  async list(): Promise<GetFileListOutput> {
    const sqlStr = `
            select 
                file_id,
                file_name,
                file_size,
                file_type,
                file_url,
                file_hash
            from
                files
        `;

    const resQ = await this.pg.pool.query(sqlStr);

    const fileList = resQ.rows.map<IFile>(
      ({ file_id, file_name, file_size, file_type, file_url, file_hash }) => ({
        id: file_id,
        fileName: file_name,
        fileSize: file_size,
        fileType: file_type,
        fileUrl: file_url,
        fileHash: file_hash,
      }),
    );

    return { fileList };
  }

  async save({
    file_name,
    file_type,
    file_size,
    file_url,
    file_hash,
  }: FileSaveParams): Promise<IFile> {
    const res = await this.pg.pool.query(
      `
            call file_create($1,$2,$3,$4,$5, null,null,null,null)
            `,
      [file_name, file_size, file_type, file_url, file_hash],
    );

    if (res.rows[0].p_error_type !== ErrorType.NoError) {
      throw new Error(res.rows[0].p_error_type);
    }
    return {
      id: res.rows[0].p_file_id,
      fileName: res.rows[0].file_name,
      fileSize: res.rows[0].file_size,
      fileType: res.rows[0].file_type,
      fileUrl: res.rows[0].file_url,
      fileHash: res.rows[0].file_hash,
    };
  }
}
