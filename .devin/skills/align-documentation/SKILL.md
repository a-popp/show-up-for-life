---
name: align-documentation
description: Fact-check and align documentation with code, configuration, product decisions, and public-facing audience expectations
---

Use this skill before releases/public visibility changes, after architecture/tooling/infrastructure/product-behavior changes, when docs may be stale, or when the user asks for documentation alignment.

## Authority order

Use repository evidence in this order:

1. Executable code, configuration, schemas, migrations, workflows, scripts, package manifests, lockfiles, and tests for what is currently true.
2. `design.md` for intended product behavior and requirement priority.
3. `docs/product/open-decisions.md` and phase run cards for confirmed decisions, phase scope, and implementation status.
4. Existing documentation, which is material to correct rather than authoritative evidence.

If documentation conflicts with verified code/configuration, normally update the documentation. Do not change code merely to match documentation. If code appears to violate `design.md`, confirmed decisions, safety/privacy constraints, or the user's intent, stop and surface the conflict instead of choosing silently.

## Workflow

1. Establish scope: full-repository documentation audit, a named document, a diff, a phase, or a specific claim. Determine whether the user asked for a read-only review or for edits that align the docs.
2. Inspect current repository state, including git status/diff, visibility or release context supplied by the user, and relevant implementation files. Do not mutate GitHub, cloud, email, or repository settings.
3. Inventory the affected documentation: README, contributing/security guidance, product docs, architecture, CI/CD, operations, privacy, run cards, Devin/agent docs, and inline examples as applicable.
4. Build a fact matrix before editing. Depending on scope, verify:
   - application implemented vs planned/deferred behavior
   - runtime, package, database, action, and tool versions
   - npm/Python/Docker commands and whether they require `.env.local` or other manual setup
   - CI jobs, gates, skipped jobs, and known platform limitations
   - database/auth/job/email/cloud implementation state
   - secret-handling, incident-response, and deployment boundaries
   - phase/run-card status, open decisions, and requirement traceability
   - public/private repository posture and GitHub feature availability
5. Compare documentation claims against the fact matrix. Check version numbers, file paths, links, commands, checkboxes, status words, examples, prerequisites, manual steps, warnings, and statements about what is implemented or deployed.
6. Classify each finding as a factual error, stale status, missing prerequisite, broken link/path, unsafe instruction, ambiguous command, inconsistent terminology, missing decision/status, tone/audience mismatch, or unnecessary private operational detail.
7. For an alignment/edit request, make the smallest accurate documentation changes. Preserve existing structure and deep links unless there is a clear reason to change them. Do not use documentation edits to hide uncertainty; distinguish clearly among implemented, planned, deferred, manual, unavailable, and unknown states.
8. For a read-only review, report findings with precise file/line citations and proposed minimal corrections rather than editing.

## Style, tone, and audience

Documentation is public-facing and must serve both humans working manually and AI agents implementing future phases. It should remain transparent that much of the project is developed through AI-agent-assisted workflows under human direction, without implying that agents are infallible or removing human accountability.

When editing or reviewing documentation:

- Use plain, direct, task-oriented language. Prefer short sections, tables where they reduce ambiguity, and copy-pasteable commands.
- Write for a technical but not necessarily expert reader. Define acronyms or project-specific terms at first use when needed.
- Give agents precise sources of truth, constraints, file paths, commands, and verification gates; give humans enough context to understand why a step matters.
- Keep instructions cross-platform where practical. Prefer npm scripts and Python module commands over shell-specific syntax; call out Windows/Linux/macOS differences when unavoidable.
- Never include secrets, credentials, personal data, machine-specific paths, private hostnames, or private operational details.
- Use inclusive, accessible, non-shaming language consistent with the product ethics in `design.md` and `AGENTS.md`.
- Avoid hype, marketing claims, certainty theater, or unsubstantiated security/privacy promises.
- Do not state that a check, setting, deployment, protection, or integration is active unless there is evidence in the repository or the user has explicitly confirmed it.
- Mark future work and risks honestly. Do not present placeholders, examples, or planned resources as production reality.

## Output and verification

Return:

- a concise summary of what was aligned or reviewed
- factual corrections and the evidence behind important or surprising corrections
- remaining uncertainties or user decisions needed
- files changed, if any
- exact verification commands and results

Before completion after edits, run the appropriate checks, normally `python scripts/check_workspace.py --ci`, `python scripts/check_secrets.py --all`, relevant Python tests when validation scripts changed, and formatting/markdown validation. Run `/verify` for broad changes. Do not commit, push, publish, or mutate external services unless the user explicitly asks.
