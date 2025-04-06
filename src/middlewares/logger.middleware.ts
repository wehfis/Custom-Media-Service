import { IncomingMessage, ServerResponse } from 'http';
import { NextFunction, RequestContext } from '../router/types';
import logger from '../utils/logger.util';

export const loggerMiddleware = async (
  req: IncomingMessage,
  res: ServerResponse,
  ctx: RequestContext<unknown>,
  next: NextFunction,
): Promise<void> => {
  const start = Date.now();
  const { method, url, headers } = ctx;

  logger.info(`[Request Start] ${method} ${url}`, {
    headers: {
      'user-agent': headers['user-agent'],
      'content-type': headers['content-type'],
      'content-length': headers['content-length'],
    },
    params: JSON.stringify(ctx.params),
  });
  await next();
};
