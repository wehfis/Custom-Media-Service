import { IncomingMessage, ServerResponse } from 'http';
import { Route, Handler, HttpMethod, RequestContext } from './types';

export class Router {
  private routes: Route[] = [];
  private middleware: Handler[] = [];

  private register<T = unknown>(
    method: HttpMethod,
    path: string,
    handler: Handler<T>,
  ): void {
    this.routes.push({
      method,
      path,
      handler: handler as Handler,
    });
  }

  public use<T = unknown>(middleware: Handler<T>) {
    this.middleware.push(middleware as Handler);
    return this;
  }

  public get<T = unknown>(path: string, handler: Handler<T>): void {
    this.register('GET', path, handler);
  }

  public post<T = unknown>(path: string, handler: Handler<T>): void {
    this.register('POST', path, handler);
  }

  public put<T = unknown>(path: string, handler: Handler<T>): void {
    this.register('PUT', path, handler);
  }

  public delete<T = unknown>(path: string, handler: Handler<T>): void {
    this.register('DELETE', path, handler);
  }

  public async handleRequest(
    req: IncomingMessage,
    res: ServerResponse,
  ): Promise<void> {
    try {
      const route = this.findRoute(req.method as HttpMethod, req.url || '/');

      const ctx = this.createContext(req);
      const handlers = [...this.middleware];

      if (!route) {
        await this.runMiddlewareChain(req, res, ctx, handlers);
        this.sendResponse(res, 404, { error: 'Not Found' });
        return;
      }

      handlers.push(route.handler);
      ctx.params = this.parseParams(route.path, req.url?.split('?')[0] || '/');

      await this.runMiddlewareChain(req, res, ctx, handlers);
    } catch (error) {
      this.sendResponse(res, 500, { error: 'Internal Server Error' });
    }
  }

  private sendResponse<T>(
    res: ServerResponse,
    statusCode: number,
    data: T,
    headers: Record<string, string> = {},
  ): void {
    const responseData = JSON.stringify(data);

    res.writeHead(statusCode, {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(responseData),
      ...headers,
    });

    res.end(responseData);
  }

  private findRoute(method: HttpMethod, url: string): Route | undefined {
    const [path] = url.split('?');
    const normalizedPath = this.normalizePath(path);

    return this.routes.find((route) => {
      if (route.method !== method) return false;

      if (!route.path.includes(':')) {
        return route.path === normalizedPath;
      }

      return this.isPathMatch(route.path, normalizedPath);
    });
  }

  private isPathMatch(routePath: string, requestPath: string): boolean {
    const routeParts = routePath.split('/');
    const pathParts = requestPath.split('/');

    if (routeParts.length !== pathParts.length) return false;

    for (let i = 0; i < routeParts.length; i++) {
      if (!routeParts[i].startsWith(':') && routeParts[i] !== pathParts[i]) {
        return false;
      }
    }

    return true;
  }

  private normalizePath(path: string): string {
    return path.replace(/\/+$/, '') || '/';
  }

  private parseParams(
    routePath: string,
    requestPath: string,
  ): Record<string, string> {
    const params: Record<string, string> = {};
    const routeParts = routePath.split('/');
    const pathParts = requestPath.split('/');

    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(':')) {
        const paramName = routeParts[i].slice(1);
        params[paramName] = pathParts[i];
      }
    }

    return params;
  }

  private createContext(req: IncomingMessage): RequestContext {
    const url = new URL(req.url || '/', `http://${req.headers.host}`);

    return {
      params: {},
      query: Object.fromEntries(url.searchParams),
      body: {},
      headers: req.headers,
      method: req.method as HttpMethod,
      url: url.pathname,
    };
  }

  private async runMiddlewareChain(
    req: IncomingMessage,
    res: ServerResponse,
    ctx: RequestContext,
    handlers: Handler[],
  ): Promise<void> {
    let index = 0;
    const next = async () => {
      if (index < handlers.length) {
        const currentMiddleware = handlers[index++];
        await currentMiddleware(req, res, ctx, next);
      }
    };

    await next();
  }
}

export default new Router();
