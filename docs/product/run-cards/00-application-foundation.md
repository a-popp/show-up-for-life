# Phase 00 — Application foundation

> **Status:** Implemented and verified locally and in GitHub CI<br>
> **Depends on:** None<br>
> **Release significance:** Development foundation only; not user-facing

This run card is an execution contract for one phase. Do not start implementation until the outstanding questions are resolved, explicitly deferred, or converted into approved assumptions. `../../../design.md` is authoritative for product behavior.

## Purpose

Create a production-shaped application skeleton that can support the product without locking in shortcuts. This phase establishes the TypeScript/Next.js modular monolith, PostgreSQL migration path, authentication integration points, testing harness, CI activation, and database-backed job/outbox primitives.

## Requirement trace

- Task 9 — Security & Compliance baseline
- Task 10 — Architecture & Data portability/modular monolith
- Task 13 — Testing & Quality harness
- Task 14 — Documentation & Delivery

Use `/trace-requirements` before implementation and map concrete tickets/commits back to these requirements.

## Functionality included

- Strict TypeScript Next.js application scaffold using npm
- Base app layout, error/loading boundaries, security headers, and accessible navigation shell
- Drizzle ORM, migration tooling, and initial database configuration
- Better Auth integration skeleton without production secrets
- Configuration validation for required environment variables using non-secret examples
- Feature/configuration mechanism for bracketed design values
- Structured server-side logging and health endpoint
- Database-backed job/outbox primitives suitable for later workers
- Unit, integration, component, and E2E test scaffolding
- Node lint/typecheck/test/build jobs enabled in CI

## Explicitly out of scope or deferred

- Product workflows beyond a minimal health/demo route
- Real authentication rollout or user-visible account behavior
- Cloud provisioning, production deployment, or real email
- Exact-address geocoding or external service integration

## Implementation notes for the agent

- Keep domain logic outside React components and route handlers from the beginning.
- Prefer server-side module boundaries matching identity, events, relationships, preferences, notifications, safety, privacy, analytics, and operations.
- Use strict TypeScript settings and avoid permissive any types except isolated integration boundaries.
- Do not commit generated secrets; document manual local secret generation instead.

## Data and model changes

- Initial migration metadata/schema tables required by Drizzle/Better Auth.
- No product-sensitive user data should exist in this phase.

## Infrastructure additions or changes

- Add root application package files and lockfile.
- Add local PostgreSQL development option, preferably Docker Compose if approved; alternatively document a user-managed local PostgreSQL instance.
- No DigitalOcean, Mailgun, hosted auth, analytics, Redis, or worker infrastructure.

## Test and verification gates

### Required automated checks

- npm lint, typecheck, unit tests, build
- Existing workspace validation, unit tests, secret scan, and pre-commit suite
- CI workflow executes the conditional Node job successfully

### Phase-specific acceptance checks

- Application boots locally against PostgreSQL using documented manual steps.
- Database migrations can be created and applied in a clean local database.
- Health endpoint returns an operational response.
- No secrets are required in source or committed examples.

Before completion, run `/verify` and the repository validation suite appropriate to the files changed.

## Manual steps for the user

- Install/select the approved Node.js version locally.
- Start Docker Desktop/the Docker daemon; Docker Compose is the standard local PostgreSQL path.
- Create an untracked `.env.local`, set a local `POSTGRES_PASSWORD`, generate a high-entropy `BETTER_AUTH_SECRET` of at least 32 characters, and construct the matching credentialed local `DATABASE_URL`.
- Run `npm run db:up`, `npm run db:migrate`, `npm run dev`, and optionally `npm run worker`.

## Implementation decisions and remaining checks

Resolved during implementation planning:

1. Docker Compose is the standard local PostgreSQL path.
2. Initial dependency versions were selected after age/security review and are recorded in `package.json`.
3. The worker is a separate entrypoint inside the same application/deployable.
4. Node.js 26 LTS is the current application runtime, with `.nvmrc`, package engines, and type definitions kept major-version aligned.
5. PostgreSQL 18 remains the intentional local/CI database major because it is the newest version currently supported for new DigitalOcean managed PostgreSQL clusters. PostgreSQL 19 adoption requires architecture review and DigitalOcean support.
6. GitHub Actions has been observed green after the first approved push.

Remaining environment checks:

1. Each new development machine must create `.env.local` manually; no auth/database secret is committed.

## Completion criteria

A future agent can implement product modules without redesigning the application shell. CI is green including the newly enabled Node checks. A clean local setup can be reproduced from documentation without any committed secret.

## Safety, privacy, and cost boundaries

- Never commit secrets or real dotenv files.
- Do not provision or mutate DigitalOcean/Mailgun resources, send real email, push, or perform destructive actions without explicit approval.
- Preserve privacy-by-default, nonjudgmental copy, and least-privilege access.
- Prefer simple PostgreSQL-backed implementation over additional paid services.
