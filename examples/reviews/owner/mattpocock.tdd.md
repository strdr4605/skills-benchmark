---
skill: mattpocock.tdd
reviewer: owner
source_commit: 5863806dd4e15c63174bee4e7515a4256792ecfa
setup: 0
tokens: 1
tokens_load: 1831
evidence: [desk]
overlaps: []
license: MIT
verdict: adopt
merge_into:
reject_reason:
---

Source: https://github.com/mattpocock/skills/blob/5863806dd4e15c63174bee4e7515a4256792ecfa/skills/engineering/tdd/SKILL.md

> Illustrative example.

## Summary

A compact TDD reference: what a good test is, where tests go, mocking rules, and the red-green loop.

## Use cases

- When I start a feature with clear behavior → "build <feature> test-first" → tests at the public interface, one behavior each. [work]

## Setup notes

Copy `skills/engineering/tdd/` (SKILL.md, tests.md, mocking.md). Nothing to edit.

## Token notes

`sb.py tokens mattpocock.tdd`: SKILL.md 907, all .md 1831. All three files apply on every cycle, so the load is 1831. Band 1.

## Comments after testing

### 2026-11-16 desk desk

Reads GLOSSARY.md and ADRs if they exist. That fits repos that use mattpocock.grilling output.
No VCS commands inside.

## Changes

None.

## Alternatives

- superpowers.test-driven-development: stricter, about 2.4x the tokens.
