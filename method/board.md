# The board

The board is one static page on GitHub Pages.
It shows the 7 stages as columns, categories as groups, and skills as chips.
Tap a chip to see both records, the use cases, the passes and the variants.

Live example (after the first deploy): `https://<owner>.github.io/skills-benchmark/?data=example/data.json`.

## One source of truth

```
catalog/skills.csv ─┐
reviews/*/*.md ─────┼─> scripts/sb.py build ─┬─> tables/*.md      (committed by the CI bot)
log/*/*.md ─────────┤                        └─> site/data.json   (built in CI, never committed)
catalog/*.csv ──────┘                                   │
                                                        └─> site/index.html + board.js  (reads it)
```

The markdown tables and the board come from the same function call, on the same data.
Nobody edits `tables/` or `data.json`. CI rejects a PR that does.
So there is no second copy to keep in sync.

## Files

| File | Lines | Role |
|---|---:|---|
| `site/index.html` | 35 | Page shell: header, filters, board, order, dialog. |
| `site/board.js` | about 200 | Fetches `data.json`, renders, filters, keeps state in the URL hash. |
| `site/board.css` | about 70 | Layout and light and dark colors. |
| `site/data.json` | generated | Everything the page shows. |

No framework. No npm. No build step for the page.

## `data.json` shape

```json
{
  "meta": {"title": "skills-benchmark", "generated": "2026-11-17", "total": 1647,
           "counts": {"unscreened": 809, "out": 832, "dup": 6}, "reviewers": ["owner", "friend"]},
  "stages": [{"stage": "test", "name": "Test", "not_covered": "No browser QA skill reviewed yet."}],
  "categories": [{"category": "tdd", "stage": "test", "name": "Test-first", "blurb": "Red-green-refactor loops."}],
  "skills": [{
    "id": "superpowers.test-driven-development", "stage": "test", "category": "tdd",
    "cluster": "tdd", "variants": ["addy.test-driven-development", "omc.tdd", "ecc.tdd-workflow"],
    "use_case": "Fix a bug or add a feature test-first in a work repo",
    "status": "reviewed", "verdict": "split",
    "reviews": {"owner": {"verdict": "adapt", "setup": "1", "tokens": "2", "depth": "trial", "use_cases": ["…"]},
                "friend": {"verdict": "merge", "merge_into": "mattpocock.tdd", "depth": "desk"}},
    "passes": [["2026-11-16", "owner", "desk"], ["2026-11-17", "owner", "trial"]]
  }],
  "order": [{"step": "1", "ref": "mattpocock.grilling", "why": "Agree on the problem before any plan."}]
}
```

## What the board shows

| Part | Source |
|---|---|
| Funnel line: inventory → unscreened → out → dup → variant → scoped → in review → reviewed | `meta.counts` |
| Stage columns | `catalog/stages.csv` |
| "Not covered" note at the top of a column | `not_covered` in `catalog/stages.csv` |
| Category groups | `catalog/categories.csv` |
| Chips | `keep` rows with a stage. Color = verdict. Striped = split. Dashed ring = postponed. `+N` = variants. |
| Detail dialog | reviews, use cases, passes, variants, source link at the pinned commit |
| Best-practice order | `catalog/order.csv` (`step`, `ref` = skill id or cluster id, `why`) |

Filters: search, verdict toggles, and the **View** menu (team, owner, friend).
The URL hash holds the state, so a link opens the same view.
Example: `#q=tdd&v=adopt,adapt&open=mattpocock.tdd`.

## Readable at 1647

- The board shows only `keep` rows with a stage. Out, dup, variant and unscreened rows are counts in the funnel line.
- Variants ride on their contender chip as `+N`. A cluster of 6 takes 1 to 3 chips.
- A category shows 24 chips, then a `+N more` button.
- The markdown tables split by repo (`tables/screen/<alias>.md`) and by stage (`tables/stages/<stage>.md`).
- Auto-screened rows collapse into a `<details>` list. `tables/screen/composio.md` has 26 table rows, not 863.

## Add one skill

When the upstream inventory gains a skill:

| # | File | Change | By |
|---|---|---|---|
| 1 | `catalog/inventory.json` | Add the record (`repo`, `commit`, `path`, `blob`). | a person, or a refreshed inventory |
| 2 | `catalog/skills.csv` | `python3 scripts/sb.py import && python3 scripts/sb.py fetch` adds the row. Then fill `screen` and the scope columns. | the screener |
| 3 | `reviews/<handle>/<id>.md` | Created by `sb.py day`. Fill it. | the reviewer |
| 4 | `log/<handle>/<date>.md` | One row. | the reviewer |

A skill from a new repo also needs one row in `catalog/repos.csv`.
`tables/` and `data.json` change by themselves on `main`.
Nothing in `site/` changes.

## Local preview

```sh
python3 scripts/sb.py build
python3 scripts/sb.py --data examples build --site site/example/data.json
python3 -m http.server -d site 8000
# open http://localhost:8000/?data=example/data.json
```

## Deploy

Settings → Pages → Source: **GitHub Actions**.
The `publish` job in `.github/workflows/build.yml` uploads `site/` after each push to `main`.
GitHub Pages is free for public repos.
