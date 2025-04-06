import { IncomingMessage, ServerResponse } from 'node:http';
import { RequestContext } from '../router/types';
import mediaService from '../services/media.service';

export default class MediaController {
  static async postFile(
    req: IncomingMessage,
    res: ServerResponse,
    ctx: RequestContext<unknown>,
  ): Promise<void> {
    const data = await mediaService.uploadFile(ctx);
    res.statusMessage = 'File Uploaded Successfully';
    res.statusCode = 201;
    res.end(
      JSON.stringify({
        status: 'File Uploaded Successfully',
        data: data,
      }),
    );
  }

  static async getFile(
    req: IncomingMessage,
    res: ServerResponse,
    ctx: RequestContext<unknown>,
  ): Promise<void> {
    const data = await mediaService.getFile(ctx);
    if (!data) {
      res.statusMessage = 'File Not Found';
      res.statusCode = 404;
      res.end(
        JSON.stringify({
          data: data,
        }),
      );
    }
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        data: data,
      }),
    );
  }

  static async getFiles(
    req: IncomingMessage,
    res: ServerResponse,
    ctx: RequestContext<unknown>,
  ): Promise<void> {
    const data = await mediaService.getFiles();
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        data: data,
      }),
    );
  }

  static async updateFile(
    req: IncomingMessage,
    res: ServerResponse,
    ctx: RequestContext<unknown>,
  ): Promise<void> {
    console.log('start');
    const data = await mediaService.updateFile(ctx);
    if (!data) {
      res.statusMessage = 'File Not Found';
      res.statusCode = 404;
      res.end(
        JSON.stringify({
          data: data,
        }),
      );
    }
    res.statusMessage = 'File Updated Successfully';
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        status: 'File Updated Successfully',
        data: data,
      }),
    );
  }

  static async deleteFile(
    req: IncomingMessage,
    res: ServerResponse,
    ctx: RequestContext<unknown>,
  ): Promise<void> {
    const data = await mediaService.deleteFile(ctx);
    if (!data) {
      res.statusMessage = 'File Not Deleted';
      res.statusCode = 404;
      res.end(
        JSON.stringify({
          data: data,
        }),
      );
    }
    res.statusMessage = 'File Deleted Successfully';
    res.statusCode = 200;
    res.end(
      JSON.stringify({
        data: data,
      }),
    );
  }
}
