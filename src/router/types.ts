import { IncomingMessage, ServerResponse } from 'http';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type RequestContext<T = unknown> = {
  params: Record<string, string>;
  query: Record<string, string | string[]>;
  body: T;
  file?: Express.Multer.File;
  headers: Record<string, string | string[] | undefined>;
  method: HttpMethod;
  url: string;
};

export type NextFunction = () => Promise<void> | void;

export type Handler<T = unknown> = (
  req: IncomingMessage,
  res: ServerResponse,
  ctx: RequestContext<T>,
  next: NextFunction,
) => Promise<void> | void;

export type Route = {
  method: HttpMethod;
  path: string;
  handler: Handler;
};
