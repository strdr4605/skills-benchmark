# Two reviewers, one repo

Two people work in this repo: the owner and the friend.
Each keeps an own review of each skill.
No file has two writers, so no review can overwrite another.

## Who writes which file

| Path | Writer | Notes |
|---|---|---|
| `reviews/owner/`, `log/owner/` | owner only | |
| `reviews/friend/`, `log/friend/` | friend only | |
| `catalog/skills.csv` | the screener of that row's repo | `catalog/repos.csv` names the screener per repo. |
| `catalog/skills.csv` column `final` | owner only | Tie-break for a split. Rare. |
| `catalog/*.csv` (all others), `templates/`, `method/`, `scripts/`, `site/`, `.github/` | either, in a framework PR | Owner merges. |
| `tables/`, `examples/tables/` | the CI bot only | Generated on `main`. |
| `site/data.json` | nobody | Built in CI, not committed. |

Handles map to GitHub logins in `catalog/reviewers.csv`.
`.github/CODEOWNERS` asks the right person for review.

## Branches

The repo uses jj. Each day is one bookmark and one PR.
Sessions inside that day are rows in the log of that day.

| Bookmark | Content | Merged by |
|---|---|---|
| `owner/<YYYY-MM-DD>` | owner's log, reviews, screening rows | owner, after CI is green |
| `friend/<YYYY-MM-DD>` | friend's log, reviews, screening rows | owner, after CI is green |
| `framework/<topic>` | categories, templates, scripts, board | owner |

`main` is protected. Nobody pushes to it directly, except the CI bot that rebuilds `tables/`.
Allow `github-actions[bot]` to bypass the protection rule. That is the one setup step for it.

Merge with "Squash and merge". One day becomes one commit on `main`.

The owner does not need the friend's approval for an own day PR.
The friend's PRs need the owner's approval, because the owner is the maintainer.
This is a merge rule, not a quality gate. The quality gate is the second review file.

## How the two reviews coexist

Both people review the same skill in two files:

```
reviews/owner/superpowers.test-driven-development.md   verdict: adapt
reviews/friend/superpowers.test-driven-development.md  verdict: merge
```

The script joins them:

- `tables/stages/test.md` shows one column per reviewer: `adapt S1 T2 trial` and `merge S1 T2 desk`.
- The team verdict is `split`.
- `tables/splits.md` lists the skill.
- The board paints the chip striped. The detail shows both records side by side.

The **View** menu on the board switches between `team`, `owner` and `friend`.
Each person can see the board through the own verdicts only.

## Disagreement

1. Read the other record. Reply in your own record, in `## Comments after testing`.
2. Change your own verdict if the other record convinced you. Never edit the other file.
3. If you still disagree after one week, the owner sets `final` in `catalog/skills.csv`. Both records stay as they are.

## Why conflicts do not happen

| Risk | Prevention |
|---|---|
| Same review file | Per-person directories. CI fails a PR that touches the other person's directory. |
| Same daily log | Per-person directories. |
| Same catalog row | One screener per repo. CI warns when a PR edits a row of another screener. |
| Generated tables | PRs never touch `tables/`. CI fails if they do. The bot rebuilds them after the merge. |
| Shared config | Framework changes go in their own small PR. |
| Stale base | Before the push: `jj git fetch && jj rebase -d main@origin`. A CSV row is one line, so jj merges row edits cleanly. |

## CI

`.github/workflows/build.yml` has two jobs.

On a pull request:

```sh
python3 scripts/sb.py check --changed-by <PR author login> --base origin/main
python3 scripts/sb.py --data examples check
```

On a push to `main`:

```sh
python3 scripts/sb.py build                                   # tables/ and site/data.json
python3 scripts/sb.py --data examples build --site site/example/data.json
# commit tables/ if changed, then deploy site/ to GitHub Pages
```
