# Phase 01 — Identity, profile, and privacy baseline

> **Status:** Not started<br>
> **Depends on:** Phase 00<br>
> **Release significance:** Private development alpha prerequisite

This run card is an execution contract for one phase. Do not start implementation until the outstanding questions are resolved, explicitly deferred, or converted into approved assumptions. `../../../design.md` is authoritative for product behavior.

## Purpose

Establish safe accounts before any social graph or invitation behavior exists. Users must understand that authentication and lightweight verification are not safety guarantees, while privacy consent and lifecycle rights are designed in from the start.

## Requirement trace

- Section 3.1 — account creation, authentication, MFA/passkeys
- Task 2 — adults-only service and proportionate verification
- Task 5 — consent, privacy rights, data minimization
- Task 4 — clear non-guarantee of safety

Use `/trace-requirements` before implementation and map concrete tickets/commits back to these requirements.

## Functionality included

- Sign-up, sign-in, logout, session management, and account status handling
- Verified email flow using local/test delivery only
- Passkey and/or TOTP MFA support through Better Auth
- 18+ self-declaration captured at account creation
- Basic profile, display identity, and time-zone selection
- Plain-language consent capture for sensitive optional features
- Initial privacy preference records
- Account export/delete architecture, even if full fulfillment arrives later
- Age-assurance risk workflow foundation for reports/review
- Clear copy that verification does not guarantee user safety

## Explicitly out of scope or deferred

- Third-party identity-document verification
- Public profiles or discoverability before visibility controls exist
- Mailgun production integration or real email delivery
- Behavioral scoring, reliability scoring, or sensitive inference

## Implementation notes for the agent

- Separate authentication identity from public/social profile data.
- Make time-zone handling explicit; never infer or store a time zone without user visibility/control.
- Design deletion/export so later modules register owned data rather than retrofitting every table.
- Use neutral, non-alarming copy for age assurance and verification.

## Data and model changes

- users/profiles/time-zone fields
- Better Auth account/session/verification/MFA tables
- age attestations
- consent records
- audit events
- initial export/delete request tables

## Infrastructure additions or changes

- Better Auth database-backed authentication configuration.
- Local/test email delivery adapter; no external provider mutation.
- No production infrastructure change.

## Test and verification gates

### Required automated checks

- Unit/integration tests for sign-up, verified email state, MFA setup, session revocation, age attestation, and consent capture
- Security tests verifying session cookies and unauthenticated access behavior
- Accessibility checks for authentication and profile forms
- Workspace validation and secret scanning

### Phase-specific acceptance checks

- A new local test user can register, verify email in test mode, configure MFA/passkey where supported, and manage basic profile/time zone.
- Verification limitations and adult-only requirements are plainly disclosed.
- No user is searchable or visible to others merely because an account exists.

Before completion, run `/verify` and the repository validation suite appropriate to the files changed.

## Manual steps for the user

- Review and approve adult-only, verification, privacy, and non-guarantee copy.
- Generate local-only auth secrets; never commit them.
- Decide passkey/TOTP rollout order if both cannot be completed in the phase.

## Outstanding questions before implementation

1. Should passkeys and TOTP both ship initially, or should one be primary and the other a fast-follow?
2. What display identifier model should be used: unique username, non-unique display name, or both?
3. What account deletion grace period, if any, should apply before irreversible deletion/anonymization?

## Completion criteria

Accounts can exist without creating any social exposure by default. Privacy and verification constraints are represented in data and UI rather than documentation only. The next phase can build friendships/groups without reworking identity.

## Safety, privacy, and cost boundaries

- Never commit secrets or real dotenv files.
- Do not provision or mutate DigitalOcean/Mailgun resources, send real email, push, or perform destructive actions without explicit approval.
- Preserve privacy-by-default, nonjudgmental copy, and least-privilege access.
- Prefer simple PostgreSQL-backed implementation over additional paid services.
