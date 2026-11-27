# Phase 08 — Trust, safety, and moderation workflows

> **Status:** Not started<br>
> **Depends on:** Phases 02–07 as applicable<br>
> **Release significance:** Required before public beta

This run card is an execution contract for one phase. Do not start implementation until the outstanding questions are resolved, explicitly deferred, or converted into approved assumptions. `../../../design.md` is authoritative for product behavior.

## Purpose

Operationalize user protection. Blocking and reporting must work across the product, first-time in-person meetings receive safer defaults, and trusted-contact sharing supports user-directed safety without surveillance.

## Requirement trace

- Section 3.12 — share plan with trusted contact
- Task 4 — age assurance, blocking/reporting/exit, scams/impersonation/harassment, first-time meeting safety
- Priority order — trust/safety outranks convenience and growth

Use `/trace-requirements` before implementation and map concrete tickets/commits back to these requirements.

## Functionality included

- Complete block/report/exit interaction flows across relevant surfaces
- Safety report taxonomy and evidence/context capture
- Moderation queue and audit trail for the solo operator
- Rapid-review timestamps and escalation-state tracking
- Anti-impersonation, scam, and harassment rate limits/abuse controls
- User-initiated trusted-contact plan sharing
- First-time-meeting safe defaults and plain-language warnings
- Public/group venue default guidance
- Account suspension/restriction primitives for safety review

## Explicitly out of scope or deferred

- Third-party identity verification
- Automated AI moderation
- Covert user surveillance or passive tracking
- Law-enforcement automation beyond documented manual escalation

## Implementation notes for the agent

- Reports and blocks must never expose the reporter/blocker unnecessarily.
- Trusted-contact sharing should be user initiated and avoid covert tracking.
- Moderation actions need audit records because the operator is also the developer.
- Rate limits should be conservative and tunable.

## Data and model changes

- safety reports
- report events/evidence metadata
- moderation actions
- account restrictions
- trusted-contact shares
- abuse/rate-limit counters or audit events

## Infrastructure additions or changes

- No new third-party service.
- May require a minimal admin/moderation interface protected by strong authentication.

## Test and verification gates

### Required automated checks

- Cross-module block enforcement regression suite
- Report creation/moderation authorization tests
- Rate-limit and abuse-control tests
- Trusted-contact sharing permission/expiry tests
- Security review of moderator-only endpoints

### Phase-specific acceptance checks

- A user can block/report and leave an interaction without retaliation pathways exposed by the UI.
- The operator can review reports with timestamps, context, and auditable actions.
- Trusted-contact sharing shares only the intended plan information.

Before completion, run `/verify` and the repository validation suite appropriate to the files changed.

## Manual steps for the user

- Draft/approve safety review and escalation procedures.
- Configure the initial moderator/admin account using strong MFA.
- Review report categories and user-facing safety resources.

## Outstanding questions before implementation

1. Should trusted-contact sharing use email, expiring authenticated links, copy-to-share text, or a combination?
2. What report evidence retention period is appropriate?
3. What escalation circumstances require external emergency/resource guidance versus in-product moderation only?

## Completion criteria

The application is not merely feature-complete but operationally safer for real interpersonal use.

## Safety, privacy, and cost boundaries

- Never commit secrets or real dotenv files.
- Do not provision or mutate DigitalOcean/Mailgun resources, send real email, push, or perform destructive actions without explicit approval.
- Preserve privacy-by-default, nonjudgmental copy, and least-privilege access.
- Prefer simple PostgreSQL-backed implementation over additional paid services.
