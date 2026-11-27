# CI/CD overview

CI/CD is scaffolded for low cost and immediate workspace validation. Nothing deploys automatically from these workflows.

## Workflows

| Workflow | Trigger | Purpose | Cost controls |
| --- | --- | --- | --- |
| `.github/workflows/ci.yml` | Push to `main`, pull request, manual dispatch | Workspace validation, pre-commit, tests, secret scan, Node lint/typecheck/unit/integration/build/E2E/audit checks, PR dependency review | Single Node version, concurrency cancellation, no matrix |
| `.github/workflows/deploy-preflight.yml` | Manual dispatch only | Validates deployment documentation/scaffolding and prints manual runbook reminders | No deployment, no cloud mutation, no scheduled runs |

## Current limitations

- GitHub Actions cannot be observed until the repository is pushed.
- The Node application job is active; it uses a disposable PostgreSQL 18 service and an ephemeral test-only auth secret generated inside the job.
- Dependency review runs only for pull requests and does not currently gate direct pushes to `main`.
- DigitalOcean App Platform auto-deploy, when configured later, may not wait for GitHub Actions checks. Before production/public reliance, use protected branches/pull-request checks or reconsider an Actions-controlled deployment gate.

## Activation steps after pushing

1. Confirm the workflows appear under GitHub Actions.
2. Run `CI` manually once with workflow dispatch.
3. Inspect the workspace, secret-scan, and dependency-review jobs.
4. Resolve any GitHub-hosted runner differences, especially Windows/Linux path or pre-commit environment assumptions.
5. Before public visibility or production deployment, complete `../security/github-hardening.md`.

## Cost rules

- No build matrix unless a concrete compatibility requirement appears.
- No per-pull-request preview apps initially.
- Keep dependency update open-PR limits low.
- Do not add scheduled scans that duplicate branch/PR checks unless there is a clear need.
