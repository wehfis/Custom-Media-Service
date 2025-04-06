import { IncomingMessage, ServerResponse } from 'http';
import { NextFunction, RequestContext } from '../router/types';
import logger from '../utils/logger.util';

export const errorMiddleware = async (
  req: IncomingMessage,
  res: ServerResponse,
  ctx: RequestContext<unknown>,
  next: NextFunction,
): Promise<void> => {
  try {
    logger.info('Error middleware');
    await next();
  } catch (error) {
    logger.error('[Unhandled Error]', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    res.statusCode = 500;
    res.end(
      JSON.stringify({
        error: 'Internal Server Error',
      }),
    );
  }
};
