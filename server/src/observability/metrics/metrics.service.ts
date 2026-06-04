import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  collectDefaultMetrics,
  Counter,
  Gauge,
  Histogram,
  Registry,
} from 'prom-client';

type HttpMetricLabels = 'method' | 'route' | 'status_code';
type ErrorMetricLabels = 'method' | 'route' | 'status_code' | 'error_name';
type DatabaseMetricLabels = 'operation' | 'status';
type HttpClientMetricLabels =
  | 'dependency'
  | 'method'
  | 'target'
  | 'status_code'
  | 'status';
type RabbitMetricLabels = 'exchange' | 'routing_key' | 'status';
type RabbitConsumerMetricLabels = 'queue' | 'routing_key' | 'status';
type HealthMetricLabels = 'check';
type CircuitMetricLabels = 'dependency' | 'state';

@Injectable()
export class MetricsService {
  private readonly registry = new Registry();
  private readonly httpRequestsTotal: Counter<HttpMetricLabels>;
  private readonly httpRequestDurationSeconds: Histogram<HttpMetricLabels>;
  private readonly applicationErrorsTotal: Counter<ErrorMetricLabels>;
  private readonly databaseOperationsTotal: Counter<DatabaseMetricLabels>;
  private readonly databaseOperationDurationSeconds: Histogram<DatabaseMetricLabels>;
  private readonly externalHttpRequestsTotal: Counter<HttpClientMetricLabels>;
  private readonly externalHttpRequestDurationSeconds: Histogram<HttpClientMetricLabels>;
  private readonly rabbitMqPublishedTotal: Counter<RabbitMetricLabels>;
  private readonly rabbitMqConsumedTotal: Counter<RabbitConsumerMetricLabels>;
  private readonly rabbitMqConsumerDurationSeconds: Histogram<RabbitConsumerMetricLabels>;
  private readonly rabbitMqConnectionStatus: Gauge;
  private readonly healthStatusGauge: Gauge<HealthMetricLabels>;
  private readonly processUptimeSeconds: Gauge;
  private readonly circuitBreakerStateGauge: Gauge<CircuitMetricLabels>;

  constructor(private readonly config: ConfigService) {
    const service = this.config.get('SERVICE_NAME', 'gestor-academico');

    this.registry.setDefaultLabels({
      app: 'gestor-academico',
      service,
      environment: this.config.get('NODE_ENV', 'development'),
    });

    collectDefaultMetrics({
      register: this.registry,
      prefix: this.config.get('METRICS_DEFAULT_PREFIX', 'gestor_academico_'),
      eventLoopMonitoringPrecision: 10,
    });

    this.httpRequestsTotal = new Counter({
      name: 'gestor_academico_http_requests_total',
      help: 'Total de requisições HTTP processadas.',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.registry],
    });

    this.httpRequestDurationSeconds = new Histogram({
      name: 'gestor_academico_http_request_duration_seconds',
      help: 'Duração das requisições HTTP processadas.',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
      registers: [this.registry],
    });

    this.applicationErrorsTotal = new Counter({
      name: 'gestor_academico_application_errors_total',
      help: 'Total de erros de aplicação observados.',
      labelNames: ['method', 'route', 'status_code', 'error_name'],
      registers: [this.registry],
    });

    this.databaseOperationsTotal = new Counter({
      name: 'gestor_academico_database_operations_total',
      help: 'Total de operações do banco observadas.',
      labelNames: ['operation', 'status'],
      registers: [this.registry],
    });

    this.databaseOperationDurationSeconds = new Histogram({
      name: 'gestor_academico_database_operation_duration_seconds',
      help: 'Duração das operações do banco observadas.',
      labelNames: ['operation', 'status'],
      buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5],
      registers: [this.registry],
    });

    this.externalHttpRequestsTotal = new Counter({
      name: 'gestor_academico_external_http_requests_total',
      help: 'Total de chamadas HTTP externas.',
      labelNames: ['dependency', 'method', 'target', 'status_code', 'status'],
      registers: [this.registry],
    });

    this.externalHttpRequestDurationSeconds = new Histogram({
      name: 'gestor_academico_external_http_request_duration_seconds',
      help: 'Duração das chamadas HTTP externas.',
      labelNames: ['dependency', 'method', 'target', 'status_code', 'status'],
      buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
      registers: [this.registry],
    });

    this.rabbitMqPublishedTotal = new Counter({
      name: 'gestor_academico_rabbitmq_published_total',
      help: 'Total de publicações no RabbitMQ.',
      labelNames: ['exchange', 'routing_key', 'status'],
      registers: [this.registry],
    });

    this.rabbitMqConsumedTotal = new Counter({
      name: 'gestor_academico_rabbitmq_consumed_total',
      help: 'Total de mensagens consumidas do RabbitMQ.',
      labelNames: ['queue', 'routing_key', 'status'],
      registers: [this.registry],
    });

    this.rabbitMqConsumerDurationSeconds = new Histogram({
      name: 'gestor_academico_rabbitmq_consumer_duration_seconds',
      help: 'Duração do processamento de mensagens do RabbitMQ.',
      labelNames: ['queue', 'routing_key', 'status'],
      buckets: [0.005, 0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
      registers: [this.registry],
    });

    this.rabbitMqConnectionStatus = new Gauge({
      name: 'gestor_academico_rabbitmq_connection_status',
      help: 'Estado da conexão com RabbitMQ. 1 para conectado, 0 para desconectado.',
      registers: [this.registry],
    });

    this.healthStatusGauge = new Gauge({
      name: 'gestor_academico_healthcheck_status',
      help: 'Estado dos health checks. 1 para up, 0 para down.',
      labelNames: ['check'],
      registers: [this.registry],
    });

    this.processUptimeSeconds = new Gauge({
      name: 'gestor_academico_process_uptime_seconds',
      help: 'Uptime do processo Node.js.',
      registers: [this.registry],
      collect: () => {
        this.processUptimeSeconds.set(process.uptime());
      },
    });

    this.circuitBreakerStateGauge = new Gauge({
      name: 'gestor_academico_circuit_breaker_state',
      help: 'Estado do circuit breaker por dependência.',
      labelNames: ['dependency', 'state'],
      registers: [this.registry],
    });

    this.rabbitMqConnectionStatus.set(0);
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
    this.httpRequestsTotal.inc(labels);
    this.httpRequestDurationSeconds.observe(labels, durationMs / 1000);
  }

  recordApplicationError(
    method: string,
    route: string,
    statusCode: number,
    errorName: string,
  ): void {
    this.applicationErrorsTotal.inc({
      method,
      route,
      status_code: String(statusCode),
      error_name: errorName,
    });
  }

  recordDatabaseOperation(
    operation: string,
    durationMs: number,
    status: 'success' | 'error',
  ): void {
    const labels = { operation, status };
    this.databaseOperationsTotal.inc(labels);
    this.databaseOperationDurationSeconds.observe(labels, durationMs / 1000);
  }

  recordExternalHttpCall(
    dependency: string,
    method: string,
    target: string,
    statusCode: number,
    durationMs: number,
    status: 'success' | 'error',
  ): void {
    const labels = {
      dependency,
      method: method.toUpperCase(),
      target,
      status_code: String(statusCode),
      status,
    };
    this.externalHttpRequestsTotal.inc(labels);
    this.externalHttpRequestDurationSeconds.observe(labels, durationMs / 1000);
  }

  recordRabbitMqPublish(
    exchange: string,
    routingKey: string,
    status: 'success' | 'error',
  ): void {
    this.rabbitMqPublishedTotal.inc({
      exchange,
      routing_key: routingKey,
      status,
    });
  }

  recordRabbitMqConsume(
    queue: string,
    routingKey: string,
    durationMs: number,
    status: 'success' | 'error',
  ): void {
    const labels = { queue, routing_key: routingKey, status };
    this.rabbitMqConsumedTotal.inc(labels);
    this.rabbitMqConsumerDurationSeconds.observe(labels, durationMs / 1000);
  }

  setRabbitMqConnectionStatus(connected: boolean): void {
    this.rabbitMqConnectionStatus.set(connected ? 1 : 0);
  }

  setHealthStatus(name: string, healthy: boolean): void {
    this.healthStatusGauge.set({ check: name }, healthy ? 1 : 0);
  }

  setCircuitBreakerState(
    dependency: string,
    state: 'closed' | 'open' | 'halfOpen',
  ): void {
    for (const currentState of ['closed', 'open', 'halfOpen'] as const) {
      this.circuitBreakerStateGauge.set(
        { dependency, state: currentState },
        currentState === state ? 1 : 0,
      );
    }
  }

  getContentType(): string {
    return this.registry.contentType;
  }

  getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}
