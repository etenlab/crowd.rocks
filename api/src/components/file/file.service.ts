import { Injectable, Logger } from '@nestjs/common';
import {
  S3Client,
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { ReadStream } from 'fs';
import { Readable, Transform } from 'stream';
import { createHash } from 'crypto';
import { nanoid } from 'nanoid';
import { Upload } from '@aws-sdk/lib-storage';
import * as dotenv from 'dotenv';
import { FileRepository } from './file.repository';
import { IFileDeleteOutput, IFileOutput } from './types';
import { ErrorType } from '../../common/types';
const AWS_ENVIRONMENTS = ['dev', 'prod'];

dotenv.config();

@Injectable()
export class FileService {
  s3Client: S3Client;
  constructor(private fileRepository: FileRepository) {}

  private getS3Client(): S3Client {
    if (!this.s3Client) {
      this.s3Client = new S3Client(this.makeS3Creds().creds);
    }
    return this.s3Client;
  }

  async uploadTemporaryFile(
    readStream: ReadStream | Readable,
    fileName: string,
    fileType: string,
  ): Promise<string> {
    try {
      const fileKey = `${nanoid()}-${fileName}`;
      const s3Creds = this.makeS3Creds({ useTemporaryBucket: true });

      const uploadParams: PutObjectCommandInput = {
        Bucket: s3Creds.bucketName,
        Key: fileKey,
        Body: readStream,
        ContentDisposition: `attachment; filename=${fileName}`,
        ContentType: fileType,
      };

      const parallelUploads3 = new Upload({
        client: this.getS3Client(),
        params: uploadParams,
        queueSize: 40,
        partSize: 1024 * 1024 * 5,
        leavePartsOnError: false,
      });

      await parallelUploads3.done();
      const fileUrl = `https://${s3Creds.bucketName}.s3.${s3Creds.region}.amazonaws.com/${fileKey}`;
      Logger.debug(`Saved temporary file, url ${fileUrl}`);
      return fileUrl;
    } catch (e) {
      Logger.error(e);
      return '';
    }
  }

  async uploadFile(
    readStream: ReadStream | Readable,
    fileName: string,
    fileType: string,
    token: string,
    fileSize?: number,
    returnErrorIfExists?: boolean | null,
  ): Promise<IFileOutput> {
    Logger.log(`Uploading file ` + fileName);
    try {
      if (returnErrorIfExists) {
        const existingFile = await this.fileRepository.find({
          where: {
            file_name: fileName,
            file_type: fileType,
          },
        });
        if (existingFile.file) {
          return {
            file: null,
            error: ErrorType.FileAlreadyExists,
          };
        }
      }

      const fileKey = `${nanoid()}-${fileName}`;

      const hash = createHash('sha256');
      let hashValue: string | null = null;
      let totalCalcSize = 0;

      const calcHashTr = new Transform({
        transform(chunk, _encoding, callback) {
          hash.update(chunk);
          this.push(chunk);
          totalCalcSize += chunk.length;
          callback();
        },
        flush(callback) {
          hashValue = hash.digest('hex') as string;
          callback();
        },
      });

      readStream.pipe(calcHashTr);
      const p1 = performance.now();

      const uploadParams: PutObjectCommandInput = {
        Bucket: this.makeS3Creds().bucketName,
        Key: fileKey,
        Body: calcHashTr,
        ContentDisposition: `attachment; filename=${fileName}`,
        ContentType: fileType,
      };

      // TODO validate the user's token before doing any uploading
      // of any kind.

      const parallelUploads3 = new Upload({
        client: this.getS3Client(),
        params: uploadParams,
        queueSize: 40,
        partSize: 1024 * 1024 * 5,
        leavePartsOnError: false,
      });

      await parallelUploads3.done();
      Logger.debug(
        `Saved file, key ${uploadParams.Key} for ${performance.now() - p1} ms.`,
      );

      const fileEntity = await this.fileRepository.find({
        where: {
          file_name: fileName,
          file_type: fileType,
          file_size: fileSize || totalCalcSize,
          file_hash: hashValue!,
        },
      });

      if (fileEntity?.file?.fileUrl) {
        const deleteParams = {
          Bucket: this.makeS3Creds().bucketName,
          Key: fileEntity.file?.fileUrl.split('/').at(-1),
        };

        const deleteCommand = new DeleteObjectCommand(deleteParams);

        await this.getS3Client().send(deleteCommand);

        Logger.debug(
          `Deleted old file, key ${deleteParams.Key} . Save+delete took ${
            performance.now() - p1
          } ms. `,
        );
        return this.fileRepository.update({
          file_id: fileEntity.file.id,
          file_name: fileName,
          file_type: fileType,
          file_size: fileSize ?? totalCalcSize,
          file_url: `https://${this.makeS3Creds().bucketName}.s3.${
            this.makeS3Creds().region
          }.amazonaws.com/${fileKey}`,
          file_hash: hashValue || '',
          token,
        });
      }

      return await this.fileRepository.save({
        file_name: fileName,
        file_type: fileType,
        file_size: fileSize ?? totalCalcSize,
        file_url: `https://${this.makeS3Creds().bucketName}.s3.${
          this.makeS3Creds().region
        }.amazonaws.com/${fileKey}`,
        file_hash: hashValue || '',
        token,
      });
    } catch (err) {
      Logger.log(`File upload failed. #file_name[${fileName}]`, err);
      return { error: ErrorType.FileUpdateFailed, file: null };
    }
  }

  async updateFile(
    readStream: ReadStream,
    id: number,
    fileName: string,
    fileType: string,
    fileSize: number,
    token: string,
  ): Promise<IFileOutput> {
    try {
      const oldFileEntity = await this.fileRepository.find({
        where: { file_id: id },
      });
      if (!oldFileEntity) throw new Error(`Not found file with id=${id}`);

      const accessKeyId = process.env.AWS_S3_ACCESS_ID || '';
      const secretAccessKey = process.env.AWS_S3_SECRET_KEY || '';
      const bucketName = process.env.AWS_S3_BUCKET_NAME || '';
      const region = process.env.AWS_S3_REGION || '';

      const newFileKey = `${nanoid()}-${fileName}`;

      const hash = createHash('sha256');
      let hashValue: string | null = null;

      const calcHashTr = new Transform({
        transform(chunk, _encoding, callback) {
          hash.update(chunk);
          this.push(chunk);
          callback();
        },
        flush(callback) {
          hashValue = hash.digest('hex') as string;
          callback();
        },
      });
      readStream.pipe(calcHashTr);

      const uploadParams = {
        Bucket: bucketName,
        Key: newFileKey,
        Body: calcHashTr,
      };

      const parallelUploads3 = new Upload({
        client: this.getS3Client(),
        params: uploadParams,
        queueSize: 40,
        partSize: 1024 * 1024 * 5,
        leavePartsOnError: false,
      });

      await parallelUploads3.done();

      const deleteParams = {
        Bucket: bucketName,
        Key: oldFileEntity.file!.fileUrl.split('/').at(-1),
      };
      const deleteCommand = new DeleteObjectCommand(deleteParams);
      await this.getS3Client().send(deleteCommand);

      const updatedFileEntity = Object.assign(oldFileEntity, {
        file_name: fileName,
        file_type: fileType,
        file_size: fileSize,
        file_url: `https://${bucketName}.s3.${region}.amazonaws.com/${newFileKey}`,
        file_hash: hashValue || '',
        token,
      });
      return await this.fileRepository.save(updatedFileEntity);
    } catch (err) {
      Logger.error('File update failed', err);
      return { error: ErrorType.FileUpdateFailed, file: null };
    }
  }

  async deleteFile(id: string): Promise<IFileDeleteOutput> {
    try {
      if (!id) {
        Logger.error(`fileService#deleteFile error: no file id specified`);
        throw new Error(ErrorType.FileDeleteFailed);
      }
      const oldFileEntity = await this.fileRepository.find({
        where: { file_id: Number(id) },
      });
      if (!oldFileEntity) throw new Error(`Not found file with id=${id}`);

      const p1 = performance.now();
      const bucketName = process.env.AWS_S3_BUCKET_NAME;
      const region = process.env.AWS_S3_REGION;

      const deleteParams = {
        Bucket: bucketName,
        Key: oldFileEntity.file!.fileUrl.split('/').at(-1),
      };
      const deleteCommand = new DeleteObjectCommand(deleteParams);
      await this.getS3Client().send(deleteCommand);

      const deletedId = await this.fileRepository.delete(id);
      Logger.debug(
        `Deleted file ID=${deletedId} for ${performance.now() - p1} ms.`,
      );
      return {
        deletedId,
        error: ErrorType.NoError,
      };
    } catch (err) {
      Logger.error('File deletion failed', err);
      return {
        deletedId: null,
        error: ErrorType.FileDeleteFailed,
      };
    }
  }

  async getAll() {
    try {
      return await this.fileRepository.list();
    } catch (e) {
      Logger.error(e);
      return [];
    }
  }

  async findOne(id: number): Promise<IFileOutput | null> {
    try {
      return await this.fileRepository.find({
        where: { file_id: id },
      });
    } catch (e) {
      Logger.error(e);
      return {
        error: ErrorType.UnknownError,
        file: null,
      };
    }
  }

  async getFileContentAsString(fileId: string): Promise<string> {
    try {
      if (isNaN(Number(fileId)))
        throw new Error(
          `flieService#getFileContentAsString: Error: Number(fileId) is NaN`,
        );
      const p1 = performance.now();
      const fileData = await this.fileRepository.find({
        where: { file_id: Number(fileId) },
      });

      const command = new GetObjectCommand({
        Bucket: this.makeS3Creds().bucketName,
        Key: fileData?.file?.fileUrl.split('/').at(-1),
      });

      const response = await this.getS3Client().send(command);
      if (!response.Body)
        throw new Error(
          `flieService#getFileContentAsString: Error: can't get file ${fileData?.file?.fileUrl
            .split('/')
            .at(-1)} from S3 bucket`,
        );
      Logger.debug(
        `File id ` +
          fileId +
          ` is downloaded from S3 bucket for ${performance.now() - p1} ms.`,
      );
      return response?.Body?.transformToString();
    } catch (e) {
      Logger.error(e);
      return '';
    }
  }

  makeS3Creds(params?: { useTemporaryBucket?: boolean }) {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID || '';
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';
    const bucketName = params?.useTemporaryBucket
      ? process.env.AWS_S3_TEMPORARY_BUCKET_NAME
      : process.env.AWS_S3_BUCKET_NAME;
    const region = process.env.AWS_S3_REGION || '';
    const creds = AWS_ENVIRONMENTS.includes(process.env.NODE_ENV || '')
      ? {
          region,
        }
      : {
          region,
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
        };

    return { creds, bucketName, region };
  }
}
