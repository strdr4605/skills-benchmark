# The daily loop

One evening. One reviewer. 1 to 10 skills. At most 120 minutes.

## The evening, step by step

| Step | Minutes | Command or action |
|---|---:|---|
| 1. Sync | 1 | `jj git fetch && jj new main@origin` |
| 2. Pick | 3 | `python3 scripts/sb.py pick --by owner` |
| 3. Open the day | 1 | `python3 scripts/sb.py day --by owner superpowers.test-driven-development caveman.caveman` |
| 4. Work | ≤ 110 | Fill each record. Fill `depth` and `min` in the log. |
| 5. Check | 1 | `python3 scripts/sb.py check` |
| 6. Describe | 1 | `jj describe -m "owner 2026-11-17: 2 skills (1 trial, 1 postponed)"` |
| 7. Push | 1 | `jj git push --named owner/2026-11-17=@` |
| 8. PR | 1 | `gh pr create --base main --head owner/2026-11-17 --fill` |

Step 3 creates `log/owner/<today>.md` with one row per skill.
It also creates a record stub `reviews/owner/<skill-id>.md` for each new skill.
It never overwrites a file.

## Mix the depth to fit the box

The time boxes come from [3-benchmark.md](3-benchmark.md#depth-and-time-boxes).

| Evening type | Mix | Minutes |
|---|---|---:|
| Sweep | 10 × skim | 100 |
| Compare | 3 × desk | 90 |
| Deep | 1 × trial + 1 × desk + 2 × skim | 110 |
| Short | 1 × desk + 2 × postponed | 40 |

A skill that does not fit tonight is `postponed`.
Postponing is a normal result. It is never hidden.
Write a date in `next` (the queue brings it back on that day) or a blocker in words (the queue shows it every day until you act).

## Log format

File: `log/<handle>/<YYYY-MM-DD>.md`. Template: [`templates/log.md`](../templates/log.md).

```markdown
# 2026-11-16 · owner

Budget: 120 min.

| skill | depth | min | next | note |
|---|---|---:|---|---|
| mattpocock.tdd | desk | 25 |  | adopt; lightest TDD loop |
| superpowers.test-driven-development | desk | 20 |  | strong excuse table; trial tomorrow |
| mattpocock.grilling | skim | 6 |  | reject: installed grilling does it |
| karpathy.karpathy-guidelines | skim | 8 |  | compare with AGENTS.md on a desk pass |
| superpowers.systematic-debugging | postponed | 2 | blocked: needs a real bug in the work repo | desk alone will not tell |

## Notes

- Three skims and two desk passes fit in one hour.
```

Rules:

- The first table is data. The script reads it. Free text goes under `## Notes`.
- One row per skill per day. A second pass on the same day goes in the same row with the deeper depth.
- Batch work of stage 1 and 2 uses `screen:<alias>` or `sweep:<stage>/<category>` in the `skill` column. The script counts its minutes but ties it to no skill.

## How the tables stay consistent with the logs

**Choice: a script, not hand editing.**
**Why: 1647 rows and two authors drift by hand; one stdlib script with a CI check cannot drift.**

The design stores each fact once:

| Fact | Stored only in |
|---|---|
| When a pass happened, its depth, its minutes, postponed and why | `log/<handle>/<date>.md` |
| Setup, tokens, use cases, comments, verdict | `reviews/<handle>/<id>.md` |
| Screen and scope | `catalog/skills.csv` |
| Team verdict, status, deepest depth, total minutes | computed by `scripts/sb.py`, never stored by hand |

`python3 scripts/sb.py check` fails when:

- A log row has `skim`, `desk` or `trial` but the record file does not exist.
- A record exists but no log row of that reviewer names the skill.
- A record says `adopt` or `adapt` but the deepest logged pass is `skim`.
- A `postponed` row has no `next`.
- A log names an unknown skill id.

It warns when one day exceeds 150 minutes or 10 skills.

`tables/days.md` lists every log with its minutes and depth mix.
The cost of the benchmark is visible per evening.
