# Future DigitalOcean App Platform runbook

This runbook is planning documentation only. Do not provision resources or mutate DigitalOcean settings until the user explicitly approves a deployment task.

## Intended small-scale shape

- One Next.js/Node service on DigitalOcean App Platform using the smallest practical instance.
- One small managed PostgreSQL database/cluster binding. Managed PostgreSQL is preferred despite cost because backups, patching, and recovery are important.
- Mailgun transactional email through provider API credentials stored as secrets.
- No per-pull-request preview apps initially because they increase cost.
- No Redis, object storage, CDN, custom domain, or additional service unless a concrete need is approved.

Check current DigitalOcean and Mailgun pricing at planning time; do not hard-code prices in repository documentation.

## Deployment gating

`.do/app.yaml.example` intentionally disables `deploy_on_push`. App Platform auto-deploy from a GitHub branch may build/deploy when a commit arrives and may not wait for GitHub Actions checks to pass, so it must not be enabled for production reliance without an equivalent non-bypassable gate. Before public/production reliance:

1. transition away from direct-to-main commits;
2. use branch protection/rulesets and pull requests with required checks; and
3. use an Actions-controlled deployment gate or a deployment model that cannot bypass checks.

## Manual pre-provisioning checklist

- [ ] Application exists and builds locally with `npm ci` and production build command.
- [ ] Current DigitalOcean Node.js buildpack supports the minimum Node.js version required by `package.json`.
- [ ] Database migration/bootstrap strategy documented and tested locally.
- [ ] Required runtime variables identified; no secrets committed.
- [ ] `.do/app.yaml.example` copied/adjusted into an active spec only after review.
- [ ] Smallest practical app instance selected after checking current pricing.
- [ ] Smallest managed PostgreSQL plan selected after checking backup/recovery support.
- [ ] Least-privilege DigitalOcean token created only if GitHub/Actions deployment requires it.
- [ ] GitHub environment approvals configured before production deployment.
- [ ] Mailgun domain/test mode/sender behavior reviewed using `../operations/mailgun.md`.
- [ ] Rollback and incident-response path documented.
- [ ] User explicitly approves provisioning and expected recurring cost.

## Provisioning boundary

This workspace must not create apps, databases, domains, tokens, firewall rules, registry resources, or Mailgun configuration. Use `/plan-deployment` to produce a plan, then wait for explicit human approval.
