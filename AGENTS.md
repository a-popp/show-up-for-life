# Show Up For Life project rules

- `design.md` is the authoritative product requirements source. Resolve conflicts in this order: user wellbeing/framing, trust and safety, privacy, ethical design, then other requirements.
- Never shame, surveil, penalize, or pressure users. No dark patterns, manipulative urgency, or sensitive inferences.
- Never commit, print, or expose secrets, real dotenv files, private keys, certificates, passwords, or tokens. Rotate exposed credentials before cleanup.
- Do not provision or mutate cloud/email resources, send real email, push to remote repositories, or perform destructive actions without explicit user approval.
- Minimize cost and operational complexity. Prefer the planned TypeScript/Next.js modular monolith, PostgreSQL, database-backed jobs/outbox, and simple DigitalOcean hosting over premature services.
- Use `/trace-requirements` before implementing product behavior and `/verify` before completion.
- Keep commits free of local machine paths, personal secrets, and private operational details.
