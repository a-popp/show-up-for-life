# Show Up For Life: Agent Requirements Specification

---

## 0. How to use this document

- **"Shall" means mandatory.** Requirements describe the required outcome; choose the implementation method unless a requirement constrains it.
- **Bracketed values `[ ]` are proposed defaults or open decisions.** Implement a bracketed value as a configurable default so it can be changed without code changes. Do not treat it as final. Open decisions are listed in Appendix B.
- **Do not guess on open decisions.** If a requirement depends on an item in Appendix B, implement the proposed default, isolate the behavior behind configuration, and flag it for human review.
- **Source code shall reside in an Acme Inc-controlled repository from the first commit.**
- **When requirements conflict,** the priority order is: Section 1.2 framing requirement, then Task 4 (trust and safety), Task 5 (privacy), Task 7 (ethical design), then the remaining tasks. Flag the conflict to a human reviewer.

---

## 1. Purpose and context

### 1.1 Purpose

**Show Up For Life** is a web application with a mobile-responsive experience that helps people turn good intentions into in-person gatherings that actually happen, and happen safely.

### 1.2 Framing requirement (applies to all work)

Evidence for a measurable rise in cancellations is limited, and many cancellations are legitimate. The solution shall **not** shame, surveil, or penalize users for genuine needs such as illness, emergencies, or mental health. It shall make realistic commitments easier to make, commitments easier to keep, and necessary cancellations easier to make considerately.

### 1.3 Mission

Show Up For Life is a pro-social alternative to attention-maximizing social media. Success is measured by what happens offline, not by time spent in the app.

### 1.4 Objectives

| # | Objective | Summary |
|---|-----------|---------|
| 1 | Increase follow-through | Plans made in the app are honored at materially higher rates than plans made through ordinary messaging, without coercion. |
| 2 | Encourage realistic commitment | Users make firm commitments (uncertainty is allowed only until a cutoff), so hosts can plan around them. |
| 3 | Make canceling considerate | Cancellation encourages early notice, respectful communication, rescheduling, or a replacement, with no disclosure of private reasons. |
| 4 | Support resilient gatherings | Flexible group sizes, waitlists, small-group and recurring formats, and optional minimum-attendance thresholds; smaller turnout is not treated as failure. |
| 5 | Enable safe encounters | Strong, practical protections, especially for first-time meetings with online contacts and for users vulnerable to harassment, stalking, fraud, or coercion. |
| 6 | Promote wellbeing and inclusion | Welcoming to people with social anxiety, depression, neurodivergence, disabilities, caregiving duties, irregular schedules, and limited budgets. |
| 7 | Build lasting community | Foster recurring real-world relationships and avoid manipulative engagement tactics. |
| 8 | Operate responsibly | Secure, privacy-protective, accessible, scalable, maintainable, and supportable by Acme Inc after transition. |

---

## 2. Scope

### 2.1 In scope for development

- A responsive web application and supporting back-end services.
- Account creation, identity and trust mechanisms, and user profiles.
- Event and plan creation, invitation, RSVP, confirmation, and cancellation workflows for recurring, one-off planned, and spontaneous events, including optional minimum-attendance thresholds.
- Group and community features that support recurring in-person gatherings.
- User availability, location and proximity preferences, and relationship-based visibility, filter, and eligibility controls (Task 3, items 3.10 to 3.12).
- Safety, reporting, and moderation capabilities (tools and workflows).
- Notifications and reminders, within the constraints in Task 7 (Section 6.7).
- Analytics instrumentation and experimentation capability aligned to Section 8.
- Automated testing, security hardening, and accessibility conformance.
- Technical documentation.

### 2.2 Out of scope

- Native mobile applications (may be proposed as an option or future phase).
- Dating or romantic matchmaking as a primary function.
- Payment processing for ticketed or commercial events (may be proposed as an option).
- Real-time or device-based location features in the initial release (may be proposed as an option or future phase).
- Content creation, advertising sales, and marketing campaigns.

---

## 3. Applicable standards

Conform to the following, using the then-current version unless stated otherwise:

- WCAG 2.2 Level AA (or then-current equivalent).
- A recognized secure-development framework, such as NIST SSDF or OWASP ASVS. [Contractor to propose; Acme Inc to approve]
- A privacy compliance framework covering applicable U.S. state privacy statutes and, where users are located in the relevant jurisdictions, GDPR and similar regimes. [Contractor to propose; Acme Inc to approve]
- Applicable consumer protection, accessibility, and data-protection laws and regulations.

---

## 4. Definitions

| Term | Meaning |
|------|---------|
| Excusable cancellation | A cancellation the system treats as legitimate without requiring the user to disclose a private reason. |
| Reliability signal | Any indicator derived from a user's follow-through history. |
| Dark pattern | An interface or notification design that manipulates users into behavior against their stated interests, including time-in-app maximization. |
| PIA | Privacy impact assessment. |
| Recurring event | An event that repeats on a host-defined schedule, normally tied to a group or community. Each repetition is an occurrence. |
| One-off planned event | An event with a specific date, time, and place set in advance that does not repeat. |
| Spontaneous event | An event created on short notice for a near-term window (for example, "tonight" or within the next two hours), with a short response window. |
| Spontaneous availability | A user's time-limited declaration that they are free for a near-term window. It expires automatically and is not an RSVP or a commitment. |
| Commitment cutoff | The time after which an undecided response converts automatically to "No", so that the host has a firm attendee count. |
| Minimum threshold | An optional minimum number of committed attendees that a host sets for an event. If it is not met by the threshold deadline, the event is cancelled automatically (item 3.13). |
| Relationship type | The connection between two users that controls visibility and eligibility: group or community membership, or friendship. |

---

## 6. Requirements

### Task 3: Core application development

Design, develop, and release in increments a responsive web application and supporting back-end services that provide the following capabilities. Source code shall reside in an Acme Inc-controlled repository from the first commit.

**3.1 Accounts, identity, and profiles.** Account creation, user profiles, and identity and trust mechanisms (see Task 4).

**3.2 Plans and events.** Creation of plans and events, invitations, RSVP, confirmation, and cancellation workflows. The application shall support three event types (see Section 4), each with the workflow defined in 3.9, and any event type may use an optional minimum-attendance threshold (3.13):

- (a) *Recurring events.* Events that repeat on a schedule and are typically tied to a group or community.
- (b) *One-off planned events.* Events with a specific date, time, and place set in advance.
- (c) *Spontaneous events.* Events created on short notice for a near-term window, such as "tonight" or "within the next two hours".

**3.3 Honest commitment.** Users shall express a firm level of certainty so that hosts can plan around it. Options such as "Maybe", "Tentative", or "Interested" shall not be offered as final responses. An alternative workflow is acceptable in which a user may remain undecided until a commitment cutoff, after which an undecided response converts automatically to "No"; the host shall always have a firm attendee count to rely on for planning. Cutoff behavior shall be appropriate to the event type (see 3.9). Declining, or changing a response before the cutoff, shall be easy and socially acceptable in the experience.

**3.4 Considerate cancellation.** The cancellation experience shall encourage early notice and respectful communication and, where appropriate, offer rescheduling or a replacement attendee. Cancellation shall never require disclosure of private health or personal information.

**3.5 Resilient gatherings.** Support for flexible group sizes, waitlists, small-group formats, recurring formats, optional minimum-attendance thresholds (3.13), and clear expectations, so that changes in attendance do not make an event feel like a failure.

**3.6 Groups and community.** Group and community features that support recurring in-person gatherings and ongoing relationships. The application shall support two relationship types between users, group or community membership and friendship, which are used for the visibility and eligibility controls in 3.10 and 3.12. [Whether friendship is mutual (both parties accept) or one-way is to be confirmed.]

**3.7 Notifications and reminders.** Reminders and notifications that comply with Section 6.7 (Task 7) and are configurable by the user. Users shall be able to configure notifications separately by event type and to restrict them using the location and filter criteria in 3.11 and 3.12.

**3.8 Browser support.** Support for current versions of major browsers on desktop and mobile.

**3.9 Event-type workflows.** Each event type shall have a workflow suited to its purpose.

- (a) *Recurring events.* The host shall be able to define a recurrence pattern. Users shall be able to commit to the series, to individual occurrences, or to a standing pattern (for example, "every other Thursday"), and to skip or cancel a single occurrence without leaving the series. Commitment cutoffs and any minimum threshold shall be set per occurrence.
- (b) *One-off planned events.* Workflows shall include invitations, RSVP, confirmation, waitlists, a commitment cutoff, and reminders leading up to the event.
- (c) *Spontaneous events.* Workflows shall be optimized for speed: a host can create an event in a minimal number of steps, invitees receive time-sensitive invitations, and responses are limited to a firm "Yes" or "No". The response window shall be set by the host, defaulting to [30 minutes] and configurable from [10 minutes] to [2 hours], and shall always close before the event start time. Invitations shall expire automatically when the window closes, and unanswered invitations shall be treated as "No". Spontaneous events shall still support capacity limits and waitlists, and shall remain subject to the safe defaults in Task 4 (4.2).
- (d) *Host visibility.* For every event type, the host shall be able to see a clear count of confirmed attendees to plan around and, where a minimum threshold is set, progress toward it.

**3.10 Availability and visibility.** Users shall be able to declare when they are available and to control who can see that.

- (a) *Forms of availability.* Users shall be able to declare scheduled availability (for example, recurring weekly windows or specific dates) and spontaneous availability (for example, "free tonight" or "free for the next two hours").
- (b) *Spontaneous availability.* Spontaneous availability shall expire automatically at a time the user chooses (default [2 hours], maximum [12 hours]), shall be easy to set and withdraw, and shall not be treated as an RSVP or a commitment to any event.
- (c) *Relationship-based visibility.* Users shall be able to control, separately for each relationship type (members of the same group or community, friends, or specific groups or individuals), whether hosts can see them as available. This applies to scheduled and spontaneous availability and to each event type.
- (d) *Criteria-based visibility.* A user shall be shown to a host as available only for events that meet the user's own event criteria (see 3.12). Hosts shall see only that the user is available for that event, and shall not see the user's underlying criteria, schedule, or location.
- (e) *Attendee search.* Users shall be able to control whether they appear in a host's attendee search results and suggestions, using the same relationship-based settings as (c). Users who have not enabled visibility for a given relationship type shall not appear in that host's search results or suggestions.
- (f) *Defaults.* Availability and attendee-search visibility shall be off by default and shall require explicit opt-in.
- (g) *Per-type rules.* Users shall be able to set different availability rules for each event type. For example, a user may be open to spontaneous invitations only on weekends, but to planned events any evening.
- (h) *Use of availability.* The system shall use availability to help hosts find and invite suitable attendees, subject to (c) through (f) and the matching criteria in 3.12.

**3.11 Location and proximity.** Users shall be able to limit the events they see, are invited to, and are notified about by location.

- (a) *Location input.* Users shall be able to specify their location by postal code or city. Users may optionally provide an exact address to improve distance accuracy. An exact address shall never be required or set by default.
- (b) *Location preferences.* Users shall be able to specify where they are willing to attend events, using a maximum distance from their stated location, one or more named areas (such as a neighborhood, city, or region), or a combination.
- (c) *Per-type settings.* Users shall be able to set different location preferences for recurring events, one-off planned events, and spontaneous events. For example, a user may accept planned events across a metropolitan area but spontaneous events only within a short distance.
- (d) *No real-time location in the initial release.* The application shall not collect or use a user's real-time or device location in the initial release. The Contractor may propose it as an option for a later increment.
- (e) *Users without location.* Users who provide no location shall still be able to use all features that do not depend on proximity. The application shall explain that proximity-based matching and notifications are unavailable until a location is provided.
- (f) *Application of preferences.* The system shall apply location preferences when (i) showing and recommending events, (ii) sending invitations, and (iii) sending notifications. Users shall not receive invitations or notifications for events outside their stated preferences unless they have chosen otherwise.
- (g) *Location privacy.* The system shall not disclose a user's postal code, city, or exact address to other users or hosts. Matching shall use coarse or derived values (for example, "within 5 km"). An exact address, if provided, shall be used only for distance calculations. The exact venue address of an event shall be shared with attendees only as defined by the host and the attendee's confirmation status. Location data handling shall comply with Task 4 (including 4.3) and Task 5.

**3.12 Filters and eligibility criteria.** Users shall control which events they see and are eligible to be invited to.

- (a) *Discovery filters.* Users shall be able to filter events by type (recurring, one-off planned, spontaneous), event category or activity, date and time, group size, cost, and location (per 3.11). Other filters may be proposed by the Contractor and approved by Acme Inc.
- (b) *Event criteria.* Users shall be able to specify the kinds of events they want to see and the criteria an event must meet before they are (i) shown as available to a host under 3.10(d), and (ii) eligible to receive an invitation. For example, a user may choose to be shown and invited only for events of a certain category, size, time of day, or distance.
- (c) *Relationship-specific criteria.* Users shall be able to apply different criteria depending on the host's relationship to them (same group or community, or friend), for example, accepting more event types from friends than from members of a large community.
- (d) *Host-side criteria.* Hosts shall be able to set criteria for who is eligible to be invited or to attend (for example, group membership, location, or availability). The system shall show users when they do not meet an event's criteria, without exposing other users' private information.
- (e) *Per-type criteria.* Filters and eligibility criteria shall be configurable separately for each event type, and users shall be able to save them as reusable presets.
- (f) *Transparency.* Users shall be able to view and edit all active filters, eligibility criteria, and visibility settings in one place at any time, and shall be able to see why they were or were not invited to a given event.
- (g) *Fairness.* Eligibility criteria shall not be used to discriminate on any basis prohibited by applicable law, and shall be consistent with the trust-and-safety requirements in Task 4.

**3.13 Minimum-attendance thresholds.** For any event type, a host shall be able to set an optional minimum number of committed attendees, so that the event goes ahead only if enough people commit and is cancelled automatically if not.

- (a) *Setting a threshold.* The threshold is optional and off by default. The host sets a minimum and a threshold deadline when creating or editing an event. The minimum shall not exceed the event's capacity. For recurring events, the host may set a minimum for the series and override it per occurrence; each occurrence is evaluated separately, and automatic cancellation of one occurrence shall not end the series.
- (b) *Threshold deadline.* The threshold is evaluated at the threshold deadline. The deadline shall be at or after the commitment cutoff (3.3), so that undecided responses have been resolved, and no later than [24 hours] before the event start; for events created with less lead time, propose a rule for Acme Inc approval. For spontaneous events, the deadline is the close of the response window (3.9(c)).
- (c) *Transparency to invitees.* Before a user commits, the application shall show clearly that the event is conditional, the minimum, the number committed so far, and the deadline. Progress shall remain visible to the host and invitees until the deadline.
- (d) *Conditional commitment.* A "Yes" given before the minimum is met remains a firm commitment to attend if the event goes ahead. The user shall be told that they will be released automatically, with no consequence, if the minimum is not met. Users may withdraw before the deadline under 3.4.
- (e) *Event status.* The event shall be shown as pending until the minimum is met, then as confirmed, with committed attendees notified. If withdrawals bring the count below the minimum before the deadline, the event shall return to pending and committed attendees shall be notified. After the deadline has passed with the minimum met, the event shall not be cancelled automatically for later attendance changes; the host shall instead be notified and offered options (such as promoting a waitlisted user, rescheduling, or cancelling under 3.4).
- (f) *Counting.* Only users who have committed ("Yes") count toward the minimum. Undecided and waitlisted users do not count unless and until they are promoted to committed. [Whether the host counts toward the minimum is to be confirmed.]
- (g) *Host options before the deadline.* The host shall be able to lower the minimum, extend the deadline (within the limits in (b)), invite additional people, or cancel under 3.4. The host shall not be able to raise the minimum after any invitee has committed. Committed attendees shall be notified of any change to the deadline.
- (h) *Automatic cancellation.* If the minimum is not met at the deadline, the system shall cancel the event automatically, without action by the host, and shall promptly notify the host, committed attendees, invitees, and waitlisted users, even if they have turned off reminders. The notice shall be neutral and non-judgmental (Task 7, 7.3), shall not attribute the outcome to any individual, and shall offer the host the option to reschedule or to re-run the event with a different minimum.
- (i) *No penalty.* An automatic cancellation under this item is not a cancellation by the host or by any attendee. It shall not count against any user in any follow-through indicator (Task 6) and shall be excluded from the early-notice measure in Section 8.1.

### Task 4: Trust and safety

Implement the following in the application. Policies, moderation procedures, and escalation protocols are human-owned; build the tooling and workflows that support them.

- 4.1 **Verification.** Identity and trustworthiness verification at a level proportionate to the risk of the interaction, with a clear explanation to users of what verification does and does not guarantee.
- 4.2 **Safe defaults.** Default settings that favor public, well-lit venues and group settings for first-time meetings.
- 4.3 **Location sharing.** Location sharing that is opt-in, limited, and revocable, and that never exposes a user's home address or precise whereabouts to people they have not chosen to share with.
- 4.4 **User controls.** Simple, prominent means to block, report, and exit an interaction, and to share a plan with a trusted contact.
- 4.5 **Report review.** Tooling for rapid review of safety reports, including support for escalation to law enforcement where appropriate.
- 4.6 **Abuse protections.** Protections against impersonation, scams, fraud, harassment, stalking, and coercion.
- 4.7 **Age assurance.** A recommended age-assurance approach and enforcement mechanism. The service is anticipated to be adults-only (18+) unless a different approach is recommended with written justification approved by Acme Inc.

### Task 5: Privacy and data protection

- 5.1 Practice data minimization: collect only what the stated functions require.
- 5.2 Provide clear, plain-language consent for any data use, including location data and behavioral data.
- 5.3 Implement the privacy compliance framework described in Section 3.
- 5.4 Not sell personal data and not use personal data for third-party advertising targeting.
- 5.5 Provide user controls to access, export, and delete data.
- 5.6 Not generate, store, or display sensitive inferences about users, such as inferences about mental health.
- 5.7 Support the privacy impact assessment and data-protection plan by documenting data flows and updating them when material changes occur.
- 5.8 Treat availability, location, and relationship data as sensitive: collect only what Task 3 (3.10 to 3.13) requires, do not collect real-time or device location in the initial release, honor the visibility settings in 3.10 and 3.11, and include these data in the user controls under 5.5.

### Task 6: Reliability signals and fairness

The application is not required to include a follow-through indicator. If one is included, it shall:

- 6.1 Avoid public shaming, ranking, or punitive scores.
- 6.2 Distinguish excusable from non-excusable cancellations without requiring users to disclose private reasons.
- 6.3 Give users visibility into, and a way to contest, any signal about them.
- 6.4 Avoid disadvantaging people with disabilities, health conditions, caregiving duties, or unstable work schedules, and document the evaluation that supports this.
- 6.5 Exclude automatic cancellations under 3.13 (unmet minimum threshold) from any follow-through indicator.

### Task 7: Ethical design and user wellbeing

- 7.1 The application contains no dark patterns, infinite scroll, streaks designed to induce guilt or compulsion, or notifications intended to maximize time-in-app.
- 7.2 Nudges are transparent, easy to turn off, and designed to support user-stated goals.
- 7.3 Messaging about missed or canceled plans is non-judgmental in tone.
- 7.4 The experience supports, but does not replace, professional mental health resources, with appropriate signposting and without diagnosing or labeling users.
- 7.5 Engagement design is validated against the "ethical engagement" measure in Section 8.1.

### Task 8: Accessibility and inclusion

- 8.1 Conform to WCAG 2.2 Level AA (or then-current equivalent) and produce automated and manual accessibility test results sufficient to support an accessibility conformance report.
- 8.2 Use plain, inclusive language. English is the required language at launch. [Confirm whether additional languages are desired; build with internationalization support so languages can be added.]
- 8.3 Provide features that accommodate sensory needs, social anxiety, and varied energy levels, for example "low-key" event tags and arrival-window flexibility.

### Task 9: Security

- 9.1 Follow secure development practices aligned with the framework identified in Section 3.
- 9.2 Encrypt data in transit and at rest and provide strong authentication options, including multi-factor authentication.
- 9.3 Run automated security testing (for example, static analysis, dependency scanning, and secrets scanning) and fix findings within the timelines in Section 8.2 below.
- 9.4 Support the incident response plan by providing logging and user-notification mechanisms needed to execute it.

### Task 10: Technology and architecture

- 10.1 Use a reputable commercial cloud platform with documented availability and recovery objectives. [Contractor to propose; see Section 8.2.]
- 10.2 Deliver a modular, documented architecture free of proprietary lock-in that would prevent Acme Inc from transitioning the system.
- 10.3 Identify all third-party components and licenses, and obtain Acme Inc approval before incorporating components that restrict transition or reuse.
- 10.4 All code, documentation, and designs shall be delivered to Acme Inc, which shall own them, excluding clearly identified pre-existing Contractor intellectual property and licensed third-party components.

### Task 11: Responsible use of AI (conditional)

If AI or machine learning features are proposed (for example matching, recommendations, moderation, or message drafting), document and obtain Acme Inc approval **before implementation** of:

- 11.1 Human oversight of AI-driven decisions, particularly moderation and safety actions.
- 11.2 Bias evaluation methodology and results.
- 11.3 Transparency to users about where and how AI is used.
- 11.4 Data-handling practices, consistent with Task 5 (including the prohibition on sensitive inferences).

*Agent note: do not add AI-driven features without this approval. This applies to features within the product, not to the agent's own development tooling.*

### Task 12: Analytics, measurement, and experimentation

- 12.1 Implement instrumentation for the success measures in Section 8.1, and for additional measures as proposed and approved.
- 12.2 Implement analytics dashboards accessible to Acme Inc.
- 12.3 Provide experimentation capability, such as controlled comparisons, to compare follow-through against a baseline or control group.
- 12.4 Ensure that wellbeing measurement is voluntary and anonymized or aggregated where possible.

### Task 13: Testing

- 13.1 Perform functional, performance, security, and accessibility testing, with results reported to the COR. Implement automated tests for all requirements in Task 3, in particular the visibility, eligibility, cutoff, and threshold logic in 3.3 and 3.9 to 3.13.

### Task 14: Documentation

- 14.1 Produce technical documentation sufficient for Acme Inc staff or a successor to operate and maintain the system.

---

## 8. Measures and standards relevant to implementation

### 8.1 Outcome measures to instrument

Targets are placeholders to be finalized by Acme Inc. Instrument the data needed to report each measure.

| Area | Measure |
|------|---------|
| Follow-through | Share of confirmed attendees who attend, compared with a baseline or control group |
| Early notice | Share of cancellations made with at least 24 hours' notice (excluding automatic cancellations under 3.13) |
| Realistic commitment | Share of undecided invitees who resolve to "Yes" before the commitment cutoff; decline in last-minute cancellations |
| Real-world connection | Gatherings held; share of users attending at least 2 gatherings in a month; recurring groups sustained over 90 days |
| Safety | Safety reports per 1,000 gatherings; median time to review a report; user-reported feeling of safety |
| Wellbeing | Opt-in, validated survey measures of loneliness and social connection before and after use |
| Inclusion and accessibility | Accessibility audit results; satisfaction among users who identify as anxious, neurodivergent, or disabled |
| Quality and operations | Availability; defect rates; security findings closed within agreed timelines |
| Ethical engagement | Evidence that engagement is driven by completed in-person events rather than time-in-app |

### 8.2 Engineering-relevant service levels (draft)

| Standard | Draft acceptable level |
|----------|------------------------|
| Availability (production, excluding approved maintenance) | [99.5%] monthly |
| Recovery time objective / recovery point objective | [Contractor to propose] |
| Critical or high security findings closed | [Within 15 / 30 days] |
| Accessibility defects blocking a core task | [Resolved within 30 days] |

---

## Appendix A: Sections removed from the full PWS

| Removed | Reason |
|---------|--------|
| 1.1 to 1.2 background narrative (retained: framing requirement) | Context only; the binding constraint is preserved in Section 1.2. |
| 2.1 bullets on research, subject-matter experts, launch support, post-launch warranty, O&M | Human-led activities. |
| 3 definitions: COR, GA, Beta | Contract and release-management terms. |
| 5 Period of performance, place, management, key personnel | Contract administration and staffing. |
| Task 1: Program management | Human management activities. |
| Task 2: Discovery, user research, and design | Human research and design activities. Agents implement against the resulting requirements. |
| Task 4: policies, moderation procedures, escalation protocols | Human-owned; tooling retained. |
| Task 5: PIA delivery before beta | Human-owned; supporting documentation retained (5.7). |
| Task 8: independent audit, usability testing with people | Human activities (8.1, 8.4). |
| Task 9: independent penetration testing, vulnerability-disclosure process, incident response plan | Human or organizational activities; supporting engineering retained. |
| Task 13: launch-readiness reviews, beta and GA launch, launch support | Release management. |
| Task 14: staff training, warranty, post-launch report | Human activities. |
| Task 15: Transition assistance | Contract closeout. |
| Task 16: Option-period O&M and enhancements | Operations and contract options. |
| 7 Information and resources furnished by Acme Inc | Contract administration. |
| 8.2 operational service levels for safety review, defect response, deliverable on-time rate; 8.3 surveillance | Human operations and contract oversight. |
| 9 Deliverables schedule | Schedule and contract deliverables. |
| 10 Additional terms | Legal and contractual. IP ownership retained in 10.4. |

---

## Appendix B: Open decisions requiring human input

Implement the proposed default behind configuration and flag for review. Do not treat as final.

1. **Commitment wording (3.3).** An earlier draft allowed "tentative" responses. The current text uses firm-commitment wording: no "Maybe" or "Tentative", and undecided converts to "No" at a cutoff. Confirm.
2. **Friendship model (3.6).** Confirm whether friendship is mutual (both parties accept) or one-way.
3. **Visibility defaults (3.10).** Availability and attendee-search visibility are proposed as off by default. Confirm, noting this will shrink the pool of people hosts can find in early use.
4. **Proposed timings.** Spontaneous response window ([30 minutes]; range [10 minutes] to [2 hours]), spontaneous availability duration ([2 hours]; maximum [12 hours]), and minimum-threshold lead time ([24 hours]).
5. **Minimum-threshold rules (3.13).** Confirm whether the host counts toward the minimum, and whether an event that has reached its minimum should return to pending if attendance later drops below it before the deadline.
6. **Language support (8.2).** Confirm whether languages beyond English are required.
7. **Service levels and targets (8.1, 8.2).** All bracketed targets are placeholders pending Acme Inc input.
8. **Terminology.** Terms such as COR were adapted from government contracting for a commercial context; confirm preferred terminology.
