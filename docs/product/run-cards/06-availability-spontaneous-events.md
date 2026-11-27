# Phase 06 — Availability, spontaneous events, and attendee discovery

> **Status:** Not started<br>
> **Depends on:** Phases 04–05<br>
> **Release significance:** Private beta capability

This run card is an execution contract for one phase. Do not start implementation until the outstanding questions are resolved, explicitly deferred, or converted into approved assumptions. `../../../design.md` is authoritative for product behavior.

## Purpose

Enable near-term, low-friction gathering while preserving strict visibility control. Availability is contextual and temporary; it must never become a public schedule, commitment, or surveillance surface.

## Requirement trace

- Section 3.5 — spontaneous events and short response windows
- Section 3.10 — availability/location visibility and attendee discovery
- Confirmed decision — availability/search visibility off by default with explicit opt-in
- Task 5 — sensitive availability data minimization

Use `/trace-requirements` before implementation and map concrete tickets/commits back to these requirements.

## Functionality included

- Scheduled availability entry per event type
- Spontaneous availability with user-selected expiry
- Default two-hour and maximum twelve-hour spontaneous visibility windows
- Per-relationship and per-event-type visibility controls
- Explicit opt-in attendee search/discovery
- Spontaneous event creation optimized for speed
- Invitations/notifications for matching available users
- Short response windows and automatic expiration to No
- Capacity/waitlist handling for spontaneous events
- Ability to withdraw availability without explanation

## Explicitly out of scope or deferred

- Passive precise location tracking
- Public availability pages
- Treating availability as commitment
- Reliability inference based on availability withdrawal/expiry
- Production push/SMS

## Implementation notes for the agent

- Visibility defaults must remain off even after feature rollout.
- Hosts see only event-specific availability, never underlying schedules, criteria, or precise location.
- Expiring spontaneous invitations must not count against users.
- Use rate limits and maximum recipient counts to reduce spam/harassment.

## Data and model changes

- availability schedules
- spontaneous availability records
- visibility settings
- attendee discovery opt-ins
- spontaneous invitation/response records
- availability audit/expiry metadata

## Infrastructure additions or changes

- Uses existing job/outbox worker for expiration.
- No new external services.

## Test and verification gates

### Required automated checks

- Unit/property tests for spontaneous expiration windows
- Visibility matrix tests for relationships and event types
- Integration tests proving default-off behavior
- Rate-limit tests for attendee search/invites
- E2E spontaneous availability → event invitation → expiration flow

### Phase-specific acceptance checks

- No user appears in attendee search without explicit opt-in.
- Spontaneous availability expires automatically and is withdrawable.
- A nonresponse to a spontaneous invitation becomes No without penalty.

Before completion, run `/verify` and the repository validation suite appropriate to the files changed.

## Manual steps for the user

- Review copy explaining what hosts can and cannot see.
- Test the host creation flow for speed and clarity.

## Outstanding questions before implementation

1. What maximum recipient count/rate limit should apply to spontaneous invitations?
2. Should scheduled availability be part of the first implementation of this phase or follow spontaneous availability?
3. What is the default relationship visibility after opt-in: mutual friends only, selected groups, or user-configured with no default?

## Completion criteria

Spontaneous coordination works end-to-end without compromising availability privacy or pressuring users.

## Safety, privacy, and cost boundaries

- Never commit secrets or real dotenv files.
- Do not provision or mutate DigitalOcean/Mailgun resources, send real email, push, or perform destructive actions without explicit approval.
- Preserve privacy-by-default, nonjudgmental copy, and least-privilege access.
- Prefer simple PostgreSQL-backed implementation over additional paid services.
