# Contributing

This is currently a solo-maintained hobby project, but the repository is structured so it can safely become public.

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

Once an application exists, also run its lint, test, and build commands.

## Pull requests

Direct-to-main development is acceptable during the initial private scaffolding phase. Before the repository becomes public or production deployment is enabled, transition to short-lived branches, pull requests, and protected main-branch checks as described in `docs/security/github-hardening.md`.
