#!/usr/bin/env python3
"""Validate the repository workspace scaffolding and safety configuration."""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path
from urllib.parse import unquote

from security_patterns import is_high_risk_secret_path

ROOT = Path(__file__).resolve().parents[1]

REQUIRED_FILES = [
    ".gitignore",
    ".devinignore",
    ".gitattributes",
    ".editorconfig",
    ".nvmrc",
    ".python-version",
    ".env.example",
    ".pre-commit-config.yaml",
    "requirements-dev.txt",
    "gitleaks.toml",
    "LICENSE",
    "README.md",
    "CONTRIBUTING.md",
    "SECURITY.md",
    "design.md",
    "AGENTS.md",
    ".devin/config.json",
    ".devin/hooks.v1.json",
    ".devin/blueprint.yaml",
    ".github/workflows/ci.yml",
    ".github/workflows/deploy-preflight.yml",
    ".github/dependabot.yml",
    ".github/CODEOWNERS",
    ".do/app.yaml.example",
    ".github/pull_request_template.md",
    ".github/ISSUE_TEMPLATE/bug_report.yml",
    ".github/ISSUE_TEMPLATE/feature_request.yml",
    "docs/product/open-decisions.md",
    "docs/product/requirements-traceability.md",
    "docs/privacy/data-flow-register.md",
    "docs/architecture/target-architecture.md",
    "docs/devin/subagents.md",
    "docs/security/secrets.md",
    "docs/security/github-hardening.md",
    "docs/operations/mailgun.md",
    "docs/operations/incident-response.md",
    "docs/ci-cd/overview.md",
    "docs/ci-cd/app-platform.md",
    "scripts/security_patterns.py",
    "scripts/devin/pre_tool_guard.py",
    "scripts/devin/session_start.py",
    "scripts/devin/user_prompt_context.py",
    "scripts/check_secrets.py",
    "scripts/check_workspace.py",
    "tests/test_workspace_scripts.py",
]

REQUIRED_GITIGNORE_ENTRIES = [
    ".env",
    ".env.*",
    "!.env.example",
    "*.pem",
    "*.key",
    ".venv-tools/",
    "node_modules/",
    ".devin/config.local.json",
    ".devin/mcp_config.local.json",
    "AGENTS.local.md",
]

KNOWN_HOOK_EVENTS = {
    "PreToolUse",
    "PostToolUse",
    "PermissionRequest",
    "UserPromptSubmit",
    "Stop",
    "PostCompaction",
    "SessionStart",
    "SessionEnd",
}


def rel(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def validate_required_files(errors: list[str]) -> None:
    for required in REQUIRED_FILES:
        if not (ROOT / required).is_file():
            errors.append(f"missing required file: {required}")
    if (ROOT / ".do/app.yaml").exists():
        errors.append(".do/app.yaml must not exist yet; use .do/app.yaml.example until deployment is approved")


def validate_gitignore(errors: list[str]) -> None:
    path = ROOT / ".gitignore"
    if not path.is_file():
        return
    lines = {line.strip() for line in path.read_text(encoding="utf-8").splitlines()}
    for entry in REQUIRED_GITIGNORE_ENTRIES:
        if entry not in lines:
            errors.append(f".gitignore missing required entry: {entry}")


def validate_json_files(errors: list[str]) -> None:
    config_path = ROOT / ".devin/config.json"
    if config_path.is_file():
        try:
            config = json.loads(config_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            errors.append(f".devin/config.json is not strict JSON: {exc}")
        else:
            imports = config.get("read_config_from", {})
            if imports.get("agents_standard") is not True:
                errors.append('.devin/config.json must keep read_config_from.agents_standard true')
            for key in ("cursor", "windsurf", "claude", "copilot", "codex", "kiro", "opencode", "zed"):
                if imports.get(key) is not False:
                    errors.append(f".devin/config.json must disable external config import: {key}")
            permissions = config.get("permissions", {})
            ask = set(permissions.get("ask", []))
            deny = set(permissions.get("deny", []))
            for required_ask in ("exec", "Write(.devin/**)", "Write(.github/**)", "mcp__*"):
                if required_ask not in ask:
                    errors.append(f".devin/config.json missing required ask rule: {required_ask}")
            for required_deny in ("Read(**/.env)", "Write(**/.env)", "Read(**/*.pem)", "Write(**/*.key)", "Exec(rm -rf)", "Exec(sudo)"):
                if required_deny not in deny:
                    errors.append(f".devin/config.json missing required deny rule: {required_deny}")

    hooks_path = ROOT / ".devin/hooks.v1.json"
    if hooks_path.is_file():
        try:
            hooks = json.loads(hooks_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            errors.append(f".devin/hooks.v1.json is not strict JSON: {exc}")
        else:
            if not isinstance(hooks, dict):
                errors.append(".devin/hooks.v1.json must be a JSON object keyed by hook event")
            else:
                unknown = sorted(set(hooks) - KNOWN_HOOK_EVENTS)
                if unknown:
                    errors.append(f".devin/hooks.v1.json has unknown hook events: {', '.join(unknown)}")
                for event_name, entries in hooks.items():
                    if not isinstance(entries, list):
                        errors.append(f"hook event {event_name} must contain a list")
                        continue
                    for entry in entries:
                        for hook in entry.get("hooks", []):
                            command = hook.get("command", "")
                            for script in re.findall(r"(scripts/[A-Za-z0-9_./-]+\.py)", command):
                                if not (ROOT / script).is_file():
                                    errors.append(f"hook command references missing script: {script}")


def validate_precommit(errors: list[str]) -> None:
    requirements = ROOT / "requirements-dev.txt"
    if requirements.is_file():
        if not re.search(r"^pre-commit==4\.7\.0$", requirements.read_text(encoding="utf-8"), re.M):
            errors.append("requirements-dev.txt must pin pre-commit==4.7.0")
    config = ROOT / ".pre-commit-config.yaml"
    if config.is_file():
        text = config.read_text(encoding="utf-8")
        for hook_id in ("detect-private-key", "check-added-large-files", "project-secret-scan", "workspace-config-check"):
            if hook_id not in text:
                errors.append(f".pre-commit-config.yaml missing hook: {hook_id}")


def validate_workflows(errors: list[str]) -> None:
    workflows = sorted((ROOT / ".github/workflows").glob("*.yml")) if (ROOT / ".github/workflows").is_dir() else []
    if not workflows:
        errors.append("missing GitHub workflow files")
        return
    for workflow in workflows:
        text = workflow.read_text(encoding="utf-8")
        if "pull_request_target" in text:
            errors.append(f"{rel(workflow)} must not use pull_request_target")
        if not re.search(r"(?m)^permissions:\s*\{\s*\}\s*$", text) and not re.search(r"(?m)^permissions:\s*\n(?:\s+[a-z-]+:\s+(?:read|none)\s*\n?)+", text):
            errors.append(f"{rel(workflow)} must declare least-privilege permissions")
        for match in re.finditer(r"uses:\s*([A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+(?:/[A-Za-z0-9_.-]+)?)@([^\s#]+)", text):
            action, ref = match.groups()
            if action.startswith(("actions/", "gitleaks/", "rhysd/", "github/")) and not re.fullmatch(r"[0-9a-f]{40}", ref):
                errors.append(f"{rel(workflow)} action {action} is not pinned to a full 40-character SHA")


def validate_env_example(errors: list[str]) -> None:
    path = ROOT / ".env.example"
    if not path.is_file():
        return
    allowed_nonempty = {
        "APP_ENV": {"development"},
        "APP_BASE_URL": {"http://localhost:3000"},
    }
    for line_number, raw in enumerate(path.read_text(encoding="utf-8").splitlines(), start=1):
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        if "=" not in line:
            errors.append(f".env.example line {line_number} is not KEY=VALUE syntax")
            continue
        key, value = line.split("=", 1)
        if value and value not in allowed_nonempty.get(key, set()):
            errors.append(f".env.example line {line_number} must be blank or an approved local placeholder")


def validate_python_syntax(errors: list[str]) -> None:
    import py_compile

    for script in sorted((ROOT / "scripts").rglob("*.py")):
        try:
            py_compile.compile(str(script), doraise=True)
        except py_compile.PyCompileError as exc:
            errors.append(f"Python syntax error in {rel(script)}: {exc.msg}")


def validate_markdown_links(errors: list[str]) -> None:
    markdown_files = sorted(ROOT.glob("*.md")) + sorted((ROOT / "docs").rglob("*.md")) if (ROOT / "docs").is_dir() else sorted(ROOT.glob("*.md"))
    link_re = re.compile(r"(?<!!)\[[^\]]*\]\(([^)]+)\)")
    for markdown in markdown_files:
        if not markdown.is_file():
            continue
        text = markdown.read_text(encoding="utf-8")
        for target in link_re.findall(text):
            target = target.strip().split()[0].strip("<>")
            if not target or target.startswith(("#", "http://", "https://", "mailto:")):
                continue
            path_part = unquote(target.split("#", 1)[0])
            if not path_part:
                continue
            candidate = (markdown.parent / path_part).resolve()
            try:
                candidate.relative_to(ROOT.resolve())
            except ValueError:
                errors.append(f"{rel(markdown)} links outside repository: {target}")
                continue
            if not candidate.exists():
                errors.append(f"{rel(markdown)} has broken relative link: {target}")


def validate_tracked_secret_paths(errors: list[str]) -> None:
    result = subprocess.run(
        ["git", "ls-files", "-z"],
        cwd=ROOT,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )
    if result.returncode != 0:
        return
    tracked = [item for item in result.stdout.decode("utf-8", errors="replace").split("\0") if item]
    for path in tracked:
        if is_high_risk_secret_path(path):
            errors.append(f"tracked high-risk secret path must be removed: {path}")


def parse_simple_frontmatter(path: Path, errors: list[str]) -> dict[str, object]:
    lines = path.read_text(encoding="utf-8").splitlines()
    if not lines or lines[0].strip() != "---":
        errors.append(f"{rel(path)} must start with YAML frontmatter")
        return {}
    try:
        end = lines[1:].index("---") + 1
    except ValueError:
        errors.append(f"{rel(path)} has unterminated YAML frontmatter")
        return {}
    data: dict[str, object] = {}
    current_list_key: str | None = None
    for raw in lines[1:end]:
        if re.match(r"^\s+-\s+", raw) and current_list_key:
            values = data.setdefault(current_list_key, [])
            if isinstance(values, list):
                values.append(raw.split("-", 1)[1].strip().strip('"\''))
            continue
        match = re.match(r"^([A-Za-z][A-Za-z0-9_-]*):\s*(.*)$", raw)
        if not match:
            continue
        key, value = match.groups()
        if value:
            data[key] = value.strip().strip('"\'')
            current_list_key = None
        else:
            data[key] = []
            current_list_key = key
    return data


def validate_devin_frontmatter(errors: list[str]) -> None:
    expected_skills = {
        "orient": None,
        "trace-requirements": None,
        "review-security": "security-reviewer",
        "review-privacy-safety": "privacy-reviewer",
        "review-accessibility": "accessibility-reviewer",
        "review-email": None,
        "verify": "test-runner",
        "triage-ci": None,
        "plan-deployment": None,
        "prepare-release": None,
        "incident-response": None,
        "review-architecture": "researcher",
    }
    for skill_name, expected_agent in expected_skills.items():
        path = ROOT / ".devin/skills" / skill_name / "SKILL.md"
        if not path.is_file():
            errors.append(f"missing skill: .devin/skills/{skill_name}/SKILL.md")
            continue
        data = parse_simple_frontmatter(path, errors)
        if data.get("name") != skill_name:
            errors.append(f"{rel(path)} frontmatter name must be {skill_name}")
        if not data.get("description"):
            errors.append(f"{rel(path)} frontmatter missing description")
        if data.get("subagent") == "true":
            errors.append(f"{rel(path)} must use agent: <profile>, not subagent: true")
        agent = data.get("agent")
        if agent != expected_agent:
            errors.append(f"{rel(path)} agent must be {expected_agent!r}")
        if agent and not (ROOT / ".devin/agents" / f"{agent}.md").is_file():
            errors.append(f"{rel(path)} references missing subagent profile: {agent}")

    expected_agents = {
        "researcher": {"read", "grep", "glob"},
        "security-reviewer": {"read", "grep", "glob"},
        "privacy-reviewer": {"read", "grep", "glob"},
        "accessibility-reviewer": {"read", "grep", "glob"},
        "test-runner": {"read", "grep", "glob", "exec"},
    }
    for agent_name, expected_tools in expected_agents.items():
        path = ROOT / ".devin/agents" / f"{agent_name}.md"
        if not path.is_file():
            errors.append(f"missing subagent profile: .devin/agents/{agent_name}.md")
            continue
        data = parse_simple_frontmatter(path, errors)
        if data.get("name") != agent_name:
            errors.append(f"{rel(path)} frontmatter name must be {agent_name}")
        if not data.get("description"):
            errors.append(f"{rel(path)} frontmatter missing description")
        tools = data.get("allowed-tools")
        if not isinstance(tools, list) or set(tools) != expected_tools:
            errors.append(f"{rel(path)} allowed-tools must be exactly {sorted(expected_tools)}")
        if "model" in data:
            errors.append(f"{rel(path)} must not pin a model")
        if "max-nesting" in data:
            errors.append(f"{rel(path)} must not enable nesting")

    for path in sorted((ROOT / ".devin/rules").glob("*.md")) if (ROOT / ".devin/rules").is_dir() else []:
        data = parse_simple_frontmatter(path, errors)
        if data.get("trigger") not in {"always_on", "model_decision", "manual", "agent", "glob"}:
            errors.append(f"{rel(path)} has missing or invalid trigger")


def validate_license(errors: list[str]) -> None:
    license_path = ROOT / "LICENSE"
    if license_path.is_file() and "Copyright (c) 2026 Alex Popp" not in license_path.read_text(encoding="utf-8"):
        errors.append("LICENSE must contain Copyright (c) 2026 Alex Popp")


def run_checks() -> list[str]:
    errors: list[str] = []
    validate_required_files(errors)
    validate_gitignore(errors)
    validate_json_files(errors)
    validate_precommit(errors)
    validate_workflows(errors)
    validate_env_example(errors)
    validate_python_syntax(errors)
    validate_markdown_links(errors)
    validate_tracked_secret_paths(errors)
    validate_devin_frontmatter(errors)
    validate_license(errors)
    return errors


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--pre-commit", action="store_true", help="run the pre-commit validation profile")
    parser.add_argument("--ci", action="store_true", help="run the CI validation profile")
    parser.add_argument("--deployment-preflight", action="store_true", help="validate manual deployment preflight scaffolding")
    args = parser.parse_args(argv)

    errors = run_checks()
    if args.deployment_preflight:
        if not (ROOT / "docs/ci-cd/app-platform.md").is_file():
            errors.append("deployment preflight requires docs/ci-cd/app-platform.md")
        if not (ROOT / ".do/app.yaml.example").is_file():
            errors.append("deployment preflight requires .do/app.yaml.example")
        print("Deployment preflight is manual-only: review docs/ci-cd/app-platform.md; no deployment or cloud mutation is performed.")
    if errors:
        print("Workspace validation failed:", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        return 1
    print("Workspace validation passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
