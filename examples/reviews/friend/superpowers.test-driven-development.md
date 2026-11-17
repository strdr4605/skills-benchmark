---
skill: superpowers.test-driven-development
reviewer: friend
source_commit: 22f0b463e7a5e579904dd6211a520321035526f7
setup: 1
tokens: 2
tokens_load: 4461
evidence: [desk]
overlaps: []
license: MIT
verdict: merge
merge_into: mattpocock.tdd
reject_reason:
---

Source: https://github.com/obra/superpowers/blob/22f0b463e7a5e579904dd6211a520321035526f7/skills/test-driven-development/SKILL.md

> Illustrative example. It shows a second, independent review of the same skill.

## Summary

Strict red-green-refactor with a long table of excuses the agent must not accept.

## Use cases

- When an agent keeps skipping tests → load it for that session only. [work]

## Setup notes

Not installed. Desk review only.

## Token notes

Same numbers as the owner: 4461 on every test change. Twice mattpocock.tdd for the same loop.

## Comments after testing

### 2026-11-17 desk desk

The loop is the same as mattpocock.tdd. The extra value is the rationalization table.
I would copy that table into mattpocock.tdd and keep one TDD skill.

## Changes

- Move the "Common Rationalizations" table into mattpocock.tdd as a reference file.

## Alternatives

- mattpocock.tdd: same job at about 40% of the tokens.
