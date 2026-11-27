# Application phase run cards

These run cards divide the design implementation into explicit, independently gated phases. They are intended for future Devin/agent sessions: each card defines scope, verification, infrastructure impact, user actions, and questions that must be resolved before coding.

`../../../design.md` is authoritative for product behavior. Use `/trace-requirements` before implementing product behavior and `/verify` before completion.

## Global implementation rules

- Work one phase at a time unless the user explicitly asks otherwise.
- Resolve, defer, or convert each card's outstanding questions into approved assumptions before implementation.
- Do not treat a private development alpha as suitable for public launch; trust/safety, privacy, accessibility, and all core event types are public-beta prerequisites.
- Never commit secrets, real dotenv files, credentials, or private operational details.
- Do not provision or mutate DigitalOcean/Mailgun resources, send real email, push, or perform destructive actions without explicit approval.
- Keep cost and operational complexity minimal; justify any new dependency or service.
- Update the status table in this index whenever a phase starts, completes, is deferred, or is retired.

## Confirmed planning inputs

- Launch country: **United States**
- Friendship model: mutual friendship
- Group visibility: owner chooses invite-only, private-but-searchable, or public
- Age assurance: 18+ self-declaration plus lightweight risk checks
- Identity/trust verification: verified email plus behavioral controls; no third-party ID verification initially
- Availability/search visibility: off by default and explicitly opt-in
- Reliability indicator: no default indicator; any future implementation is opt-in and non-punitive
- Notifications: in-app plus transactional email; no SMS/push initially
- Threshold counting: host counts toward minimum; events return to pending if attendance drops before the deadline
- Language: English at launch, i18n-ready
- Exact-address geocoding: recommended deferral pending provider/privacy review

## Phase index

| Phase | Run card | Depends on | Status |
|---|---|---|---|
| 00 | [Application foundation](00-application-foundation.md) | None | Locally verified; CI observation pending push |
| 01 | [Identity, profile, and privacy baseline](01-identity-privacy-baseline.md) | Phase 00 | Not started |
| 02 | [Friendships, blocking, and groups](02-relationships-groups.md) | Phase 01 | Not started |
| 03 | [Core event engine and one-off planned events](03-core-events.md) | Phases 01–02 | Not started |
| 04 | [Preferences, eligibility, and notification delivery](04-preferences-notifications.md) | Phase 03 | Not started |
| 05 | [Recurring events and minimum thresholds](05-recurring-events-thresholds.md) | Phase 04 | Not started |
| 06 | [Availability, spontaneous events, and attendee discovery](06-availability-spontaneous-events.md) | Phases 04–05 | Not started |
| 07 | [USA location and proximity](07-location-proximity.md) | Phase 06 | Not started |
| 08 | [Trust, safety, and moderation workflows](08-trust-safety.md) | Phases 02–07 as applicable | Not started |
| 09 | [Accessibility, inclusion, and wellbeing hardening](09-accessibility-wellbeing.md) | Core product phases through Phase 07/08 as applicable | Not started |
| 10 | [Privacy-preserving analytics and measurement](10-analytics-measurement.md) | Core event/safety phases sufficient to measure outcomes | Not started |
| 11 | [Optional reliability indicator — deferred and gated](11-optional-reliability-indicator.md) | Phases 03–10 and explicit renewed user approval | Not started |
| 12 | [Public-beta readiness, deployment, and operations](12-public-beta-readiness.md) | Phases 00–10; Phase 11 optional | Not started |

## Phase-order rationale

The order is deliberately safety- and dependency-oriented:

1. Foundation and identity come before any social exposure.
2. Mutual relationships, groups, and blocking precede invitations.
3. The commitment engine is proven with one-off events before recurring/spontaneous complexity.
4. Preferences and notification controls precede broad invitation distribution.
5. Location and availability are implemented only after visibility and eligibility controls exist.
6. Trust/safety, accessibility, analytics, and operational readiness are launch gates rather than optional polish.
7. The reliability indicator is explicitly deferred and gated because it carries high wellbeing/fairness risk.

## Run-card maintenance

When implementation reveals a design conflict, do not silently change behavior. Update the relevant card, record the decision in `../open-decisions.md`, and trace the result back to `../../../design.md`.
