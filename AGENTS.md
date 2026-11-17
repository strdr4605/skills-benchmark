# Working rules for coding agents in this repository

This repository benchmarks agent skills. It stores opinions with evidence.
You work here as a reviewer.

## Read first

| File | Why |
|---|---|
| `method/1-screen.md` | Stage 1. Duplicate and scope screen. |
| `method/2-scope.md` | Stage 2. Stage, category, use case, target repo. |
| `method/3-benchmark.md` | Stage 3. Desk review and trial. |
| `templates/README.md` | Every field, every scale, every verdict rule. |
| `method/two-reviewers.md` | Who writes which file. |

## Write only these paths

- `reviews/<your-handle>/<skill-id>.md` — one record per skill.
- `log/<your-handle>/<YYYY-MM-DD>.md` — one log per evening.
- `catalog/skills.csv` — only rows of the repos where you are the screener.
  The screener per repo is in `catalog/repos.csv`.

## Never

- Never write a format review under `reviews/`. It goes to `format-review/`.
- Never edit `tables/`, `examples/tables/` or `site/data.json`. They are generated.
- Never edit another reviewer's directory under `reviews/` or `log/`.
- Never change a verdict, a scale value or a note of another reviewer.
- Never run the same trial twice for one skill on one day. The first reviewer
  says so in the log. The second reviewer does a desk pass.
- Never commit upstream skill bodies into this repository. Store links and
  short results. Each skill keeps its own license.
- Never push secrets, tokens or cookies. They belong in the upstream repo, not here.

## Depth and time box

| Depth | Box | Verdicts it allows |
|---|---|---|
| `skim` | 10 min | `reject`, `merge`, or none |
| `desk` | 30 min | all four |
| `trial` | 60 min | all four |
| `postponed` | 5 min | none |

Stop at the box. Write the depth and the minutes in the log.

## Before you push

```sh
python3 scripts/sb.py check
python3 scripts/sb.py --data examples check
```

Both must report 0 errors. Warnings must be read and either fixed or explained.

## Verdict rules

- A verdict needs `setup`, `tokens`, `license` and one use case.
- `adopt` and `adapt` need at least a desk pass.
- A skill that overlaps an installed skill gets `merge` or `reject`, never `adopt`.
- Every verdict needs `source_commit`. It is the pinned commit you read.
- Two reviewers may disagree. Keep both. The owner sets `final` in `catalog/skills.csv`.

## Deliver a change

1. Work on a branch named `<your-handle>/<YYYY-MM-DD>`.
2. Commit your own records and logs only.
3. Push the branch and open a pull request to `main`.
4. Use the pull request template. Fill every line.
5. Never merge to `main` yourself. The owner merges.

## Report

Say which skills you reviewed, at which depth, with which verdict, and what you
left for another day. Point to the file paths.
