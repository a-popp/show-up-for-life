"""Shared secret-pattern helpers for workspace validation.

The patterns here are intentionally conservative. They complement, rather than
replace, gitleaks and pre-commit's detect-private-key hook.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class SecretPattern:
    name: str
    regex: re.Pattern[str]
    secret_group: int = 0


@dataclass(frozen=True)
class Finding:
    path: str
    line_number: int
    pattern_name: str
    line: str


def _compile(pattern: str) -> re.Pattern[str]:
    return re.compile(pattern)


SECRET_PATTERNS: tuple[SecretPattern, ...] = (
    SecretPattern(
        "private-key-block",
        _compile(r"-----BEGIN (?:RSA |DSA |EC |OPENSSH |PGP |ENCRYPTED )?PRIVATE KEY(?: BLOCK)?-----"),
    ),
    SecretPattern(
        "aws-access-key-id",
        _compile(r"\b(?:AKIA|ASIA)[0-9A-Z]{16}\b"),
    ),
    SecretPattern(
        "github-token",
        _compile(r"\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{30,255}\b"),
    ),
    SecretPattern(
        "github-fine-grained-token",
        _compile(r"\bgithub_pat_[A-Za-z0-9_]{30,255}\b"),
    ),
    SecretPattern(
        "digitalocean-token",
        _compile(r"\bdop_v1_[a-f0-9]{64}\b"),
    ),
    SecretPattern(
        "mailgun-legacy-key",
        _compile(r"\bkey-[0-9a-f]{32}\b"),
    ),
    SecretPattern(
        "slack-token",
        _compile(r"\bxox[baprs]-[A-Za-z0-9-]{10,}\b"),
    ),
    SecretPattern(
        "stripe-live-secret-key",
        _compile(r"\bsk_live_[A-Za-z0-9]{16,}\b"),
    ),
    SecretPattern(
        "sendgrid-api-key",
        _compile(r"\bSG\.[A-Za-z0-9_-]{16,}\.[A-Za-z0-9_-]{16,}\b"),
    ),
    SecretPattern(
        "jwt-like-token",
        _compile(r"\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b"),
    ),
    SecretPattern(
        "credentialed-url",
        _compile(r"\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|redis|https?)://[^\s:/@]+:[^\s/@]+@"),
    ),
    SecretPattern(
        "generic-secret-assignment",
        _compile(
            r"(?i)\b(?:password|passwd|secret|api[_-]?key|token|private[_-]?key|connection[_-]?string)"
            r"\b\s*[:=]\s*[\"']?([^\s\"']{8,})"
        ),
        secret_group=1,
    ),
)

HIGH_RISK_EXTENSIONS = {
    ".key",
    ".pem",
    ".p12",
    ".pfx",
    ".crt",
    ".cer",
    ".der",
}

ALLOWED_ENV_EXAMPLES = {
    ".env.example",
    ".env.sample",
    ".env.template",
}

PLACEHOLDER_RE = re.compile(
    r"(?ix)^(?:"
    r"replace[-_ ]?me|placeholder|example|dummy|changeme|change[-_ ]?me|todo|none|null|"
    r"your[-_ ]?(?:api[-_ ]?)?(?:key|token|secret|password)(?:[-_ ]?here)?|"
    r"__[a-z0-9_-]+__|<[^>]+>|\$\{[^}]+\}|\{\{[^}]+\}\}"
    r")$"
)

ALLOWLIST_MARKER = "pragma: allowlist secret"


def looks_like_placeholder(value: str) -> bool:
    cleaned = value.strip().strip('"\'')
    if not cleaned:
        return True
    if len(cleaned) < 8:
        return True
    return bool(PLACEHOLDER_RE.fullmatch(cleaned))


def redact_line(line: str, pattern: SecretPattern) -> str:
    def replacement(match: re.Match[str]) -> str:
        if pattern.secret_group:
            return match.group(0).replace(match.group(pattern.secret_group), "***REDACTED***", 1)
        return "***REDACTED***"

    return pattern.regex.sub(replacement, line.rstrip("\n"))


def scan_text(text: str, path: str = "<text>") -> list[Finding]:
    findings: list[Finding] = []
    for line_number, line in enumerate(text.splitlines(), start=1):
        if ALLOWLIST_MARKER in line:
            continue
        for pattern in SECRET_PATTERNS:
            match = pattern.regex.search(line)
            if not match:
                continue
            secret_value = match.group(pattern.secret_group) if pattern.secret_group else match.group(0)
            if looks_like_placeholder(secret_value):
                continue
            findings.append(
                Finding(
                    path=path,
                    line_number=line_number,
                    pattern_name=pattern.name,
                    line=redact_line(line, pattern),
                )
            )
            break
    return findings


def is_high_risk_secret_path(path: str | Path) -> bool:
    p = Path(path)
    name = p.name.lower()
    suffix = p.suffix.lower()
    if name in ALLOWED_ENV_EXAMPLES:
        return False
    if name == ".env" or name.startswith(".env."):
        return True
    if name in {"id_rsa", "id_ed25519"} or name.startswith(("id_rsa.", "id_ed25519.")):
        return True
    if suffix in HIGH_RISK_EXTENSIONS:
        return True
    parts = {part.lower() for part in p.parts}
    return "secrets" in parts or ".secrets" in parts
