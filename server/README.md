# Gestor Acadêmico Server

[![CI](https://github.com/estermarreiro/gestor-academico/actions/workflows/ci.yml/badge.svg)](https://github.com/estermarreiro/gestor-academico/actions/workflows/ci.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=EsterMarreiro_gestor-academico&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=EsterMarreiro_gestor-academico)

Backend NestJS do Gestor Acadêmico com gateway HTTP, microserviços TCP por domínio, persistência PostgreSQL com Prisma, cache Redis, mensageria RabbitMQ, WebSocket para eventos operacionais e stack de observabilidade com Prometheus e Grafana.

## Visão Geral

O runtime está dividido entre:

- `Gateway HTTP`: entrada pública da API, documentação Swagger, health checks, métricas, cache e realtime
- `Microserviços de domínio`: execução isolada por módulo
- `Infraestrutura local`: PostgreSQL, Redis, RabbitMQ, Prometheus, Grafana e pgAdmin

Módulos ativos:

- usuários
- alunos
- professores
- cursos
- disciplinas
- turmas
- matrículas
- alunos por turma
- inscrições de professor
- notificações
- versionamento

## Estrutura

```text
server/
├── Dockerfile
├── README.md
├── docker-compose.yml
├── docker-compose.prod.yml
├── docs/
│   └── observability.md
├── observability/
│   ├── grafana/
│   └── prometheus/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── gateway/
│   ├── messaging/
│   ├── microservice-apps/
│   ├── modules/
│   ├── notifications/
│   ├── observability/
│   ├── realtime/
│   ├── resilience/
│   └── shared/
└── test/
```

## Requisitos

- Node.js 22
- npm
- Docker
- Docker Compose

## Instalação

Na raiz do repositório:

```bash
npm ci
npm ci --prefix server
```

Se usar `nvm`:

```bash
nvm use
```

## Execução Local

Para subir toda a stack:

```bash
cd server
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

Para gerar build:

```bash
npm run build
```

## Serviços da Stack Docker

O ambiente local sobe:

- gateway HTTP
- microserviços de usuários, turmas, cursos, disciplinas, matrículas, alunos, professores, alunos por turma e inscrições de professor
- microserviço de notificações
- PostgreSQL 16
- Redis 7
- RabbitMQ 3 com painel de administração
- pgAdmin 4
- Prometheus
- Grafana

## Endpoints e Interfaces

- gateway: `http://localhost:3001`
- Swagger: `http://localhost:3001/docs`
- health: `http://localhost:3001/health`
- metrics: `http://localhost:3001/metrics`
- version: `http://localhost:3001/api/v1/version`
- WebSocket namespace: `/events`
- RabbitMQ Management: `http://localhost:15672`
- pgAdmin: `http://localhost:8080`
- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3002`

## Arquitetura de Aplicação

### Gateway HTTP

O gateway centraliza:

- entrada REST para os módulos
- documentação Swagger
- interceptação de logs
- health check
- exportação de métricas
- cache de leitura
- emissão de eventos realtime

Ele roteia chamadas para microserviços TCP por domínio e aplica recursos transversais antes de expor a resposta ao cliente.

### Microserviços de Domínio

Cada contexto funcional relevante possui um bootstrap dedicado. Isso mantém isolamento por responsabilidade e prepara o projeto para crescimento operacional sem misturar todas as regras em um único processo.

### Persistência

O projeto usa:

- PostgreSQL 16 como banco principal
- Prisma para modelagem, acesso e migrações
- serviço `migrate` no `docker compose` para aplicar migrações antes do gateway e dos microserviços

## Observabilidade

A camada de observabilidade já está ativa no código e cobre:

- logging estruturado com `nestjs-pino`, `pino` e `pino-pretty`
- correlation ID com `X-Request-Id`
- exception logging centralizado
- métricas Prometheus com `prom-client`
- dashboards Grafana provisionados via arquivos em `observability/`
- monitoramento de saúde com `@nestjs/terminus`

O endpoint `/health` verifica:

- aplicação
- PostgreSQL
- Redis
- RabbitMQ
- dependências externas configuradas em `EXTERNAL_SERVICES`

O serviço de health também executa sondagem periódica para refletir o estado nas métricas.

Documentação complementar:

- [docs/observability.md](docs/observability.md)

## Resiliência

O backend já possui uma camada própria de resiliência em `src/resilience/`.

Capacidades implementadas:

- `retry` com backoff configurável
- `timeout` para operações HTTP, RPC e integrações externas
- `circuit breaker` para reduzir falhas em cascata
- `bulkhead` para limitar concorrência e fila
- tratamento de erros RPC para transformar falhas técnicas em respostas consistentes

Essa camada é especialmente relevante no gateway, onde chamadas entre módulos e dependências externas precisam de proteção operacional.

## Cache

O cache do gateway usa `cache-manager` com suporte a Redis.

Comportamento atual:

- quando Redis está disponível, ele é usado como backend de cache
- quando Redis falha ou não sobe, o sistema faz fallback para cache em memória
- o TTL padrão configurado é de `300` segundos
- leituras podem ser encapsuladas pelo `GatewayCacheService`
- eventos de matrícula acionam invalidação de cache para manter consistência

## Mensageria

O sistema usa RabbitMQ como barramento de eventos de domínio.

Uso atual no projeto:

- publicação de eventos por módulos como `Matrículas` e `Turmas`
- consumo de `MATRICULA_CRIADA_EVENT` pelo microserviço de notificações
- consumo de eventos de matrícula no gateway para limpar cache e propagar realtime

Essa abordagem deixa o núcleo transacional menor e desloca efeitos colaterais para processamento assíncrono.

## Realtime

O backend expõe comunicação em tempo real com `socket.io`.

Uso atual:

- namespace `/events`
- emissão de eventos de matrícula criada, atualizada e removida
- apoio a interfaces que precisem refletir alterações sem polling contínuo

O adaptador WebSocket usa Redis, o que já prepara o sistema para cenários com mais de uma instância do gateway.

## Regras de Negócio Relevantes Já Refletidas no Código

### Matrículas

- uma matrícula liga `Aluno` a `Curso`
- o status pode ser `pendente`, `ativa`, `em_fila` ou `recusada`
- existe unicidade por aluno e curso
- criação, atualização e remoção disparam eventos de domínio

### Inscrições de Professor

- uma inscrição liga `Usuario` a `Disciplina`
- o status pode ser `pendente`, `aprovada` ou `recusada`
- uma disciplina não aceita nova aprovação se já tiver professor responsável
- também não aceita nova inscrição aprovada se já existir outra inscrição aprovada para a mesma disciplina

### Alunos por Turma

- o vínculo entre aluno e turma é tratado em módulo próprio
- isso separa matrícula no curso de alocação operacional em turma

## Variáveis de Ambiente Relevantes

### Aplicação

- `DATABASE_URL`
- `NODE_ENV`
- `BUILD_DATE`
- `PORT`
- `SERVICE_NAME`
- `LOG_LEVEL`

### Redis e cache

- `REDIS_HOST`
- `REDIS_PORT`
- `REDIS_URL`
- `REDIS_USERNAME`
- `REDIS_PASSWORD`

### RabbitMQ

- `RABBITMQ_URL`

### Observabilidade

- `METRICS_DEFAULT_PREFIX`
- `EXTERNAL_SERVICES`
- `HEALTHCHECK_EXTERNAL_TIMEOUT_MS`

### Resiliência

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

### WebSocket

- `WS_CORS_ORIGIN`

## Testes e Qualidade

Scripts principais:

```bash
npm run lint
npm run lint:fix
npm run test
npm run test:e2e
npm run test:cov
```

Cobertura global mínima configurada:

- `branches >= 70%`
- `functions >= 70%`
- `lines >= 70%`
- `statements >= 70%`

## Versionamento e Pipeline

- Conventional Commits com `commitlint`
- hooks com `husky`
- versionamento semântico com `standard-version`
- workflow CI em `.github/workflows/ci.yml`
- análise de qualidade com SonarCloud

Comandos de release:

```bash
npm run release:first
npm run release
```
