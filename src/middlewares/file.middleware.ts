import { IncomingMessage, ServerResponse } from 'http';
import { NextFunction, RequestContext } from '../router/types';
import { FileValidationOptions } from './types';
import multer from 'multer';
import logger from '../utils/logger.util';

export const fileValidatorMiddleware = (
  options: FileValidationOptions = {},
) => {
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: options.maxFileSize,
      files: 1,
    },
    fileFilter: (req, file, cb) => {
      if (
        options.allowedMimeTypes &&
        !options.allowedMimeTypes.includes(file.mimetype)
      ) {
        return cb(
          new Error(
            `Invalid file type. Allowed: ${options.allowedMimeTypes.join(', ')}`,
          ),
        );
      }
      cb(null, true);
    },
  });

  return async (
    req: IncomingMessage & { file?: Express.Multer.File },
    res: ServerResponse,
    ctx: RequestContext<unknown>,
    next: NextFunction,
  ): Promise<void> => {
    if (
      !req.headers['content-type']?.includes('multipart/form-data') ||
      (req.method && !['POST', 'PUT'].includes(req.method))
    ) {
      logger.info('file validation middleware skip');
      return await next();
    }

    const processFile = () =>
      new Promise<void>((resolve, reject) => {
        upload.single('file')(req as any, res as any, (err: unknown) => {
          if (err) reject(err);
          else resolve();
        });
      });

    try {
      await processFile();

      if (req.file) {
        ctx.file = req.file;
      }

      return await next();
    } catch (error) {
      if (error instanceof multer.MulterError) {
        res.statusCode = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
      } else {
        res.statusCode = 500;
      }
      return await next();
    }
  };
};
