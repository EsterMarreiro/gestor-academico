import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { RequestContextHttpRequest } from './request-context.types';
import { RequestContextService } from './request-context.service';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  constructor(private readonly requestContext: RequestContextService) {}

  use(
    request: Request & RequestContextHttpRequest,
    response: Response,
    next: NextFunction,
  ) {
    const context = this.requestContext.createFromHeaders(
      request.headers as Record<string, unknown>,
    );

    request.id = context.requestId;
    request.requestId = context.requestId;
    request.correlationId = context.correlationId;
    request.traceId = context.traceId;
    request.spanId = context.spanId;

    response.setHeader('X-Request-Id', context.requestId);
    response.setHeader('X-Correlation-Id', context.correlationId);
    response.setHeader('X-Trace-Id', context.traceId);
    response.setHeader('X-Span-Id', context.spanId);

    this.requestContext.run(context, () => next());
  }
}
