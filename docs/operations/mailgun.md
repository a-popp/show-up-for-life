# Mailgun operating boundaries

Mailgun is planned only for necessary transactional email: invitations, RSVP/threshold outcomes, reminders, account/security notices, and similar user-triggered messages. It is not for marketing email, tracking-heavy engagement optimization, or bulk newsletters.

## Development boundaries

- Do not mutate Mailgun domains, routes, templates, webhooks, mailing lists, suppressions, or credentials without explicit approval.
- Do not send real email during development. Use Mailgun test mode, local captured output, or approved test recipients only.
- Do not place API keys in committed files, shell commands, logs, screenshots, or chat.
- Respect suppression lists; never attempt to re-add or work around a suppressed recipient.
- Disable open/click tracking by default unless a future documented requirement clearly justifies it and privacy review approves it.

## Future setup checklist

- [ ] Confirm sender identity, reply-to behavior, and user-facing from name.
- [ ] Configure domain/DNS records deliberately and document who owns them.
- [ ] Use environment-specific domains or test mode so development cannot accidentally email real users.
- [ ] Store sending credentials in approved secret stores only.
- [ ] Create minimal templates with accessible/plain-language content and no sensitive data beyond necessity.
- [ ] Version templates or template variables in a way that can be reviewed.
- [ ] Implement unsubscribe/preferences where legally or product-appropriate; transactional security messages may differ from optional reminders.
- [ ] Test bounce, complaint, delivery failure, and suppression behavior before launch.

Use `/review-email` before implementing or changing email behavior.
