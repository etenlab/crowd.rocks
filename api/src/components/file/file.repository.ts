import { Injectable, Logger } from '@nestjs/common';

import { ErrorType } from 'src/common/types';
import { PostgresService } from 'src/core/postgres.service';
import { IFile, IFileOutput } from './types';

interface FileFindParams {
  where?: {
    file_id?: number;
    file_name?: string;
    file_type?: string;
    file_size?: number;
    file_hash?: string;
  };
}

export interface FileSaveParams {
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  file_hash: string;
  token: string;
}
export interface FileUpdateParams {
  file_id: number;
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  file_hash: string;
  token: string;
}

@Injectable()
export class FileRepository {
  constructor(private pg: PostgresService) {}

  async find(input?: FileFindParams): Promise<IFileOutput | null> {
    if (input) {
      if (Object.keys(input.where!).length < 1) {
        Logger.error(
          `Specify at least one condition at input<FileFindParams> `,
        );
        throw new Error(ErrorType.FileDeleteFailed);
      }
    }
    const params: (string | number)[] = [];
    let fileClause = '';

    if (input && input.where) {
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
      file: {
        id: Number(resQ.rows[0].file_id),
        fileName: resQ.rows[0].file_name,
        fileSize: resQ.rows[0].file_size,
        fileType: resQ.rows[0].file_type,
        fileUrl: resQ.rows[0].file_url,
        fileHash: resQ.rows[0].file_hash,
      },
      error: ErrorType.NoError,
    };
  }

  async list(): Promise<IFile[]> {
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

    return fileList;
  }

  async save({
    file_name,
    file_type,
    file_size,
    file_url,
    file_hash,
    token,
  }: FileSaveParams): Promise<IFileOutput> {
    const res = await this.pg.pool.query(
      `
            call file_create($1,$2,$3,$4,$5,$6, null,null,null,null)
            `,
      [file_name, file_size, file_type, file_url, file_hash, token],
    );

    const error = res.rows[0].p_error_type;
    if (error !== ErrorType.NoError) {
      return { file: null, error };
    }
    return {
      file: {
        id: res.rows[0].p_file_id,
        fileName: file_name,
        fileSize: file_size,
        fileType: file_type,
        fileUrl: file_url,
        fileHash: file_hash,
      },
      error,
    };
  }

  async update({
    file_id,
    file_name,
    file_type,
    file_size,
    file_url,
    file_hash,
    token,
  }: FileUpdateParams): Promise<IFileOutput> {
    const res = await this.pg.pool.query(
      `
            call file_update($1,$2,$3,$4,$5,$6,$7,null,null,null)
            `,
      [file_id, file_name, file_size, file_type, file_url, file_hash, token],
    );

    const error = res.rows[0].p_error_type;
    if (error !== ErrorType.NoError) {
      return { file: null, error };
    }
    return {
      file: {
        id: file_id,
        fileName: file_name,
        fileSize: file_size,
        fileType: file_type,
        fileUrl: file_url,
        fileHash: file_hash,
      },
      error,
    };
  }

  async delete(fileId: string): Promise<string> {
    const params = [fileId];
    const sqlStr = `
      delete
      from
        files
      where
        file_id = $1
      returning file_id
    `;
    const resQ = await this.pg.pool.query(sqlStr, params);
    if (resQ.rows.length > 1) {
      Logger.error(
        `Something wrong, deleted several files instead of single one:` +
          JSON.stringify(resQ.rows),
      );
      throw new Error(ErrorType.MapDeletionError);
    }
    if (!resQ.rows || resQ.rows.length < 1) {
      throw new Error(ErrorType.MapNotFound);
    }
    return resQ.rows[0].file_id;
  }
}
