import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppLoggingModule } from './logging/logging.module';
import { ExceptionLoggingFilter } from './logging/exception-logging.filter';
import { HttpLoggingInterceptor } from './logging/http-logging.interceptor';
import { MetricsModule } from './metrics/metrics.module';
import { RequestContextMiddleware } from './tracing/request-context.middleware';
import { TracingModule } from './tracing/tracing.module';

@Module({
  imports: [TracingModule, AppLoggingModule, MetricsModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: ExceptionLoggingFilter,
    },
  ],
  exports: [TracingModule, AppLoggingModule, MetricsModule],
})
export class ObservabilityModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
