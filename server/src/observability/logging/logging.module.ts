import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';
import { RequestContextHttpRequest } from '../tracing/request-context.types';

@Global()
@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isDevelopment =
          config.get('NODE_ENV', 'development') === 'development';
        const serviceName = config.get('SERVICE_NAME', 'gestor-academico');
        const level = config.get('LOG_LEVEL', isDevelopment ? 'debug' : 'info');

        return {
          pinoHttp: {
            level,
            autoLogging: false,
            messageKey: 'message',
            customAttributeKeys: {
              req: 'request',
              res: 'response',
              err: 'error',
            },
            formatters: {
              level: (label: string) => ({ level: label }),
            },
            timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
            base: {
              service: serviceName,
              environment: config.get('NODE_ENV', 'development'),
            },
            transport: isDevelopment
              ? {
                  target: 'pino-pretty',
                  options: {
                    singleLine: true,
                    colorize: true,
                    translateTime: 'SYS:standard',
                    ignore: 'pid,hostname',
                  },
                }
              : undefined,
            genReqId: (request) => {
              const req = request as typeof request & RequestContextHttpRequest;
              return (
                req.requestId ||
                req.id ||
                (typeof request.headers['x-request-id'] === 'string'
                  ? request.headers['x-request-id']
                  : undefined) ||
                (typeof request.headers['x-correlation-id'] === 'string'
                  ? request.headers['x-correlation-id']
                  : undefined) ||
                randomUUID()
              );
            },
            serializers: {
              req: (request) => {
                const req = request as typeof request &
                  RequestContextHttpRequest;
                return {
                  id: req.id,
                  method: request.method,
                  url: request.url,
                  route: request.url,
                  requestId: req.requestId ?? req.id,
                  correlationId: req.correlationId,
                  traceId: req.traceId,
                  spanId: req.spanId,
                };
              },
              res: (response) => ({
                statusCode: response.statusCode,
              }),
            },
          },
        };
      },
    }),
  ],
})
export class AppLoggingModule {}
