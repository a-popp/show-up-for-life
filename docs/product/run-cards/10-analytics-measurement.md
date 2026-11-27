# Phase 10 — Privacy-preserving analytics and measurement

> **Status:** Not started<br>
> **Depends on:** Core event/safety phases sufficient to measure outcomes<br>
> **Release significance:** Required before meaningful public beta evaluation

This run card is an execution contract for one phase. Do not start implementation until the outstanding questions are resolved, explicitly deferred, or converted into approved assumptions. `../../../design.md` is authoritative for product behavior.

## Purpose

Measure whether the product creates real-world connection and reliable coordination without surveillance or sensitive inference. Analytics exist to evaluate outcomes and safety, not maximize engagement.

## Requirement trace

- Section 8.1 — feasibility, follow-through, safety, accessibility, usability, privacy, inclusion, cost measures
- Section 8.2 — loneliness reduction and ethical engagement measures
- Task 12 — controlled experimentation and privacy-preserving analysis

Use `/trace-requirements` before implementation and map concrete tickets/commits back to these requirements.

## Functionality included

- Internal minimized analytics event model
- Aggregation jobs/views for operational measures
- Gatherings held, follow-through, early-notice cancellation, and recurring-event stability measures
- Report-review time and moderator burden measures
- Accessibility/performance/error-rate operational measures
- Opt-in wellbeing survey framework
- Simple experiment-assignment capability only if needed
- Cost/usage telemetry review

## Explicitly out of scope or deferred

- Third-party behavioral analytics or advertising identifiers
- Time-in-app optimization
- Sensitive inference or user-level surveillance dashboards
- Reliability scoring disguised as analytics

## Implementation notes for the agent

- Prefer aggregate reporting and short retention for granular events.
- Automatic threshold cancellations must be excluded from punitive/follow-through interpretations.
- Wellbeing surveys must be optional and not affect product access.
- Experiment assignments should be transparent internally and reversible.

## Data and model changes

- analytics events
- aggregate tables/views
- survey responses/opt-in records
- experiment assignments if enabled
- operational performance/cost metrics

## Infrastructure additions or changes

- No third-party analytics service.
- May add lightweight internal dashboard routes for the operator.

## Test and verification gates

### Required automated checks

- Unit tests for aggregation correctness
- Privacy tests for prohibited fields/inference
- Retention/job tests
- Dashboard authorization tests
- Schema tests separating threshold cancellations from user-initiated cancellations

### Phase-specific acceptance checks

- The operator can answer key design questions without inspecting private user-level activity unnecessarily.
- Analytics cannot be used to shame/rank users.
- Survey participation is clearly optional.

Before completion, run `/verify` and the repository validation suite appropriate to the files changed.

## Manual steps for the user

- Review metric definitions and privacy implications before enablement.
- Select or approve any validated wellbeing survey instrument and confirm licensing/usage constraints.

## Outstanding questions before implementation

1. Which metrics are essential for first public beta versus later optimization?
2. Should controlled experimentation be implemented now or deferred until sufficient usage exists?
3. What survey instrument, if any, is appropriate and legally usable for wellbeing measurement?

## Completion criteria

The product can be evaluated against its intended outcomes while preserving the privacy and ethics constraints.

## Safety, privacy, and cost boundaries

- Never commit secrets or real dotenv files.
- Do not provision or mutate DigitalOcean/Mailgun resources, send real email, push, or perform destructive actions without explicit approval.
- Preserve privacy-by-default, nonjudgmental copy, and least-privilege access.
- Prefer simple PostgreSQL-backed implementation over additional paid services.
