from __future__ import annotations

import json
import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

import check_workspace  # noqa: E402
from security_patterns import is_high_risk_secret_path, scan_text  # noqa: E402


class SecretPatternTests(unittest.TestCase):
    def test_detects_digitalocean_token(self) -> None:
        token = "dop_v1_" + ("a" * 64)
        findings = scan_text(f"DIGITALOCEAN_TOKEN={token}\n")
        self.assertTrue(any(f.pattern_name == "digitalocean-token" for f in findings))
        self.assertNotIn(token, findings[0].line)

    def test_detects_private_key_marker(self) -> None:
        marker = "-----BEGIN " + "OPENSSH PRIVATE KEY-----\n"
        findings = scan_text(marker)
        self.assertEqual(findings[0].pattern_name, "private-key-block")

    def test_detects_generic_assignment(self) -> None:
        value = "not-a-real-password-but-long"
        findings = scan_text("pass" + f"word={value}\n")
        self.assertTrue(any(f.pattern_name == "generic-secret-assignment" for f in findings))

    def test_allows_blank_or_placeholder_values(self) -> None:
        text = (
            "API" + "_KEY=placeholder\n"
            + "TOKEN" + "=__EXAMPLE__\n"
            + "PASS" + "WORD=<replace-me>\n"
        )
        self.assertEqual(scan_text(text), [])

    def test_allowlist_marker_suppresses_line(self) -> None:
        token = "dop_v1_" + ("a" * 64)
        self.assertEqual(scan_text(f"example={token}  # pragma: allowlist secret\n"), [])

    def test_high_risk_paths(self) -> None:
        self.assertTrue(is_high_risk_secret_path(".env"))
        self.assertTrue(is_high_risk_secret_path(".env.local"))
        self.assertTrue(is_high_risk_secret_path("certs/service.pem"))
        self.assertFalse(is_high_risk_secret_path(".env.example"))
        self.assertFalse(is_high_risk_secret_path("docs/security/secrets.md"))


class WorkspaceScriptTests(unittest.TestCase):
    def test_required_files_have_no_duplicates(self) -> None:
        self.assertEqual(len(check_workspace.REQUIRED_FILES), len(set(check_workspace.REQUIRED_FILES)))

    def test_required_gitignore_entries_have_no_duplicates(self) -> None:
        entries = check_workspace.REQUIRED_GITIGNORE_ENTRIES
        self.assertEqual(len(entries), len(set(entries)))

    def test_hook_event_names_are_known_devin_events(self) -> None:
        self.assertIn("PreToolUse", check_workspace.KNOWN_HOOK_EVENTS)
        self.assertIn("SessionStart", check_workspace.KNOWN_HOOK_EVENTS)
        self.assertIn("Stop", check_workspace.KNOWN_HOOK_EVENTS)

    def test_node_runtime_files_are_aligned(self) -> None:
        errors: list[str] = []
        check_workspace.validate_runtime_version_alignment(errors)
        self.assertEqual(errors, [])

    def test_postgres_images_use_supported_major(self) -> None:
        errors: list[str] = []
        check_workspace.validate_postgres_version_alignment(errors)
        self.assertEqual(errors, [])


class DevinHookTests(unittest.TestCase):
    def run_hook(self, script_name: str, payload: dict[str, object]) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            [sys.executable, str(ROOT / "scripts/devin" / script_name)],
            input=json.dumps(payload),
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            check=False,
        )

    def test_pre_tool_guard_blocks_recursive_forced_delete(self) -> None:
        result = self.run_hook(
            "pre_tool_guard.py",
            {"hook_event_name": "PreToolUse", "tool_name": "exec", "tool_input": {"command": "rm -rf /"}},
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('"decision": "block"', result.stdout)

    def test_pre_tool_guard_blocks_real_dotenv_write(self) -> None:
        result = self.run_hook(
            "pre_tool_guard.py",
            {"hook_event_name": "PreToolUse", "tool_name": "write", "tool_input": {"file_path": ".env.local", "content": "x"}},
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn('"decision": "block"', result.stdout)

    def test_pre_tool_guard_allows_safe_status_command(self) -> None:
        result = self.run_hook(
            "pre_tool_guard.py",
            {"hook_event_name": "PreToolUse", "tool_name": "exec", "tool_input": {"command": "git status"}},
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(result.stdout, "")

    def test_user_prompt_context_injects_deployment_reminder(self) -> None:
        result = self.run_hook("user_prompt_context.py", {"prompt": "please plan deployment on digitalocean"})
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("DigitalOcean/Mailgun", result.stdout)

    def test_user_prompt_context_is_silent_for_ordinary_prompt(self) -> None:
        result = self.run_hook("user_prompt_context.py", {"prompt": "hello"})
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(result.stdout, "")


if __name__ == "__main__":
    unittest.main()
