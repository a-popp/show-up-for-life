---
name: verify
description: Run the appropriate workspace or application verification checks
agent: test-runner
---

Verify the current change using the smallest appropriate set of checks:

1. Run `python scripts/check_workspace.py --ci`, `python scripts/check_secrets.py --all`, and `python -m unittest discover -s tests -v`.
2. If `.venv-tools` pre-commit is available, run pre-commit for all files; otherwise report that it is unavailable rather than installing anything.
3. If root `package.json` exists, inspect its scripts and run the appropriate npm lint/test/build checks.
4. Report exact commands, results, failures, and remaining unverified items. Do not edit files.
