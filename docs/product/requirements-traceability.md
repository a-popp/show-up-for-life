# Requirements traceability

This lightweight matrix connects `design.md` requirements to implementation and test evidence. Everything is initially unimplemented because this repository currently contains workspace scaffolding only.

| Requirement | Scope | Implementation status | Test/evidence | Notes |
| --- | --- | --- | --- | --- |
| Task 3 | Core application development | Not implemented | None | Includes accounts, events, groups, notifications, browser support |
| 3.1 | Accounts, identity, profiles | Not implemented | None | Must align with Tasks 4/5 |
| 3.2 | Plans and event types | Not implemented | None | Recurring, one-off planned, spontaneous |
| 3.3 | Honest commitment | Not implemented | None | OD-1 affects final wording/state machine |
| 3.4 | Considerate cancellation | Not implemented | None | No forced disclosure of private reasons |
| 3.5 | Resilient gatherings | Not implemented | None | Flexible sizes, waitlists, thresholds |
| 3.6 | Groups/community and friendship | Not implemented | None | OD-2 friendship mutuality |
| 3.7 | Notifications/reminders | Not implemented | None | Configurable by event type and filters |
| 3.8 | Browser support | Not implemented | None | Current major desktop/mobile browsers |
| 3.9 | Event-type workflows | Not implemented | None | Includes spontaneous timing behavior |
| 3.10 | Availability and visibility | Not implemented | None | Off by default; sensitive data |
| 3.11 | Location/proximity | Not implemented | None | No real-time/device location initially |
| 3.12 | Filters/eligibility | Not implemented | None | Transparency and fairness requirements |
| 3.13 | Minimum-attendance thresholds | Not implemented | None | OD-5 affects details |
| Task 4 | Trust and safety | Not implemented | None | High-priority constraint |
| Task 5 | Privacy/data protection | Not implemented | None | GDPR-inspired baseline; data rights |
| Task 6 | Reliability signals/fairness | Not implemented | None | Must avoid shaming/penalties |
| Task 7 | Ethical design/wellbeing | Not implemented | None | High-priority constraint |
| Task 8 | Accessibility/inclusion | Not implemented | None | WCAG 2.2 AA direction |
| Task 9 | Security | Not implemented | Workspace scanner only | OWASP ASVS/SSDF-oriented |
| Task 10 | Technology/architecture | Not implemented | Target architecture documented | TypeScript modular monolith direction |
| Task 11 | Responsible AI (conditional) | Not implemented | None | No product AI without explicit approval |
| Task 12 | Analytics/measurement | Not implemented | None | Privacy-preserving measurement required |
| Task 13 | Testing | Not implemented | Workspace script tests only | Future requirement tests mandatory |
| Task 14 | Documentation | Partially started | Workspace docs exist | Product docs must evolve with implementation |

Update this matrix whenever implementing or changing product behavior. Link test files, migration notes, review evidence, or manual verification notes in the evidence column.
