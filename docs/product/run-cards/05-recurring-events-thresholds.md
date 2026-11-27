# Phase 05 — Recurring events and minimum thresholds

> **Status:** Not started<br>
> **Depends on:** Phase 04<br>
> **Release significance:** Private beta capability

This run card is an execution contract for one phase. Do not start implementation until the outstanding questions are resolved, explicitly deferred, or converted into approved assumptions. `../../../design.md` is authoritative for product behavior.

## Purpose

Support durable communities and low-turnout resilience through recurring gatherings and optional minimum thresholds. This phase contains some of the highest-risk time and state-transition logic in the product.

## Requirement trace

- Section 3.4 — recurring events and series-level commitment
- Section 3.6 — minimum-attendance thresholds
- Confirmed decision — host counts toward minimum
- Confirmed decision — confirmed events return to pending if attendance drops before deadline

Use `/trace-requirements` before implementation and map concrete tickets/commits back to these requirements.

## Functionality included

- Recurrence rules and occurrence materialization
- Series-level membership/commitment model
- Occurrence-level RSVP overrides
- Skip/cancel one occurrence without leaving series
- Per-occurrence cutoff and cancellation behavior
- Optional minimum-attendance thresholds
- Transparent host-inclusive committed count
- Pending/confirmed/pending threshold transitions before deadline
- Automatic neutral cancellation for unmet threshold at deadline
- Host ability to lower but never raise threshold after commitment

## Explicitly out of scope or deferred

- Complex calendar synchronization/export unless separately approved
- Reliability penalties or public attendance scoring
- Automatic cancellation after a successful threshold deadline
- Custom threshold semantics for short-lead events beyond normal validation

## Implementation notes for the agent

- Store instants in UTC plus explicit event time zone.
- Materialize occurrences conservatively; avoid unbounded generation.
- Treat threshold state transitions as transactional domain logic.
- Use neutral language for automatic cancellation; no blame or penalty.

## Data and model changes

- event series
- recurrence rules
- materialized occurrences
- series memberships/commitments
- threshold configuration/status
- occurrence cancellation/status history
- notification jobs for deadlines

## Infrastructure additions or changes

- Reliable database-backed worker execution becomes required.
- Initially the worker may run in the same container/process for cost control, but code must support splitting it later.
- No Redis or cloud scheduler required.

## Test and verification gates

### Required automated checks

- Property/unit tests for recurrence across DST and month boundaries
- Threshold transition tests including host-count and regression behavior
- Deadline/job idempotency tests
- Integration tests for series commitment plus occurrence override
- E2E recurring event threshold cancellation flow

### Phase-specific acceptance checks

- A recurring series can generate correct occurrences across DST transitions.
- A threshold event becomes confirmed when the host-inclusive minimum is met and returns to pending only before the deadline if it drops below minimum.
- An unmet threshold at deadline produces one neutral cancellation notification path, not duplicates.

Before completion, run `/verify` and the repository validation suite appropriate to the files changed.

## Manual steps for the user

- Review recurrence limits, cancellation copy, and threshold explanation copy.
- Decide acceptable recurrence horizon/materialization window.

## Outstanding questions before implementation

1. What maximum recurrence horizon and occurrence-generation window should be enforced?
2. What recurrence patterns are required initially: weekly/monthly only, or full RRULE complexity?
3. How should hosts edit a series after users have committed to future occurrences?

## Completion criteria

Recurring communities can coordinate without manual event duplication. Threshold behavior exactly matches the confirmed product decisions and is robust under concurrent RSVP changes.

## Safety, privacy, and cost boundaries

- Never commit secrets or real dotenv files.
- Do not provision or mutate DigitalOcean/Mailgun resources, send real email, push, or perform destructive actions without explicit approval.
- Preserve privacy-by-default, nonjudgmental copy, and least-privilege access.
- Prefer simple PostgreSQL-backed implementation over additional paid services.
