#!/usr/bin/env python3
"""UserPromptSubmit hook that injects concise situational reminders."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

from security_patterns import scan_text  # noqa: E402


def emit_context(text: str) -> None:
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "UserPromptSubmit",
            "additionalContext": text,
        }
    }))


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except json.JSONDecodeError:
        return 0
    prompt = str(payload.get("prompt", ""))
    lowered = prompt.lower()
    reminders: list[str] = []

    if any(word in lowered for word in ("commit", "push", "public", "release")):
        reminders.append("Before committing or publishing, run the workspace validation and secret scan; never commit real secrets, keys, certificates, or dotenv files.")
    if any(word in lowered for word in ("deploy", "digitalocean", "app platform", "provision", "database", "mailgun", "email")):
        reminders.append("Do not provision or mutate DigitalOcean/Mailgun resources or send real email without explicit user approval; prefer dry-run inspection and least-cost options.")
    if any(word in lowered for word in ("feature", "implement", "build", "requirement", "design")):
        reminders.append("For product behavior, trace implementation back to design.md and use /trace-requirements before coding.")
    if scan_text(prompt, "<prompt>"):
        reminders.append("The prompt may contain secret-like material. Do not repeat it, write it to files, or include it in commits; recommend rotation if it is real.")

    if reminders:
        emit_context(" ".join(reminders))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
