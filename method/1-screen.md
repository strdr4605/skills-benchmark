# Stage 1 — Screen

Goal: decide for each of the 1647 inventory files whether it stays.
Output: the `screen` column of `catalog/skills.csv` is filled for every row.

Screening is a batch phase.
It runs before the daily benchmark loop.
It costs about 7 evenings in total, split between two people.

## Inputs

| File | What it is |
|---|---|
| `catalog/inventory.json` | 1647 records: `repo`, `commit`, `path`, `blob`. Copied from the inventory of 2026-11-15. Never edited. |
| `catalog/inventory.md` | The human notes of that inventory. |
| `catalog/repos.csv` | One row per repo: short `alias`, pinned `commit`, `screener`, `license`. |
| `catalog/screen-rules.csv` | Path rules that screen rows without a human. |
| `catalog/synonyms.csv` | Names that mean the same job, for the duplicate hints. |
| `catalog/installed.csv` | The skills we already use. The baseline. |

## Step 1 — Import (script, 1 second)

```sh
python3 scripts/sb.py import
```

The script adds one row per inventory file to `catalog/skills.csv`.
It never changes a row that exists.

The skill id is `<alias>.<directory name>`.
Example: `superpowers.test-driven-development`.
A `SKILL.md` at the repo root gets `<alias>.root`.
When one repo has the same directory name twice, the id gets `@<first path segment that differs>`.
Example: `omo.ulw-plan@omo-codex`, `omo.ulw-plan@omo-senpi`, `omo.ulw-plan@shared-skills`.

Two rules run automatically. They set `screen_by=auto`.

| Rule | Result | Rows today |
|---|---|---:|
| Same `blob` as an earlier row | `screen=dup`, `dup_of=<first id>`, `reason=same blob` | 6 |
| `composio,composio-skills/*-automation/SKILL.md` in `screen-rules.csv` | `screen=out`, `reason=service-automation` | 832 |

That leaves 809 rows for humans.
A human can undo any auto row. Change the value and set `screen_by` to your handle.

## Step 2 — Fetch descriptions (script, about 3 minutes once)

```sh
python3 scripts/sb.py fetch
```

The script downloads each `SKILL.md` at the pinned commit from `raw.githubusercontent.com`.
It copies the front matter `name` and `description` into the catalog.
It caches files in `.cache/` (not committed). A second run only fetches what failed.
No token and no paid service is needed.

## Step 3 — Screen by hand (809 rows, 30 seconds each)

Each repo has one screener in `catalog/repos.csv`.
Today the owner screens 367 rows and the friend screens 442 rows.
Only the screener edits the rows of that repo. CI warns on any other edit.

Open `tables/screen/<alias>.md` to read. Edit `catalog/skills.csv` to decide.
A spreadsheet or a CSV editor works. Keep one row per line.

| `screen` | Use it when | Also fill |
|---|---|---|
| `keep` | The skill may help us. It goes to stage 2. | — |
| `dup` | Same content as another row, with small edits only. | `dup_of` |
| `variant` | Same job as a skill you keep, but a weaker or less portable version. | `cluster` |
| `out` | Not for us. | `reason` |

Always set `screen_by` to your handle.

Use these short reasons for `out`. Free text is allowed when none fits.

| Reason | Meaning |
|---|---|
| `service-automation` | Drives one SaaS product we do not use. |
| `platform` | Works only in a harness we do not run, and a portable copy exists. |
| `maintainer` | Maintains its own source repo. Useless outside it. |
| `off-stack` | Language or framework we do not use (for example `ecc.laravel-tdd`). |
| `low-value` | The name and description show no job we have. |
| `license` | The license blocks reuse. |

**Rule of thumb:** when in doubt, `keep`. Stage 2 and stage 3 are cheaper per wrong keep than a lost good skill.

One screening evening: one repo, or 120 rows of a big repo. Log it as one line in the daily log (see [daily.md](daily.md)).

## Duplicates

There are three kinds. Each has its own net.

### 1. Exact copies — script

Same Git blob means the same bytes.
`import` marks them. Today: 6 rows, for example `composio.pdf` is a `dup` of `anthropic.pdf`.

Canonical member rule: the oldest upstream project wins.
Tie goes to the alphabetically first repo alias.
Every other row of the group points to the canonical member in `dup_of`.
The canonical member stays `keep`.

### 2. Same name — script hint, human decision

`tables/clusters.md` lists names that occur in more than one repo.
It also folds names from `catalog/synonyms.csv`, so `tdd` and `test-driven-development` land in one hint.
Today there are 67 cross-repo names. Examples: `tdd` (5 repos), `code-review` (4), `git-master` (2 repos, 3 files).

A hint is not a decision.
The same name can mean a different job. `omx.design` and `uiux.design` are an example.
Read both descriptions. Then set the same `cluster` id only if the job is the same.

`tables/clusters.md` also lists skills with the name of an installed skill.
Today: `mattpocock.grilling` and `mattpocock.prototype`.
These go to stage 3 only to compare with what we have. The verdict can only be `merge` or `reject`.

### 3. Same job, different name — category sweep

No script can find this case reliably.
`superpowers.systematic-debugging` and `mattpocock.diagnosing-bugs` do one job with no shared word.

The net is the category sweep at the end of stage 2.
After scoping, every kept skill has a category.
One category holds 5 to 40 skills. A human reads them side by side in `tables/stages/<stage>.md`.
Same job → same `cluster` id.
The sweep is in [2-scope.md](2-scope.md#category-sweep).

Compare two candidates on five parts:

| Part | Question |
|---|---|
| Trigger | What makes the agent use the skill? |
| Inputs | What must the agent have? |
| Actions | What does the agent do? |
| Output | What comes out? |
| Success criterion | How do you know it worked? |

The same five parts mean one job.
A different output or a different platform means two jobs.
Write the comparison in the weaker row, in `reason`.
Mark the pair `possible` while the comparison is not done.
A `possible` pair is a queue for a human. It is not a rejection.

## Clusters

A cluster is one job with many implementations.

- The `cluster` id is a short job slug: `tdd`, `debugging`, `grilling`.
- Keep 1 to 3 contenders as `keep`. They get stage 3 records.
- Mark the rest `variant`. They do not get records.
- The board shows variants as `+N` on each contender chip.
- The record of a contender has `## Alternatives`: one line per other member.

Pick contenders by these tests, in order:
lowest token cost, fewest dependencies, repo we already trust, most recent upkeep.

A `variant` can come back. Change it to `keep` and give it a priority.
