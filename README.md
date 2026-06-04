# Gestor Acadêmico Backend

[![CI](https://github.com/estermarreiro/gestor-academico/actions/workflows/ci.yml/badge.svg)](https://github.com/estermarreiro/gestor-academico/actions/workflows/ci.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=EsterMarreiro_gestor-academico&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=EsterMarreiro_gestor-academico)

Backend NestJS para gestão acadêmica com API Gateway HTTP, microserviços TCP por domínio, mensageria RabbitMQ, cache distribuído com Redis e stack de observabilidade com Prometheus e Grafana. Não existe frontend neste repositório.

## Estrutura

```text
.
├── .github/workflows/ci.yml
├── .husky/commit-msg
├── CHANGELOG.md
├── commitlint.config.js
├── package.json
├── server/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   ├── package.json
│   ├── src/
│   └── test/
└── sonar-project.properties
```

## Requisitos

- Node.js 22
- npm
- Docker
- Docker Compose

Para execução completa da stack local, o `docker compose` sobe:

- PostgreSQL 16
- Redis 7
- RabbitMQ 3
- pgAdmin 4
- Prometheus
- Grafana

## Módulos Ativos

O backend expõe e orquestra os domínios abaixo:

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
- Versionamento da aplicação

## Instalação

Se usar `nvm`:

```bash
nvm use
```

Instale as dependências do repositório e do backend:

```bash
npm ci
npm ci --prefix server
```

## Execução

Para subir a stack completa de desenvolvimento:

```bash
cd server
docker compose up -d --build
```

Para rodar apenas o backend fora do Docker, você precisa ter PostgreSQL, Redis e RabbitMQ acessíveis pelas variáveis de ambiente:

```bash
npm run build
npm --prefix server run start:dev
```

## Variáveis Relevantes

- `DATABASE_URL`: conexão do Prisma com PostgreSQL.
- `NODE_ENV`: `development`, `test` ou `production`.
- `BUILD_DATE`: opcional. Se ausente, a aplicação gera a data no bootstrap do módulo de versão.
- `PORT`: porta HTTP do gateway.
- `REDIS_HOST`: host do Redis.
- `REDIS_PORT`: porta do Redis.
- `REDIS_URL`: alternativa ao uso de `REDIS_HOST` e `REDIS_PORT`.
- `RABBITMQ_URL`: conexão AMQP usada por health checks, mensageria e notificações.
- `SERVICE_NAME`: nome exposto para logs e observabilidade.
- `LOG_LEVEL`: nível de log (`trace`, `debug`, `info`, `warn`, `error`, `fatal`).
- `EXTERNAL_SERVICES`: lista opcional de serviços externos monitorados no health check.

## Endpoints Úteis

Com a stack padrão em Docker:

- Gateway HTTP: `http://localhost:3001`
- Swagger: `http://localhost:3001/docs`
- Health check: `http://localhost:3001/health`
- Métricas Prometheus: `http://localhost:3001/metrics`
- Endpoint de versão: `http://localhost:3001/api/v1/version`
- RabbitMQ Management: `http://localhost:15672`
- pgAdmin: `http://localhost:8080`
- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3002`

Resposta esperada em `GET /api/v1/version`:

```json
{
  "version": "0.1.0",
  "environment": "development",
  "buildDate": "2026-01-01T00:00:00.000Z"
}
```

## Testes

```bash
npm run test
npm run test:e2e
npm run test:cov
```

A meta configurada é `>= 70%` de cobertura global para o escopo analisado em Jest e SonarCloud.

## Lint e Qualidade

```bash
npm run lint
npm run lint:fix
```

O ESLint roda em `server/`. A pipeline falha se lint, build, testes unitários, testes de integração ou cobertura falharem.

## Conventional Commits e Husky

Commits devem seguir Conventional Commits, por exemplo:

```text
feat: adiciona endpoint de versão
fix: corrige healthcheck do gateway
chore: atualiza runtime para node 22
```

Arquivos de automação:

- `commitlint.config.js`
- `.husky/commit-msg`

Após instalar dependências, execute:

```bash
npm run prepare
```

## Versionamento Semântico

O projeto usa `standard-version` para:

- versionar `package.json`
- gerar `CHANGELOG.md`
- criar tags semânticas como `v0.1.0`

Comandos:

```bash
npm run release:first
npm run release
```

## Git Flow

Branches oficiais:

- `main`: produção
- `develop`: integração
- `feature/*`: novas funcionalidades
- `hotfix/*`: correções urgentes
- `release/*`: preparação de versão

## CI/CD

Workflow: `.github/workflows/ci.yml`

Etapas executadas:

1. Instala dependências do repositório
2. Instala dependências do backend
3. Executa lint
4. Executa build
5. Executa testes unitários
6. Executa testes de integração
7. Gera cobertura
8. Executa análise no SonarCloud quando `SONAR_TOKEN` está configurado

A pipeline está fixada em Node 22.

## SonarCloud

Arquivo base: `sonar-project.properties`

Configurar no GitHub:

- Secret `SONAR_TOKEN`
