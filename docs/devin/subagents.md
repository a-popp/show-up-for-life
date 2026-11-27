# Devin subagent guidance

Custom subagent profiles live in `.devin/agents/` and are intentionally constrained. They are experimental Devin CLI functionality; if a profile fails to load, fall back to the built-in `subagent_explore` profile for read-only work.

## Available profiles

- `researcher` — read/grep/glob only; design/codebase research with citations
- `security-reviewer` — read-only ASVS/SSDF-oriented security review
- `privacy-reviewer` — read-only privacy, trust/safety, and anti-surveillance review
- `accessibility-reviewer` — read-only WCAG 2.2 AA and inclusive-design review
- `test-runner` — read/grep/glob plus constrained execution for requested checks; no editing

## Usage rules

- Prefer one focused subagent over broad fan-out. Each subagent adds inference cost and context.
- Use foreground subagents for interactive or approval-sensitive work because background subagents cannot prompt for new permissions.
- Use background subagents only for independent read-only audits that do not require new permissions.
- Do not use custom write-capable implementation agents in this workspace.
- Do not enable nested subagents; the cost and coordination risk outweigh the benefit for this hobby project.
- Treat subagent findings as review input, not truth. The parent agent should verify important claims before acting.

The skills `/review-security`, `/review-privacy-safety`, `/review-accessibility`, `/verify`, and `/review-architecture` invoke these constrained profiles where appropriate.
