# Phase 04 — Preferences, eligibility, and notification delivery

> **Status:** Not started<br>
> **Depends on:** Phase 03<br>
> **Release significance:** Private alpha hardening; required before broader invitations

This run card is an execution contract for one phase. Do not start implementation until the outstanding questions are resolved, explicitly deferred, or converted into approved assumptions. `../../../design.md` is authoritative for product behavior.

## Purpose

Ensure invitations are relevant, wanted, and explainable. User preferences are first-class constraints on discovery and notification, while critical safety/lifecycle notices remain distinct from optional reminders.

## Requirement trace

- Section 3.8 — customized filters and criteria
- Section 3.9 — event criteria, eligibility, and disinterest signals
- Section 3.11 — timely privacy-protective notifications and reminder preferences
- Task 5 — privacy-protective communication

Use `/trace-requirements` before implementation and map concrete tickets/commits back to these requirements.

## Functionality included

- Per-event-type preferences and criteria models
- Reusable filter/criteria presets
- Eligibility evaluation combining user criteria, host criteria, relationship, blocks, and basic event constraints
- Plain-language explanation of invitation eligibility/non-eligibility where safe
- Notification preferences by event type
- Critical versus optional notification categories
- In-app notification center
- Email template/rendering abstraction and local/test delivery
- Outbox idempotency, retry, and delivery records

## Explicitly out of scope or deferred

- SMS or push notifications
- Behavioral targeting, advertising email, or tracking pixels
- Production Mailgun provisioning or sending
- Complex digest experimentation unless approved

## Implementation notes for the agent

- Eligibility must be deterministic and inspectable.
- Do not leak hidden preferences or criteria in explanations.
- Automatic cancellation and safety notices are transactional; optional reminders can be disabled.
- Use provider-neutral email interfaces so Mailgun remains replaceable.

## Data and model changes

- event/filter criteria rules
- filter presets
- notification preferences
- notification outbox/deliveries
- eligibility explanation metadata
- suppression/unsubscribe state where legally/technically appropriate

## Infrastructure additions or changes

- Add Mailgun provider adapter interface and test/local implementations.
- Add placeholders/documentation for future Mailgun environment variables without values.
- No Mailgun resource mutation or real email.

## Test and verification gates

### Required automated checks

- Unit tests for eligibility rule combinations and explanations
- Integration tests for notification preference enforcement
- Outbox retry/idempotency tests
- Template snapshot/accessibility checks
- Security checks that preference data is not leaked to other users

### Phase-specific acceptance checks

- A user outside their own selected criteria does not receive the corresponding invitation.
- A user can control optional reminders without disabling critical transactional safety notices.
- Email rendering can be tested locally without a real provider.

Before completion, run `/verify` and the repository validation suite appropriate to the files changed.

## Manual steps for the user

- Review notification copy, critical-notice policy, and eligibility explanation wording.
- Later approve any Mailgun domain/API-key setup explicitly before production delivery.

## Outstanding questions before implementation

1. Should quiet hours and/or digest batching be included in this phase or deferred to wellbeing hardening?
2. What notification categories are truly critical and therefore non-optional?
3. What sender identity/domain naming should be planned for email templates?

## Completion criteria

Event distribution is constrained by user intent rather than only host intent. Notification infrastructure is reliable, testable, and provider-isolated.

## Safety, privacy, and cost boundaries

- Never commit secrets or real dotenv files.
- Do not provision or mutate DigitalOcean/Mailgun resources, send real email, push, or perform destructive actions without explicit approval.
- Preserve privacy-by-default, nonjudgmental copy, and least-privilege access.
- Prefer simple PostgreSQL-backed implementation over additional paid services.
