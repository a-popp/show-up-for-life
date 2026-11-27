---
description: Future TypeScript and Next.js implementation conventions
trigger: model_decision
---

For future application code, use strict TypeScript, accessible React components, server-side validation, data minimization, migration discipline, and npm with `package-lock.json`. Keep secrets server-side only. Favor modular-monolith boundaries and PostgreSQL-backed jobs/outbox over premature microservices, Redis, or complex infrastructure.
