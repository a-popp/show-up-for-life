# Target architecture

This is the planning direction, not deployed infrastructure. The future application is expected to be a TypeScript modular monolith at the repository root using Next.js/React, Node, PostgreSQL, and npm with `package-lock.json`.

## Principles

- Keep one deployable application and one primary database until scale clearly justifies otherwise.
- Use strict module boundaries inside the monolith rather than premature microservices.
- Prefer database-backed jobs/outbox patterns for reminders, cancellation evaluation, and email delivery; no Redis initially unless a concrete requirement justifies it.
- Validate input server-side, enforce authorization server-side, and keep secrets out of the browser.
- Design around data minimization, export/delete behavior, and sensitive visibility rules from the start.
- Optimize for low cost, low operational burden, accessibility, and maintainability by one maintainer.

## Future components

- **Web/application service:** Next.js/React and Node in a single root application.
- **Database:** PostgreSQL, eventually a small managed DigitalOcean database because backups and patching are worth the cost.
- **Transactional email:** Mailgun only for necessary transactional messages. Development uses test mode/local inspection; no open/click tracking by default.
- **Hosting:** DigitalOcean App Platform is the future direction after explicit approval.
- **Jobs:** Database-backed scheduling/outbox where practical for RSVP cutoffs, threshold evaluation, spontaneous expiry, and notification delivery.

## Explicit non-goals initially

- Native mobile applications
- Real-time or device location collection
- Payments or monetization
- Dating/matchmaking positioning
- Product AI features without explicit approval
- Microservices, service mesh, Kubernetes, or multi-cloud deployment
- Per-pull-request preview apps, because they increase cost

## Architecture review trigger

Use `/review-architecture` before introducing a new service, queue, cache, infrastructure dependency, product AI feature, or major data flow.
