# Secret-handling policy

## Approved locations

- Local development secrets: uncommitted `.env.local` or the developer's local secret store. These files must never be committed.
- CI/CD secrets: GitHub Actions repository or environment secrets, created only when needed.
- Devin Cloud secrets: the Devin secrets manager, uploaded through a secret-safe flow that does not expose values in chat.
- Provider consoles: DigitalOcean and Mailgun control panels for account-owned credentials.

Do not duplicate MCP endpoints or credentials in project configuration. This workspace relies on existing user/account-level MCP setup.

## Never commit

- `.env`, `.env.local`, or other real dotenv files
- private keys, certificates, SSH keys, API tokens, passwords, session cookies, or connection strings
- screenshots or logs containing secrets
- local Devin overrides such as `.devin/config.local.json` or `.devin/mcp_config.local.json`

`.env.example` may contain only blank values and explicitly safe local placeholders.

For Phase 00 local development, `.env.local` must be created manually and must not be committed. `POSTGRES_PASSWORD`, the credentialed local `DATABASE_URL`, and `BETTER_AUTH_SECRET` are local-only generated secrets; the auth secret must be high entropy and at least 32 characters. CI creates an ephemeral test-only auth secret inside the job rather than storing one in repository configuration.

## Layered scanning

1. Devin permissions/hooks reduce accidental reads, writes, and shell exposure.
2. `.gitignore` prevents high-risk paths from being tracked. `.devinignore` is defense in depth for Devin Desktop; standalone Devin CLI relies primarily on `.gitignore` plus permissions/hooks.
3. pre-commit runs private-key detection plus `scripts/check_secrets.py --staged`.
4. CI runs the custom scanner and full-history gitleaks with `gitleaks.toml`.
5. For visibility or hosting-provider changes, repeat the full-history review and confirm GitHub-native protections using `github-hardening.md`.

## False positives

Do not weaken scanning silently. Prefer one of these approaches:

1. rewrite the example so it no longer resembles a real credential;
2. use a clearly blank or `<PLACEHOLDER>`-style value;
3. add a narrowly scoped allowlist entry with a short justification;
4. use the scanner's single-line marker only for clearly documented test/example material.

## Leak response

If a real credential may have been exposed: rotate/revoke it first, then assess repository history, issues, pull requests, workflow logs, chat transcripts, and provider logs. Only after rotation consider history rewriting. Follow `docs/operations/incident-response.md` and `/incident-response`.
