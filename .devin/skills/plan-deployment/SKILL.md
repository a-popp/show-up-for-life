---
name: plan-deployment
description: Create a cost-aware DigitalOcean deployment plan without provisioning
---

Produce a deployment plan only; do not provision or mutate anything.

Cover DigitalOcean App Platform, smallest practical service, small managed PostgreSQL, required secrets/environment variables, Mailgun boundary, migration/bootstrapping, rollback, cost controls, and operational risks. Check current documentation/pricing only if needed rather than hard-coding prices. Include the caveat that App Platform auto-deploy may not wait for GitHub Actions checks, and require explicit human approval before any mutation.
