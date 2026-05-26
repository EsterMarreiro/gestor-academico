import { Injectable } from '@nestjs/common';
import {
  collectDefaultMetrics,
  Counter,
  Histogram,
  Registry,
} from 'prom-client';

type HttpMetricLabels = 'method' | 'route' | 'status_code';

@Injectable()
export class MetricsService {
  private readonly registry = new Registry();
  private readonly httpRequestsTotal: Counter<HttpMetricLabels>;
  private readonly httpRequestDurationSeconds: Histogram<HttpMetricLabels>;

  constructor() {
    this.registry.setDefaultLabels({
      app: 'gestor-academico',
      service: 'gateway',
    });

    collectDefaultMetrics({
      register: this.registry,
      prefix: 'gestor_academico_',
    });

    this.httpRequestsTotal = new Counter({
      name: 'gestor_academico_http_requests_total',
      help: 'Total de requisições HTTP processadas pelo gateway.',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.registry],
    });

    this.httpRequestDurationSeconds = new Histogram({
      name: 'gestor_academico_http_request_duration_seconds',
      help: 'Duração das requisições HTTP processadas pelo gateway.',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
      registers: [this.registry],
    });
  }

  recordHttpRequest(
    method: string,
    route: string,
    statusCode: number,
    durationMs: number,
  ): void {
    const labels = {
      method,
      route,
      status_code: String(statusCode),
    };
    const durationSeconds = durationMs / 1000;

    this.httpRequestsTotal.inc(labels);
    this.httpRequestDurationSeconds.observe(labels, durationSeconds);
  }

  getContentType(): string {
    return this.registry.contentType;
  }

  getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}
