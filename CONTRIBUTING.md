# Contributing

This is currently a solo-maintained hobby project. The repository is public, and much of it is developed through AI-agent-assisted workflows under human direction and review.

## Before making changes

1. Read `design.md` for product requirements and open decisions.
2. Use `/trace-requirements` in Devin before implementing product behavior.
3. Keep changes small, cost-conscious, privacy-protective, and accessible.
4. Do not commit secrets, local environment files, private keys, or certificates.

## Verification

Run the workspace checks before committing:

```bash
python scripts/check_workspace.py --ci
python scripts/check_secrets.py --all
python -m unittest discover -s tests -v
```

Also run the application lint, typecheck, test, and build commands listed in the README when changing application code or dependencies.

## Pull requests

Use short-lived branches and pull requests by default now that the repository is public. Before production deployment is enabled, protected main-branch checks must be configured as described in `docs/security/github-hardening.md`.
