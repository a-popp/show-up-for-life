#!/usr/bin/env python3
"""PreToolUse guardrail hook for secret files and destructive commands."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

from security_patterns import is_high_risk_secret_path, scan_text  # noqa: E402

DESTRUCTIVE_COMMAND_PATTERNS = [
    (re.compile(r"\brm\s+[^\n]*(?:-rf|-fr|-r\s+-f|-f\s+-r)\b", re.I), "recursive forced deletion"),
    (re.compile(r"\bgit\s+push\b[^\n]*\s--force(?:\s|$)", re.I), "force-pushing rewrites remote history"),
    (re.compile(r"\bgit\s+reset\s+--hard\b", re.I), "git reset --hard can discard uncommitted work"),
    (re.compile(r"\bgit\s+clean\s+-[^\n]*f", re.I), "git clean can permanently delete untracked files"),
    (re.compile(r"\b(?:terraform|tofu)\s+destroy\b", re.I), "infrastructure destruction"),
    (re.compile(r"\bkubectl\s+delete\b", re.I), "Kubernetes deletion"),
]

SECRET_FILE_COMMAND = re.compile(
    r"\b(?:cat|type|copy|cp|Get-Content)\b[^\n]*(?:\.env(?:\.[A-Za-z0-9_-]+)?|id_rsa|id_ed25519|\.(?:pem|key|p12|pfx|crt|cer|der)\b)",
    re.I,
)


def emit_block(reason: str) -> None:
    print(json.dumps({"decision": "block", "reason": reason}))


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except json.JSONDecodeError:
        return 0

    tool_name = str(payload.get("tool_name", ""))
    tool_input = payload.get("tool_input") or {}
    serialized_input = json.dumps(tool_input, sort_keys=True, default=str)

    if tool_name in {"write", "edit", "notebook_edit"}:
        file_path = str(tool_input.get("file_path") or tool_input.get("notebook_path") or "")
        if file_path and is_high_risk_secret_path(file_path):
            emit_block(
                "Writes to dotenv files, private keys, certificates, or secret directories are blocked. "
                "Use approved placeholder examples only; create real local secrets outside the agent workflow."
            )
            return 0
        findings = scan_text(serialized_input, "<tool-input>")
        if findings:
            emit_block(
                "The proposed file edit appears to contain secret-like material. "
                "Replace it with a blank placeholder or non-secret example before writing."
            )
            return 0

    if tool_name == "exec":
        command = str(tool_input.get("command", ""))
        for pattern, description in DESTRUCTIVE_COMMAND_PATTERNS:
            if pattern.search(command):
                emit_block(f"Destructive command blocked ({description}). Ask the user to perform it explicitly outside Devin if truly intended.")
                return 0
        if SECRET_FILE_COMMAND.search(command):
            emit_block("Shell command appears to print or copy a local secret/key/dotenv file. Inspect metadata or use approved secret tooling instead.")
            return 0
        findings = scan_text(command, "<command>")
        if findings:
            emit_block("Shell command appears to embed a secret. Do not place credentials in command lines, shell history, logs, or process arguments.")
            return 0

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
