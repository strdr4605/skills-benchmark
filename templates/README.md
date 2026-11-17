# Templates and field definitions

This folder holds the two fixed forms of the benchmark.

| File | Copy to | Created by |
|---|---|---|
| `review.md` | `reviews/<handle>/<skill-id>.md` | `python3 scripts/sb.py day --by <handle> <skill-id>…` |
| `log.md` | `log/<handle>/<YYYY-MM-DD>.md` | the same command |

Do not change field names. The script `scripts/sb.py` reads them.
A filled example is in [`examples/reviews/owner/superpowers.test-driven-development.md`](../examples/reviews/owner/superpowers.test-driven-development.md).

## Benchmark record (`review.md`)

One file per reviewer per skill.
The owner and the friend each write their own file for the same skill.
Nobody edits the file of the other person.

### Front matter

| Field | Type | Required | Meaning |
|---|---|---|---|
| `skill` | skill id | always | The `id` column of `catalog/skills.csv`. Must equal the file name. |
| `reviewer` | handle | always | Must equal the folder name under `reviews/`. |
| `source_commit` | commit sha | with a verdict | The pinned upstream commit of the source. A verdict on another commit is stale. |
| `setup` | 0–4 | with a verdict | Setup effort. Scale below. |
| `tokens` | 0–4 | with a verdict | Token cost band. Scale below. |
| `tokens_load` | integer | with a verdict | Tokens that enter the context when the skill triggers. |
| `tokens_run` | integer | no | Tokens of one real run, read from the agent's usage report. |
| `tokens_without` | integer | no | Tokens of the same task without the skill. The difference is the real cost. |
| `evidence` | list | always | What the verdict rests on: `desk`, `work`, `personal`. |
| `overlaps` | list | always | Names from `catalog/installed.csv` that do the same job. Empty list if none. |
| `license` | SPDX id | for adopt, adapt | License of the source directory. `NONE` if the repo has no license. |
| `verdict` | enum | no | `adopt`, `adapt`, `merge`, `reject`. Empty while pending. |
| `merge_into` | name or id | for merge | Where the good parts go. |
| `reject_reason` | enum | for reject | `duplicate`, `overlap`, `low-value`, `too-costly`, `broken`, `license`, `platform`. |

The record does not hold dates or depth.
The daily logs hold them.
The script joins them, so they cannot disagree.

### Body sections

| Section | Required | Content |
|---|---|---|
| `## Summary` | always | One sentence. The board shows it on the chip detail. |
| `## Use cases` | for adopt, adapt | One bullet per use case: `When <situation> → <what you type> → <what you get>. [work]`. The board shows them. |
| `## Setup notes` | with a verdict | What you did to make it run. Real minutes. |
| `## Token notes` | with a verdict | How you measured. What loads on demand. |
| `## Comments after testing` | always | One sub-heading per pass: `### <date> <depth> <where>`. Facts first. |
| `## Changes` | for adapt, merge, reject | The edit list (adapt), the parts to move (merge), or the reason (reject). |
| `## Alternatives` | if the skill has a cluster | One line per other cluster member. |

## Setup effort

`setup` is the work to get the skill running in **our** setup.
Our setup is pi, Claude Code, Codex CLI, jj, herdr, surf and RTK.
Pick the highest row that applies.

| Value | Name | Test | Typical time |
|---|---|---|---|
| `0` | Drop-in | Copy the skill directory. It works on the first trigger. | ≤ 5 min |
| `1` | Light | Copy, then change a trigger, a name or one path. | ≤ 15 min |
| `2` | Edit | Rewrite instructions for our setup: git to jj, tool names, harness differences, approval rules. | ≤ 60 min |
| `3` | Dependency | Needs an external CLI, MCP server, API key, hook or script runtime. | ≤ half a day |
| `4` | Framework | Needs its own installer, state, hooks or router. Or it competes with another orchestration owner. | more, or exclusive |

## Token cost

`tokens` is a band on `tokens_load`.
`tokens_load` is the size of what the agent reads when the skill triggers.
Count `SKILL.md` plus every file the skill tells the agent to read on every run.
Do not count files it reads only on a branch.
Estimate tokens as bytes divided by 4.
`python3 scripts/sb.py tokens <skill-id>` gives both numbers for the skill directory.

| Value | Band | `tokens_load` |
|---|---|---|
| `0` | Tiny | < 1,000 |
| `1` | Small | 1,000 – 2,999 |
| `2` | Medium | 3,000 – 7,999 |
| `3` | Large | 8,000 – 19,999 |
| `4` | Unbounded | ≥ 20,000, **or** the skill starts subagents or loops, so one run has no fixed cost |

If a trial shows a run cost far above the band, write `tokens_run` and raise the band by one.
Say why in `## Token notes`.

A trial can also measure the same task without the skill.
Write that number in `tokens_without`.
The difference `tokens_run - tokens_without` is the cost the skill adds.
`check` warns when `tokens_run` is set and `tokens_without` is empty.

## Source pinning

Every record names the upstream commit it was read from.
`source_commit` holds that commit sha.
The pinned commit per repo lives in `catalog/repos.csv`.

Rule: the verdict is only valid for the pinned commit.
When upstream moves to a new commit, `check` reports a stale verdict.
Read the changed source again, then update `source_commit` and the verdict.
Do not change the pinned commit to silence the check.

## Depth of a pass

Depth lives in the daily log, one value per pass.
Each depth has a time box.

| Depth | Time box | What you do | Verdicts it allows |
|---|---|---|---|
| `skim` | ≤ 10 min | Read the front matter and skim the body. Fill summary, setup, tokens. | `reject`, `merge`, or none |
| `desk` | ≤ 30 min | Read the full skill directory, scripts and license. Measure tokens. Compare with the cluster. | all four |
| `trial` | ≤ 60 min | Use the skill on one real task in a work or a personal project. | all four |
| `postponed` | ≤ 5 min | Write why and when in the `next` column. No record change. | none |

`check` fails if a record says `adopt` or `adapt` and its deepest pass is `skim`.

## Verdicts

| Verdict | Meaning | Rules `check` enforces |
|---|---|---|
| `adopt` | Install the skill unchanged. Use it daily. | Depth ≥ desk. `license` set. One use case or more. `overlaps` empty. |
| `adapt` | Install it after the edits under `## Changes`. | Depth ≥ desk. `license` set. One use case or more. |
| `merge` | Do not install it. Move named parts into `merge_into`. | `merge_into` set. |
| `reject` | Do not install it. | `reject_reason` set. |

The baseline rule:
a skill that overlaps an installed skill gets `merge` or `reject`, never `adopt`.
Fill `overlaps` honestly and the check applies the rule.

## Team verdict

The script computes one team verdict per skill.

- One review → its verdict.
- Two reviews that agree → that verdict.
- Two reviews that disagree → `split`. The skill appears in `tables/splits.md`.
- The `final` column in `catalog/skills.csv` overrides all of this. Only the owner sets it.

## Daily log (`log.md`)

One file per reviewer per day: `log/<handle>/<YYYY-MM-DD>.md`.
The first table is the data. The script reads only that table.
A day holds many sessions. One session holds 2 to 5 skills.

| Column | Meaning |
|---|---|
| `skill` | Skill id. |
| `session` | Session id in that day: `s1`, `s2`, `s3`. |
| `depth` | `skim`, `desk`, `trial` or `postponed`. |
| `min` | Minutes spent. Integer. Postponed is usually `0` to `5`. |
| `next` | For `postponed`: a date `YYYY-MM-DD` or a blocker in words. Else empty. |
| `note` | One line. What changed today. |

Free text goes under `## Notes`.
