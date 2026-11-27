# Phase 12 — Public-beta readiness, deployment, and operations

> **Status:** Not started<br>
> **Depends on:** Phases 00–10; Phase 11 optional<br>
> **Release significance:** Public beta gate

This run card is an execution contract for one phase. Do not start implementation until the outstanding questions are resolved, explicitly deferred, or converted into approved assumptions. `../../../design.md` is authoritative for product behavior.

## Purpose

Verify that the product is safe, operable, recoverable, affordable, and compliant enough for real public use. This phase is a gate, not merely a deployment task.

## Requirement trace

- Task 2 — adults-only operating model
- Task 5 — privacy rights and controls
- Task 9 — security/compliance baseline
- Task 10 — portability/backup/retention
- Task 13 — comprehensive quality
- Task 14 — delivery/deployment gate

Use `/trace-requirements` before implementation and map concrete tickets/commits back to these requirements.

## Functionality included

- End-to-end release checklist and go/no-go review
- Production deployment plan for DigitalOcean App Platform and managed PostgreSQL
- Worker/web process deployment decision
- Backup/restore verification
- Rollback and incident-response rehearsal
- Security headers, dependency scanning, static application security testing, auth/session review, rate-limit review
- Privacy export/delete validation
- Accessibility regression pass
- Operational dashboard/health/logging validation
- Cost review and shutdown/scale-down plan

## Explicitly out of scope or deferred

- Actual cloud/email provisioning without explicit user approval
- Public repository visibility change without user action/approval
- Real email sends before Mailgun approval/configuration
- Premature scaling or additional paid services

## Implementation notes for the agent

- Treat deployment as a manual approval gate with preflight verification.
- Use least-privilege secrets and provider configuration.
- Test restore procedures, not merely backup creation.
- Confirm no development/test users or seed data leak into production unintentionally.

## Data and model changes

- production migration plan
- backup/restore validation records
- retention/deletion validation evidence
- release decision record

## Infrastructure additions or changes

- Potentially first production DigitalOcean app, database, worker, and Mailgun configuration — only after explicit approval.
- Prefer the smallest viable managed database and app resources.
- No Redis/preview apps/CDN additions unless justified.

## Test and verification gates

### Required automated checks

- Full CI, workspace validation, secret scan, pre-commit, unit/integration/E2E suites
- Deployment preflight workflow/checks
- Backup/restore test evidence
- Security and accessibility regression checks

### Phase-specific acceptance checks

- A clean production-like environment can be migrated, booted, backed up, restored, and rolled back.
- All critical user flows pass E2E/accessibility/security checks.
- The operator consciously approves open risks and service-level targets.

Before completion, run `/verify` and the repository validation suite appropriate to the files changed.

## Manual steps for the user

- Approve provisioning and any cloud/email spend explicitly.
- Configure provider secrets using secure secret storage.
- Decide custom domain/service naming.
- Perform GitHub public-repository hardening before visibility changes.
- Run final go/no-go review.

## Outstanding questions before implementation

1. What are the concrete service-level targets currently placeholdered in Appendix B?
2. Should the worker run in the same container initially or as a separate low-cost worker?
3. What production domain/name and sender identity should be used?
4. What monthly cost ceiling triggers scale-down or shutdown review?

## Completion criteria

Public beta is either approved with documented residual risk or explicitly blocked with actionable gaps.

## Safety, privacy, and cost boundaries

- Never commit secrets or real dotenv files.
- Do not provision or mutate DigitalOcean/Mailgun resources, send real email, push, or perform destructive actions without explicit approval.
- Preserve privacy-by-default, nonjudgmental copy, and least-privilege access.
- Prefer simple PostgreSQL-backed implementation over additional paid services.
