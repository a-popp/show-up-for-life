# Open product decisions

`design.md` is authoritative. This register restates Appendix B so implementation can isolate configurable defaults and track human decisions. “Acme Inc” and “COR” in the source document are treated as placeholders for the personal project owner unless the owner chooses different terminology.

| ID | Decision | Proposed default / current text | Owner decision needed | Implementation impact | Status |
| --- | --- | --- | --- | --- | --- |
| OD-1 | Commitment wording (3.3) | No final “Maybe”/“Tentative”; undecided converts to “No” at cutoff | Confirm firm-commitment model | RSVP state machine, cutoff jobs, copy, notifications, tests | Open |
| OD-2 | Friendship model (3.6) | To be confirmed: mutual or one-way | Choose mutual acceptance or one-way relationship | Relationship graph, visibility, eligibility, privacy controls | Resolved — mutual friendship |
| OD-3 | Visibility defaults (3.10) | Availability and attendee-search visibility off by default | Confirm opt-in default despite smaller early host pool | Default settings, onboarding copy, host search behavior | Resolved — off by default; explicit opt-in |
| OD-4 | Proposed timings | Spontaneous response window 30 min (10 min–2 hr); spontaneous availability 2 hr (max 12 hr); threshold lead time 24 hr | Confirm or adjust values | Configuration schema, validation, scheduling jobs, tests | Open |
| OD-5 | Minimum-threshold rules (3.13) | Host counting and return-to-pending behavior need confirmation | Decide whether host counts and whether pre-deadline drops return event to pending | Threshold state machine, notifications, host/invitee copy | Resolved — host counts; pre-deadline drops return event to pending |
| OD-6 | Language support (8.2) | English initial assumption; other languages undecided | Confirm whether additional languages are required | i18n architecture, content workflow, accessibility testing | Resolved — English at launch; architecture must remain i18n-ready |
| OD-7 | Service levels and targets (8.1, 8.2) | Bracketed targets are placeholders | Set realistic hobby-scale targets | Instrumentation, alerting, capacity/cost planning | Open |
| OD-8 | Terminology | COR/Acme terminology adapted from contracting language | Confirm preferred product/business terminology | Documentation, admin labels, future legal/privacy copy | Open |

## Confirmed supplementary planning inputs

These inputs were confirmed during megaplanning and are reflected in the phase run cards under `run-cards/`:

| Decision | Confirmed direction | Implementation impact |
| --- | --- | --- |
| Launch geography | United States first | USA postal/city reference data, time-zone handling, privacy/legal analysis |
| Group visibility | Group owner chooses invite-only, private-but-searchable, or public | Group schema, discovery, membership, moderation, search behavior |
| Identity/trust verification | Verified email plus behavioral/trust controls; no third-party ID verification initially | Authentication design, report/moderation workflows, user-facing safety copy |
| Notification channels | In-app notifications plus transactional email; no SMS/push initially | Notification schema, Mailgun adapter boundary, cost control |
| Reliability indicator | No default indicator; any future implementation is opt-in, user-controlled, and non-punitive | Deferred optional phase; data model must avoid unfair inference |
| Short-lead thresholds | Thresholds remain optional, but normal non-spontaneous validation applies; invalid timing must be explained rather than special-cased | Event validation and host-facing copy |
| Exact-address geocoding | Recommended deferral pending provider/privacy review | Initial location phase uses USA postal/city and named areas only |

Implementation rule: implement a proposed default behind configuration only when needed, flag it for review, and never treat it as final.
