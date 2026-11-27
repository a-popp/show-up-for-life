# Phase 02 — Friendships, blocking, and groups

> **Status:** Not started<br>
> **Depends on:** Phase 01<br>
> **Release significance:** Private development alpha prerequisite

This run card is an execution contract for one phase. Do not start implementation until the outstanding questions are resolved, explicitly deferred, or converted into approved assumptions. `../../../design.md` is authoritative for product behavior.

## Purpose

Create the trusted relationship graph and group structures that later control invitations, availability visibility, group coordination, and safety enforcement. Friendship is mutual, and blocking is a global enforcement primitive.

## Requirement trace

- Section 3.2 — friend connections and group membership
- Confirmed decision — mutual friendship
- Confirmed decision — group visibility owner-controlled as invite-only, private-searchable, or public
- Task 4 — blocking/reporting/exit interaction

Use `/trace-requirements` before implementation and map concrete tickets/commits back to these requirements.

## Functionality included

- Mutual friend request, accept, decline, cancel, and remove flows
- Canonical friendship storage preventing duplicate reciprocal relationships
- Block creation/removal and central enforcement helpers
- Group create/edit/archive lifecycle
- Group owner/admin/member roles
- Invite-only, private-but-searchable, and public group modes
- Group invitations and join requests
- Membership leave/remove flows
- Basic rate limits for relationship and group actions

## Explicitly out of scope or deferred

- Events or event invitations
- Public user directory
- Algorithmic friend/group recommendations
- Reliability scoring or vouching
- Complex moderation automation

## Implementation notes for the agent

- Do not treat friendship as follower/following; both parties must accept.
- Enforce blocks in queries and service operations, not only by hiding UI.
- Define exactly how blocks affect shared group visibility and existing memberships before implementation.
- Keep group discovery descriptions searchable without exposing member lists unnecessarily.

## Data and model changes

- friendship requests
- canonical friendships
- user blocks
- groups
- group memberships
- group invitations
- group join requests
- audit events for moderation-relevant actions

## Infrastructure additions or changes

- No new external infrastructure.
- Uses existing PostgreSQL/application modules only.

## Test and verification gates

### Required automated checks

- Unit tests for friendship state transitions and duplicate prevention
- Integration tests for group visibility and membership authorization
- Block-enforcement tests across profile, friend, group, and search paths
- Rate-limit tests for request spam
- Workspace validation and secret scanning

### Phase-specific acceptance checks

- Two test users can establish mutual friendship; one-sided follow is impossible.
- Group owners can select and change the three supported visibility modes with correct behavior.
- Blocked users cannot use relationship/group pathways to contact or target the blocking user.

Before completion, run `/verify` and the repository validation suite appropriate to the files changed.

## Manual steps for the user

- Review group visibility terminology and safety copy.
- Decide whether the default new-group mode is invite-only or private-searchable.

## Outstanding questions before implementation

1. What are the exact permissions of owner/admin/member?
2. How should blocking affect pre-existing shared group membership and event participation?
3. Should public groups expose member counts only, member lists, or neither by default?
4. What initial rate limits are appropriate for friend/group requests?

## Completion criteria

The social graph can safely constrain later visibility and invitations. Group privacy mode behavior is explicit and testable. Blocking is implemented as a cross-module enforcement boundary.

## Safety, privacy, and cost boundaries

- Never commit secrets or real dotenv files.
- Do not provision or mutate DigitalOcean/Mailgun resources, send real email, push, or perform destructive actions without explicit approval.
- Preserve privacy-by-default, nonjudgmental copy, and least-privilege access.
- Prefer simple PostgreSQL-backed implementation over additional paid services.
