# GitHub hardening checklist

The repository is private initially but is intended to become public. Treat every commit as public-ready.

## Current private-repository posture

GitHub-native secret scanning and push protection may require paid GitHub Secret Protection for private repositories. Therefore local pre-commit scanning and CI gitleaks are the primary secret-scanning controls right now. Do not assume GitHub will block a secret push while the repository is private.

## Before making the repository public

- [ ] Scan full git history with the custom scanner and gitleaks.
- [ ] Rotate/revoke any credential that may ever have been exposed before cleaning history.
- [ ] Enable free public-repository secret scanning and push protection where available.
- [ ] Enable Dependabot alerts and security updates.
- [ ] Enable private vulnerability reporting.
- [ ] Transition from direct-to-main development to protected main/rulesets requiring checks.
- [ ] Require pull-request review or at least required status checks before merge.
- [ ] Review issues, pull requests, wiki content, releases, and workflow logs for sensitive data.
- [ ] Confirm `LICENSE`, `SECURITY.md`, and public-facing documentation are accurate.
- [ ] Confirm no secrets, personal data, private hostnames, or private operational details exist in history.

## Actions hardening

- Keep top-level workflow permissions least-privilege, normally `contents: read`.
- Pin third-party and GitHub actions to full commit SHAs and update them deliberately.
- Never use `pull_request_target` for untrusted code execution.
- Do not print secrets or environment dumps in workflow logs.
- Use environments with approval rules before any production deployment.
- Create a least-privilege DigitalOcean token only when deployment is approved; store it in GitHub secrets rather than the repository.
- Keep deployment manual or gated until branch protections/checks are reliable.

## Optional CodeQL

No active CodeQL workflow is included yet because there is no application code and private-repository GitHub code security features may require a paid plan. When the repository becomes public, or if the maintainer chooses a paid feature, add a minimal CodeQL workflow for JavaScript/TypeScript, pinned to full SHAs and scoped to relevant paths.

## Repository deletion and destructive actions

Do not delete the repository, rewrite public history, force-push, or mutate security settings through automation without explicit human approval. Rotation of exposed credentials always comes before cleanup.
