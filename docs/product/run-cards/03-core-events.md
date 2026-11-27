# Phase 03 — Core event engine and one-off planned events

> **Status:** Not started<br>
> **Depends on:** Phases 01–02<br>
> **Release significance:** Private alpha possible for trusted test users only

This run card is an execution contract for one phase. Do not start implementation until the outstanding questions are resolved, explicitly deferred, or converted into approved assumptions. `../../../design.md` is authoritative for product behavior.

## Purpose

Prove the central commitment model using the simplest event type. This phase establishes event lifecycle, invitations, RSVP resolution, capacity/waitlist behavior, cancellation, and plain-language commitment communication.

## Requirement trace

- Section 3.3 — planned events, yes/no/undecided-until-cutoff
- Task 1 — reduce coordination friction and ambiguity
- Task 7 — nonjudgmental commitment/withdrawal
- Section 8.1 — follow-through and cancellation measurement prerequisites

Use `/trace-requirements` before implementation and map concrete tickets/commits back to these requirements.

## Functionality included

- One-off planned event creation/edit/cancel/reschedule workflow
- Event draft/published lifecycle
- Host and co-host model if approved
- Invitations to existing eligible users
- RSVP states: yes, no, undecided until cutoff, expired/withdrawn as applicable
- Automatic conversion of unresolved undecided responses to No at cutoff
- Capacity and waitlist basics
- Cancellation and reschedule notifications in-app
- Transparent committed attendee count including host where applicable
- Plain-language explanation of what commitment means

## Explicitly out of scope or deferred

- Recurring events and series
- Spontaneous events
- Minimum thresholds
- Exact proximity/location-aware matching
- Production email delivery
- Reliability scoring

## Implementation notes for the agent

- Model invitations/RSVPs separately from event status.
- Use explicit server time calculations and event time zones.
- Cancellation/rescheduling must be easy and nonjudgmental while preserving auditability.
- Do not permit silent post-cutoff response edits; use explicit cancellation/withdrawal semantics.

## Data and model changes

- events/occurrences
- event hosts
- venues or venue descriptors
- event invitations
- event RSVPs
- waitlist entries
- event cancellations
- event status history
- minimal notification records

## Infrastructure additions or changes

- Uses database job/outbox primitives from Phase 00.
- No external services or production deployment changes.

## Test and verification gates

### Required automated checks

- Unit/property tests for cutoff resolution across time zones
- Integration tests for RSVP/waitlist/capacity transitions
- Authorization tests for host/invitee/non-invitee access
- E2E test for create → invite → commit → cutoff/cancel
- Accessibility checks for event creation and response flows

### Phase-specific acceptance checks

- A host can create a one-off event, invite users, receive firm commitments, and cancel/reschedule without ambiguous attendee state.
- At cutoff, no unresolved undecided response remains.
- Committed counts are understandable and do not hide whether the host is included.

Before completion, run `/verify` and the repository validation suite appropriate to the files changed.

## Manual steps for the user

- Review event commitment and cancellation copy.
- Select initial event category taxonomy if categories are required in the first UI.
- Run trusted-user exploratory testing if desired before proceeding.

## Outstanding questions before implementation

1. What is the initial event category/tag taxonomy?
2. Are co-hosts required in the first implementation or deferrable?
3. Can hosts invite only existing registered users, or is email-based non-user invitation in scope later?
4. What default cutoff should apply when the host does not choose one?

## Completion criteria

The application has a functioning commitment engine for one-off events. All subsequent event types can extend this engine rather than introduce a parallel workflow.

## Safety, privacy, and cost boundaries

- Never commit secrets or real dotenv files.
- Do not provision or mutate DigitalOcean/Mailgun resources, send real email, push, or perform destructive actions without explicit approval.
- Preserve privacy-by-default, nonjudgmental copy, and least-privilege access.
- Prefer simple PostgreSQL-backed implementation over additional paid services.
