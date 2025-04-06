import config from '../config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import logger from '../utils/logger.util';
import 'multer';

export class S3BucketProvider {
  private client: S3Client;
  private s3Config = config.get('aws').s3;

  constructor() {
    const s3_region = this.s3Config.region;

    if (!s3_region) {
      throw new Error('S3_REGION not found in environment variables');
    }

    this.client = new S3Client({
      region: s3_region,
      credentials: {
        accessKeyId: this.s3Config.accessKey,
        secretAccessKey: this.s3Config.secretAccessKey,
      },
    });
  }

  async uploadSingleFile({ file }: { file: Express.Multer.File }) {
    try {
      const key = uuidv4();
      await this.uploadToS3({
        key,
        buffer: file.buffer,
        mimetype: file.mimetype,
        originalName: file.originalname,
      });

      logger.info(`file finished uploading: ${file.originalname}`);
      return { key };
    } catch (error: any) {
      throw new Error(error);
    }
  }

  private async uploadToS3({
    key,
    buffer,
    mimetype,
    originalName,
  }: {
    key: string;
    buffer: Buffer;
    mimetype: string;
    originalName: string;
  }) {
    const command = new PutObjectCommand({
      Bucket: this.s3Config.bucketName,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
      ACL: 'public-read',
      Metadata: {
        originalName,
      },
    });

    await this.client.send(command);
  }

  async getFileUrl(key: string) {
    return {
      url: `https://${this.s3Config.bucketName}.s3.amazonaws.com/${key}`,
    };
  }

  async deleteFile(key: string) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.s3Config.bucketName,
        Key: key,
      });

      await this.client.send(command);

      return { message: 'File deleted successfully' };
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
