# CI/CD overview

CI/CD is scaffolded for low cost and immediate workspace validation. Nothing deploys automatically from these workflows.

## Workflows

| Workflow | Trigger | Purpose | Cost controls |
| --- | --- | --- | --- |
| `.github/workflows/ci.yml` | Push to `main`, pull request, manual dispatch | Workspace validation, pre-commit, tests, secret scan, Node lint/typecheck/unit/integration/build/E2E/audit checks, PR dependency review | Single Node version, concurrency cancellation, no matrix |
| `.github/workflows/deploy-preflight.yml` | Manual dispatch only | Validates deployment documentation/scaffolding and prints manual runbook reminders | No deployment, no cloud mutation, no scheduled runs |

## Current status and limitations

- The Node application job is active and uses a disposable PostgreSQL 18 service plus an ephemeral test-only auth secret generated inside the job. Check GitHub Actions for the current branch/PR status rather than treating historical verification as current.
- Dependency review runs only for pull requests and does not currently gate direct pushes to `main`.
- DigitalOcean App Platform auto-deploy, when configured later, may not wait for GitHub Actions checks. Before production/public reliance, use protected branches/pull-request checks or reconsider an Actions-controlled deployment gate.

## Dependency updates

- Routine Dependabot version updates use a seven-day cooldown; security updates are not intentionally delayed.
- React/React DOM and Next.js/`eslint-config-next` updates are grouped for both version and security updates because those packages are tightly coupled.
- `react` and `react-dom` must remain on the same exact version; workspace validation checks this before the slower Node install/test jobs.
- ESLint 10 is retained with the official `@eslint/compat` rule wrapper because some transitive `eslint-config-next` plugins do not yet declare native ESLint 10 support. Reassess that shim when those plugins publish supported releases.
- Runtime-sensitive updates must preserve the validated alignment among `.nvmrc`, package engines, `@types/node`, local PostgreSQL, and CI PostgreSQL.
- PostgreSQL remains at major version 18 until DigitalOcean managed PostgreSQL support and the production architecture deliberately change.

## Activation steps after pushing

1. Confirm the workflows appear under GitHub Actions.
2. Run `CI` manually once with workflow dispatch.
3. Inspect the workspace, secret-scan, and dependency-review jobs.
4. Resolve any GitHub-hosted runner differences, especially Windows/Linux path or pre-commit environment assumptions.
5. Before production deployment or public-beta reliance, complete `../security/github-hardening.md`.

## Cost rules

- No build matrix unless a concrete compatibility requirement appears.
- No per-pull-request preview apps initially.
- Keep dependency update open-PR limits low.
- Do not add scheduled scans that duplicate branch/PR checks unless there is a clear need.
