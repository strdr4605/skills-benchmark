# skills-benchmark

Benchmark agent skills one by one.
Go from 1647 popular skills to a short list your team understands and uses every day.

The repo holds everything: the method, the catalog, one record per skill and reviewer, the daily logs, the markdown tables and an interactive board on GitHub Pages.
Plain files. One Python script with no dependencies. One static page.

## The funnel

| Stage | Question | Output | Method |
|---|---|---|---|
| 1. Screen | Is it a duplicate? Is it in our scope at all? | `screen` column of `catalog/skills.csv` | [method/1-screen.md](method/1-screen.md) |
| 2. Scope | Where does it fit: stage, category, use case, target repo? | scope columns of `catalog/skills.csv` | [method/2-scope.md](method/2-scope.md) |
| 3. Benchmark | Setup effort, token cost, use cases, comments, verdict? | `reviews/<handle>/<id>.md` | [method/3-benchmark.md](method/3-benchmark.md) |

Verdicts: `adopt`, `adapt`, `merge`, `reject`.
Scales and every field: [templates/README.md](templates/README.md).

State today: 1647 rows imported. 838 screened by rule (6 exact duplicates, 832 service automations). 809 wait for a human.
See [tables/README.md](tables/README.md).

## Layout

```
catalog/
  inventory.json        input: 1647 skill files (repo, commit, path, blob). Never edited.
  skills.csv            ONE ROW PER SKILL: facts + screen + scope. Hand-edited.
  repos.csv             alias, pinned commit, screener per repo
  stages.csv            board columns + "not covered" notes
  categories.csv        board groups, 27 categories in 7 stages
  installed.csv         the baseline: skills we already use
  reviewers.csv         handles and GitHub logins
  project.csv           title, repo URL, work and personal target repos
  screen-rules.csv      path rules for auto screening
  synonyms.csv          names that mean the same job
  order.csv             the best-practice order shown under the board
reviews/<handle>/<id>.md   one benchmark record per reviewer per skill
log/<handle>/<date>.md     one daily log per reviewer per evening
templates/                 review.md, log.md, README.md (field definitions and scales)
method/                    how to screen, scope, benchmark, work in pairs, reuse
scripts/sb.py              import, fetch, pick, day, tokens, check, build
tables/                    GENERATED markdown tables. Do not edit.
site/                      the board: index.html, board.js, board.css (+ generated data.json)
examples/                  a small filled instance: 16 rows, 6 records, 3 logs
.github/                   CI check, build and Pages deploy, CODEOWNERS, PR template
```

## One evening

The owner has 2 hours. The queue says what is next.

```sh
jj git fetch && jj new main@origin
python3 scripts/sb.py pick --by owner
#   blocked        superpowers.systematic-debugging    Find the root cause before a fix
#   P1             karpathy.karpathy-guidelines        Always-on coding guidelines for small, simple diffs
#   P2             mattpocock.diagnosing-bugs          Diagnose a bug with a hypothesis loop
python3 scripts/sb.py day --by owner superpowers.systematic-debugging karpathy.karpathy-guidelines mattpocock.diagnosing-bugs
#   created log/owner/2026-11-18.md
#   created reviews/owner/superpowers.systematic-debugging.md  (and the others)
```

Then, for each skill, inside its time box:

| Depth | Box | Do |
|---|---|---|
| `skim` | 10 min | Read the front matter. Fill summary, setup, tokens. Reject if obvious. |
| `desk` | 30 min | Read the whole directory. `python3 scripts/sb.py tokens <id>`. Compare with the cluster. |
| `trial` | 60 min | Use it on one real task in the work or the personal repo. |
| `postponed` | 5 min | Write why and until when. That is a result too. |

Write `depth` and `min` in the log row. Then:

```sh
python3 scripts/sb.py check
jj describe -m "owner 2026-11-18: 3 skills (1 trial, 1 desk, 1 skim)"
jj git push --named owner/2026-11-18=@
gh pr create --base main --head owner/2026-11-18 --fill
```

CI checks the PR. After the merge, CI rebuilds `tables/` and deploys the board.
Details: [method/daily.md](method/daily.md).

## Two reviewers

The owner and the friend each write their own file per skill: `reviews/owner/<id>.md` and `reviews/friend/<id>.md`.
Nobody writes in the other directory. CI enforces it.
The tables and the board show both verdicts and a computed team verdict (`split` when they differ).
Details: [method/two-reviewers.md](method/two-reviewers.md).

## One source of truth

`scripts/sb.py build` reads `catalog/`, `reviews/` and `log/`.
It writes the markdown tables and `site/data.json` in one run.
The board reads only `data.json`.
Nobody edits generated files, so they cannot drift.
Details: [method/board.md](method/board.md).

## Try it in 2 minutes

```sh
python3 scripts/sb.py --data examples check
python3 scripts/sb.py --data examples build --site site/example/data.json
python3 -m http.server -d site 8000
# open http://localhost:8000/?data=example/data.json
```

`examples/` holds a filled TDD cluster with a split between owner and friend, a reject on overlap, a pending skim and two postponed skills.
Read the filled record: [examples/reviews/owner/superpowers.test-driven-development.md](examples/reviews/owner/superpowers.test-driven-development.md).

## Reuse it for your own skills

Keep `method/`, `templates/`, `scripts/`, `site/` and `.github/`.
Replace the inventory, the catalog rows, the reviewers and the baseline.
Run `import`, `fetch`, `build`.
The full path, about one hour: [method/reuse.md](method/reuse.md).

## Rules of the repo

- Markdown and CSV first. The one script uses only the Python standard library.
- No paid service. No database. No build toolchain for the page.
- Version control with jj. No commit or push without the author's own "go".
- English. Short sentences.

Why it is built this way: [RATIONALE.md](RATIONALE.md).

## Requirements

Python 3.9 or later. jj. `gh` for PRs (optional). A browser.
