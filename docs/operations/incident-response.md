# Incident response guide

This lightweight guide applies to credential leaks, suspected abuse, vulnerability reports, privacy incidents, email mistakes, and service outages. It is designed for a solo maintainer: contain first, preserve evidence, avoid irreversible actions, and ask for help when needed.

## Immediate steps

1. **Contain:** stop active harm. Disable the smallest affected feature, revoke access, pause sending, or take the service offline only as needed.
2. **Rotate/revoke credentials first:** if a secret may be exposed, revoke or rotate it before deleting files or rewriting history.
3. **Preserve evidence:** capture timestamps, relevant logs, commit hashes, affected resources, and actor actions. Do not alter evidence unnecessarily.
4. **Assess scope:** determine what data, users, providers, repositories, emails, or infrastructure may be affected.
5. **Communicate carefully:** avoid public details that increase risk or expose user data. Use private vulnerability reporting channels where possible.
6. **Recover deliberately:** restore service with the smallest safe change and verify the fix.
7. **Follow up:** document root cause, controls added, and remaining actions.

## Credential-leak checklist

- [ ] Credential revoked/rotated at provider
- [ ] New credential stored only in approved secret store
- [ ] Exposure locations identified: git history, issues, pull requests, workflow logs, chat, local files, provider logs
- [ ] Unauthorized use assessed
- [ ] History cleanup considered only after rotation
- [ ] Scanner/policy gap documented

## Incident timeline template

| Time | Event | Actor/source | Evidence | Action taken |
| --- | --- | --- | --- | --- |
| TBD | Initial detection | TBD | TBD | TBD |

Use `/incident-response` for guided triage. Do not perform destructive containment actions through automation without explicit approval.
