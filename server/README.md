# Gestor Acadêmico Server

## Requisitos

- Node.js 22
- npm
- Docker
- Docker Compose

## Serviços da Stack Local

O ambiente de desenvolvimento em Docker sobe:

- Gateway HTTP
- Microserviços de usuários, turmas, cursos, disciplinas, matrículas, alunos, professores, alunos por turma e inscrições de professor
- Microserviço de notificações
- PostgreSQL 16
- Redis 7
- RabbitMQ 3 com painel de administração
- pgAdmin 4
- Prometheus
- Grafana

## Instalação

```bash
npm ci
```

## Execução Local

Para rodar toda a stack:

```bash
docker compose up -d --build
```

Para rodar apenas o gateway:

```bash
npm run start:gateway:dev
```

Para rodar gateway e microserviços em processo local:

```bash
npm run start:dev
```

## Observabilidade

- Logging estruturado com Pino
- Correlation ID com `X-Request-Id`
- Health checks com Terminus em `/health`
- Métricas Prometheus em `/metrics`
- Dashboards Grafana provisionados automaticamente

Documentação detalhada:

- [docs/observability.md](./docs/observability.md)

## Endpoints Úteis

- `http://localhost:3001/docs`
- `http://localhost:3001/health`
- `http://localhost:3001/metrics`
- `http://localhost:3001/api/v1/version`
- `http://localhost:15672`
- `http://localhost:8080`
- `http://localhost:9090`
- `http://localhost:3002`

## Módulos Documentados

- Usuários
- Turmas
- Cursos
- Disciplinas
- Matrículas
- Alunos
- Professores
- Alunos por turma
- Inscrições de professor
- Notificações
- Versionamento
