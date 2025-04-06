import { MAX_FILE_SIZE_BYTES, ALLOWED_MIME_TYPES } from './constants';
import MediaController from './controllers/media.controller';
import middleware from './middlewares/';
import router from './router/router';
import logger from './utils/logger.util';

export default async () => {
  try {
    router
      .use(middleware.error)
      .use(middleware.logger)
      .use(
        middleware.file({
          maxFileSize: MAX_FILE_SIZE_BYTES,
          allowedMimeTypes: ALLOWED_MIME_TYPES,
        }),
      );

    router.get('/media', async (req, res, ctx) => {
      await MediaController.getFiles(req, res, ctx);
    });
    router.get('/media/:id', async (req, res, ctx) => {
      await MediaController.getFile(req, res, ctx);
    });
    router.post('/media', async (req, res, ctx) => {
      await MediaController.postFile(req, res, ctx);
    });
    router.put('/media/:id', async (req, res, ctx) => {
      await MediaController.updateFile(req, res, ctx);
    });
    router.delete('/media/:id', async (req, res, ctx) => {
      await MediaController.deleteFile(req, res, ctx);
    });

    logger.info('Routes registered successfully');
  } catch (e) {
    logger.error(`Error registering routes ${e}`);
  }
};
