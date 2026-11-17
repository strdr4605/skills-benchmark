# Stage 2 — Scope

Goal: decide where each kept skill fits, and in what order to benchmark it.
Output: `stage`, `category`, `use_case`, `target`, `priority` filled for every `keep` row of `catalog/skills.csv`.

Cost: about 1 minute per kept row.
If 300 rows survive stage 1, scope takes about 3 evenings, split between two people.
The screener of a repo also scopes it.

## Fields

| Column | Values | Rule |
|---|---|---|
| `stage` | `plan`, `design`, `build`, `test`, `deploy`, `maintain`, `anytime` | The stage where you trigger the skill. Use `anytime` only if it has no stage. |
| `category` | an id from `catalog/categories.csv` | The category must belong to the stage. `check` enforces it. |
| `use_case` | one line | Your hypothesis: when would we use it? Write `<situation> → <result>`. Stage 3 tests it. |
| `target` | `work`, `personal`, `both` | The project where a trial makes sense. The two repos are named in `catalog/project.csv` (`work_repo`, `personal_repo`). |
| `priority` | `1`, `2`, `3` | Order of the benchmark queue. |

### Priority

| Value | Test |
|---|---|
| `1` | It does a job we do by hand every week, or it challenges an installed skill. |
| `2` | It does a job we do every month. |
| `3` | Nice to know. Benchmark when the queue is empty. |

### Categories

`catalog/categories.csv` holds 27 categories over 7 stages.
They are the groups on the board and in `tables/stages/<stage>.md`.

Add or rename a category in its own PR. It is a shared file. The owner merges it.
Keep a category below about 40 skills. Split it when it grows.

### Example rows

From the example instance (`examples/catalog/skills.csv`):

| id | screen | cluster | stage | category | use_case | target | priority |
|---|---|---|---|---|---|---|---|
| superpowers.test-driven-development | keep | tdd | test | tdd | Fix a bug or add a feature test-first in a work repo | both | 1 |
| mattpocock.tdd | keep | tdd | test | tdd | Test-first loop with guidance on good tests and mocks | both | 1 |
| addy.test-driven-development | variant | tdd | | | | | |
| mattpocock.grilling | keep | grilling | plan | requirements | Stress-test a plan before code | both | 1 |

## Category sweep

Do this once per category, after all its rows are scoped.
It is the net for "same job, different name".

1. Run `python3 scripts/sb.py build`.
2. Open `tables/stages/<stage>.md`. Go to one category.
3. Read the `use case` column from top to bottom.
4. For each group of rows that do one job: give them one `cluster` id.
   Compare the five parts: trigger, inputs, actions, output, success criterion.
   See [1-screen.md](1-screen.md#duplicates).
5. Keep 1 to 3 contenders. Change the others to `screen=variant`.
6. Note the sweep in your daily log, for example `| sweep:test/tdd | desk | 15 | | 5 rows, 1 cluster |`.

The `sweep:` row is a log row without a skill id. `check` ignores rows whose skill starts with `sweep:` or `screen:`.

## Not covered

`catalog/stages.csv` has a `not_covered` column per stage.
Write there the jobs that no kept skill does.
Example: "No jj-aware commit or PR skill found so far."
The board shows it at the top of the stage column.
