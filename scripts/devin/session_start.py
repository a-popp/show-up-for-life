#!/usr/bin/env python3
"""SessionStart hook injecting compact project operating constraints."""

from __future__ import annotations

import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
required = ["design.md", "AGENTS.md", ".devin/config.json", "scripts/check_workspace.py", "scripts/check_secrets.py"]
missing = [path for path in required if not (ROOT / path).exists()]

parts = []
if missing:
    parts.append("Workspace scaffolding appears incomplete; missing: " + ", ".join(missing) + ".")
if not shutil.which("python") and not shutil.which("python3"):
    parts.append("Python is not on PATH; workspace validation scripts cannot run.")
if (ROOT / "package.json").exists() and not shutil.which("node"):
    parts.append("package.json exists but Node is not on PATH.")

parts.append(
    "design.md is authoritative for product behavior. Never commit secrets; do not provision DigitalOcean/Mailgun resources, "
    "send real email, push, or perform destructive actions without explicit approval. Use /trace-requirements before product implementation and /verify before completion."
)

print(json.dumps({
    "hookSpecificOutput": {
        "hookEventName": "SessionStart",
        "additionalContext": " ".join(parts),
    }
}))
