# Show Up For Life

Show Up For Life is a planned responsive web application that helps people turn good intentions into safe, realistic in-person gatherings. The product requirements live in [`design.md`](design.md), which is the authoritative product specification.

## Current status

This repository now contains the **Phase 00 application foundation**: a strict TypeScript/Next.js shell, PostgreSQL/Drizzle foundation, Better Auth integration skeleton, database-backed job/outbox primitives, and test/CI harnesses. It does not yet contain user-facing account, event, matching, notification, or social product behavior. No cloud or email resources have been provisioned.

The implementation direction is a TypeScript modular monolith using Next.js/React, Node, PostgreSQL, npm, DigitalOcean App Platform, and Mailgun for transactional email. DigitalOcean and Mailgun remain planning constraints, not deployed resources.

## Local requirements

- Node.js matching `.nvmrc` for future application work
- Python matching `.python-version` for workspace validation hooks
- npm (bundled with Node)
- Docker Desktop/Compose for the standard local PostgreSQL service

## Application setup

1. Copy `.env.example` to `.env.local` manually. Never commit `.env.local`.
2. In `.env.local`, set a locally generated `POSTGRES_PASSWORD` and a high-entropy `BETTER_AUTH_SECRET` of at least 32 characters. Set `DATABASE_URL` to the matching local PostgreSQL connection string, including the local password in the connection string's user-info portion.
3. Install dependencies:

   ```bash
   npm ci
   ```

4. Start local PostgreSQL:

   ```bash
   npm run db:up
   ```

   Use `npm run db:ps` to inspect container status and `npm run db:logs` to inspect PostgreSQL logs.

5. Apply migrations:

   ```bash
   npm run db:migrate
   ```

6. Start the web application and, when needed, the worker in separate terminals:

   ```bash
   npm run dev
   npm run worker
   ```

   For a diagnostic single polling batch that exits afterward, use `npm run worker -- --once`.

Useful checks:

```bash
npm run lint
npm run typecheck
npm run format:check
npm test
npm run test:integration
npm run test:e2e
npm run build
```

Playwright browser installation may be required before the first E2E run:

```bash
npx playwright install chromium
```

## Workspace verification

After setting up the project-local tooling environment:

```bash
python -m venv .venv-tools
.venv-tools/Scripts/python -m pip install -r requirements-dev.txt  # Windows
# .venv-tools/bin/python -m pip install -r requirements-dev.txt   # Linux/macOS
.venv-tools/Scripts/pre-commit install
.venv-tools/Scripts/pre-commit run --all-files
python scripts/check_workspace.py --ci
python scripts/check_secrets.py --all
python -m unittest discover -s tests -v
```

On Linux/macOS, use `.venv-tools/bin/pre-commit` instead of `.venv-tools/Scripts/pre-commit`.

## Secret-handling rules

- Never commit real `.env` files, tokens, private keys, certificates, passwords, or connection strings.
- Use `.env.example` only for blank placeholders.
- Do not paste secrets into chat, issues, pull requests, workflow files, or shell commands.
- If a secret may have leaked, rotate/revoke it first, then clean the repository history as needed. Deleting the file alone is not sufficient.

See [`docs/security/secrets.md`](docs/security/secrets.md) for the full policy.

## Important boundaries

- Do not provision DigitalOcean or Mailgun resources without explicit approval.
- Do not send real email during development; use Mailgun test mode and local inspection first.
- Treat availability, location, relationship, safety, and behavioral data as sensitive.
- Follow the product framing in `design.md`: no shaming, surveillance, dark patterns, or sensitive inferences.

## Key documentation

- Product requirements: [`design.md`](design.md)
- Open product decisions: [`docs/product/open-decisions.md`](docs/product/open-decisions.md)
- Target architecture: [`docs/architecture/target-architecture.md`](docs/architecture/target-architecture.md)
- CI/CD overview: [`docs/ci-cd/overview.md`](docs/ci-cd/overview.md)
- Future App Platform runbook: [`docs/ci-cd/app-platform.md`](docs/ci-cd/app-platform.md)
- GitHub hardening checklist: [`docs/security/github-hardening.md`](docs/security/github-hardening.md)
- Devin subagent guidance: [`docs/devin/subagents.md`](docs/devin/subagents.md)
