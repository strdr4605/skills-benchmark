# Reuse the framework

This repo is two things in one folder:
the **framework** (method, templates, script, board) and **our data** (catalog rows, reviews, logs).
To benchmark your own skills, keep the first and replace the second.
There is no template product yet. The steps below are the whole path.

## What is framework and what is data

| Framework: keep | Data: replace |
|---|---|
| `method/`, `templates/`, `scripts/sb.py`, `site/index.html`, `site/board.js`, `site/board.css`, `.github/workflows/build.yml` | `catalog/inventory.json`, `catalog/inventory.md`, `catalog/skills.csv`, `reviews/`, `log/`, `tables/` |
| `catalog/stages.csv`, `catalog/categories.csv` (edit if you like) | `catalog/repos.csv`, `catalog/installed.csv`, `catalog/reviewers.csv`, `catalog/project.csv`, `catalog/screen-rules.csv`, `catalog/synonyms.csv`, `catalog/order.csv` |
| `examples/` (keep as a working reference) | |

## Steps (about one hour)

1. Fork or copy the repo. Delete `catalog/skills.csv`, `reviews/*/*`, `log/*/*` and `tables/`.
2. Write your inventory to `catalog/inventory.json`. It is a JSON list of `{"repo", "commit", "path", "blob"}`. The GitHub tree API gives all four:
   `gh api "repos/<owner>/<repo>/git/trees/<commit>?recursive=1" --jq '.tree[] | select(.path|endswith("SKILL.md")) | {path, blob: .sha}'`
3. Add one row per source repo to `catalog/repos.csv` with a short `alias` and a `screener`.
4. Write your reviewers to `catalog/reviewers.csv` and `.github/CODEOWNERS`. Rename `reviews/owner`, `log/owner` and the others to your handles.
5. List what you already use in `catalog/installed.csv`. The baseline rule depends on it.
6. Set `title`, `repo_url`, `work_repo`, `personal_repo` in `catalog/project.csv`.
7. Run:
   ```sh
   python3 scripts/sb.py import
   python3 scripts/sb.py fetch
   python3 scripts/sb.py check
   python3 scripts/sb.py build
   ```
8. Enable GitHub Pages with source "GitHub Actions". Push.
9. Read [1-screen.md](1-screen.md) and start the first screening evening.

## The example instance

`examples/` is a full small instance: 16 catalog rows, 6 records, 3 daily logs.
It uses the root config files where it has none of its own (for example `categories.csv`).

```sh
python3 scripts/sb.py --data examples check
python3 scripts/sb.py --data examples build --site site/example/data.json
```

Read `examples/tables/` and open the example board to see a filled state before you start.
CI checks the example on every PR, so it stays valid when the framework changes.

## What you can change safely

- Stages and categories: edit the two CSV files. The board and tables follow.
- Reviewers: any number. Each gets a directory, a table column and a View option.
- Scales and time boxes: edit `templates/README.md` and the constants at the top of `scripts/sb.py` (`DEPTHS`, `VERDICTS`, `REJECT_REASONS`, `DAY_MINUTES_WARN`, `DAY_SKILLS_MAX`).
- The baseline: `catalog/installed.csv`.

Do not rename the record fields or the log columns unless you also change `load_reviews` and `load_logs` in `scripts/sb.py`.
