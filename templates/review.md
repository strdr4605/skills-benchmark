---
skill: {skill}
reviewer: {reviewer}
source_commit: {commit}   # the pinned upstream commit of the source
setup:              # 0-4. See templates/README.md#setup-effort
tokens:             # 0-4. See templates/README.md#token-cost
tokens_load:        # number. Tokens in context when the skill triggers (bytes / 4)
tokens_run:         # optional number. Tokens of one observed run in a trial
tokens_without:     # optional number. Tokens of the same task without the skill
evidence: [desk]    # any of: desk, work, personal
overlaps: []        # names from catalog/installed.csv that do the same job
license:            # SPDX id, e.g. MIT. Required for adopt and adapt
verdict:            # adopt | adapt | merge | reject | empty while pending
merge_into:         # required for merge: an installed skill name or a skill id
reject_reason:      # required for reject: duplicate | overlap | low-value | too-costly | broken | license | platform
---

Source: {source}

## Summary

One sentence. What the skill makes the agent do.

## Use cases

- When <situation> → <what you type> → <what you get>. [work|personal]

## Setup notes

What you copied, installed or edited. Time it took.

## Token notes

How you measured tokens_load. What loads on demand. Observed run cost, if any.

## Comments after testing

### <YYYY-MM-DD> <skim|desk|trial> <work|personal|desk>

What you did. What worked. What broke. What surprised you.

## Changes

For adapt: each edit as one line. For merge: each part to move and where. For reject: the reason in one line.

## Alternatives

Other members of the same cluster. One line each: why this one wins or loses.
