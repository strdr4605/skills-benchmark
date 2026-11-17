# The session loop

One session. One reviewer. 2 to 5 skills. At most 60 minutes.

A day can hold many sessions. Each one is a row group in the log of that day.
A skill can stop in one session and continue in the next one.

## The session, step by step

| Step | Minutes | Command or action |
|---|---:|---|
| 1. Sync | 1 | `jj git fetch && jj new main@origin` |
| 2. Pick | 2 | `python3 scripts/sb.py pick --by owner -n 5` |
| 3. Open the session | 1 | `python3 scripts/sb.py day --by owner <id> [<id> …]` |
| 4. Work | ≤ 50 | Fill each record. Fill `session`, `depth` and `min` in the log. |
| 5. Check | 1 | `python3 scripts/sb.py check` |
| 6. Describe | 1 | `jj describe -m "owner 2026-11-18 s1: 2 skills (1 desk, 1 skim)"` |
| 7. Push | 1 | `jj git push --named owner/2026-11-18=@` |
| 8. PR | 1 | `gh pr create --base main --head owner/2026-11-18 --fill` |

Step 3 creates `log/<handle>/<today>.md` with one row per skill.
It also creates a record stub `reviews/<handle>/<skill-id>.md` for each new skill.
It never overwrites a file.

`day` prints the session id it used.
The first session of a day is `s1`, the next is `s2`.
Use `--session s3` to name it yourself.

## Mix the depth to fit the box

The time boxes come from [3-benchmark.md](3-benchmark.md#depth-and-time-boxes).

| Session type | Mix | Minutes |
|---|---|---:|
| Sweep | 5 × skim | 50 |
| Compare | 3 × desk | 90 → split it over two sessions |
| Deep | 1 × trial + 1 × skim | 70 → one session for the trial, one for the skim |
| Short | 1 × desk + 1 × postponed | 35 |

One session holds at most 5 skills and 60 minutes.
`check` warns above that.

A skill that does not fit today is `postponed`.
Postponing is a normal result. It is never hidden.
Write a date in `next` (the queue brings it back on that day) or a blocker in
words (the queue shows it every day until you act).

## One skill, two sessions

Read it in one session. Test it in the next one.
Both passes are rows in the log of that day, with their own session id.
The record holds one sub-heading per pass under `## Comments after testing`.

```
| superpowers.test-driven-development | s1 | desk | 25 |  | read the whole directory |
| superpowers.test-driven-development | s2 | trial | 55 |  | used it on the herdr bug |
```

The deepest pass sets the record status. The earlier pass stays visible.

## Log format

File: `log/<handle>/<YYYY-MM-DD>.md`. Template: [`templates/log.md`](../templates/log.md).

```markdown
# 2026-11-16 · owner

Budget: 60 min per session. Two sessions this evening.

| skill | session | depth | min | next | note |
|---|---|---|---:|---|---|
| mattpocock.tdd | s1 | desk | 25 |  | adopt; lightest TDD loop |
| superpowers.test-driven-development | s1 | desk | 20 |  | strong excuse table; trial tomorrow |
| mattpocock.grilling | s2 | skim | 6 |  | reject: installed grilling does it |
| karpathy.karpathy-guidelines | s2 | skim | 8 |  | compare with AGENTS.md on a desk pass |
| superpowers.systematic-debugging | s2 | postponed | 2 | blocked: needs a real bug in the work repo | desk alone will not tell |

## Notes

- Two sessions, five skills. The TDD cluster needs a trial to break the tie.
```

Rules:

- The first table is data. The script reads it. Free text goes under `## Notes`.
- One row per skill per session. The same skill may appear in two sessions.
- Batch work of stage 1 and 2 uses `screen:<alias>` or `sweep:<stage>/<category>` in the `skill` column. The script counts its minutes but ties it to no skill.

## How the tables stay consistent with the logs

**Choice: a script, not hand editing.**
**Why: 1647 rows and two authors drift by hand; one stdlib script with a CI check cannot drift.**

The design stores each fact once:

| Fact | Stored only in |
|---|---|
| When a pass happened, its session, its depth, its minutes, postponed and why | `log/<handle>/<date>.md` |
| Setup, tokens, use cases, comments, verdict | `reviews/<handle>/<id>.md` |
| Screen and scope | `catalog/skills.csv` |
| Team verdict, status, deepest depth, total minutes | computed by `scripts/sb.py`, never stored by hand |

`python3 scripts/sb.py check` fails when:

- A log row has `skim`, `desk` or `trial` but the record file does not exist.
- A record exists but no log row of that reviewer names the skill.
- A record says `adopt` or `adapt` but the deepest logged pass is `skim`.
- A `postponed` row has no `next`.
- A log names an unknown skill id.

It warns when one session exceeds 60 minutes or 5 skills, and when one day
exceeds 300 minutes.

`tables/days.md` lists every log with its sessions, minutes and depth mix.
The cost of the benchmark is visible per session and per day.
