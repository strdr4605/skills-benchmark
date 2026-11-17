# Synthesis note

This repository was designed in an arena: three independent candidates designed it
from the same brief, a fourth model judged them, and the best parts were grafted
into one base.

## Base

Candidate C (Claude, opus) is the base.

Reasons:

- One home per fact. The log holds when and how deep. The record holds content.
  The catalog holds screen and scope.
- The invariants are enforced, not described. CI rejects a PR that touches the
  other person's directory or a generated file.
- It ships real data: 1647 pinned inventory rows, 838 rows screened by rule.
- The cross-judge scored it highest: 18 of 18, against 16 for codex and 13 for pi.

## Cross-judge

Judge: Claude sonnet, readonly. Different vendor than the coordinator (MiniMax).
The judge read all three candidates and ran the check script of each.

| Criterion | pi | codex | claude |
|---|---:|---:|---:|
| Funnel fidelity | 2 | 3 | 3 |
| Record template | 3 | 3 | 3 |
| One source of truth | 2 | 3 | 3 |
| Two-contributor workflow | 2 | 3 | 3 |
| Reuse path | 2 | 2 | 3 |
| Cost discipline | 2 | 2 | 3 |
| Total | 13 | 16 | 18 |

The judge and the coordinator agreed on the base.

## Grafts

| Graft | From | Where |
|---|---|---|
| Canonical member rule for duplicate groups: oldest upstream project wins, tie goes to the alphabetically first repo alias. | pi | `method/1-screen.md` |
| Five-part comparison for "same job, different name": trigger, inputs, actions, output, success criterion. Adds the `possible` state for an unfinished comparison. | codex | `method/1-screen.md`, `method/2-scope.md` |
| Source pinning: every record names the upstream commit it was read from. A verdict on another commit is stale. | codex | `templates/review.md`, `templates/README.md`, `scripts/sb.py` |
| Token delta: `tokens_without` holds the cost of the same task without the skill. The difference is the real cost of the skill. | codex | `templates/review.md`, `templates/README.md`, `scripts/sb.py`, `site/board.js` |

## Rejected

| Rejected | Why |
|---|---|
| The pi base | Shipped seed data, not the real 1647 rows. The funnel was never run on real input. |
| The codex base | Never screened or scoped a row. All 1647 rows were unscreened. Review paths were unreadable hashes. |
| A markdown file per skill in stage 1 (codex) | 1647 files before any work. One CSV row per skill is enough. |
| A board that fetches the source files at load time (pi) | It works, but the tables need a build step anyway. One build keeps both outputs on the same data. |
| A separate template product for other teams | Later. The reuse path is documented, not packaged. |
| A blog post | Later. The method must be proven in use first. |

## Convergence and dropouts

- All three candidates converged on the same funnel, the same four verdicts and
  the same board shape. That is strong agreement. No averaging was needed.
- No candidate dropped out. The claude candidate lost its session once to a
  sleep event. It was resumed and finished.
- The three depth words in the brief were left open. The base uses
  `skim`, `desk`, `trial` and `postponed`, each with a time box.

## Verification

- `python3 scripts/sb.py check` → 0 errors, 0 warnings.
- `python3 scripts/sb.py --data examples check` → 0 errors, 0 warnings.
- `python3 scripts/sb.py build` and the example build → 31 and 24 tables written.
- `node --check site/board.js` → clean.
- Relative links in all markdown files → 0 broken.
- The board was served and opened in a headless browser. Stages, categories,
  verdict colors, cluster counts and the best-practice order rendered.
- The live board stays empty until rows are screened and scoped. That is the
  honest state of day one.
