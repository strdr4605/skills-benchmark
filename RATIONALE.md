# Rationale

The owner fixed the funnel, the record axes, the verdicts, the cadence, the two reviewers and the outputs.
This file covers only the structure built around those decisions.
Each section names the choice, the alternatives, and why they lost.

## 1. Where the per-skill state lives

**Choice:** one CSV row per skill (`catalog/skills.csv`) for facts, screen and scope. One markdown file per reviewer per skill for stage 3 only.

| Alternative | Why rejected |
|---|---|
| One markdown file per skill for all 1647 | 1647 files before any real work. Screening a row would mean opening a file. Most skills die in stage 1, so most files would hold nothing. |
| One YAML or JSON file for everything | Every edit touches one big file. Merges get hard. JSON is unpleasant to edit by hand. |
| SQLite in the repo | Binary. No diff, no review, no merge. |
| Spreadsheet service (Google Sheets, Airtable, Notion) | A second home for the data. Not in the repo. Breaks "one repo holds everything" and the open-source copy path. |

CSV wins because GitHub renders it as a searchable table, any editor opens it, and one row per line merges cleanly.
Markdown wins for records because comments after testing are prose.

## 2. One record per reviewer, not one record per skill

**Choice:** `reviews/<handle>/<id>.md`.

| Alternative | Why rejected |
|---|---|
| One file per skill with an owner section and a friend section | Two writers on one file. Merge conflicts and accidental overwrites. The owner asked that reviews never overwrite each other. |
| `reviews/<id>/<handle>.md` | Works too. But per-person directories make ownership a prefix rule: CODEOWNERS and the CI check stay one line each. |
| Git branches per person, never merged | The board and the tables could not show both reviews together. |

## 3. Depth and dates live in the log only

**Choice:** the daily log is the only place for when, how deep, how long, and postponed. The record holds content only.

| Alternative | Why rejected |
|---|---|
| Depth and date in both the record and the log | Two copies of one fact. They drift. |
| No daily log; history in the record | The owner wants the day visible, including postponed skills that have no record content yet. |
| Log generated from records | Postponed skills and screening evenings have no record. The log must exist on its own. |

The script joins logs and records. `check` fails when a pass has no record or a record has no pass.

## 4. Tables by script, not by hand

**Choice:** `scripts/sb.py build` generates every table. One line of justification: 1647 rows and two authors drift by hand; a stdlib script with a CI check cannot.

| Alternative | Why rejected |
|---|---|
| Hand-edited master tables | The same verdict would sit in the record, the stage table and the shortlist. At 1647 rows that is busywork and drift. |
| A static site generator (Jekyll data files, Hugo) | Adds a toolchain. Markdown tables in the repo would still need a separate generator. |

## 5. Who commits the generated tables

**Choice:** PRs never touch `tables/`. A CI job on `main` rebuilds and commits them.

| Alternative | Why rejected |
|---|---|
| Each PR commits its rebuilt tables | Every two open PRs conflict on `tables/README.md` (the funnel counts). |
| The owner runs `build` after each merge | Manual step. Easy to forget. Works as a fallback if the bot is not allowed to push. |
| Do not commit tables; show them only on Pages | The tables must be readable in the repo on GitHub. |

## 6. Board technology

**Choice:** one HTML page, one vanilla JS file, one CSS file. It fetches `data.json` built by the same script.

| Alternative | Why rejected |
|---|---|
| React, Vue or Svelte with Vite | npm, a lockfile, a build step. Heavy for one page of chips. |
| Jekyll with Liquid templates | Logic in templates is hard to test. The data would need a second format for Liquid. |
| Page parses `skills.csv` and the markdown records in the browser | Hundreds of fetches. Join logic duplicated in JS. Two implementations of one rule. |
| Fork the super-board code | Its data shape describes one skill pack, not a benchmark with reviewers and verdicts. The layout idea is kept; the code is not. |

`data.json` is not committed. CI builds it before the Pages deploy.

## 7. Skill ids

**Choice:** `<alias>.<directory name>`, with `@<path segment>` only on a clash inside one repo.

| Alternative | Why rejected |
|---|---|
| Full path (`obra/superpowers/skills/test-driven-development/SKILL.md`) | Too long for file names, chips and table cells. |
| Numbers (`S0412`) | Unreadable in logs and commits. |
| Blob hash | Changes when the upstream file changes. Not stable. |

Ids never change after import. A new upstream path gets a new row.

## 8. Duplicate detection

**Choice:** blob hash for exact copies, path rules for known bulk families, name hints for same-name, and a human category sweep for same-job-different-name.

| Alternative | Why rejected |
|---|---|
| Embeddings or an LLM to cluster all 1647 | A paid API or a local model. Opaque results. A human must confirm every cluster anyway. |
| Fuzzy text similarity on whole files | Platform copies with small edits match, but different names for one job do not. Many false matches across Composio automations. |
| Human reads all 1647 | 832 Composio automations are one decision, not 832. |

The category sweep is cheap because scope already put the candidates side by side.

## 9. Screening ownership

**Choice:** one screener per repo in `catalog/repos.csv`.

| Alternative | Why rejected |
|---|---|
| Both people screen every row | Double cost for the cheapest decision in the funnel. |
| Per-person screening files merged later | A second copy of the screen decision. A merge step nobody wants. |
| Split by row ranges | Ranges shift on re-import. Repos do not. |

## 10. Scales

**Choice:** setup 0–4 and token band 0–4, each with a test and a number. Raw minutes and raw tokens are also stored.

| Alternative | Why rejected |
|---|---|
| T-shirt sizes (S/M/L) | No test for the edge cases. Two reviewers would read them differently. |
| Raw minutes and tokens only | Hard to compare at a glance on a chip or in a table cell. |
| 1–10 scores | False precision. A tired reader cannot tell a 6 from a 7. |

Token cost uses bytes / 4 of what loads on trigger. It is crude, but it is free, repeatable and the same for every skill.

## 11. Team verdict

**Choice:** computed. Agreement gives the verdict. Disagreement gives `split`. The owner can set `final`.

| Alternative | Why rejected |
|---|---|
| Owner's verdict always wins | The friend's work would be invisible on the board. |
| A third "team" record file | A third writer. A third copy of the verdict. |
| Require two reviews per skill | Doubles the cost. The queue asks for a second opinion only on adopt and adapt. |

## 12. Variants under a cluster

**Choice:** 1 to 3 contenders per job get records. Other members are `variant` and ride on the contender chips.

| Alternative | Why rejected |
|---|---|
| Benchmark every member | Six TDD skills at 30 minutes each is three evenings for one job. |
| Pick one winner at screen time | Too early. Stage 3 often reverses the first impression. |

## 13. Examples in their own instance

**Choice:** `examples/` is a small full instance with its own catalog, reviews and logs. `--data examples` points the script at it.

| Alternative | Why rejected |
|---|---|
| Seed example reviews in `reviews/` | Fake results mixed with real ones. They would show on the real board. |
| Only a filled template file | Shows the record, but not the join, the split, the queue or the board. |

CI checks the example instance on every PR, so it also works as the test fixture of the script.

## 14. License

The repo ships MIT. Each benchmarked skill keeps its own license, recorded in the record's `license` field.
The repo stores no copies of skill bodies. `.cache/` is not committed.
