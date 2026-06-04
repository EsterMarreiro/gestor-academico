# Gestor Acadêmico Server

## Requisitos

- Node.js 20+
- Docker e Docker Compose

## Instalação

```bash
npm install
```

## Execução local

```bash
npm run start:gateway:dev
npm run start:dev
```

## Observabilidade

- Logging estruturado com Pino
- Correlation id com `X-Request-Id`
- Health checks com Terminus em `/health`
- Métricas Prometheus em `/metrics`
- Dashboards Grafana provisionados automaticamente

Documentação detalhada:

- [docs/observability.md](./docs/observability.md)

## Docker

```bash
docker compose -f docker-compose.yml up -d --build
```

## Endpoints úteis

- `http://localhost:3001/docs`
- `http://localhost:3001/health`
- `http://localhost:3001/metrics`
- `http://localhost:9090`
- `http://localhost:3002`
