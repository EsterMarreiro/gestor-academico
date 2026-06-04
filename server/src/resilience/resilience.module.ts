import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MetricsModule } from '../observability/metrics/metrics.module';
import { BulkheadService } from './bulkhead/bulkhead.service';
import { CircuitBreakerService } from './circuit-breaker/circuit-breaker.service';
import { ResilienceConfigService } from './resilience.config';
import { ResilientHttpService } from './resilient-http.service';
import { RetryService } from './retry/retry.service';
import { RpcResilienceService } from './rpc-resilience.service';
import { TimeoutInterceptor } from './timeout/timeout.interceptor';

@Global()
@Module({
  imports: [MetricsModule],
  providers: [
    ResilienceConfigService,
    RetryService,
    BulkheadService,
    CircuitBreakerService,
    ResilientHttpService,
    RpcResilienceService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
  ],
  exports: [
    ResilienceConfigService,
    RetryService,
    BulkheadService,
    CircuitBreakerService,
    ResilientHttpService,
    RpcResilienceService,
  ],
})
export class ResilienceModule {}
