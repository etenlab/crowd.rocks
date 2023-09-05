import { Injectable } from '@nestjs/common';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import { ReadStream } from 'fs';
import { Transform } from 'stream';
import { createHash } from 'crypto';
import { nanoid } from 'nanoid';
import { Upload } from '@aws-sdk/lib-storage';
import * as dotenv from 'dotenv';
import { FileRepository } from './file.repository';
import { IFile } from './types';

dotenv.config();

@Injectable()
export class FileService {
  constructor(private fileRepository: FileRepository) {}

  async uploadFile(
    readStream: ReadStream,
    fileName: string,
    fileType: string,
    fileSize: number,
  ): Promise<IFile | void> {
    try {
      const accessKeyId = process.env.AWS_ACCESS_KEY_ID || '';
      const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';
      const bucketName = process.env.AWS_S3_BUCKET_NAME || '';
      const region = process.env.AWS_REGION || '';
      const fileKey = `${nanoid()}-${fileName}` || '';

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
        Key: fileKey,
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

      const fileEntity = await this.fileRepository.find({
        where: {
          file_name: fileName,
          file_type: fileType,
          file_size: fileSize,
          file_hash: hashValue!,
        },
      });

      if (fileEntity) {
        const deleteParams = {
          Bucket: bucketName,
          Key: fileKey,
        };

        const deleteCommand = new DeleteObjectCommand(deleteParams);

        await s3Client.send(deleteCommand);

        return fileEntity;
      }

      return this.fileRepository.save({
        file_name: fileName,
        file_type: fileType,
        file_size: fileSize,
        file_url: `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`, //TODO: it'd be cool to generate differently for local environments
        file_hash: hashValue!,
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
  ): Promise<IFile | void> {
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
        Key: oldFileEntity.fileUrl.split('/').at(-1),
      };
      const deleteCommand = new DeleteObjectCommand(deleteParams);
      await s3Client.send(deleteCommand);
      const updatedFileEntity = Object.assign(oldFileEntity, {
        file_name: fileName,
        file_type: fileType,
        file_size: fileSize,
        file_url: `https://${bucketName}.s3.${region}.amazonaws.com/${newFileKey}`,
        file_hash: hashValue || '',
      });
      return await this.fileRepository.save(updatedFileEntity);
    } catch (err) {
      console.log('File update failed', err);
    }
  }

  async getAll() {
    return await this.fileRepository.find();
  }

  async findOne(id: number) {
    return await this.fileRepository.find({
      where: { file_id: id },
    });
  }
}
