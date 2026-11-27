# Phase 09 — Accessibility, inclusion, and wellbeing hardening

> **Status:** Not started<br>
> **Depends on:** Core product phases through Phase 07/08 as applicable<br>
> **Release significance:** Required before public beta

This run card is an execution contract for one phase. Do not start implementation until the outstanding questions are resolved, explicitly deferred, or converted into approved assumptions. `../../../design.md` is authoritative for product behavior.

## Purpose

Make accessibility and inclusion part of the shipped product rather than a late visual pass. The product must reduce pressure, support different social energy/access needs, and avoid manipulative engagement patterns.

## Requirement trace

- Task 7 — no-shame, no-pressure ethical design
- Task 8 — WCAG 2.2 AA, inclusive/plain-language design
- Section 8.2 — loneliness reduction and low-pressure participation measures

Use `/trace-requirements` before implementation and map concrete tickets/commits back to these requirements.

## Functionality included

- WCAG 2.2 AA audit and remediation of core flows
- Keyboard, focus, screen-reader, contrast, motion, and resize behavior review
- Plain-language review of commitment, cancellation, privacy, and safety copy
- Low-key event and arrival-flexibility support
- Sensory/accessibility tags on events/venues where appropriate
- Optional quiet hours/digest controls if approved
- Inclusive imagery/language review
- Cognitive-load reduction pass for event creation and response flows

## Explicitly out of scope or deferred

- Diagnosis, mental-health scoring, or sensitive inference
- Gamification or manipulative urgency
- Accessibility overlay widgets as a substitute for accessible implementation

## Implementation notes for the agent

- Use semantic HTML and tested Radix primitives rather than ad-hoc inaccessible widgets.
- Treat low-pressure participation as a feature: clear exit, no penalty, no ranking.
- Keep tags user-controlled and avoid inferring health/disability status.
- Use automated tools as a complement to manual review, not a replacement.

## Data and model changes

- event accessibility/sensory/arrival metadata
- user notification quiet/digest preferences if approved
- accessibility audit records outside the production database as appropriate

## Infrastructure additions or changes

- Add automated accessibility test tooling if not already present.
- No production infrastructure change.

## Test and verification gates

### Required automated checks

- Automated accessibility checks for key pages/components
- Playwright keyboard/focus smoke tests
- Reduced-motion and zoom/responsive checks
- Unit/integration tests for tags and arrival-window behavior

### Phase-specific acceptance checks

- Core flows are operable by keyboard and understandable in plain language.
- Users can create/join low-pressure events without using stigmatizing labels.
- No manipulative countdown/shame/pressure pattern is introduced.

Before completion, run `/verify` and the repository validation suite appropriate to the files changed.

## Manual steps for the user

- Perform or arrange manual accessibility review of critical flows.
- Review tag taxonomy and inclusive-language copy.

## Outstanding questions before implementation

1. Should quiet hours and digest batching be part of this phase or deferred beyond public beta?
2. What initial sensory/accessibility tag taxonomy is appropriate without becoming intrusive or overly complex?
3. Is an external accessibility review feasible, or should the first pass use a documented manual checklist?

## Completion criteria

Accessibility/inclusion requirements are demonstrably represented in core workflows and release gates.

## Safety, privacy, and cost boundaries

- Never commit secrets or real dotenv files.
- Do not provision or mutate DigitalOcean/Mailgun resources, send real email, push, or perform destructive actions without explicit approval.
- Preserve privacy-by-default, nonjudgmental copy, and least-privilege access.
- Prefer simple PostgreSQL-backed implementation over additional paid services.
