# Gestor Acadêmico Backend

[![CI](https://github.com/<OWNER>/<REPO>/actions/workflows/ci.yml/badge.svg)](https://github.com/<OWNER>/<REPO>/actions/workflows/ci.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=<SONAR_PROJECT_KEY>&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=<SONAR_PROJECT_KEY>)

Backend NestJS do sistema de gestão acadêmica. O frontend Angular não existe neste repositório; a API HTTP e os contratos de integração estão preparados para consumo futuro por qualquer cliente web.

## Estrutura

```text
.
├── .github/workflows/ci.yml
├── .husky/commit-msg
├── CHANGELOG.md
├── commitlint.config.js
├── package.json
├── server/
│   ├── package.json
│   ├── src/
│   └── test/
└── sonar-project.properties
```

## Requisitos

- Node.js LTS
- npm
- PostgreSQL para uso completo da aplicação
- Redis opcional para cache distribuido

## Instalação

```bash
npm ci
npm ci --prefix server
```

## Execução

```bash
npm run build
npm --prefix server run start:dev
```

Variáveis relevantes:

- `DATABASE_URL`: conexão do Prisma.
- `NODE_ENV`: `development`, `test` ou `production`.
- `BUILD_DATE`: opcional. Se não for definida, o backend gera a data automaticamente no bootstrap do módulo de versão.
- `PORT`: porta HTTP do gateway.

## Endpoint de versão

Endpoint HTTP disponível em `GET /api/v1/version`.

Resposta esperada:

```json
{
  "version": "0.1.0",
  "environment": "development",
  "buildDate": "2026-01-01T00:00:00.000Z"
}
```

Origem dos dados:

- `version`: lida de `server/package.json`
- `environment`: lida de `NODE_ENV`
- `buildDate`: lida de `BUILD_DATE` ou gerada automaticamente

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

O ESLint da aplicação roda em `server/` e a pipeline falha caso lint, build, testes unitários, e2e ou coverage falhem.

## Conventional Commits e Husky

Commits devem seguir o padrão Conventional Commits, por exemplo:

```text
feat: adiciona endpoint de versão
fix: corrige serialização do build date
chore: atualiza pipeline de ci
```

Arquivos de automação:

- `commitlint.config.js`
- `.husky/commit-msg`

Após instalar dependências, execute:

```bash
npm run prepare
```

O hook `commit-msg` bloqueia commits inválidos com `commitlint`.

## Versionamento Semântico

Foi adotado `standard-version` por ser uma solução estável e pragmática para um backend NestJS que não precisa publicar pacote no npm, mas precisa:

- versionar `package.json`
- gerar `CHANGELOG.md`
- criar tags semânticas como `v0.1.0`

Comandos:

```bash
npm run release:first
npm run release
```

Fluxo recomendado:

1. Faça merge de commits válidos em `develop`.
2. Crie `release/*` a partir de `develop`.
3. Execute `npm run release` na branch de release.
4. Valide pipeline e merge em `main`.
5. Publique a tag criada.

## Git Flow

Branches oficiais:

- `main`: produção
- `develop`: integração contínua
- `feature/*`: novas funcionalidades
- `hotfix/*`: correções urgentes saindo de `main`
- `release/*`: preparação de versão

Fluxo resumido:

1. `feature/*` nasce de `develop` e retorna para `develop`.
2. `release/*` nasce de `develop`, recebe ajustes finais e volta para `main` e `develop`.
3. `hotfix/*` nasce de `main`, corrige produção e volta para `main` e `develop`.

## CI/CD com GitHub Actions

Workflow: `.github/workflows/ci.yml`

Etapas executadas:

1. Install
2. Lint
3. Build
4. Unit Tests
5. Integration Tests
6. Coverage
7. SonarCloud Analysis

O workflow usa Node LTS com cache de dependências e aguarda o Quality Gate do SonarCloud.

## SonarCloud

Arquivo base: `sonar-project.properties`

Configurar no GitHub:

- Secret `SONAR_TOKEN`

Substituir placeholders:

- `your-sonarcloud-org`
- `your-sonarcloud-org_gestor-academico`
- `<SONAR_PROJECT_KEY>` no badge do README
- `<OWNER>` e `<REPO>` no badge do GitHub Actions

Meta esperada:

- Coverage on New Code `>= 70%`
- Quality Gate `PASSED`

## Frontend

Não existe frontend Angular neste repositório. O backend ficou preparado para integração via endpoint versionado, documentação da API e pipeline de qualidade.
