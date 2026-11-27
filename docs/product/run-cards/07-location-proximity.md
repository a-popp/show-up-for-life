# Phase 07 — USA location and proximity

> **Status:** Not started<br>
> **Depends on:** Phase 06<br>
> **Release significance:** Private beta capability

This run card is an execution contract for one phase. Do not start implementation until the outstanding questions are resolved, explicitly deferred, or converted into approved assumptions. `../../../design.md` is authoritative for product behavior.

## Purpose

Implement practical United States postal/city location and proximity controls while minimizing exposure of sensitive location data. The launch country is confirmed as the USA.

## Requirement trace

- Section 3.7 — postal code/city, optional named areas, radius, venue visibility
- Task 5 — location privacy and sensitive-data minimization
- Confirmed decision — one-country USA launch

Use `/trace-requirements` before implementation and map concrete tickets/commits back to these requirements.

## Functionality included

- USA postal-code/city reference dataset import
- User postal code/city location profile
- Coarse distance/radius calculations
- Per-event-type distance/location preferences
- Named areas within the USA launch scope
- Proximity-aware event display, invitations, and notifications
- Explicit behavior for users without location information
- Venue visibility rules based on host choice and confirmation status
- Privacy copy explaining coarse versus exact location

## Explicitly out of scope or deferred

- Exact-address geocoding/provider integration unless separately approved after privacy review
- International postal/geocoding support
- Precise realtime location tracking
- Public display of user postal code/city

## Implementation notes for the agent

- Use coarse reference centroids; do not imply exact user position.
- Store reference latitude/longitude only as needed for distance calculations.
- Never expose underlying postal code/city to hosts or other users.
- Keep exact-address support isolated behind a future provider boundary.

## Data and model changes

- location reference tables
- user location profiles
- distance/preference settings
- named area memberships
- venue coarse/exact visibility metadata as appropriate

## Infrastructure additions or changes

- Database reference-data migration/import job.
- No paid geocoding provider or external API required for postal/city matching.

## Test and verification gates

### Required automated checks

- Unit tests for distance calculations and boundary behavior
- Integration tests for location-based eligibility/notification suppression
- Privacy tests proving postal/city is not exposed
- Data-import validation tests
- Accessibility/plain-language review of location explanations

### Phase-specific acceptance checks

- Users can specify USA postal code/city and control distance preferences per event type.
- Users without location receive the documented default behavior rather than silent exclusion or inclusion.
- No other user can infer exact postal code/city from event or matching responses.

Before completion, run `/verify` and the repository validation suite appropriate to the files changed.

## Manual steps for the user

- Approve the selected USA postal/geographic reference dataset and its license/update process.
- Review exact-address deferral and privacy copy.

## Outstanding questions before implementation

1. Which USA dataset should be canonical: Census-derived ZCTA data, GeoNames, or another appropriately licensed source?
2. What initial named areas should be seeded, if any?
3. Should exact-address support remain deferred until after public beta?

## Completion criteria

Location improves relevance without converting the product into a location-tracking system.

## Safety, privacy, and cost boundaries

- Never commit secrets or real dotenv files.
- Do not provision or mutate DigitalOcean/Mailgun resources, send real email, push, or perform destructive actions without explicit approval.
- Preserve privacy-by-default, nonjudgmental copy, and least-privilege access.
- Prefer simple PostgreSQL-backed implementation over additional paid services.
