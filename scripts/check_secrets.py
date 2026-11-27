#!/usr/bin/env python3
"""Fail when tracked or staged files appear to contain committed secrets."""

from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path

from security_patterns import Finding, is_high_risk_secret_path, scan_text

ROOT = Path(__file__).resolve().parents[1]
MAX_FILE_BYTES = 2 * 1024 * 1024


def git_lines(args: list[str]) -> list[str]:
    result = subprocess.run(
        ["git", *args],
        cwd=ROOT,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or f"git {' '.join(args)} failed")
    return [line for line in result.stdout.splitlines() if line]


def git_zlines(args: list[str]) -> list[str]:
    output = subprocess.run(
        ["git", *args],
        cwd=ROOT,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=True,
    ).stdout.decode("utf-8", errors="replace")
    return [item for item in output.split("\0") if item]


def staged_files() -> list[str]:
    return git_zlines(["diff", "--cached", "--name-only", "--diff-filter=ACMR", "-z"])


def tracked_files() -> list[str]:
    return git_zlines(["ls-files", "-z"])


def read_candidate(path: Path) -> str | None:
    try:
        if not path.is_file() or path.stat().st_size > MAX_FILE_BYTES:
            return None
        data = path.read_bytes()
    except OSError:
        return None
    if b"\0" in data[:4096]:
        return None
    try:
        return data.decode("utf-8")
    except UnicodeDecodeError:
        return None


def scan_file(relative_path: str) -> list[Finding]:
    findings: list[Finding] = []
    if is_high_risk_secret_path(relative_path):
        findings.append(
            Finding(
                path=relative_path,
                line_number=0,
                pattern_name="high-risk-secret-file",
                line="High-risk secret file path is not committable in this repository.",
            )
        )
    text = read_candidate(ROOT / relative_path)
    if text is not None:
        findings.extend(scan_text(text, relative_path))
    return findings


def collect_paths(args: argparse.Namespace) -> list[str]:
    if args.staged:
        return staged_files()
    if args.all:
        return tracked_files()
    if args.paths:
        return args.paths
    return staged_files() or tracked_files()


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--staged", action="store_true", help="scan staged files")
    mode.add_argument("--all", action="store_true", help="scan all tracked files")
    parser.add_argument("paths", nargs="*", help="specific repository-relative files to scan")
    args = parser.parse_args(argv)

    try:
        paths = collect_paths(args)
    except (RuntimeError, subprocess.CalledProcessError) as exc:
        print(f"Unable to enumerate files for secret scan: {exc}", file=sys.stderr)
        return 2

    findings: list[Finding] = []
    for relative_path in paths:
        findings.extend(scan_file(relative_path))

    if findings:
        print("Potential committed secrets or unsafe secret files detected:", file=sys.stderr)
        for finding in findings:
            location = f"{finding.path}:{finding.line_number}" if finding.line_number else finding.path
            print(f"- {location} [{finding.pattern_name}] {finding.line}", file=sys.stderr)
        print(
            "Remove the value/file before committing. If the value was ever real, rotate or revoke it immediately.",
            file=sys.stderr,
        )
        return 1

    print(f"Secret scan passed ({len(paths)} file(s) checked).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
