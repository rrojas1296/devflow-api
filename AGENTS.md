# AGENTS.md — devflow-api

High-signal context for OpenCode working in this repo.

## Package manager
- **pnpm only** — pinned to `11.1.3` via `packageManager` field. Do not use npm/yarn.
- `pnpm install` to bootstrap.

## Dev server & dependencies
- **Postgres + Redis are required** at runtime.
- `pnpm run start:docker:dev` spins up `db` (postgres) and `redis` services via `compose.dev.yml` (API service is commented out; you run it locally).
- `pnpm run start:dev` runs NestJS in watch mode with `.env.development`.
- The real entrypoint is `src/main.ts`. API prefix is `/api`, default port `8000`.
- **CORS** is enabled for `CLIENT_URL` (default `http://localhost:5173`).

## Environment & config quirks
- `.env.development` is **committed to the repo** and is the canonical dev env file.
- `drizzle.config.ts` hardcodes `dotenv.config({ path: '.env.development' })` — it will ignore `.env`.
- `src/config/env.ts` uses simple manual defaults (no validation library). If a new env var is added, update both `.env.development` and `src/config/env.ts`.
- `storageSession.json` (Playwright LinkedIn session state) is in `.gitignore` but already tracked in the repo. If you need to regenerate it, run `npx tsx scripts/login.ts` and manually log in via the opened browser window.

## Database & ORM
- **Primary ORM**: Drizzle ORM (`drizzle-orm`) with `pg` Pool.
- **Secondary query builder**: Knex (global module, token `KNEX_SERVICE`).
- Schema lives in `src/infrastructure/database/drizzle/schemas/`.
- `drizzle-kit` is available for generating migrations (`drizzle-kit generate`), but **no migration scripts are defined in `package.json`**. Apply migrations manually or add scripts as needed.
- Migrations and snapshots are stored in `drizzle/`.

## Architecture

NestJS application following **Clean Architecture** / **Hexagonal Architecture** conventions with explicit layering inside each feature module.

### Layer responsibilities

| Layer | Directory | Responsibility |
|-------|-----------|----------------|
| **Domain** | `domain/` | Entities (interfaces), ports (repository contracts), enums, injection tokens. No framework imports except basic types. |
| **Application** | `application/` | Use-cases (orchestrate domain objects), DTOs/inputs, mappers, utilities. Depends only on domain layer ports. |
| **Infrastructure** | `infrastructure/` | Repository implementations, external service clients, queue processors, ORM mappers. Adapts domain ports to concrete technologies. |
| **Presentation** | `presentation/` | Controllers, route DTOs, HTTP formatting. Thin layer — delegates all logic to application use-cases. |

### Feature module structure

Each feature lives under `src/modules/<feature>/` and follows the same four-layer layout:

```
modules/
├── jobs/
│   ├── domain/
│   │   ├── entities/job.entity.ts
│   │   ├── ports/jobs-repository.port.ts
│   │   ├── enums/modality.enum.ts
│   │   └── tokens/jobs.tokens.ts         # JOBS_REPOSITORY = 'IJobsRepository'
│   ├── application/
│   │   ├── use-cases/get-jobs.use-case.ts
│   │   ├── use-cases/create-job.use-case.ts
│   │   └── ...
│   ├── infrastructure/
│   │   ├── jobs.repository.ts            # implements IJobsRepository
│   │   └── mappers/job.mapper.ts         # Drizzle <-> Domain mapper
│   └── presentation/
│       ├── jobs.controller.ts
│       └── dtos/create-job.dto.ts
├── companies/                            # same 4-layer layout
└── scraper/
    ├── domain/
    │   ├── ports/scraper-source.port.ts
    │   ├── ports/scraper-producer.port.ts
    │   └── tokens/scraper.tokens.ts      # SCRAPER_PRODUCER, SCRAPER_SOURCES
    ├── application/
    │   └── use-cases/...
    ├── infrastructure/
    │   ├── queue/
    │   │   ├── scraper.producer.ts
    │   │   └── scraper.processor.ts      # BullMQ @Processor
    │   └── sources/
    │       └── linkedin.source.ts        # Playwright scraper
    └── presentation/
        └── scraper.controller.ts
```

### Dependency injection & tokens

All external boundaries are injected via **custom tokens** (no concrete classes injected directly):

| Token | Type | Consumers |
|-------|------|-----------|
| `JOBS_REPOSITORY` | `IJobsRepository` | Jobs use-cases |
| `COMPANIES_REPOSITORY` | `ICompaniesRepository` | Companies use-cases, scraper |
| `DRIZZLE_TOKEN` | `DrizzleDB` | Repositories |
| `KNEX_SERVICE` | `KnexService` | Repositories (global module) |
| `SCRAPER_PRODUCER` | `IScraperProducer` | Scraper use-cases |
| `SCRAPER_SOURCES` | `IScraperSource[]` | Scraper source use-case (factory provider) |

Modules declare providers explicitly and export only the use-cases other modules need.

### Data flow

```
HTTP Request
    |
    v
Presentation Controller  ──>  Application Use-Case  ──>  Domain Port (interface)
    |                              |                           |
    |                              |                           v
    |                              |                    Infrastructure Repository
    |                              |                           |
    |                              |                           v
    |                              |<── Drizzle ORM / Knex ──> Postgres
    |                              |
    |<────── domain entity ────────|
    |
    v
HTTP Response
```

Rules:
- Controllers **never** call repositories or ORM directly.
- Use-cases **only** depend on domain ports (interfaces), never on infrastructure classes.
- Repositories return **domain entities**, not raw ORM rows. Mappers handle the conversion.
- For complex relational/filtered queries, repositories may use **Knex** directly while simple CRUD uses **Drizzle ORM**.

### Module dependency graph

```
AppModule
├── JobsModule
│   ├── DrizzleModule
│   └── QueueModule
├── CompaniesModule
│   └── DrizzleModule
├── ScraperModule
│   ├── JobsModule         (exports GetJobsByIdUseCase, BulkJobsUseCase)
│   ├── CompaniesModule    (exports GetCompaniesByNamesUseCase, BulkCompaniesUseCase, GetCompaniesUseCase)
│   ├── CloudinaryModule
│   └── BullModule.registerQueue(SCRAPER_QUEUE)
├── KnexModule             (global)
├── CloudinaryModule
└── ScheduleModule
```

### Cross-cutting infrastructure modules

| Module | Path | Role |
|--------|------|------|
| `DrizzleModule` | `src/infrastructure/database/drizzle/` | Provides `DRIZZLE_TOKEN` via `pg` Pool. Schema lives in `drizzle/schemas/`. |
| `KnexModule` | `src/infrastructure/database/knex/` | **Global** module providing `KNEX_SERVICE`. Used for raw SQL / complex joins. |
| `QueueModule` | `src/infrastructure/bullmq/` | Configures BullMQ root connection to Redis. |
| `CloudinaryModule` | `src/infrastructure/cloudinary/` | Image upload service. |

## Queue & background jobs
- BullMQ queue (`jobs-queue`) is used for scraping jobs.
- Queue processor is in `src/modules/scraper/infrastructure/queue/scraper.processor.ts`.
- Redis connection is configured in `src/infrastructure/bullmq/bullmq.module.ts` using env vars.

## Testing
- **Unit tests**: `pnpm test` (Jest, `ts-jest`, rootDir `src`, regex `.*\.spec\.ts$`).
- **E2E tests**: `pnpm test:e2e` (uses `test/jest-e2e.json`, rootDir `.`, regex `.e2e-spec.ts$`).
- **Coverage**: `pnpm test:cov`.
- E2E tests import `AppModule` from `../src/app.module`. Ensure services (Postgres/Redis) are running if e2e tests hit real infra.

## Lint & format
- `pnpm run lint` — ESLint with `typescript-eslint` recommended-type-checked. Many strict rules are **disabled** (`no-explicit-any`, `no-unsafe-call`, `no-floating-promises`, `no-unsafe-member-access`).
- `pnpm run format` — Prettier (`singleQuote: true`, `trailingComma: all`).
- Source type is `commonjs` in ESLint config despite `nodenext` in tsconfig.

## Build & deploy
- `pnpm run build` — NestJS CLI (`nest build`), deletes `dist/` first (`deleteOutDir: true`).
- `pnpm run start:prod` — runs `node dist/main`.
- `Dockerfile.dev` uses Node 24 + bullseye, enables corepack for pnpm, and installs Playwright deps.

## TypeScript quirks
- `tsconfig.json` uses `"module": "nodenext"` and `"moduleResolution": "nodenext"`.
- `strictNullChecks` is on, but `noImplicitAny` and `strictBindCallApply` are **off**.
- `tsconfig.build.json` excludes `test`, `dist`, and `**/*spec.ts`.

## Playwright / scraping
- LinkedIn scraping uses `playwright` with a `storageSession.json` for authenticated state.
- The scraper source (`LinkedinSource`) is injected via `SCRAPER_SOURCES` token in `ScraperModule`.
- If scraping fails, check that `storageSession.json` has a valid session and that the `userAgent` in `LinkedinSource` is up to date.

## Monorepo note
- `pnpm-workspace.yaml` exists only for `allowBuilds` config (disabling native builds for some packages). This is **not a monorepo** — all code lives in `src/`.

## Quick reference
```bash
pnpm install
pnpm run start:docker:dev   # postgres + redis
pnpm run start:dev          # API in watch mode
pnpm test                   # unit tests
pnpm test:e2e               # e2e tests
pnpm run build              # production build
pnpm run lint               # lint + auto-fix
pnpm run format             # prettier
```
