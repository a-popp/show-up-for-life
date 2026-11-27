# Phase 11 — Optional reliability indicator — deferred and gated

> **Status:** Not started<br>
> **Depends on:** Phases 03–10 and explicit renewed user approval<br>
> **Release significance:** Optional post-beta experiment only; not required for launch

This run card is an execution contract for one phase. Do not start implementation until the outstanding questions are resolved, explicitly deferred, or converted into approved assumptions. `../../../design.md` is authoritative for product behavior.

## Purpose

Define a safe path for the optional reliability/dependability signal without letting it undermine the no-shame, privacy, accessibility, or fairness constraints. The default remains no indicator.

## Requirement trace

- Task 6 — optional, inspectable, contestable reliability/dependability signals
- Confirmed decision — no default indicator; opt-in only; no penalty for opting out
- Priority order — wellbeing, safety, privacy, and ethics outrank convenience

Use `/trace-requirements` before implementation and map concrete tickets/commits back to these requirements.

## Functionality included

- Explicit opt-in indicator configuration
- Private/host-visible/public visibility choices
- User inspection and contest/correction flow
- Fairness review for disability, health, caregiving, work, and access constraints
- Automatic-threshold-cancellation exclusion
- Clear explanations and non-punitive presentation

## Explicitly out of scope or deferred

- Public ranking, punitive labels, or algorithmic penalties
- Use of availability withdrawal/nonresponse as negative evidence
- Any indicator enabled by default
- Sensitive inference or surveillance

## Implementation notes for the agent

- Do not begin this phase merely because data exists; explicit renewed approval is required.
- Evaluate whether the feature should exist at all after beta evidence.
- If implemented, start private-only before any host/public visibility.
- Provide a complete opt-out that removes display and does not reduce functionality.

## Data and model changes

- indicator opt-in/preferences
- derived signal inputs
- contest/correction records
- audit/fairness review records

## Infrastructure additions or changes

- No new infrastructure expected.

## Test and verification gates

### Required automated checks

- Tests proving default-off behavior
- Visibility permission tests
- Exclusion tests for automatic threshold cancellations
- Contest workflow tests
- Fairness/privacy regression review

### Phase-specific acceptance checks

- Users who never opt in are neither shown an indicator nor disadvantaged.
- Users can inspect, understand, contest, and disable the signal.
- Automatic cancellations caused by unmet thresholds never count against attendees.

Before completion, run `/verify` and the repository validation suite appropriate to the files changed.

## Manual steps for the user

- Re-decide whether this feature should be implemented at all after observing beta usage.
- Conduct a documented fairness and wellbeing review.

## Outstanding questions before implementation

1. Is there evidence users want this signal?
2. What positive framing avoids shame and still communicates useful dependability?
3. Should host/public visibility ever be enabled, or should the feature remain private-only?

## Completion criteria

Either the feature is implemented under strict opt-in/fairness controls, or the phase is explicitly retired with rationale recorded.

## Safety, privacy, and cost boundaries

- Never commit secrets or real dotenv files.
- Do not provision or mutate DigitalOcean/Mailgun resources, send real email, push, or perform destructive actions without explicit approval.
- Preserve privacy-by-default, nonjudgmental copy, and least-privilege access.
- Prefer simple PostgreSQL-backed implementation over additional paid services.
