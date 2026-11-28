# Show Up For Life project rules

- `design.md` is the authoritative product requirements source. Resolve conflicts in this order: user wellbeing/framing, trust and safety, privacy, ethical design, then other requirements.
- Never shame, surveil, penalize, or pressure users. No dark patterns, manipulative urgency, or sensitive inferences.
- Never commit, print, or expose secrets, real dotenv files, private keys, certificates, passwords, or tokens. Rotate exposed credentials before cleanup.
- Do not provision or mutate cloud/email resources, send real email, push to remote repositories, or perform destructive actions without explicit user approval.
- Minimize cost and operational complexity. Prefer the planned TypeScript/Next.js modular monolith, PostgreSQL, database-backed jobs/outbox, and simple DigitalOcean hosting over premature services.
- Use `/trace-requirements` before implementing product behavior, `/align-documentation` when documentation may diverge from implementation or before public/release transitions, and `/verify` before completion.
- Keep commits free of local machine paths, personal secrets, and private operational details.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
