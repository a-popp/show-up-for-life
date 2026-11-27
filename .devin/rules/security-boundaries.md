---
description: Security and secret-handling boundaries
trigger: always_on
---

- Never read, write, print, or commit real secrets, dotenv files, private keys, certificates, or credential stores.
- Treat shell commands, MCP mutations, deployment, email sending, git push, and destructive operations as approval-sensitive.
- If a credential may be exposed, recommend rotation/revocation before history cleanup.
- Preserve least privilege in CI/CD and never weaken secret scanning to silence findings.
