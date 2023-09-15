import { Injectable, Logger } from '@nestjs/common';
import {
  S3Client,
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { ReadStream } from 'fs';
import { Transform } from 'stream';
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
  constructor(private fileRepository: FileRepository) {}

  async uploadFile(
    readStream: ReadStream,
    fileName: string,
    fileType: string,
    fileSize: number,
    token: string,
  ): Promise<IFileOutput | undefined> {
    try {
      const fileKey = `${nanoid()}-${fileName}`;

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

      const s3Client = new S3Client(this.makeS3Creds().creds);

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
        client: s3Client,
        params: uploadParams,
        queueSize: 40,
        partSize: 1024 * 1024 * 5,
        leavePartsOnError: false,
      });

      await parallelUploads3.done();

      const fileEntity = await this.fileRepository.find({
        where: {
          file_name: fileName,
          file_type: fileType,
          file_size: fileSize,
          file_hash: hashValue!,
        },
      });

      if (fileEntity?.file?.fileUrl) {
        const deleteParams = {
          Bucket: this.makeS3Creds().bucketName,
          Key: fileEntity.file?.fileUrl.split('/').at(-1),
        };

        const deleteCommand = new DeleteObjectCommand(deleteParams);

        await s3Client.send(deleteCommand);
        return await this.fileRepository.update({
          file_id: fileEntity.file.id,
          file_name: fileName,
          file_type: fileType,
          file_size: fileSize,
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
        file_size: fileSize,
        file_url: `https://${this.makeS3Creds().bucketName}.s3.${
          this.makeS3Creds().region
        }.amazonaws.com/${fileKey}`,
        file_hash: hashValue || '',
        token,
      });
    } catch (err) {
      console.log('File upload failed', err);
    }
  }

  async updateFile(
    readStream: ReadStream,
    id: number,
    fileName: string,
    fileType: string,
    fileSize: number,
    token: string,
  ): Promise<IFileOutput | undefined> {
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

      const s3Client = new S3Client({
        region,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });

      const uploadParams = {
        Bucket: bucketName,
        Key: newFileKey,
        Body: calcHashTr,
      };

      const parallelUploads3 = new Upload({
        client: s3Client,
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
      await s3Client.send(deleteCommand);

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
      console.log('File update failed', err);
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

      const bucketName = process.env.AWS_S3_BUCKET_NAME;
      const region = process.env.AWS_S3_REGION;

      const s3Client = new S3Client({
        region,
      });

      const deleteParams = {
        Bucket: bucketName,
        Key: oldFileEntity.file!.fileUrl.split('/').at(-1),
      };
      const deleteCommand = new DeleteObjectCommand(deleteParams);
      await s3Client.send(deleteCommand);

      const deletedId = await this.fileRepository.delete(id);
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
    return await this.fileRepository.list();
  }

  async findOne(id: number): Promise<IFileOutput | null> {
    return await this.fileRepository.find({
      where: { file_id: id },
    });
  }

  async getFileContentAsString(fileId: string): Promise<string> {
    if (isNaN(Number(fileId)))
      throw new Error(
        `flieService#getFileContentAsString: Error: Number(fileId) is NaN`,
      );
    const s3Client = new S3Client(this.makeS3Creds().creds);
    const fileData = await this.fileRepository.find({
      where: { file_id: Number(fileId) },
    });

    const command = new GetObjectCommand({
      Bucket: this.makeS3Creds().bucketName,
      Key: fileData?.file?.fileUrl.split('/').at(-1),
    });

    const response = await s3Client.send(command);
    if (!response.Body)
      throw new Error(
        `flieService#getFileContentAsString: Error: can't get file ${fileData?.file?.fileUrl
          .split('/')
          .at(-1)} from S3 bucket`,
      );
    return response?.Body?.transformToString();
  }

  makeS3Creds() {
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID || '';
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';
    const bucketName = process.env.AWS_S3_BUCKET_NAME;
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
