import { db } from '../db/postgresConfig';
import { IPostMediaDto, IUpdateMediaDto } from '../DTOs/Media.dto';
import IMediaModel from '../models/Media.model';
import IRepository from './IRepository';

export default class MediaRepository implements IRepository<IMediaModel> {
  async findById(id: string): Promise<IMediaModel | false> {
    console.log('query:', id);
    const query = {
      text: `
            SELECT * 
            FROM media_metadata
            WHERE id = $1
        `,
      values: [id],
    };
    const result = await db.query(query);

    if (result.rows.length < 1) {
      return false;
    }

    const media: IMediaModel = result.rows[0];

    return media;
  }

  async findAll(): Promise<IMediaModel[]> {
    const query = {
      text: `
              SELECT * 
              FROM media_metadata
          `,
    };
    const result = await db.query(query);

    const media: IMediaModel[] = result.rows;

    return media;
  }

  async create(payload: IPostMediaDto): Promise<IMediaModel> {
    const { id, fileName, fileSize, mimeType } = payload;
    console.log('payload:', payload);
    const query = {
      text: `
            INSERT INTO media_metadata(id, file_name, file_size, mime_type) 
            VALUES($1, $2, $3, $4)
            RETURNING *
        `,
      values: [id, fileName, fileSize, mimeType],
    };
    const result = await db.query(query);

    const media: IMediaModel = result.rows[0];

    return media;
  }

  async update(
    oldId: string,
    payload: IUpdateMediaDto,
  ): Promise<IMediaModel | false> {
    const { id: newId, fileName, fileSize, mimeType } = payload;
    console.log('update:', payload);
    console.log('update:', oldId);
    const query = {
      text: `
            UPDATE media_metadata
            SET file_name = COALESCE($1, file_name), file_size = COALESCE($2, file_size), mime_type = COALESCE ($3, mime_type), id = $5
            WHERE id = $4
            RETURNING *
        `,
      values: [fileName, fileSize, mimeType, oldId, newId],
    };
    const result = await db.query(query);

    if (result.rows.length < 1) {
      return false;
    }

    const media: IMediaModel = result.rows[0];

    return media;
  }

  async delete(id: string): Promise<boolean> {
    const data = await this.findById(id);
    if (!data) {
      return false;
    }
    const query = {
      text: `
          DELETE FROM media_metadata
          WHERE id = $1
          RETURNING id
        `,
      values: [id],
    };

    const result = await db.query(query);
    return result.rows.length > 0;
  }
}
