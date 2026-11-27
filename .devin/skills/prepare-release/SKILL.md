---
name: prepare-release
description: Run a public-readiness or release checklist
---

Prepare a release/public-readiness assessment without publishing or changing settings:

- full-history secret scan status and rotation-first leak policy
- license, SECURITY.md, README, privacy/security docs
- workflow pinning, permissions, dependency scanning, and CI status
- branch protection/rulesets and visibility transition requirements
- accessibility, privacy/safety, product ethics, and open decisions
- deployment state, cost exposure, rollback, and operational readiness
Return a concise go/no-go checklist with blockers and evidence. Do not push or mutate GitHub/cloud/email resources.
