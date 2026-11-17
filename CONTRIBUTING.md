# Contributing

This repository holds one opinion per reviewer per skill.
Reviews never overwrite each other. The owner merges.

## First: check the format

Before you benchmark a skill, check that the format works for you.
Read [format-review/README.md](format-review/README.md).
It holds the checklist and a dry run that touches no real data.

Write your answer in `format-review/<handle>-<YYYY-MM-DD>.md` and open a pull
request. A skill record is the wrong place for it.

## Two reviewers, one repository

| Path | Writer |
|---|---|
| `reviews/owner/`, `log/owner/` | owner only |
| `reviews/friend/`, `log/friend/` | friend only |
| `catalog/skills.csv` | the screener of that row's repo, plus the owner for the `final` column |
| `catalog/*.csv` (other files), `method/`, `templates/`, `scripts/`, `site/` | either, in a framework pull request |
| `tables/`, `examples/tables/`, `site/data.json` | the build. Nobody edits them |

A pull request that touches the other person's directory fails the check job.
That is the rule that keeps two opinions safe.

## One evening

```sh
git clone git@github.com:strdr4605/skills-benchmark.git
cd skills-benchmark

python3 scripts/sb.py pick --by friend
#   blocked        superpowers.systematic-debugging    Find the root cause before a fix
#   P1             mattpocock.diagnosing-bugs          Diagnose a bug with a hypothesis loop
#   P2             karpathy.karpathy-guidelines        Always-on coding guidelines

python3 scripts/sb.py day --by friend superpowers.systematic-debugging mattpocock.diagnosing-bugs
#   created log/friend/2026-11-17.md
#   created reviews/friend/superpowers.systematic-debugging.md
```

Pick 1 to 10 skills. Use 10 only for short screens.
One evening is about two hours. The check warns above 150 minutes or 10 skills.

Then, per skill:

| Depth | Box | Do |
|---|---|---|
| `skim` | 10 min | Read the front matter. Fill summary, setup, tokens. |
| `desk` | 30 min | Read the whole skill directory and its license. Measure tokens. |
| `trial` | 60 min | Use it on one real task in the work repo or the personal repo. |
| `postponed` | 5 min | Write why and until when. A postponement is a result. |

## Write your review

One file per skill: `reviews/<your-handle>/<skill-id>.md`.
The fields and the scales are in `templates/README.md`.
Short rules:

- `setup` and `tokens` are bands from 0 to 4. Fill the raw number too.
- `use_cases` holds one line per use case.
- `comments after testing` holds one sub-heading per pass: date, depth, place.
- `verdict` is `adopt`, `adapt`, `merge` or `reject`.
- `source_commit` is the pinned commit you read.
- `tokens_without` is the cost of the same task without the skill. It shows what
  the skill really adds.

A verdict needs evidence. A desk pass needs three specific observations.
A trial needs the real task, the result and what failed.

## Let your agents do it

Point your agents at `AGENTS.md` in the repository root.
It holds the paths they may write, the depth boxes, the checks to run and the
rules they must not break.

Give one agent one skill at a time when the depth is `trial`.
Give the whole batch to one agent when the depth is `skim`.

## Before you push

```sh
python3 scripts/sb.py check
python3 scripts/sb.py --data examples check
```

Both must report 0 errors.
Then commit on a branch named `friend/<YYYY-MM-DD>`, push it and open a pull
request to `main`. Fill the pull request template.

The check job runs on the pull request. The publish job rebuilds the tables and
the board after the merge.

## Disagreement

Both verdicts stay.
Reply in your own record. Change your own verdict if the other record convinced
you. Never edit the other file.
If the disagreement lasts a week, the owner sets `final` in `catalog/skills.csv`.

## What the owner does

The owner merges. The owner decides the shared scope. The owner keeps `final`.
Nobody else merges to `main`.
