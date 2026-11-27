---
name: review-email
description: Review transactional email/Mailgun behavior and safety boundaries
---

Review the requested email-related design or change without sending email or mutating Mailgun:

- transactional-only purpose and necessity
- test mode/local inspection during development
- no open/click tracking by default
- unsubscribe/preferences where applicable
- suppression-list respect and deliverability implications
- no secrets or real recipient data in logs/templates
- explicit approval required before any real send or Mailgun mutation
Report findings and the smallest safe implementation path.
