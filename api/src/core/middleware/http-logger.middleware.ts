import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    if (process.env.HTTP_LOGGING.toLowerCase().trim() === 'true') {
      const { ip, method, path: url, body } = request;
      const userAgent = request.get('user-agent') || '';

      response.on('close', () => {
        const { statusCode } = response;
        const contentLength = response.get('content-length');

        this.logger.log(
          `${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip} : ${JSON.stringify(
            body,
          )}`,
        );
      });
    }

    next();
  }
}
