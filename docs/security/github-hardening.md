# GitHub hardening checklist

The repository is public. Treat every commit, issue, pull request, workflow log, wiki page, and release as public-facing.

## Current public-repository posture

Public repositories can use GitHub-native secret scanning, push protection, dependency review, and code scanning without GitHub Advanced Security. Because the visibility transition is recent, manually confirm which settings are enabled rather than assuming they are active. Local pre-commit scanning and CI gitleaks remain defense-in-depth even when GitHub-native controls are enabled.

The dependency-review action should now be available because the repository is public. If it still fails with `Forbidden`, inspect dependency-graph/security settings and the action error before merging further dependency changes. `npm audit` remains a local/CI vulnerability gate, but it is not a complete substitute for introduced-dependency and license review.

## Public-repository hardening checklist

- [ ] Scan full git history with the custom scanner and gitleaks.
- [ ] Rotate/revoke any credential that may ever have been exposed before cleaning history.
- [ ] Confirm free public-repository secret scanning and push protection are enabled where available.
- [ ] Confirm Dependabot alerts and security updates are enabled.
- [ ] Enable private vulnerability reporting.
- [ ] Transition from direct-to-main development to protected main/rulesets requiring checks.
- [ ] Require pull-request review or at least required status checks before merge.
- [ ] Review issues, pull requests, wiki content, releases, and workflow logs for sensitive data.
- [ ] Confirm `LICENSE`, `SECURITY.md`, and public-facing documentation are accurate.
- [ ] Confirm no secrets, personal data, private hostnames, or private operational details exist in history.

## Actions hardening

- Keep top-level workflow permissions least-privilege, normally `contents: read`.
- Pin third-party and GitHub actions to full commit SHAs and update them deliberately.
- Use Dependabot cooldowns for routine version updates; do not intentionally delay security updates.
- Do not merge dependency updates that violate runtime, type-definition, database, or deployment-platform alignment.
- Never use `pull_request_target` for untrusted code execution.
- Do not print secrets or environment dumps in workflow logs.
- Use environments with approval rules before any production deployment.
- Create a least-privilege DigitalOcean token only when deployment is approved; store it in GitHub secrets rather than the repository.
- Keep deployment manual or gated until branch protections/checks are reliable.

## Static application security testing

No active CodeQL workflow is included yet. Feature availability is no longer the blocker because the repository is public; this is deferred implementation work, not a permanent omission. Add a minimal JavaScript/TypeScript SAST workflow such as CodeQL or Semgrep, pinned to full SHAs where applicable and scoped to relevant paths, before public beta reliance. Do not make the beta public without reviewing the resulting high/critical findings.

## Repository deletion and destructive actions

Do not delete the repository, rewrite public history, force-push, or mutate security settings through automation without explicit human approval. Rotation of exposed credentials always comes before cleanup.
