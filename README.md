# Show Up For Life

Show Up For Life is a planned responsive web application that helps people turn good intentions into safe, realistic in-person gatherings. The product requirements live in [`design.md`](design.md), which is the authoritative product specification.

## Current status

This repository is intentionally **workspace-only** right now. It contains development guardrails, documentation, validation tooling, and CI/CD scaffolding. It does not yet contain the application, and no cloud or email resources have been provisioned by this workspace setup.

The planned implementation direction is a TypeScript modular monolith using Next.js/React, Node, PostgreSQL, npm, DigitalOcean App Platform, and Mailgun for transactional email. Those are planning constraints, not deployed resources.

## Local requirements

- Node.js matching `.nvmrc` for future application work
- Python matching `.python-version` for workspace validation hooks
- npm (bundled with Node)
- Docker is available for optional future container work, but is not required for the current workspace checks

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
