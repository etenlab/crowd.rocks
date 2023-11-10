import { Module } from '@nestjs/common';
import { HttpLoggerMiddleware } from './http-logger.middleware';

@Module({
  providers: [HttpLoggerMiddleware],
  exports: [HttpLoggerMiddleware],
})
export class MiddlewareModule {}
