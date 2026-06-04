# Observabilidade e Resiliência

## Componentes

- `nestjs-pino`, `pino` e `pino-pretty` para logging estruturado.
- `@nestjs/terminus` para `/health`.
- `prom-client` para `/metrics`.
- `opossum`, `axios-retry` e interceptor de timeout para resiliência.
- Prometheus e Grafana provisionados via Docker Compose.

## Endpoints

- `GET /health`
- `GET /metrics`
- `GET /docs`

## Variáveis de ambiente principais

- `LOG_LEVEL`
- `SERVICE_NAME`
- `METRICS_DEFAULT_PREFIX`
- `EXTERNAL_SERVICES`
- `HEALTHCHECK_EXTERNAL_TIMEOUT_MS`
- `RESILIENCE_RETRY_ATTEMPTS`
- `RESILIENCE_RETRY_INITIAL_DELAY_MS`
- `RESILIENCE_RETRY_MAX_DELAY_MS`
- `RESILIENCE_TIMEOUT_MS`
- `RESILIENCE_RPC_TIMEOUT_MS`
- `RESILIENCE_EXTERNAL_HTTP_TIMEOUT_MS`
- `RESILIENCE_CIRCUIT_BREAKER_THRESHOLD`
- `RESILIENCE_CIRCUIT_BREAKER_HALF_OPEN_AFTER_MS`
- `RESILIENCE_CIRCUIT_BREAKER_TIMEOUT_MS`
- `RESILIENCE_BULKHEAD_LIMIT`
- `RESILIENCE_BULKHEAD_QUEUE_LIMIT`

## Subindo a stack

```bash
npm install
docker compose -f docker-compose.yml up -d --build
```

## URLs úteis

- API Gateway: `http://localhost:3001`
- Swagger: `http://localhost:3001/docs`
- Health: `http://localhost:3001/health`
- Metrics: `http://localhost:3001/metrics`
- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3002`

## Formato de `EXTERNAL_SERVICES`

Use `nome|url` separados por vírgula.

Exemplo:

```env
EXTERNAL_SERVICES=google|https://www.google.com,github|https://api.github.com
```
