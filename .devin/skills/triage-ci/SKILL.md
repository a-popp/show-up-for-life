---
name: triage-ci
description: Inspect a CI failure and propose the smallest safe fix
---

Triage the requested GitHub Actions/CI failure using read-only inspection first:

1. Identify workflow, job, commit/ref, failing step, and exact error.
2. Compare with local files and recent changes.
3. Propose the smallest fix and verification command.
Do not rewrite workflows, weaken security checks, rotate secrets, or mutate repository settings automatically. Ask before any write or GitHub mutation.
