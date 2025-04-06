import { ServerResponse } from 'node:http';
import IMediaModel from '../models/Media.model';
import MediaRepository from '../repositories/MediaRepository';
import { RequestContext } from '../router/types';
import { S3BucketProvider } from './s3-bucket.service';
import { IPostMediaDto } from '../DTOs/Media.dto';

class MediaService {
  readonly mediaRepository: MediaRepository;
  readonly s3Provider: S3BucketProvider;

  constructor() {
    this.mediaRepository = new MediaRepository();
    this.s3Provider = new S3BucketProvider();
  }

  async uploadFile(ctx: RequestContext): Promise<IMediaModel> {
    if (!ctx.file) {
      throw new Error('No file provided in context');
    }
    const file = ctx.file;
    const { key: id } = await this.s3Provider.uploadSingleFile({ file });
    const payload: IPostMediaDto = {
      id,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
    };
    return await this.mediaRepository.create(payload);
  }

  async updateFile(ctx: RequestContext): Promise<IMediaModel | false> {
    if (!ctx.file) {
      throw new Error('No file provided in context');
    }
    const file = ctx.file;

    const { key: id } = await this.s3Provider.uploadSingleFile({ file });
    await this.s3Provider.deleteFile(ctx.params.id);
    const payload: IPostMediaDto = {
      id,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      updatedAt: new Date(),
    };
    return await this.mediaRepository.update(ctx.params.id, payload);
  }

  async getFile(
    ctx: RequestContext,
  ): Promise<(IMediaModel & { url: string }) | false> {
    const { url } = await this.s3Provider.getFileUrl(ctx.params.id);
    const media = await this.mediaRepository.findById(ctx.params.id);
    if (!media) {
      return false;
    }
    return { ...media, url };
  }

  async getFiles(): Promise<IMediaModel[]> {
    return await this.mediaRepository.findAll();
  }
  async deleteFile(ctx: RequestContext): Promise<boolean> {
    await this.s3Provider.deleteFile(ctx.params.id);
    return await this.mediaRepository.delete(ctx.params.id);
  }
}

export default new MediaService();
