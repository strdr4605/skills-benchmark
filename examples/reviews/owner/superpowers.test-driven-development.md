---
skill: superpowers.test-driven-development
reviewer: owner
source_commit: 22f0b463e7a5e579904dd6211a520321035526f7
setup: 1            # copy dir; rename one trigger phrase
tokens: 2           # 4461 load: SKILL.md + writing-good-tests.md on every test
tokens_load: 4461
tokens_run: 31000
tokens_without: 24000
evidence: [desk, work]
overlaps: []
license: MIT
verdict: adapt
merge_into:
reject_reason:
---

Source: https://github.com/obra/superpowers/blob/22f0b463e7a5e579904dd6211a520321035526f7/skills/test-driven-development/SKILL.md

> Illustrative example. It shows the shape of a filled record. The trial numbers are not real results.

## Summary

Forces a strict red-green-refactor loop: no production code before a failing test that you watched fail.

## Use cases

- When I fix a bug in a work repo → "fix <bug> test-first" → a failing regression test, then the smallest fix. [work]
- When I add a pure function to a personal project → "add <fn> with TDD" → one test per behavior, each seen red first. [personal]

## Setup notes

Copied `skills/test-driven-development/` (2 files) to `~/.agents/skills/`. 4 minutes.
The trigger "before writing implementation code" fired on every edit in a docs-only change. I narrowed the description to code changes. 6 more minutes.

## Token notes

`python3 scripts/sb.py tokens superpowers.test-driven-development`: SKILL.md 2394, all .md 4461.
The skill tells the agent to read `writing-good-tests.md` on every test change, so the load is 4461. Band 2.
One trial run used about 31,000 tokens in total. Most of it was the normal task, not the skill.
The same task without the skill used about 24,000 tokens. The skill added about 7,000.

## Comments after testing

### 2026-11-16 desk desk

The rationalization table at the end is the strongest part. It pre-empts the excuses an agent gives to skip the test.
No git or jj commands inside. No harness-specific tool names.

### 2026-11-17 trial work

Bug: wrong rounding in an invoice total. The agent wrote the failing test first and showed the red output. Then it made a 2-line fix.
It refused to write the fix before the test, also when I asked it to hurry. That is the intended behavior.
Cost: about 15 minutes more than without the skill for a 10-minute bug.

## Changes

- Narrow the description from "any feature or bugfix" to "a code change with a test runner in the repo".
- Drop the "delete code written before the test" rule for spikes. Our `prototype` skill covers spikes.

## Alternatives

- mattpocock.tdd: lighter (T1) and has better guidance on what to test. Weaker at stopping shortcuts.
- cursor.tdd: only fires when a cheap test target exists. Postponed by friend.
- addy.test-driven-development, omc.tdd, ecc.tdd-workflow: variants. Not benchmarked separately.
